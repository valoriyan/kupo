import { v4 as uuidv4 } from "uuid";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
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

export interface CreatePostFailed {
  reason: CreatePostFailedReason;
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
}): Promise<SecuredHTTPResponse<CreatePostFailed, CreatePostSuccess>> {
  const {
    caption,
    scheduledPublicationTimestamp,
    hashtags,
    mediaFiles,
    expirationTimestamp,
  } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const postId: string = uuidv4();
  const now = Date.now();

  const creationTimestamp = now;

  try {
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.createPublishedItem({
      publishedItemId: postId,
      type: PublishedItemType.POST,
      creationTimestamp,
      authorUserId: clientUserId,
      caption,
      scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
      expirationTimestamp,
    });

    const mediaFileErrors = await checkValidityOfMediaFiles({ files: mediaFiles });
    if (mediaFileErrors.length > 0) {
      return {
        error: { reason: CreatePostFailedReason.UnknownCause },
      };
    }

    const filedAndRenderablePostMediaElements = await BluebirdPromise.map(
      mediaFiles,
      async (file) =>
        uploadMediaFile({
          file,
          blobStorageService: controller.blobStorageService,
        }),
    );

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
          postContentElements: filedAndRenderablePostMediaElements.map(
            ({ blobFileKey, mimetype }, index) => ({
              postId,
              postContentElementIndex: index,
              blobFileKey,
              mimetype,
            }),
          ),
        },
      );
    }

    const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

    await controller.databaseService.tableNameToServicesMap.hashtagTableService.addHashtagsToPublishedItem(
      {
        hashtags: lowerCaseHashtags,
        publishedItemId: postId,
      },
    );

    const unrenderableUsers =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
        { userIds: [clientUserId] },
      );

    const unrenderableUser = unrenderableUsers[0];

    await controller.webSocketService.notifyOfNewPost({
      recipientUserId: clientUserId,
      previewTemporaryUrl: mediaElementTemporaryUrls[0],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      username: unrenderableUser!.username,
    });

    return {
      success: {
        renderablePost: {
          type: PublishedItemType.POST,
          id: postId,
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
      },
    };
  } catch (error) {
    console.log("error", error);
    controller.setStatus(500);
    return { error: { reason: CreatePostFailedReason.UnknownCause } };
  }
}
