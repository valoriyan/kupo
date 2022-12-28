import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const { publishedItemId, caption, scheduledPublicationTimestamp, expirationTimestamp } =
    requestBody;

  //////////////////////////////////////////////////
  // Get Unrenderable Published Item
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Check Authorization of User to Update Post
  //////////////////////////////////////////////////

  if (unrenderablePostWithoutElementsOrHashtags.authorUserId !== clientUserId) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: UpdatePostFailedReason.IllegalAccess,
      error: "Illegal Access at handleUpdatePost",
      additionalErrorInformation: "Illegal Access at handleUpdatePost",
    });
  }

  //////////////////////////////////////////////////
  // Write Update to DB
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
