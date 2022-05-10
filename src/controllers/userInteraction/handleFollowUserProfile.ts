import { v4 as uuidv4 } from "uuid";
import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import { constructRenderableUserFromParts } from "../user/utilities";

export interface FollowUserRequestBody {
  userIdBeingFollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FollowUserSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FollowUserFailed {}

export async function handleFollowUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: FollowUserRequestBody;
}): Promise<HTTPResponse<FollowUserFailed, FollowUserSuccess>> {
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

    const unrenderableClientUser = await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      userId: clientUserId,
    });

    if (!!unrenderableClientUser) {
      const clientUser = await constructRenderableUserFromParts({
        clientUserId,
        unrenderableUser: unrenderableClientUser,
        blobStorageService: controller.blobStorageService,
        databaseService: controller.databaseService,
      });
      
      const renderableNewFollowerNotification = {
        type: NOTIFICATION_EVENTS.NEW_FOLLOWER,
        eventTimestamp: Date.now(),    
        userDoingFollowing: clientUser,
      };
  
      await controller.webSocketService.notifyUserIdOfNewFollower({
        userId: userIdBeingFollowed,
        renderableNewFollowerNotification,
      });        
    }



  }

  return {
    success: {},
  };
}
