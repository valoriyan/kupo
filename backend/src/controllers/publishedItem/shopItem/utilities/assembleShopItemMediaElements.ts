import { BlobStorageService } from "../../../../services/blobStorageService";
import { DatabaseService } from "../../../../services/databaseService";
import { Promise as BluebirdPromise } from "bluebird";
import { MediaElement } from "../../../models";
import { DBShopItemElementType } from "../../../../services/databaseService/tableServices/publishedItem/shopItemMediaElementsTableService";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../../utilities/monads/unwrapListOfResponses";

export async function assembleShopItemMediaElements({
  controller,
  publishedItemId,
  shopItemType,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  publishedItemId: string;
  shopItemType: DBShopItemElementType;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, MediaElement[]>> {
  //////////////////////////////////////////////////
  // Get Pointers From DB
  //////////////////////////////////////////////////
  const getShopItemMediaElementsByPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.shopItemMediaElementsTableService.getShopItemMediaElementsByPublishedItemId(
      { controller, publishedItemId, shopItemType },
    );
  if (getShopItemMediaElementsByPublishedItemIdResponse.type === EitherType.failure) {
    return getShopItemMediaElementsByPublishedItemIdResponse;
  }
  const { success: filedShopItemMediaElements } =
    getShopItemMediaElementsByPublishedItemIdResponse;

  //////////////////////////////////////////////////
  // Get Temporary URLs
  //////////////////////////////////////////////////

  const getTemporaryImageUrlResponses = await BluebirdPromise.map(
    filedShopItemMediaElements,
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

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return unwrapListOfEitherResponses({
    eitherResponses: getTemporaryImageUrlResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}
