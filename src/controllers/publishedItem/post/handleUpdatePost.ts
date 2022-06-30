import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { checkAuthorization } from "../../auth/utilities";
import { PostController } from "./postController";

export enum UpdatePostFailedReason {
  IllegalAccess = "Illegal Access",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdatePostSuccess {}

export interface UpdatePostRequestBody {
  postId: string;

  caption?: string;

  scheduledPublicationTimestamp?: number;
  expirationTimestamp?: number;
}

export async function handleUpdatePost({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: UpdatePostRequestBody;
}): Promise<SecuredHTTPResponse<UpdatePostFailedReason, UpdatePostSuccess>> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { postId, caption, scheduledPublicationTimestamp, expirationTimestamp } =
    requestBody;

  const unrenderablePostWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { id: postId },
    );

  if (unrenderablePostWithoutElementsOrHashtags.authorUserId !== clientUserId) {
    return {
      error: {
        reason: UpdatePostFailedReason.IllegalAccess,
      },
    };
  }

  await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.updateContentItemById(
    {
      id: postId,
      authorUserId: clientUserId,
      caption: caption ? caption.toLowerCase() : caption,
      scheduledPublicationTimestamp,
      expirationTimestamp,
    },
  );

  return {};
}
