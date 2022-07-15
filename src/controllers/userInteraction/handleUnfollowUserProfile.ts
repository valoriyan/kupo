import express from "express";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import { EitherType, HTTPResponse } from "../../types/monads";
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

  const { user_follow_event_id } =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.deleteUserFollow(
      {
        userIdDoingUnfollowing: clientUserId,
        userIdBeingUnfollowed: requestBody.userIdBeingUnfollowed,
      },
    );

  await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
    {
      notificationType: NOTIFICATION_EVENTS.NEW_FOLLOWER,
      referenceTableId: user_follow_event_id,
      recipientUserId: userIdBeingUnfollowed,
    },
  );

  const countOfUnreadNotifications =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { userId: userIdBeingUnfollowed },
    );

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
