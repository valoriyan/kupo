import { v4 as uuidv4 } from "uuid";
import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";

export interface UserLikesPostRequestBody {
  postId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulUserLikesPostResponse {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToLikePostByUserResponse {}

export async function handleUserLikesPost({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: UserLikesPostRequestBody;
}): Promise<
  HTTPResponse<FailedToLikePostByUserResponse, SuccessfulUserLikesPostResponse>
> {
  const { postId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.postLikesTableService.createPostLikeFromUserId(
    {
      postId,
      userId: clientUserId,
      timestamp: Date.now(),
    },
  );

  const unrenderablePostWithoutElementsOrHashtags =
  await controller.databaseService.tableNameToServicesMap.postsTableService.getPostByPostId(
    { postId },
);

const doesNotificationExist = await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.doesUserNotificationExist({
  userId: unrenderablePostWithoutElementsOrHashtags.authorUserId,
  referenceTableId: postId,
});

if (doesNotificationExist) {
  await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.setLastUpdatedTimestamp({
    userNotificationId: uuidv4(),
    newUpdateTimestamp: Date.now(),
  });

} else {
  await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification({
    userNotificationId: uuidv4(),
    recipientUserId: unrenderablePostWithoutElementsOrHashtags.authorUserId,
    notificationType: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
    referenceTableId: postId,
  });
}


  return {};
}
