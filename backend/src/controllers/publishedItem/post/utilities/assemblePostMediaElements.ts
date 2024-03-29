import { BlobStorageService } from "../../../../services/blobStorageService";
import { DatabaseService } from "../../../../services/databaseService";
import { Promise as BluebirdPromise } from "bluebird";
import { MediaElement } from "../../../models";
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

export async function assemblePostMediaElementsByIds({
  controller,
  publishedItemId,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  publishedItemId: string;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, MediaElement[]>> {
  //////////////////////////////////////////////////
  // Get Post Media Item Pointers
  //////////////////////////////////////////////////

  const getPostContentElementsByPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.postContentElementsTableService.getPostContentElementsByPublishedItemId(
      {
        controller,
        publishedItemId,
      },
    );
  if (getPostContentElementsByPublishedItemIdResponse.type === EitherType.failure) {
    return getPostContentElementsByPublishedItemIdResponse;
  }
  const { success: filedPostMediaElements } =
    getPostContentElementsByPublishedItemIdResponse;

  //////////////////////////////////////////////////
  // Get Media Item Temporary Urls From Pointers
  //////////////////////////////////////////////////

  const getTemporaryImageUrlResponses = await BluebirdPromise.map(
    filedPostMediaElements,
    async (
      filedPostMediaElement,
    ): Promise<InternalServiceResponse<ErrorReasonTypes<string>, MediaElement>> => {
      const getTemporaryImageUrlResponse = await blobStorageService.getTemporaryImageUrl({
        controller,
        blobItemPointer: {
          fileKey: filedPostMediaElement.blobFileKey,
        },
      });
      if (getTemporaryImageUrlResponse.type === EitherType.failure) {
        return getTemporaryImageUrlResponse;
      }
      const { success: fileTemporaryUrl } = getTemporaryImageUrlResponse;

      return Success({
        temporaryUrl: fileTemporaryUrl,
        mimeType: filedPostMediaElement.mimeType,
      });
    },
  );

  const mappedGetTemporaryImageUrlResponses = unwrapListOfEitherResponses({
    eitherResponses: getTemporaryImageUrlResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
  if (mappedGetTemporaryImageUrlResponses.type === EitherType.failure) {
    return mappedGetTemporaryImageUrlResponses;
  }
  const { success: mediaElements } = mappedGetTemporaryImageUrlResponses;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success(mediaElements);
}
