import { v4 as uuidv4 } from "uuid";
import { HTTPResponse } from "src/types/httpResponse";
import { PostController } from "./postController";
import express from "express";

export enum PostPrivacySetting {
  Tier2AndTier3 = "Tier2AndTier3",
}

export enum PostDurationSetting {
  Forever = "Forever",
}

export enum CreatePostFailureReasons {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToCreatePostResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulPostCreationResponse {}

export async function handleCreatePost({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: {
    caption: string;
    creatorUserId: string;
    visibility: PostPrivacySetting;
    duration: PostDurationSetting;
    title: string;
    price: number;
    collaboratorUsernames: string[];
    scheduledPublicationTimestamp: number;
    file: Express.Multer.File;
  };
}): Promise<HTTPResponse<FailedToCreatePostResponse, SuccessfulPostCreationResponse>> {
  console.log(request);

  const postId = uuidv4();
  const imageId = uuidv4();

  const imageBuffer: Buffer = requestBody.file.buffer;

  const { fileKey: imageBlobFilekey } = await controller.blobStorageService.saveImage({
    image: imageBuffer,
  });

  try {
    await controller.databaseService.tableServices.postsTableService.createPost({
      postId,
      creatorUserId: requestBody.creatorUserId,
      imageId,
      caption: requestBody.caption,
      imageBlobFilekey,
      title: requestBody.title,
      price: requestBody.price,
      scheduledPublicationTimestamp: requestBody.scheduledPublicationTimestamp,
    });
    return {};
  } catch (error) {
    console.log("error", error);
    controller.setStatus(401);
    return { error: { reason: CreatePostFailureReasons.UnknownCause } };
  }
}
