/* eslint-disable @typescript-eslint/ban-types */
import { Promise as BluebirdPromise } from "bluebird";
import express from "express";
import { FileDescriptor, MediaElement } from "../../../controllers/models";
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
import { checkAuthentication } from "../../auth/utilities";
import { PublishedItemType, RenderablePublishedItem } from "../models";
import { RenderableShopItem, RenderableShopItemType } from "./models";
import { ShopItemController } from "./shopItemController";
import { Controller } from "tsoa";
import { DatabaseService } from "../../../services/databaseService";
import { BlobStorageService } from "../../../services/blobStorageService";
import { WebSocketService } from "../../../services/webSocketService";
import { collectTagsFromText } from "../../../controllers/utilities/collectTagsFromText";
import { assembleRecordAndSendNewTagInPublishedItemCaptionNotification } from "../../../controllers/notification/notificationSenders/assembleRecordAndSendNewTagInPublishedItemCaptionNotification";

export enum CreateShopItemFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface CreateShopItemSuccess {
  renderableShopItem: RenderableShopItem;
}

export interface CreateShopItemRequestBody {
  idempotentcyToken: string;
  caption: string;
  hashtags: string[];
  title: string;
  price: number;
  collaboratorUserIds: string[];
  scheduledPublicationTimestamp?: number;
  expirationTimestamp?: number;
  mediaFiles: FileDescriptor[];
  purchasedMediaFiles: FileDescriptor[];
}

export async function handleCreateShopItem({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: CreateShopItemRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | CreateShopItemFailedReason>,
    CreateShopItemSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: error } = await checkAuthentication(
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
    idempotentcyToken,
  } = requestBody;

  const publishedItemId = uuidv4();
  const now = Date.now();

  //////////////////////////////////////////////////
  // Handle Idempotentcy Token
  //////////////////////////////////////////////////
  const assertThatIdempotentcyTokenDoesNotExistResponse =
    await controller.fastCacheService.assertThatIdempotentcyTokenDoesNotExist({
      controller,
      idempotentcyToken,
    });
  if (assertThatIdempotentcyTokenDoesNotExistResponse.type === EitherType.failure) {
    return assertThatIdempotentcyTokenDoesNotExistResponse;
  }

  const addIdempotentcyTokenResponse =
    await controller.fastCacheService.addIdempotentcyToken({
      controller,
      idempotentcyToken,
    });
  if (addIdempotentcyTokenResponse.type === EitherType.failure) {
    return addIdempotentcyTokenResponse;
  }

  //////////////////////////////////////////////////
  // Write to DB
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
  // Add Hashtags
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
  // Write Preview Media Items to DB
  //////////////////////////////////////////////////

  if (mediaFiles.length > 0) {
    const createShopItemMediaElementsResponse =
      await controller.databaseService.tableNameToServicesMap.shopItemMediaElementsTableService.createShopItemMediaElements(
        {
          controller,
          shopItemMediaElements: mediaFiles.map(({ blobFileKey, mimeType }, index) => ({
            publishedItemId,
            shopItemElementIndex: index,
            shopItemType: DBShopItemElementType.PREVIEW_MEDIA_ELEMENT,
            blobFileKey,
            mimetype: mimeType,
          })),
        },
      );
    if (createShopItemMediaElementsResponse.type === EitherType.failure) {
      return createShopItemMediaElementsResponse;
    }
  }

  //////////////////////////////////////////////////
  // Write Purchased Media Items to DB
  //////////////////////////////////////////////////

  if (purchasedMediaFiles.length > 0) {
    const createShopItemMediaElementsResponse =
      await controller.databaseService.tableNameToServicesMap.shopItemMediaElementsTableService.createShopItemMediaElements(
        {
          controller,
          shopItemMediaElements: purchasedMediaFiles.map(
            ({ blobFileKey, mimeType }, index) => ({
              publishedItemId,
              shopItemElementIndex: index,
              shopItemType: DBShopItemElementType.PURCHASED_MEDIA_ELEMENT,
              blobFileKey,
              mimetype: mimeType,
            }),
          ),
        },
      );
    if (createShopItemMediaElementsResponse.type === EitherType.failure) {
      return createShopItemMediaElementsResponse;
    }
  }

  //////////////////////////////////////////////////
  // Get Preview Media File Temporary Urls
  //////////////////////////////////////////////////
  const getTemporaryImageUrlResponsesForMediaFiles = await BluebirdPromise.map(
    mediaFiles,
    async ({ blobFileKey }) => {
      return await controller.blobStorageService.getTemporaryImageUrl({
        controller,
        blobItemPointer: { fileKey: blobFileKey },
      });
    },
  );

  const unwrappedGetTemporaryImageUrlResponsesForMediaFiles = unwrapListOfEitherResponses(
    {
      eitherResponses: getTemporaryImageUrlResponsesForMediaFiles,
      failureHandlingMethod:
        UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
    },
  );
  if (unwrappedGetTemporaryImageUrlResponsesForMediaFiles.type === EitherType.failure) {
    return unwrappedGetTemporaryImageUrlResponsesForMediaFiles;
  }

  const { success: mediaFileTemporaryUrls } =
    unwrappedGetTemporaryImageUrlResponsesForMediaFiles;

  const mediaElements: MediaElement[] = mediaFileTemporaryUrls.map(
    (mediaElementTemporaryUrl, index) => ({
      temporaryUrl: mediaElementTemporaryUrl,
      mimeType: mediaFiles[index].mimeType,
    }),
  );

  //////////////////////////////////////////////////
  // Get Purchased Media File Temporary Urls
  //////////////////////////////////////////////////

  const getTemporaryImageUrlResponsesForPurchasedMediaFiles = await BluebirdPromise.map(
    purchasedMediaFiles,
    async ({ blobFileKey }) => {
      return await controller.blobStorageService.getTemporaryImageUrl({
        controller,
        blobItemPointer: { fileKey: blobFileKey },
      });
    },
  );

  const unwrappedGetTemporaryImageUrlResponsesForPurchasedMediaFiles =
    unwrapListOfEitherResponses({
      eitherResponses: getTemporaryImageUrlResponsesForPurchasedMediaFiles,
      failureHandlingMethod:
        UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
    });
  if (
    unwrappedGetTemporaryImageUrlResponsesForPurchasedMediaFiles.type ===
    EitherType.failure
  ) {
    return unwrappedGetTemporaryImageUrlResponsesForPurchasedMediaFiles;
  }

  const { success: purchasedMediaFileTemporaryUrls } =
    unwrappedGetTemporaryImageUrlResponsesForPurchasedMediaFiles;

  const purchasedMediaElements: MediaElement[] = purchasedMediaFileTemporaryUrls.map(
    (mediaElementTemporaryUrl, index) => ({
      temporaryUrl: mediaElementTemporaryUrl,
      mimeType: purchasedMediaFiles[index].mimeType,
    }),
  );

  //////////////////////////////////////////////////
  // Assemble Shop Item
  //////////////////////////////////////////////////

  const renderableShopItem: RenderableShopItem = {
    host: "user-self-hosted",
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
  // Send Out Relevant Notifications
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
  blobStorageService: BlobStorageService;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Get Usernames Tagged in Caption
  //////////////////////////////////////////////////
  const { caption, authorUserId } = renderablePublishedItem;

  const tags = collectTagsFromText({ text: caption });

  //////////////////////////////////////////////////
  // Get User Ids Associated with Tagged Usernames
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
  // Send Tagged Caption Notifications to Everyone Tagged
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
