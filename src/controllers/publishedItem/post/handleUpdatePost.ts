import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { PostController } from "./postController";

export enum UpdatePostFailedReason {
  IllegalAccess = "Illegal Access",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdatePostSuccess {}

export interface UpdatePostRequestBody {
  publishedItemId: string;

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
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UpdatePostFailedReason>,
    UpdatePostSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { publishedItemId, caption, scheduledPublicationTimestamp, expirationTimestamp } =
    requestBody;

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      {
        controller,
        id: publishedItemId,
      },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: unrenderablePostWithoutElementsOrHashtags } =
    getPublishedItemByIdResponse;

  if (unrenderablePostWithoutElementsOrHashtags.authorUserId !== clientUserId) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: UpdatePostFailedReason.IllegalAccess,
      error: "Illegal Access at handleUpdatePost",
      additionalErrorInformation: "Illegal Access at handleUpdatePost",
    });
  }

  const updateContentItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.updateContentItemById(
      {
        controller,
        id: publishedItemId,
        authorUserId: clientUserId,
        caption: caption ? caption.toLowerCase() : caption,
        scheduledPublicationTimestamp,
        expirationTimestamp,
      },
    );
  if (updateContentItemByIdResponse.type === EitherType.failure) {
    return updateContentItemByIdResponse;
  }

  return Success({});
}
