import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { assembleRecordAndSendCanceledNewUserFollowRequestNotification } from "../../notification/notificationSenders/cancelledNotifications/assembleRecordAndSendCanceledNewUserFollowRequestNotification";
import { assembleRecordAndSendCanceledNewFollowerNotification } from "../../notification/notificationSenders/cancelledNotifications/assembleRecordAndSendCanceledNewFollowerNotification";

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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { userIdBeingUnfollowed } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Delete the User Follow From DB
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

  if (is_pending) {
    //////////////////////////////////////////////////
    // Handle Follow Request Notification
    //////////////////////////////////////////////////

    const emitCanceledNewUserFollowRequestNotificationResponse =
      await assembleRecordAndSendCanceledNewUserFollowRequestNotification({
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
    //////////////////////////////////////////////////
    // Handle New Follower Notification
    //////////////////////////////////////////////////
    const assembleRecordAndSendCanceledNewFollowerNotificationResponse =
      await assembleRecordAndSendCanceledNewFollowerNotification({
        controller,
        databaseService: controller.databaseService,
        webSocketService: controller.webSocketService,
        recipientUserId: userIdBeingUnfollowed,
        userIdDoingUnfollowing: clientUserId,
        userFollowEventId,
      });
    if (
      assembleRecordAndSendCanceledNewFollowerNotificationResponse.type ==
      EitherType.failure
    ) {
      return assembleRecordAndSendCanceledNewFollowerNotificationResponse;
    }
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return {
    type: EitherType.success,
    success: {},
  };
}
