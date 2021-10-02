import { v4 as uuidv4 } from "uuid";
import { HTTPResponse } from "../../types/httpResponse";
import { PostController } from "./postController";
import express from "express";
import { Promise as BluebirdPromise } from "bluebird";
import { BlobStorageService } from "../../services/blobStorageService";
import { checkAuthorization } from "../auth/utilities";
import {
  FiledPostContentElement,
  PostElementFileType,
  RenderablePost,
  RenderablePostContentElement,
} from "./models";

export enum CreatePostFailureReasons {
  UnknownCause = "Unknown Cause",
  ExpirationTimestampIsInPast = "Expiration Timestamp is in Past",
  ScheduledPublicationTimestampIsInPast = "Scheduled Publication Timestamp is in Past",
}

export interface FailedToCreatePostResponse {
  reason: CreatePostFailureReasons;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulPostCreationResponse {
  renderablePost: RenderablePost;
}

interface HandlerRequestBody {
  images?: Express.Multer.File[];
  videos?: Express.Multer.File[];

  indexesOfUploadedImages?: number[];
  indexesOfUploadedVideos?: number[];

  caption: string;
  expirationTimestamp?: number;
  authorUserId: string;

  title?: string;
  price?: number;

  scheduledPublicationTimestamp: number;
}

function getOrderedUploadedFiles({ requestBody }: { requestBody: HandlerRequestBody }): {
  file: Express.Multer.File;
  type: PostElementFileType;
}[] {
  if (
    !!requestBody.images &&
    (!requestBody.indexesOfUploadedImages ||
      requestBody.images.length !== requestBody.indexesOfUploadedImages.length)
  ) {
    throw new Error("Uploaded images are missing matching indexes");
  }

  if (
    !!requestBody.videos &&
    (!requestBody.indexesOfUploadedVideos ||
      requestBody.videos.length !== requestBody.indexesOfUploadedVideos.length)
  ) {
    throw new Error("Uploaded videos are missing matching indexes");
  }

  const setOfEncounteredFileIndexes = new Set();
  if (requestBody.indexesOfUploadedImages) {
    requestBody.indexesOfUploadedImages.forEach((uploadedImageIndex) => {
      setOfEncounteredFileIndexes.add(uploadedImageIndex);
    });
  }
  if (requestBody.indexesOfUploadedVideos) {
    requestBody.indexesOfUploadedVideos.forEach((uploadedVideoIndex) => {
      setOfEncounteredFileIndexes.add(uploadedVideoIndex);
    });
  }

  const numberOfUploadedFiles =
    (!!requestBody.images ? requestBody.images.length : 0) +
    (!!requestBody.videos ? requestBody.videos.length : 0);

  if (numberOfUploadedFiles !== setOfEncounteredFileIndexes.size) {
    throw new Error("Uploaded files have incorrect indexes.");
  }

  const orderedUploadedFiles: {
    file: Express.Multer.File;
    type: PostElementFileType;
  }[] = [...Array(numberOfUploadedFiles).keys()].map((targetIndex) => {
    const uploadedImageFileIndex = !!requestBody.indexesOfUploadedImages
      ? requestBody.indexesOfUploadedImages.indexOf(targetIndex)
      : -1;
    if (uploadedImageFileIndex !== -1) {
      return {
        file: requestBody.images![uploadedImageFileIndex],
        type: PostElementFileType.Image,
      };
    }
    const uploadedVideoFileIndex = !!requestBody.indexesOfUploadedVideos
      ? requestBody.indexesOfUploadedVideos.indexOf(targetIndex)
      : -1;
    return {
      file: requestBody.videos![uploadedVideoFileIndex],
      type: PostElementFileType.Video,
    };
  });

  return orderedUploadedFiles;
}

async function uploadFile({
  file,
  fileType,
  blobStorageService,
}: {
  file: Express.Multer.File;
  fileType: PostElementFileType;
  blobStorageService: BlobStorageService;
}): Promise<{
  filedPostContentElement: FiledPostContentElement;
  renderablePostContentElement: RenderablePostContentElement;
}> {
  if (fileType === PostElementFileType.Video) {
    // TODO ADD VIDEO HANDLING
    throw new Error("Videos are unhandled");
  } else {
    // TODO: ADD IMAGE VALIDATION
    const blobItemPointer = await blobStorageService.saveImage({
      image: file.buffer,
    });

    const fileTemporaryUrl = await blobStorageService.getTemporaryImageUrl({
      blobItemPointer,
    });

    return {
      filedPostContentElement: {
        fileType,
        blobFileKey: blobItemPointer.fileKey,
      },
      renderablePostContentElement: {
        fileType,
        fileTemporaryUrl,
      },
    };
  }
}

export async function handleCreatePost({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: HandlerRequestBody;
}): Promise<HTTPResponse<FailedToCreatePostResponse, SuccessfulPostCreationResponse>> {
  const { authorUserId, caption, title, price, scheduledPublicationTimestamp } =
    requestBody;

  const { clientUserId } = await checkAuthorization(controller, request);

  if (authorUserId !== clientUserId) {
    throw new Error("Someone other than user is attempting to create a post");
  }

  const postId: string = uuidv4();

  const orderedUploadedFiles = getOrderedUploadedFiles({ requestBody });

  try {
    await controller.databaseService.tableServices.postsTableService.createPost({
      postId,
      authorUserId: clientUserId,
      caption,
      title,
      price,
      scheduledPublicationTimestamp,
    });

    const filedAndRenderablePostContentElements = await BluebirdPromise.map(
      orderedUploadedFiles,
      async (
        file,
      ): Promise<{
        filedPostContentElement: FiledPostContentElement;
        renderablePostContentElement: RenderablePostContentElement;
      }> =>
        uploadFile({
          file: file.file,
          fileType: file.type,
          blobStorageService: controller.blobStorageService,
        }),
    );

    const renderablePostContentElements = filedAndRenderablePostContentElements.map(
      (filedAndRenderablePostContentElement) =>
        filedAndRenderablePostContentElement.renderablePostContentElement,
    );

    const filedPostContentElements = filedAndRenderablePostContentElements.map(
      (filedAndRenderablePostContentElement) =>
        filedAndRenderablePostContentElement.filedPostContentElement,
    );

    await controller.databaseService.tableServices.postContentElementsTableService.createPostContentElements(
      {
        postContentElements: filedPostContentElements.map(
          (filedPostContentElement, index) => ({
            postId,
            postContentElementIndex: index,
            postContentElementType: filedPostContentElement.fileType,
            blobFileKey: filedPostContentElement.blobFileKey,
          }),
        ),
      },
    );

    return {
      success: {
        renderablePost: {
          contentElements: renderablePostContentElements,
          postId,
          postAuthorUserId: clientUserId,
          caption,
          title,
          price,
          scheduledPublicationTimestamp,
        },
      },
    };
  } catch (error) {
    console.log("error", error);
    controller.setStatus(401);
    return { error: { reason: CreatePostFailureReasons.UnknownCause } };
  }
}
