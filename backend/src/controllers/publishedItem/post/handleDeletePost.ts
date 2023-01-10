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
import { assembleRecordAndSendCanceledNewShareOfPublishedItemNotification } from "../../../controllers/notification/notificationSenders/cancelledNotifications/assembleRecordAndSendCanceledNewShareOfPublishedItemNotification";

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
  // Handle Notifications
  //////////////////////////////////////////////////
  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: unrenderablePublishedItemBeingDeleted } = getPublishedItemByIdResponse;

  if (!!unrenderablePublishedItemBeingDeleted.idOfPublishedItemBeingShared) {
    const getPublishedItemByIdSecondResponse =
      await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
        {
          controller,
          id: unrenderablePublishedItemBeingDeleted.idOfPublishedItemBeingShared,
        },
      );

    if (getPublishedItemByIdSecondResponse.type === EitherType.failure) {
      return getPublishedItemByIdSecondResponse;
    }
    const { success: unrenderablePublishedItemThatWasShared } =
      getPublishedItemByIdSecondResponse;

    assembleRecordAndSendCanceledNewShareOfPublishedItemNotification({
      controller,
      userIdNoLongerSharingPublishedItem: clientUserId,
      deletedPublishedItemId: unrenderablePublishedItemBeingDeleted.id,
      recipientUserId: unrenderablePublishedItemThatWasShared.authorUserId,
      databaseService: controller.databaseService,
      webSocketService: controller.webSocketService,
    });
  }
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
