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
import { assembleRenderableNewFollowerNotification } from "../../../notification/renderableNotificationAssemblers/assembleRenderableNewFollowerNotification";

export async function generateAndEmitNewFollowerNotification({
  controller,
  databaseService,
  blobStorageService,
  webSocketService,
  recipientUserId,
  userFollowEventId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageServiceInterface;
  webSocketService: WebSocketService;
  recipientUserId: string;
  userFollowEventId: string;
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
        externalReference: {
          type: NOTIFICATION_EVENTS.NEW_FOLLOWER,
          userFollowEventId,
        },
      },
    );
  if (createUserNotificationResponse.type === EitherType.failure) {
    return createUserNotificationResponse;
  }

  const { success: userNotification } = createUserNotificationResponse;

  //////////////////////////////////////////////////
  // ASSEMBLE RENDERABLE NOTICIATION
  //////////////////////////////////////////////////

  const assembleRenderableNewFollowerNotificationResponse =
    await assembleRenderableNewFollowerNotification({
      controller,
      userNotification,
      blobStorageService,
      databaseService,
      clientUserId: recipientUserId,
    });
  if (assembleRenderableNewFollowerNotificationResponse.type === EitherType.failure) {
    return assembleRenderableNewFollowerNotificationResponse;
  }

  const { success: renderableNewFollowerNotification } =
    assembleRenderableNewFollowerNotificationResponse;

  //////////////////////////////////////////////////
  // EMIT NOTIFICATION
  //////////////////////////////////////////////////
  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewFollower({
    userId: recipientUserId,
    renderableNewFollowerNotification,
  });
  return Success({});
}
