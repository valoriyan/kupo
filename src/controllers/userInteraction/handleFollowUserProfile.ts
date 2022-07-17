import { v4 as uuidv4 } from "uuid";
import express from "express";
import { EitherType, HTTPResponse } from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import { constructRenderableUserFromParts } from "../user/utilities";
import { RenderableNewFollowerNotification } from "../notification/models/renderableUserNotifications";

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

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const userFollowEventId = uuidv4();

  const createUserFollowResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.createUserFollow(
      {
        controller,
        userFollowEventId,
        userIdDoingFollowing: clientUserId,
        userIdBeingFollowed,
        timestamp: Date.now(),
      },
    );
  if (createUserFollowResponse.type === EitherType.failure) {
    return createUserFollowResponse;
  }

  if (userIdBeingFollowed !== clientUserId) {
    const createUserNotificationResponse =
      await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
        {
          controller,
          userNotificationId: uuidv4(),
          recipientUserId: userIdBeingFollowed,
          notificationType: NOTIFICATION_EVENTS.NEW_FOLLOWER,
          referenceTableId: userFollowEventId,
        },
      );
    if (createUserNotificationResponse.type === EitherType.failure) {
      return createUserNotificationResponse;
    }

    const selectUserByUserIdResponse =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
        {
          controller,
          userId: clientUserId,
        },
      );
    if (selectUserByUserIdResponse.type === EitherType.failure) {
      return selectUserByUserIdResponse;
    }

    const { success: unrenderableClientUser } = selectUserByUserIdResponse;

    if (!!unrenderableClientUser) {
      const constructRenderableUserFromPartsResponse =
        await constructRenderableUserFromParts({
          controller,
          clientUserId,
          unrenderableUser: unrenderableClientUser,
          blobStorageService: controller.blobStorageService,
          databaseService: controller.databaseService,
        });

      if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
        return constructRenderableUserFromPartsResponse;
      }

      const { success: clientUser } = constructRenderableUserFromPartsResponse;

      const selectCountOfUnreadUserNotificationsByUserIdResponse =
        await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
          { controller, userId: userIdBeingFollowed },
        );

      if (
        selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure
      ) {
        return selectCountOfUnreadUserNotificationsByUserIdResponse;
      }

      const { success: countOfUnreadNotifications } =
        selectCountOfUnreadUserNotificationsByUserIdResponse;

      const renderableNewFollowerNotification: RenderableNewFollowerNotification = {
        countOfUnreadNotifications,
        type: NOTIFICATION_EVENTS.NEW_FOLLOWER,
        eventTimestamp: Date.now(),
        userDoingFollowing: clientUser,
      };

      await controller.webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewFollower(
        {
          userId: userIdBeingFollowed,
          renderableNewFollowerNotification,
        },
      );
    }
  }

  return {
    type: EitherType.success,
    success: {},
  };
}
