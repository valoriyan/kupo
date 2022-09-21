import express from "express";
import { NOTIFICATION_EVENTS } from "../../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
} from "../../../../utilities/monads";
import { checkAuthorization } from "../../../auth/utilities";
import { UserInteractionController } from "../userInteractionController";
import { deleteAndEmitCanceledNewFollowerNotification } from "./deleteAndEmitCanceledNewFollowerNotification";
import { deleteAndEmitCanceledNewUserFollowRequestNotification } from "./deleteAndEmitCanceledNewUserFollowRequestNotification";

export interface UnfollowUserRequestBody {
  userIdBeingUnfollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnfollowUserSuccess {}

export enum UnfollowUserFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleUnfollowUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: UnfollowUserRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UnfollowUserFailedReason>,
    UnfollowUserSuccess
  >
> {
  const { userIdBeingUnfollowed } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // DELETE THE USER FOLLOW
  //////////////////////////////////////////////////

  const deleteUserFollowResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.deleteUserFollow(
      {
        controller,
        userIdDoingUnfollowing: clientUserId,
        userIdBeingUnfollowed: requestBody.userIdBeingUnfollowed,
      },
    );

  if (deleteUserFollowResponse.type === EitherType.failure) {
    return deleteUserFollowResponse;
  }
  const {
    success: { user_follow_event_id: userFollowEventId, is_pending },
  } = deleteUserFollowResponse;

  //////////////////////////////////////////////////
  // DELETE THE NOTIFICATION
  // AND INFORM USER UI OF CANCELED REQUEST
  //////////////////////////////////////////////////

  if (is_pending) {
    const emitCanceledNewUserFollowRequestNotificationResponse =
      await deleteAndEmitCanceledNewUserFollowRequestNotification({
        controller,
        databaseService: controller.databaseService,
        webSocketService: controller.webSocketService,
        recipientUserId: userIdBeingUnfollowed,
        userIdWithdrawingFollowRequest: clientUserId,
        userFollowEventId,
      });
    if (emitCanceledNewUserFollowRequestNotificationResponse.type == EitherType.failure) {
      return emitCanceledNewUserFollowRequestNotificationResponse;
    }
  } else {
    const emitCanceledNewFollowerNotificationResponse =
      await deleteAndEmitCanceledNewFollowerNotification({
        controller,
        databaseService: controller.databaseService,
        webSocketService: controller.webSocketService,
        recipientUserId: userIdBeingUnfollowed,
        userIdDoingUnfollowing: clientUserId,
        userFollowEventId,
      });
    if (emitCanceledNewFollowerNotificationResponse.type == EitherType.failure) {
      return emitCanceledNewFollowerNotificationResponse;
    }
  }

  //////////////////////////////////////////////////
  // RETURN
  //////////////////////////////////////////////////

  return {
    type: EitherType.success,
    success: {},
  };
}
