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
import { assembleRenderableAcceptedUserFollowRequestNotification } from "../../../notification/renderableNotificationAssemblers/assembleRenderableAcceptedUserFollowRequestNotification";

export async function generateAndEmitAcceptedUserFollowRequestNotification({
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
        notificationType: NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST,
        referenceTableId: userFollowEventId,
      },
    );
  if (createUserNotificationResponse.type === EitherType.failure) {
    return createUserNotificationResponse;
  }

  const { success: userNotification } = createUserNotificationResponse;

  //////////////////////////////////////////////////
  // ASSEMBLE RENDERABLE NOTICIATION
  //////////////////////////////////////////////////

  const assembleRenderableAcceptedUserFollowRequestNotificationResponse =
    await assembleRenderableAcceptedUserFollowRequestNotification({
      controller,
      userNotification,
      blobStorageService,
      databaseService,
      clientUserId: recipientUserId,
    });
  if (
    assembleRenderableAcceptedUserFollowRequestNotificationResponse.type ===
    EitherType.failure
  ) {
    return assembleRenderableAcceptedUserFollowRequestNotificationResponse;
  }

  const { success: renderableAcceptedUserFollowRequestNotification } =
    assembleRenderableAcceptedUserFollowRequestNotificationResponse;

  //////////////////////////////////////////////////
  // EMIT NOTIFICATION
  //////////////////////////////////////////////////
  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfAcceptedUserFollowRequest(
    {
      userId: recipientUserId,
      renderableAcceptedUserFollowRequestNotification,
    },
  );
  return Success({});
}
