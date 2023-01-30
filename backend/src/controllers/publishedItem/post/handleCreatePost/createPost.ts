/* eslint-disable @typescript-eslint/ban-types */
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { DatabaseService } from "../../../../services/databaseService";
import { PublishedItemHost, PublishedItemType } from "../../models";
import { FileDescriptor, MediaElement } from "../../../../controllers/models";
import { v4 as uuidv4 } from "uuid";
import { RenderablePost } from "../models";
import { Promise as BluebirdPromise } from "bluebird";
import { BlobStorageService } from "../../../../services/blobStorageService";
import {
  UnwrapListOfEitherResponsesFailureHandlingMethod,
  unwrapListOfEitherResponses,
} from "../../../../utilities/monads/unwrapListOfResponses";

export async function createPost({
  controller,
  databaseService,
  blobStorageService,
  networkPortalId,
  authorUserId,
  host,
  caption,
  hashtags,
  scheduledPublicationTimestamp,
  expirationTimestamp,
  contentElementFiles,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  networkPortalId: string;
  authorUserId: string;
  host: PublishedItemHost;
  caption: string;
  hashtags: string[];
  scheduledPublicationTimestamp?: number;
  expirationTimestamp?: number;
  contentElementFiles: FileDescriptor[];
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePost>> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const publishedItemId: string = uuidv4();

  const now = Date.now();
  const creationTimestamp = now;

  //////////////////////////////////////////////////
  // Write to DB
  //////////////////////////////////////////////////

  const createPublishedItemResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.createPublishedItem(
      {
        controller,
        publishedItemId,
        networkPortalIdOfOrigin: networkPortalId,
        type: PublishedItemType.POST,
        creationTimestamp,
        authorUserId,
        caption,
        scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
        expirationTimestamp,
      },
    );
  if (createPublishedItemResponse.type === EitherType.failure) {
    return createPublishedItemResponse;
  }

  //////////////////////////////////////////////////
  // Write Media Items to DB
  //////////////////////////////////////////////////

  if (contentElementFiles.length > 0) {
    await databaseService.tableNameToServicesMap.postContentElementsTableService.createPostContentElements(
      {
        controller,
        postContentElements: contentElementFiles.map(
          ({ blobFileKey, mimeType }, index) => ({
            publishedItemId,
            postContentElementIndex: index,
            blobFileKey,
            mimetype: mimeType,
          }),
        ),
      },
    );
  }

  //////////////////////////////////////////////////
  // Add Hashtags
  //////////////////////////////////////////////////

  const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  const addHashtagsToPublishedItemResponse =
    await databaseService.tableNameToServicesMap.publishedItemHashtagsTableService.addHashtagsToPublishedItem(
      {
        controller,
        hashtags: lowerCaseHashtags,
        publishedItemId: publishedItemId,
      },
    );
  if (addHashtagsToPublishedItemResponse.type === EitherType.failure) {
    return addHashtagsToPublishedItemResponse;
  }

  //////////////////////////////////////////////////
  // Get Media File Temporary Urls
  //////////////////////////////////////////////////

  const getTemporaryImageUrlResponses = await BluebirdPromise.map(
    contentElementFiles,
    async ({ blobFileKey }) => {
      return await blobStorageService.getTemporaryImageUrl({
        controller,
        blobItemPointer: { fileKey: blobFileKey },
      });
    },
  );

  const unwrappedGetTemporaryImageUrlResponses = unwrapListOfEitherResponses({
    eitherResponses: getTemporaryImageUrlResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
  if (unwrappedGetTemporaryImageUrlResponses.type === EitherType.failure) {
    return unwrappedGetTemporaryImageUrlResponses;
  }

  const { success: mediaElementTemporaryUrls } = unwrappedGetTemporaryImageUrlResponses;

  const mediaElements: MediaElement[] = mediaElementTemporaryUrls.map(
    (mediaElementTemporaryUrl, index) => ({
      temporaryUrl: mediaElementTemporaryUrl,
      mimeType: contentElementFiles[index].mimeType,
    }),
  );

  //////////////////////////////////////////////////
  // Compile Post
  //////////////////////////////////////////////////

  const renderablePost: RenderablePost = {
    host,
    type: PublishedItemType.POST,
    id: publishedItemId,
    authorUserId,
    caption,
    creationTimestamp,
    scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
    expirationTimestamp,
    mediaElements,
    hashtags: lowerCaseHashtags,
    likes: {
      count: 0,
    },
    comments: {
      count: 0,
    },
    isLikedByClient: false,
    isSavedByClient: false,
  };

  return Success(renderablePost);
}
