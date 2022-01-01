import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { constructRenderableUsersFromParts } from "../user/utilities";
import {
  NotificationType,
  RenderableNewFollowerNotification,
  RenderableNotification,
} from "./models";
import { NotificationController } from "./notificationController";

export interface GetPageOfNotificationsRequestBody {
  cursor?: string;
  pageSize: number;
}

export interface SuccessfullyGotPageOfNotificationsResponse {
  notifications: RenderableNotification[];

  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum FailedtoGetPageOfNotificationsResponseReason {
  UnknownCause = "Unknown Cause",
}

export interface FailedtoGetPageOfNotificationsResponse {
  reason: FailedtoGetPageOfNotificationsResponseReason;
}

export async function handleGetPageOfNotifications({
  controller,
  request,
  requestBody,
}: {
  controller: NotificationController;
  request: express.Request;
  requestBody: GetPageOfNotificationsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FailedtoGetPageOfNotificationsResponse,
    SuccessfullyGotPageOfNotificationsResponse
  >
> {
  console.log(requestBody);

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const unrenderableUserFollows =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowingUserId(
      { userIdBeingFollowed: clientUserId },
    );

  const userIdsDoingFollowing = unrenderableUserFollows.map(
    (follow) => follow.userIdDoingFollowing,
  );

  const unrenderableUsersDoingFollowing =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
      { userIds: userIdsDoingFollowing },
    );

  const renderableUsers = await constructRenderableUsersFromParts({
    clientUserId,
    unrenderableUsers: unrenderableUsersDoingFollowing,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  const mapOfUserIdsToUsers = new Map(
    renderableUsers.map((renderableUser) => [renderableUser.userId, renderableUser]),
  );

  const newFollowerNotifications = unrenderableUserFollows.map(
    (unrenderableUserFollow) => {
      const notification: RenderableNewFollowerNotification = {
        type: NotificationType.NEW_FOLLOWER,
        timestamp: unrenderableUserFollow.timestamp,
        userDoingFollowing: mapOfUserIdsToUsers.get(
          unrenderableUserFollow.userIdDoingFollowing,
        )!,
      };
      return notification;
    },
  );

  return {
    success: {
      notifications: [...newFollowerNotifications],
    },
  };
}
