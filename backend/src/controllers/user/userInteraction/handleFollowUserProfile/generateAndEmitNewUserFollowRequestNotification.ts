/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuidv4 } from "uuid";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { NOTIFICATION_EVENTS } from "../../../../services/webSocketService/eventsConfig";
import { Controller } from "tsoa";
import { DatabaseService } from "../../../../services/databaseService";
import { WebSocketService } from "../../../../services/webSocketService";
import { BlobStorageServiceInterface } from "../../../../services/blobStorageService/models";
import { assembleRenderableNewUserFollowRequestNotification } from "../../../../controllers/notification/renderableNotificationAssemblers/assembleRenderableNewUserFollowRequestNotification";

export async function generateAndEmitNewUserFollowRequestNotification({
  controller,
  databaseService,
  blobStorageService,
  webSocketService,
  recipientUserId,
  followRequestingUserId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageServiceInterface;
  webSocketService: WebSocketService;
  recipientUserId: string;
  followRequestingUserId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  const userNotificationId = uuidv4();

  //////////////////////////////////////////////////
  // RECORD NOTIFICATION
  //////////////////////////////////////////////////

  const createUserNotificationResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
      {
        controller,
        userNotificationId,
        recipientUserId,
        notificationType: NOTIFICATION_EVENTS.NEW_FOLLOWER,
        referenceTableId: followRequestingUserId,
      },
    );
  if (createUserNotificationResponse.type === EitherType.failure) {
    return createUserNotificationResponse;
  }

  const { success: userNotification } = createUserNotificationResponse;

  //////////////////////////////////////////////////
  // ASSEMBLE RENDERABLE NOTICIATION
  //////////////////////////////////////////////////

  const assembleRenderableNewUserFollowRequestNotificationResponse =
    await assembleRenderableNewUserFollowRequestNotification({
      controller,
      userNotification,
      blobStorageService,
      databaseService,
      clientUserId: recipientUserId,
    });
  if (
    assembleRenderableNewUserFollowRequestNotificationResponse.type === EitherType.failure
  ) {
    return assembleRenderableNewUserFollowRequestNotificationResponse;
  }

  const { success: renderableNewUserFollowRequestNotification } =
    assembleRenderableNewUserFollowRequestNotificationResponse;

  //////////////////////////////////////////////////
  // EMIT NOTIFICATION
  //////////////////////////////////////////////////
  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewUserFollowRequest(
    {
      userId: recipientUserId,
      renderableNewUserFollowRequestNotification,
    },
  );
  return Success({});
}
