import { v4 as uuidv4 } from "uuid";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { PostController } from "./postController";
import express from "express";
import { Promise as BluebirdPromise } from "bluebird";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost } from "./models";
import { uploadMediaFile } from "../utilities/uploadMediaFile";

export enum CreatePostFailureReasons {
  UnknownCause = "Unknown Cause",
  ExpirationTimestampIsInPast = "Expiration Timestamp is in Past",
  ScheduledPublicationTimestampIsInPast = "Scheduled Publication Timestamp is in Past",
}

export interface FailedToCreatePostResponse {
  reason: CreatePostFailureReasons;
}

export interface SuccessfulPostCreationResponse {
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
  SecuredHTTPResponse<FailedToCreatePostResponse, SuccessfulPostCreationResponse>
> {
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

  try {
    await controller.databaseService.tableNameToServicesMap.postsTableService.createPost({
      postId,
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

    const countOfLikesOnPost =
      await controller.databaseService.tableNameToServicesMap.postLikesTableService.countLikesOnPostId(
        {
          postId,
        },
      );

    return {
      success: {
        renderablePost: {
          contentElementTemporaryUrls,
          postId,
          authorUserId: clientUserId,
          caption,
          scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
          hashtags,
          expirationTimestamp,
          likes: {
            count: countOfLikesOnPost,
          },
        },
      },
    };
  } catch (error) {
    console.log("error", error);
    controller.setStatus(401);
    return { error: { reason: CreatePostFailureReasons.UnknownCause } };
  }
}
