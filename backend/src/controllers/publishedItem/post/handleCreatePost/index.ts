import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../../utilities/monads";
import { PostController } from "../postController";
import express from "express";
import { checkAuthentication, readNetworkPortalId } from "../../../auth/utilities";
import { RenderablePost } from "../models";
import { FileDescriptor, GenericResponseFailedReason } from "../../../models";
import { handleCreatePostNotifications } from "./handleCreatePostNotifications";
import { createPost } from "./createPost";
import { getPreviewTemporaryUrlFromRenderablePost } from "../utilities/getPreviewTemporaryUrlFromRenderablePost";

export enum CreatePostFailedReason {
  UnknownCause = "Unknown Cause",
  ExpirationTimestampIsInPast = "Expiration Timestamp is in Past",
  ScheduledPublicationTimestampIsInPast = "Scheduled Publication Timestamp is in Past",
}

export interface CreatePostSuccess {
  renderablePost: RenderablePost;
}

export interface CreatePostRequestBody {
  contentElementFiles: FileDescriptor[];
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
  requestBody: CreatePostRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | CreatePostFailedReason>,
    CreatePostSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const {
    caption,
    scheduledPublicationTimestamp,
    hashtags,
    contentElementFiles,
    expirationTimestamp,
  } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const readNetworkPortalIdResponse = readNetworkPortalId(controller, request);
  if (readNetworkPortalIdResponse.type === EitherType.failure) {
    return readNetworkPortalIdResponse;
  }
  const { success: networkPortalId } = readNetworkPortalIdResponse;

  //////////////////////////////////////////////////
  // Create Post
  //////////////////////////////////////////////////

  const createPostResponse = await createPost({
    controller,
    databaseService: controller.databaseService,
    blobStorageService: controller.blobStorageService,
    networkPortalId,
    authorUserId: clientUserId,
    host: "user-self-hosted",
    caption,
    hashtags,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    contentElementFiles,
  });
  if (createPostResponse.type === EitherType.failure) {
    return createPostResponse;
  }
  const { success: createdPost } = createPostResponse;

  //////////////////////////////////////////////////
  // Get Client User
  //////////////////////////////////////////////////

  const selectMaybeUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      { controller, userId: clientUserId },
    );
  if (selectMaybeUserByUserIdResponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdResponse;
  }
  const { success: maybeUser } = selectMaybeUserByUserIdResponse;

  if (!maybeUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at handleCreatePost",
      additionalErrorInformation: "User not found at handleCreatePost",
    });
  }
  const unrenderableUser = maybeUser;

  //////////////////////////////////////////////////
  // Send Out Relevant Notifications
  //////////////////////////////////////////////////

  const handleCreatePostNotificationsResponse = await handleCreatePostNotifications({
    controller,
    renderablePublishedItem: createdPost,
    databaseService: controller.databaseService,
    blobStorageService: controller.blobStorageService,
    webSocketService: controller.webSocketService,
  });
  if (handleCreatePostNotificationsResponse.type === EitherType.failure) {
    return handleCreatePostNotificationsResponse;
  }

  await controller.webSocketService.notifyOfNewPublishedItem({
    recipientUserId: clientUserId,
    previewTemporaryUrl: getPreviewTemporaryUrlFromRenderablePost({
      renderablePost: createdPost,
    }),
    username: unrenderableUser.username,
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    renderablePost: createdPost,
  });
}
