import { v4 as uuidv4 } from "uuid";
import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";

export interface FollowUserRequestBody {
  userIdBeingFollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyFollowedUserResponse {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToFollowUserResponse {}

export async function handleFollowUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: FollowUserRequestBody;
}): Promise<HTTPResponse<FailedToFollowUserResponse, SuccessfullyFollowedUserResponse>> {
  const { userIdBeingFollowed } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const userFollowEventId = uuidv4();

  await controller.databaseService.tableNameToServicesMap.userFollowsTableService.createUserFollow(
    {
      userFollowEventId,
      userIdDoingFollowing: clientUserId,
      userIdBeingFollowed,
      timestamp: Date.now(),
    },
  );

  if (userIdBeingFollowed !== clientUserId) {
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
      {
        userNotificationId: uuidv4(),
        recipientUserId: userIdBeingFollowed,
        notificationType: NOTIFICATION_EVENTS.NEW_FOLLOWER,
        referenceTableId: userFollowEventId,
      },
    );
  }

  return {
    success: {},
  };
}
