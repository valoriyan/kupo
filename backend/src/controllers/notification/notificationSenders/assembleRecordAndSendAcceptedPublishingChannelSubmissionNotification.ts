/* eslint-disable @typescript-eslint/ban-types */
import { Controller } from "tsoa";
import { v4 as uuidv4 } from "uuid";
import { constructPublishedItemFromPartsById } from "../../publishedItem/utilities/constructPublishedItemsFromParts";
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { RenderableAcceptedPublishingChannelSubmissionNotification } from "../models/renderableUserNotifications";
import { assembleRenderablePublishingChannelById } from "../../../controllers/publishingChannel/utilities/assembleRenderablePublishingChannel";
import { BlobStorageService } from "../../../services/blobStorageService";

export async function assembleRecordAndSendAcceptedPublishingChannelSubmissionNotification({
  controller,
  publishingChannelSubmissionId,
  publishingChannelId,
  publishedItemId,
  recipientUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  publishingChannelSubmissionId: string;
  publishingChannelId: string;
  publishedItemId: string;
  recipientUserId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // GET PUBLISHING CHANNEL
  //////////////////////////////////////////////////
  const assembleRenderablePublishingChannelByIdResponse =
    await assembleRenderablePublishingChannelById({
      controller,
      blobStorageService,
      databaseService,
      publishingChannelId,
      requestorUserId: recipientUserId,
    });

  if (assembleRenderablePublishingChannelByIdResponse.type === EitherType.failure) {
    return assembleRenderablePublishingChannelByIdResponse;
  }

  const { success: publishingChannel } = assembleRenderablePublishingChannelByIdResponse;

  //////////////////////////////////////////////////
  // GET PUBLISHED ITEM
  //////////////////////////////////////////////////
  const constructPublishedItemFromPartsByIdResponse =
    await constructPublishedItemFromPartsById({
      controller,
      blobStorageService,
      databaseService,
      publishedItemId,
      requestorUserId: recipientUserId,
    });
  if (constructPublishedItemFromPartsByIdResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsByIdResponse;
  }
  const { success: publishedItem } = constructPublishedItemFromPartsByIdResponse;

  //////////////////////////////////////////////////
  // GET COUNT OF UNREAD NOTIFICATIONS
  //////////////////////////////////////////////////

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: recipientUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // WRITE NOTIFICATION INTO DATASTORE
  //////////////////////////////////////////////////

  const createUserNotificationResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
      {
        controller,
        userNotificationId: uuidv4(),
        recipientUserId,
        externalReference: {
          type: NOTIFICATION_EVENTS.ACCEPTED_PUBLISHING_CHANNEL_SUBMISSION,
          publishingChannelSubmissionId,
        },
      },
    );
  if (createUserNotificationResponse.type === EitherType.failure) {
    return createUserNotificationResponse;
  }

  //////////////////////////////////////////////////
  // COMPILE AND SEND NOTIFICATION TO CLIENT
  //////////////////////////////////////////////////

  const renderableAcceptedPublishingChannelSubmissionNotification: RenderableAcceptedPublishingChannelSubmissionNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.ACCEPTED_PUBLISHING_CHANNEL_SUBMISSION,
      eventTimestamp: Date.now(),
      publishedItem,
      publishingChannel,
    };

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfAcceptedPublishingChannelSubmission(
    {
      userId: recipientUserId,
      renderableAcceptedPublishingChannelSubmissionNotification,
    },
  );

  //////////////////////////////////////////////////
  // RETURN
  //////////////////////////////////////////////////

  return Success({});
}
