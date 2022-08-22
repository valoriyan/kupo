import express from "express";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import { EitherType, HTTPResponse } from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { UnrenderableCanceledNewFollowerNotification } from "../notification/models/unrenderableCanceledUserNotifications";
import { UserInteractionController } from "./userInteractionController";

export interface UnfollowUserRequestBody {
  userIdBeingUnfollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyUnfollowedUserProfileResponse {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToUnfollowUserProfileResponse {}

export async function handleUnfollowUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: UnfollowUserRequestBody;
}): Promise<
  HTTPResponse<
    FailedToUnfollowUserProfileResponse,
    SuccessfullyUnfollowedUserProfileResponse
  >
> {
  const { userIdBeingUnfollowed } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

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
    success: { user_follow_event_id },
  } = deleteUserFollowResponse;

  await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
    {
      controller,
      notificationType: NOTIFICATION_EVENTS.NEW_FOLLOWER,
      referenceTableId: user_follow_event_id,
      recipientUserId: userIdBeingUnfollowed,
    },
  );

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: userIdBeingUnfollowed },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type == EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }

  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  const unrenderableCanceledNewFollowerNotification: UnrenderableCanceledNewFollowerNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.CANCELED_NEW_FOLLOWER,
      userIdDoingUnfollowing: clientUserId,
    };

  await controller.webSocketService.userNotificationsWebsocketService.notifyUserIdOfCanceledNewFollower(
    {
      userId: userIdBeingUnfollowed,
      unrenderableCanceledNewFollowerNotification,
    },
  );

  return {
    type: EitherType.success,
    success: {},
  };
}
