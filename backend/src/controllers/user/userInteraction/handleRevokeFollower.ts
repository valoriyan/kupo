import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { deleteAndEmitCanceledAcceptedUserFollowRequestNotification } from "./utilities/deleteAndEmitCanceledAcceptedUserFollowRequestNotification";

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
  const { revokedUserId } = requestBody;

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
  // DETERMINE IF ACCEPTED FOLLOW REQUEST NOTIFCATION EXISTS
  //////////////////////////////////////////////////

  const maybeGetUserNotificationByUserFollowReferenceResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.maybeGetUserNotificationByUserFollowReference(
      {
        controller,
        userId: revokedUserId,
        userFollowReference: user_follow_event_id,
      },
    );
  if (maybeGetUserNotificationByUserFollowReferenceResponse.type === EitherType.failure) {
    return maybeGetUserNotificationByUserFollowReferenceResponse;
  }
  const { success: maybeUserNotification } =
    maybeGetUserNotificationByUserFollowReferenceResponse;

  //////////////////////////////////////////////////
  // IF EXISTS
  //     DELETE THE NOTIFICATION
  //     AND INFORM USER UI OF CANCELED REQUEST ACCEPTANCE
  //////////////////////////////////////////////////

  if (!!maybeUserNotification) {
    const { user_follow_reference: userFollowEventId } = maybeUserNotification;

    const deleteAndEmitCanceledAcceptedUserFollowRequestNotificationResponse =
      await deleteAndEmitCanceledAcceptedUserFollowRequestNotification({
        controller,
        databaseService: controller.databaseService,
        webSocketService: controller.webSocketService,
        recipientUserId: revokedUserId,
        userIdUnacceptingFollowRequest: clientUserId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userFollowEventId: userFollowEventId!,
      });
    if (
      deleteAndEmitCanceledAcceptedUserFollowRequestNotificationResponse.type ===
      EitherType.failure
    ) {
      return deleteAndEmitCanceledAcceptedUserFollowRequestNotificationResponse;
    }
  }

  return Success({});
}
