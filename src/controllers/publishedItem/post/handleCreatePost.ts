import { v4 as uuidv4 } from "uuid";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
  collectMappedResponses,
} from "../../../utilities/monads";
import { PostController } from "./postController";
import express from "express";
import { Promise as BluebirdPromise } from "bluebird";
import { checkAuthorization } from "../../auth/utilities";
import { RenderablePost } from "./models";
import { uploadMediaFile } from "../../utilities/mediaFiles/uploadMediaFile";
import { checkValidityOfMediaFiles } from "../../utilities/mediaFiles/checkValidityOfMediaFiles";
import { MediaElement } from "../../models";
import { PublishedItemType } from "../models";

export enum CreatePostFailedReason {
  UnknownCause = "Unknown Cause",
  ExpirationTimestampIsInPast = "Expiration Timestamp is in Past",
  ScheduledPublicationTimestampIsInPast = "Scheduled Publication Timestamp is in Past",
}

export interface CreatePostSuccess {
  renderablePost: RenderablePost;
}

interface HandlerRequestBody {
  mediaFiles: Express.Multer.File[];
  caption: string;
  hashtags: string[];
  scheduledPublicationTimestamp?: number;
  expirationTimestamp?: number;
}

export async function handleCreatePost({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: HandlerRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | CreatePostFailedReason>,
    CreatePostSuccess
  >
> {
  const {
    caption,
    scheduledPublicationTimestamp,
    hashtags,
    mediaFiles,
    expirationTimestamp,
  } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const publishedItemId: string = uuidv4();
  const now = Date.now();

  const creationTimestamp = now;

  const createPublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.createPublishedItem(
      {
        controller,
        publishedItemId,
        type: PublishedItemType.POST,
        creationTimestamp,
        authorUserId: clientUserId,
        caption,
        scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
        expirationTimestamp,
      },
    );
  if (createPublishedItemResponse.type === EitherType.failure) {
    return createPublishedItemResponse;
  }

  const mediaFileErrors = await checkValidityOfMediaFiles({ files: mediaFiles });
  if (mediaFileErrors.length > 0) {
    return {
      type: EitherType.failure,
      error: { reason: CreatePostFailedReason.UnknownCause },
    };
  }

  const uploadMediaFileResponses = await BluebirdPromise.map(mediaFiles, async (file) =>
    uploadMediaFile({
      controller,
      file,
      blobStorageService: controller.blobStorageService,
    }),
  );
  const mappedUploadMediaFileResponses = collectMappedResponses({
    mappedResponses: uploadMediaFileResponses,
  });
  if (mappedUploadMediaFileResponses.type === EitherType.failure) {
    return mappedUploadMediaFileResponses;
  }
  const { success: filedAndRenderablePostMediaElements } = mappedUploadMediaFileResponses;

  const mediaElements: MediaElement[] = filedAndRenderablePostMediaElements.map(
    (filedAndRenderablePostMediaElement) => ({
      temporaryUrl: filedAndRenderablePostMediaElement.fileTemporaryUrl,
      mimeType: filedAndRenderablePostMediaElement.mimetype,
    }),
  );

  const mediaElementTemporaryUrls = filedAndRenderablePostMediaElements.map(
    (filedAndRenderablePostMediaElement) =>
      filedAndRenderablePostMediaElement.fileTemporaryUrl,
  );

  if (filedAndRenderablePostMediaElements.length > 0) {
    await controller.databaseService.tableNameToServicesMap.postContentElementsTableService.createPostContentElements(
      {
        controller,
        postContentElements: filedAndRenderablePostMediaElements.map(
          ({ blobFileKey, mimetype }, index) => ({
            publishedItemId,
            postContentElementIndex: index,
            blobFileKey,
            mimetype,
          }),
        ),
      },
    );
  }

  const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  const addHashtagsToPublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.addHashtagsToPublishedItem(
      {
        controller,
        hashtags: lowerCaseHashtags,
        publishedItemId: publishedItemId,
      },
    );
  if (addHashtagsToPublishedItemResponse.type === EitherType.failure) {
    return addHashtagsToPublishedItemResponse;
  }

  const selectUsersByUserIdsResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
      { controller, userIds: [clientUserId] },
    );
  if (selectUsersByUserIdsResponse.type === EitherType.failure) {
    return selectUsersByUserIdsResponse;
  }
  const { success: unrenderableUsers } = selectUsersByUserIdsResponse;

  const unrenderableUser = unrenderableUsers[0];

  await controller.webSocketService.notifyOfNewPublishedItem({
    recipientUserId: clientUserId,
    previewTemporaryUrl: mediaElementTemporaryUrls[0],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    username: unrenderableUser!.username,
  });

  return Success({
    renderablePost: {
      type: PublishedItemType.POST,
      id: publishedItemId,
      authorUserId: clientUserId,
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
    },
  });
}
