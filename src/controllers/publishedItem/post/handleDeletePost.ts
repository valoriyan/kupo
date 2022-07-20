/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { Controller } from "tsoa";
import { checkAuthorization } from "../../../controllers/auth/utilities";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { deleteBaseRenderablePublishedItemComponents } from "../utilities/deleteBasePublishedItemComponents";
import { PostController } from "./postController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeletePostFailed {}

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
  SecuredHTTPResponse<ErrorReasonTypes<string | DeletePostFailed>, DeletePostSuccess>
> {
  const { errorResponse: error, clientUserId } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { publishedItemId } = requestBody;

  //////////////////////////////////////////////////
  // DELETE BASE PUBLISHED ITEMS
  //////////////////////////////////////////////////

  const deleteBaseRenderablePublishedItemComponentsResponse =
    await deleteBaseRenderablePublishedItemComponents({
      controller,
      databaseService: controller.databaseService,
      publishedItemId,
      requestingUserId: clientUserId,
    });
  if (deleteBaseRenderablePublishedItemComponentsResponse.type === EitherType.failure) {
    return deleteBaseRenderablePublishedItemComponentsResponse;
  }

  //////////////////////////////////////////////////
  // DELETE ASSOCIATED BLOB FILES
  //////////////////////////////////////////////////
  const deleteAssociatedBlobFilesResponse = await deleteAssociatedBlobFilesForPost({
    controller,
    databaseService: controller.databaseService,
    blobStorageService: controller.blobStorageService,
    publishedItemId: publishedItemId,
  });
  if (deleteAssociatedBlobFilesResponse.type === EitherType.failure) {
    return deleteAssociatedBlobFilesResponse;
  }

  return Success({});
}

const deleteAssociatedBlobFilesForPost = async ({
  controller,
  databaseService,
  blobStorageService,
  publishedItemId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  publishedItemId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> => {
  const deletePostContentElementsByPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.postContentElementsTableService.deletePostContentElementsByPublishedItemId(
      {
        controller,
        publishedItemId,
      },
    );
  if (deletePostContentElementsByPublishedItemIdResponse.type === EitherType.failure) {
    return deletePostContentElementsByPublishedItemIdResponse;
  }
  const { success: blobPointers } = deletePostContentElementsByPublishedItemIdResponse;

  const deleteImagesResponse = await blobStorageService.deleteImages({
    controller,
    blobPointers,
  });
  if (deleteImagesResponse.type === EitherType.failure) {
    return deleteImagesResponse;
  }

  return Success({});
};
