import { v4 as uuidv4 } from "uuid";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { PostController } from "./postController";
import express from "express";
import { Promise as BluebirdPromise } from "bluebird";
import { BlobStorageService } from "../../services/blobStorageService";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost } from "./models";

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

async function uploadFile({
  file,
  blobStorageService,
}: {
  file: Express.Multer.File;
  blobStorageService: BlobStorageService;
}): Promise<{
  blobFileKey: string;
  fileTemporaryUrl: string;
}> {
  const fileType = file.mimetype;
  if (!["image/jpeg", "image/png"].includes(fileType)) {
    throw new Error(`Cannot handle file of type ${fileType}`);
  }

  // TODO: ADD IMAGE VALIDATION
  const blobItemPointer = await blobStorageService.saveImage({
    image: file.buffer,
  });

  const fileTemporaryUrl = await blobStorageService.getTemporaryImageUrl({
    blobItemPointer,
  });

  return {
    blobFileKey: blobItemPointer.fileKey,
    fileTemporaryUrl,
  };
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
      async (
        file,
      ): Promise<{
        blobFileKey: string;
        fileTemporaryUrl: string;
      }> =>
        uploadFile({
          file,
          blobStorageService: controller.blobStorageService,
        }),
    );

    const blobFileKeys = filedAndRenderablePostContentElements.map(
      (filedAndRenderablePostContentElement) =>
        filedAndRenderablePostContentElement.blobFileKey,
    );

    const contentElementTemporaryUrls = filedAndRenderablePostContentElements.map(
      (filedAndRenderablePostContentElement) =>
        filedAndRenderablePostContentElement.fileTemporaryUrl,
    );

    await controller.databaseService.tableNameToServicesMap.postContentElementsTableService.createPostContentElements(
      {
        postContentElements: blobFileKeys.map((blobFileKey, index) => ({
          postId,
          postContentElementIndex: index,
          blobFileKey,
        })),
      },
    );

    await controller.databaseService.tableNameToServicesMap.hashtagTableService.addHashtagsToPost(
      {
        hashtags,
        postId,
      },
    );

    const unrenderableUser =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
        { userId: clientUserId },
      );

    await controller.webSocketService.notifyOfNewPost({
      recipientUserId: clientUserId,
      previewTemporaryUrl: contentElementTemporaryUrls[0],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      username: unrenderableUser!.username,
    });

    return {
      success: {
        renderablePost: {
          contentElementTemporaryUrls,
          postId,
          postAuthorUserId: clientUserId,
          caption,
          scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
          hashtags,
          expirationTimestamp,
        },
      },
    };
  } catch (error) {
    console.log("error", error);
    controller.setStatus(401);
    return { error: { reason: CreatePostFailureReasons.UnknownCause } };
  }
}
