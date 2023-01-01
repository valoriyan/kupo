import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { assembleRecordAndSendCanceledAcceptedUserFollowRequestNotification } from "../../../controllers/notification/notificationSenders/cancelledNotifications/assembleRecordAndSendCanceledAcceptedUserFollowRequestNotification";

export interface RevokeFollowerRequestBody {
  revokedUserId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RevokeFollowerSuccess {}

export enum RevokeFollowerFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleRevokeFollower({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: RevokeFollowerRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | RevokeFollowerFailedReason>,
    RevokeFollowerSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { revokedUserId } = requestBody;

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
        userIdDoingUnfollowing: revokedUserId,
        userIdBeingUnfollowed: clientUserId,
      },
    );

  if (deleteUserFollowResponse.type === EitherType.failure) {
    return deleteUserFollowResponse;
  }
  const {
    success: { user_follow_event_id },
  } = deleteUserFollowResponse;

  //////////////////////////////////////////////////
  // Handle Notifications
  //////////////////////////////////////////////////
  const assembleRecordAndSendCanceledAcceptedUserFollowRequestNotificationResponse =
    await assembleRecordAndSendCanceledAcceptedUserFollowRequestNotification({
      controller,
      userIdUnacceptingFollowRequest: clientUserId,
      userFollowEventId: user_follow_event_id,
      databaseService: controller.databaseService,
      webSocketService: controller.webSocketService,
      recipientUserId: revokedUserId,
    });
  if (
    assembleRecordAndSendCanceledAcceptedUserFollowRequestNotificationResponse.type ===
    EitherType.failure
  ) {
    return assembleRecordAndSendCanceledAcceptedUserFollowRequestNotificationResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
