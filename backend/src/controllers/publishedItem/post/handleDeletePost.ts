/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import { checkAuthentication } from "../../../controllers/auth/utilities";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { PostController } from "./postController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export enum DeletePostFailedReason {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeletePostSuccess {}

export interface DeletePostRequestBody {
  publishedItemId: string;
}

export async function handleDeletePost({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: DeletePostRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | DeletePostFailedReason>,
    DeletePostSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { errorResponse: error, clientUserId } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const { publishedItemId } = requestBody;

  //////////////////////////////////////////////////
  // Delete Published Item from DB
  //////////////////////////////////////////////////

  const deletePublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.deletePublishedItem(
      {
        controller,
        id: publishedItemId,
        authorUserId: clientUserId,
      },
    );
  if (deletePublishedItemResponse.type === EitherType.failure) {
    return deletePublishedItemResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
