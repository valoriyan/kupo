import express from "express";
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
import { ShopItemController } from "./shopItemController";
import { v4 as uuidv4 } from "uuid";
import { Promise as BluebirdPromise } from "bluebird";
import { uploadMediaFile } from "../../utilities/mediaFiles/uploadMediaFile";
import { PublishedItemType } from "../models";
import { DBShopItemElementType } from "../../../services/databaseService/tableServices/shopItemMediaElementsTableService";

export enum CreateShopItemFailedReason {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateShopItemSuccess {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HandlerRequestBody {
  caption: string;
  hashtags: string[];
  title: string;
  price: number;
  collaboratorUserIds: string[];
  scheduledPublicationTimestamp?: number;
  expirationTimestamp?: number;
  mediaFiles: Express.Multer.File[];
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
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const {
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title,
    price,
    mediaFiles,
    hashtags,
  } = requestBody;

  const publishedItemId = uuidv4();
  const now = Date.now();

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
    await controller.databaseService.tableNameToServicesMap.shopItemTableService.createShopItem(
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

  const uploadMediaFileResponses = await BluebirdPromise.map(
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
        }
      >
    > => {
      const uploadMediaFileResponse = await uploadMediaFile({
        controller,
        file: mediaFile,
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
      });
    },
  );

  const mappedUploadMediaFileResponses = unwrapListOfEitherResponses({
    eitherResponses: uploadMediaFileResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
  if (mappedUploadMediaFileResponses.type === EitherType.failure) {
    return mappedUploadMediaFileResponses;
  }
  const { success: shopItemMediaElements } = mappedUploadMediaFileResponses;

  const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  const addHashtagsToPublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.addHashtagsToPublishedItem(
      {
        controller,
        hashtags: lowerCaseHashtags,
        publishedItemId,
      },
    );
  if (addHashtagsToPublishedItemResponse.type === EitherType.failure) {
    return addHashtagsToPublishedItemResponse;
  }

  const createShopItemMediaElementsResponse =
    await controller.databaseService.tableNameToServicesMap.shopItemMediaElementTableService.createShopItemMediaElements(
      {
        controller,
        shopItemMediaElements: shopItemMediaElements.map(
          ({ publishedItemId, shopItemElementIndex, blobFileKey, mimetype }) => ({
            publishedItemId,
            shopItemElementIndex,
            shopItemType: DBShopItemElementType.PREVIEW_MEDIA_ELEMENT,
            blobFileKey,
            mimetype,
          }),
        ),
      },
    );
  if (createShopItemMediaElementsResponse.type === EitherType.failure) {
    return createShopItemMediaElementsResponse;
  }

  return Success({});
}
