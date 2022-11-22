/* eslint-disable @typescript-eslint/ban-types */
import { Promise as BluebirdPromise } from "bluebird";
import express from "express";
import { MediaElement } from "../../../controllers/models";
import { v4 as uuidv4 } from "uuid";
import { DBShopItemElementType } from "../../../services/databaseService/tableServices/publishedItem/shopItemMediaElementsTableService";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../utilities/monads/unwrapListOfResponses";
import { checkAuthorization } from "../../auth/utilities";
import { uploadMediaFile } from "../../utilities/mediaFiles/uploadMediaFile";
import { PublishedItemType, RenderablePublishedItem } from "../models";
import { RenderableShopItem, RenderableShopItemType } from "./models";
import { ShopItemController } from "./shopItemController";
import { Controller } from "tsoa";
import { DatabaseService } from "../../../services/databaseService";
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { WebSocketService } from "../../../services/webSocketService";
import { collectTagsFromText } from "../../../controllers/utilities/collectTagsFromText";
import { assembleRecordAndSendNewTagInPublishedItemCaptionNotification } from "../../../controllers/notification/notificationSenders/assembleRecordAndSendNewTagInPublishedItemCaptionNotification";

export enum CreateShopItemFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface CreateShopItemSuccess {
  renderableShopItem: RenderableShopItem;
}

interface HandlerRequestBody {
  caption: string;
  hashtags: string[];
  title: string;
  price: number;
  collaboratorUserIds: string[];
  scheduledPublicationTimestamp?: number;
  expirationTimestamp?: number;
  mediaFiles: Express.Multer.File[];
  purchasedMediaFiles: Express.Multer.File[];
}

