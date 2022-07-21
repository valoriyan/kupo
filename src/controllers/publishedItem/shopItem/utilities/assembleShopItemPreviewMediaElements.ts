import { BlobStorageServiceInterface } from "../../../../services/blobStorageService/models";
import { DatabaseService } from "../../../../services/databaseService";
import { Promise as BluebirdPromise } from "bluebird";
import { MediaElement } from "../../../models";
import { DBShopItemElementType } from "../../../../services/databaseService/tableServices/shopItemMediaElementsTableService";
import { Controller } from "tsoa";
import {
  collectMappedResponses,
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";

export async function assembleShopItemPreviewMediaElements({
  controller,
  publishedItemId,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  publishedItemId: string;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, MediaElement[]>> {
  const getShopItemMediaElementsByPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.shopItemMediaElementTableService.getShopItemMediaElementsByPublishedItemId(
      {
        controller,
        publishedItemId,
        shopItemType: DBShopItemElementType.PREVIEW_MEDIA_ELEMENT,
      },
    );
  if (getShopItemMediaElementsByPublishedItemIdResponse.type === EitherType.failure) {
    return getShopItemMediaElementsByPublishedItemIdResponse;
  }
  const { success: filedShopItemPreviewMediaElements } =
    getShopItemMediaElementsByPublishedItemIdResponse;

  const getTemporaryImageUrlResponses = await BluebirdPromise.map(
    filedShopItemPreviewMediaElements,
    async (
      filedShopItemMediaElement,
    ): Promise<InternalServiceResponse<ErrorReasonTypes<string>, MediaElement>> => {
      const { blobFileKey, mimeType } = filedShopItemMediaElement;

      const getTemporaryImageUrlResponse = await blobStorageService.getTemporaryImageUrl({
        controller,
        blobItemPointer: {
          fileKey: blobFileKey,
        },
      });

      if (getTemporaryImageUrlResponse.type === EitherType.failure) {
        return getTemporaryImageUrlResponse;
      }
      const { success: fileTemporaryUrl } = getTemporaryImageUrlResponse;

      return Success({
        temporaryUrl: fileTemporaryUrl,
        mimeType: mimeType,
      });
    },
  );

  return collectMappedResponses({ mappedResponses: getTemporaryImageUrlResponses });
}
