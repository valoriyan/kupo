import { BlobStorageServiceInterface } from "../../../../services/blobStorageService/models";
import { DatabaseService } from "../../../../services/databaseService";
import { Promise as BluebirdPromise } from "bluebird";
import { MediaElement } from "../../../models";
import { Controller } from "tsoa";
import {
  collectMappedResponses,
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";

export async function assemblePostMediaElements({
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

  const mappedGetTemporaryImageUrlResponses = collectMappedResponses({
    mappedResponses: getTemporaryImageUrlResponses,
  });
  if (mappedGetTemporaryImageUrlResponses.type === EitherType.failure) {
    return mappedGetTemporaryImageUrlResponses;
  }
  const { success: mediaElements } = mappedGetTemporaryImageUrlResponses;

  return Success(mediaElements);
}