export async function handleCreateShopItem({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: HandlerRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | CreateShopItemFailedReason>,
    CreateShopItemSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const {
    caption,
    hashtags,
    title,
    price,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    mediaFiles,
    purchasedMediaFiles,
  } = requestBody;

  const publishedItemId = uuidv4();
  const now = Date.now();

  //////////////////////////////////////////////////
  // Write to db
  //////////////////////////////////////////////////

  const createPublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.createPublishedItem(
      {
        controller,
        type: PublishedItemType.SHOP_ITEM,
        publishedItemId,
        creationTimestamp: now,
        authorUserId: clientUserId,
        caption,
        scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
        expirationTimestamp,
      },
    );
  if (createPublishedItemResponse.type === EitherType.failure) {
    return createPublishedItemResponse;
  }

  const createShopItemResponse =
    await controller.databaseService.tableNameToServicesMap.shopItemsTableService.createShopItem(
      {
        controller,
        publishedItemId,
        title: title,
        price: price,
      },
    );
  if (createShopItemResponse.type === EitherType.failure) {
    return createShopItemResponse;
  }

  //////////////////////////////////////////////////
  // Add hashtags
  //////////////////////////////////////////////////

  const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  const addHashtagsToPublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemHashtagsTableService.addHashtagsToPublishedItem(
      {
        controller,
        hashtags: lowerCaseHashtags,
        publishedItemId,
      },
    );
  if (addHashtagsToPublishedItemResponse.type === EitherType.failure) {
    return addHashtagsToPublishedItemResponse;
  }

  //////////////////////////////////////////////////
  // Upload media files
  //////////////////////////////////////////////////

  const mappedPreviewMedia = mediaFiles.map((file) => ({
    file,
    type: DBShopItemElementType.PREVIEW_MEDIA_ELEMENT,
  }));
  const mappedPurchasedMedia = purchasedMediaFiles.map((file) => ({
    file,
    type: DBShopItemElementType.PURCHASED_MEDIA_ELEMENT,
  }));

  const uploadMediaFileResponses = await uploadShopItemMedia(
    publishedItemId,
    [...mappedPreviewMedia, ...mappedPurchasedMedia],
    controller,
  );

  if (uploadMediaFileResponses.type === EitherType.failure) {
    return uploadMediaFileResponses;
  }
  const { success: shopItemMediaElements } = uploadMediaFileResponses;

  const createShopItemMediaElementsResponse =
    await controller.databaseService.tableNameToServicesMap.shopItemMediaElementsTableService.createShopItemMediaElements(
      { controller, shopItemMediaElements },
    );
  if (createShopItemMediaElementsResponse.type === EitherType.failure) {
    return createShopItemMediaElementsResponse;
  }

  const mediaElements: MediaElement[] = shopItemMediaElements
    .filter(
      (element) => element.shopItemType === DBShopItemElementType.PREVIEW_MEDIA_ELEMENT,
    )
    .map((element) => ({
      temporaryUrl: element.fileTemporaryUrl,
      mimeType: element.mimetype,
    }));

  const purchasedMediaElements: MediaElement[] = shopItemMediaElements
    .filter(
      (element) => element.shopItemType === DBShopItemElementType.PURCHASED_MEDIA_ELEMENT,
    )
    .map((element) => ({
      temporaryUrl: element.fileTemporaryUrl,
      mimeType: element.mimetype,
    }));

  //////////////////////////////////////////////////
  // Compile Shop Item
  //////////////////////////////////////////////////

  const renderableShopItem: RenderableShopItem = {
    type: PublishedItemType.SHOP_ITEM,
    renderableShopItemType: RenderableShopItemType.PURCHASED_SHOP_ITEM_DETAILS,
    id: publishedItemId,
    authorUserId: clientUserId,
    caption,
    creationTimestamp: now,
    scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
    expirationTimestamp,
    hashtags: lowerCaseHashtags,
    title,
    price,
    mediaElements,
    purchasedMediaElements,
    purchasedMediaElementsMetadata: {
      count: purchasedMediaElements.length,
    },
    likes: {
      count: 0,
    },
    comments: {
      count: 0,
    },
    isLikedByClient: false,
    isSavedByClient: false,
  };

  //////////////////////////////////////////////////
  // Send out relevant notifications
  //////////////////////////////////////////////////

  const considerAndExecuteNotificationsResponse = await considerAndExecuteNotifications({
    controller,
    renderablePublishedItem: renderableShopItem,
    databaseService: controller.databaseService,
    blobStorageService: controller.blobStorageService,
    webSocketService: controller.webSocketService,
  });
  if (considerAndExecuteNotificationsResponse.type === EitherType.failure) {
    return considerAndExecuteNotificationsResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({ renderableShopItem });
}

const uploadShopItemMedia = async (
  publishedItemId: string,
  mediaFiles: Array<{ file: Express.Multer.File; type: DBShopItemElementType }>,
  controller: ShopItemController,
) => {
  const eitherResponses = await BluebirdPromise.map(
    mediaFiles,
    async (
      mediaFile,
      index,
    ): Promise<
      InternalServiceResponse<
        ErrorReasonTypes<string>,
        {
          publishedItemId: string;
          shopItemElementIndex: number;
          blobFileKey: string;
          fileTemporaryUrl: string;
          mimetype: string;
          shopItemType: DBShopItemElementType;
        }
      >
    > => {
      const uploadMediaFileResponse = await uploadMediaFile({
        controller,
        file: mediaFile.file,
        blobStorageService: controller.blobStorageService,
      });
      if (uploadMediaFileResponse.type === EitherType.failure) {
        return uploadMediaFileResponse;
      }
      const {
        success: { blobFileKey, fileTemporaryUrl, mimetype },
      } = uploadMediaFileResponse;

      return Success({
        publishedItemId,
        shopItemElementIndex: index,
        blobFileKey,
        fileTemporaryUrl,
        mimetype,
        shopItemType: mediaFile.type,
      });
    },
  );

  return unwrapListOfEitherResponses({
    eitherResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
};

async function considerAndExecuteNotifications({
  controller,
  renderablePublishedItem,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  renderablePublishedItem: RenderablePublishedItem;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageServiceInterface;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Get usernames tagged in caption
  //////////////////////////////////////////////////
  const { caption, authorUserId } = renderablePublishedItem;

  const tags = collectTagsFromText({ text: caption });

  //////////////////////////////////////////////////
  // Get user ids associated with tagged usernames
  //////////////////////////////////////////////////

  const selectUsersByUsernamesResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernames(
      { controller, usernames: tags },
    );
  if (selectUsersByUsernamesResponse.type === EitherType.failure) {
    return selectUsersByUsernamesResponse;
  }
  const { success: foundUnrenderableUsersMatchingTags } = selectUsersByUsernamesResponse;

  const foundUserIdsMatchingTags = foundUnrenderableUsersMatchingTags
    .map(({ userId }) => userId)
    .filter((userId) => userId !== authorUserId);

  //////////////////////////////////////////////////
  // Send tagged caption notifications to everyone tagged
  //////////////////////////////////////////////////
  const assembleRecordAndSendNewTagInPublishedItemCaptionNotificationResponses =
    await BluebirdPromise.map(
      foundUserIdsMatchingTags,
      async (taggedUserId) =>
        await assembleRecordAndSendNewTagInPublishedItemCaptionNotification({
          controller,
          publishedItemId: renderablePublishedItem.id,
          recipientUserId: taggedUserId,
          databaseService,
          blobStorageService,
          webSocketService,
        }),
    );

  const mappedResponse = unwrapListOfEitherResponses({
    eitherResponses:
      assembleRecordAndSendNewTagInPublishedItemCaptionNotificationResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
  if (mappedResponse.type === EitherType.failure) {
    return mappedResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////
  return Success({});
}
