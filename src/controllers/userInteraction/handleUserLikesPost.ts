import { v4 as uuidv4 } from "uuid";
import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import { constructRenderableUserFromParts } from "../user/utilities";
import { constructRenderablePostFromParts } from "../post/utilities";
import { RenderableNewLikeOnPostNotification } from "../notification/models/renderableUserNotifications";

export interface UserLikesPostRequestBody {
  postId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserLikesPostSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserLikesPostFailed {}

export async function handleUserLikesPost({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: UserLikesPostRequestBody;
}): Promise<HTTPResponse<UserLikesPostFailed, UserLikesPostSuccess>> {
  const now = Date.now();

  const { postId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const postLikeId = uuidv4();

  await controller.databaseService.tableNameToServicesMap.postLikesTableService.createPostLikeFromUserId(
    {
      postLikeId,
      postId,
      userId: clientUserId,
      timestamp: now,
    },
  );

  const unrenderablePostWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostByPostId(
      { postId },
    );

  const doesNotificationExist =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.doesUserNotificationExist(
      {
        userId: unrenderablePostWithoutElementsOrHashtags.authorUserId,
        referenceTableId: postId,
      },
    );

  if (doesNotificationExist) {
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.setLastUpdatedTimestamp(
      {
        userNotificationId: uuidv4(),
        newUpdateTimestamp: now,
      },
    );
  } else {
    if (unrenderablePostWithoutElementsOrHashtags.authorUserId !== clientUserId) {
      await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
        {
          userNotificationId: uuidv4(),
          recipientUserId: unrenderablePostWithoutElementsOrHashtags.authorUserId,
          notificationType: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
          referenceTableId: postLikeId,
        },
      );
    }
  }

  const unrenderableClientUser =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
      {
        userId: clientUserId,
      },
    );

  if (!!unrenderableClientUser) {
    const clientUser = await constructRenderableUserFromParts({
      clientUserId,
      unrenderableUser: unrenderableClientUser,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });

    const post = await constructRenderablePostFromParts({
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      unrenderablePostWithoutElementsOrHashtags,
      clientUserId,
    });

    const countOfUnreadNotifications =
      await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
        { userId: unrenderablePostWithoutElementsOrHashtags.authorUserId },
      );

    const renderableNewLikeOnPostNotification: RenderableNewLikeOnPostNotification = {
      eventTimestamp: now,
      type: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
      countOfUnreadNotifications,
      userThatLikedPost: clientUser,
      post,
    };

    await controller.webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewLikeOnPost(
      {
        renderableNewLikeOnPostNotification,
        userId: unrenderablePostWithoutElementsOrHashtags.authorUserId,
      },
    );
  }

  return {};
}
