/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuidv4 } from "uuid";
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  HTTPResponse,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import { constructRenderableUserFromParts } from "../user/utilities";
import { RenderableNewFollowerNotification } from "../notification/models/renderableUserNotifications";
import { GenericResponseFailedReason } from "../models";
import { ProfilePrivacySetting } from "../user/models";
import { Controller } from "tsoa";
import { DatabaseService } from "../../services/databaseService";
import { WebSocketService } from "../../services/webSocketService";
import { BlobStorageServiceInterface } from "../../services/blobStorageService/models";

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

  console.log("userIdBeingFollowed", userIdBeingFollowed);

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const userFollowEventId = uuidv4();

  console.log("userIdBeingFollowed", userIdBeingFollowed);
  console.log("userFollowEventId", userFollowEventId);


  const selectUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
      { controller, userId: userIdBeingFollowed },
    );
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const userBeingFollowed = selectUserByUserIdResponse.success;

  console.log("userBeingFollowed", userBeingFollowed);


  if (!userBeingFollowed) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at handleFollowUser",
      additionalErrorInformation: "Error at handleFollowUser",
    });
  }

  const isPending =
    userBeingFollowed.profilePrivacySetting === ProfilePrivacySetting.Private;

  const createUserFollowResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.createUserFollow(
      {
        controller,
        userFollowEventId,
        userIdDoingFollowing: clientUserId,
        userIdBeingFollowed,
        timestamp: Date.now(),
        isPending,
      },
    );
  console.log("createUserFollowResponse", userBeingFollowed);

  if (createUserFollowResponse.type === EitherType.failure) {
    return createUserFollowResponse;
  }

  if (userIdBeingFollowed !== clientUserId && !isPending) {
    await notifyUserOfNewFollower({
      controller,
      databaseService: controller.databaseService,
      blobStorageService: controller.blobStorageService,
      webSocketService: controller.webSocketService,
      userIdBeingFollowed,
      userIdDoingFollowing: clientUserId,
      userFollowEventId,
    });
  }

  return {
    type: EitherType.success,
    success: {},
  };
}

const notifyUserOfNewFollower = async ({
  controller,
  databaseService,
  blobStorageService,
  webSocketService,
  userIdBeingFollowed,
  userIdDoingFollowing,
  userFollowEventId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageServiceInterface;
  webSocketService: WebSocketService;
  userIdBeingFollowed: string;
  userIdDoingFollowing: string;
  userFollowEventId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> => {
  const createUserNotificationResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
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

  //////////////////////////////////////////////////
  // COLLECT USER DOING FOLLOWING TO SHARE WITH USER BEING FOLLOWED
  //////////////////////////////////////////////////

  const selectUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      controller,
      userId: userIdDoingFollowing,
    });
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }

  const { success: unrenderableUserDoingFollowing } = selectUserByUserIdResponse;

  if (!!unrenderableUserDoingFollowing) {
    const constructRenderableUserFromPartsResponse =
      await constructRenderableUserFromParts({
        controller,
        requestorUserId: userIdBeingFollowed,
        unrenderableUser: unrenderableUserDoingFollowing,
        blobStorageService: blobStorageService,
        databaseService: databaseService,
      });

    if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
      return constructRenderableUserFromPartsResponse;
    }

    const { success: userDoingFollowing } = constructRenderableUserFromPartsResponse;

    const selectCountOfUnreadUserNotificationsByUserIdResponse =
      await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
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
      userDoingFollowing,
    };

    await webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewFollower({
      userId: userIdBeingFollowed,
      renderableNewFollowerNotification,
    });
  }
  return Success({});
};
