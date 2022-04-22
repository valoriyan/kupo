import { v4 as uuidv4 } from "uuid";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { PostController } from "./postController";
import express from "express";
import { Promise as BluebirdPromise } from "bluebird";
import { checkAuthorization } from "../auth/utilities";
import { ContentElement, RenderablePost } from "./models";
import { uploadMediaFile } from "../utilities/uploadMediaFile";

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
    await controller.databaseService.tableNameToServicesMap.postsTableService.createPost({
      postId,
      creationTimestamp,
      authorUserId: clientUserId,
      caption,
      scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
      expirationTimestamp,
    });

    const filedAndRenderablePostContentElements = await BluebirdPromise.map(
      mediaFiles,
      async (file) =>
        uploadMediaFile({
          file,
          blobStorageService: controller.blobStorageService,
        }),
    );

    const contentElements: ContentElement[] = filedAndRenderablePostContentElements.map(
      (filedAndRenderablePostContentElement) => ({
        temporaryUrl: filedAndRenderablePostContentElement.fileTemporaryUrl,
        mimeType: filedAndRenderablePostContentElement.mimetype,
      }),
    );

    const contentElementTemporaryUrls = filedAndRenderablePostContentElements.map(
      (filedAndRenderablePostContentElement) =>
        filedAndRenderablePostContentElement.fileTemporaryUrl,
    );

    await controller.databaseService.tableNameToServicesMap.postContentElementsTableService.createPostContentElements(
      {
        postContentElements: filedAndRenderablePostContentElements.map(
          ({ blobFileKey, mimetype }, index) => ({
            postId,
            postContentElementIndex: index,
            blobFileKey,
            mimetype,
          }),
        ),
      },
    );

    await controller.databaseService.tableNameToServicesMap.hashtagTableService.addHashtagsToPost(
      {
        hashtags,
        postId,
      },
    );

    const unrenderableUsers =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
        { userIds: [clientUserId] },
      );

    const unrenderableUser = unrenderableUsers[0];

    await controller.webSocketService.notifyOfNewPost({
      recipientUserId: clientUserId,
      previewTemporaryUrl: contentElementTemporaryUrls[0],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      username: unrenderableUser!.username,
    });

    return {
      success: {
        renderablePost: {
          postId,
          creationTimestamp,
          contentElements,
          authorUserId: clientUserId,
          caption,
          scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
          hashtags,
          expirationTimestamp,
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
    controller.setStatus(401);
    return { error: { reason: CreatePostFailedReason.UnknownCause } };
  }
}
