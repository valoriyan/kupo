import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableAcceptedPublishingChannelSubmissionNotification } from "../models/renderableUserNotifications";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { constructPublishedItemFromPartsById } from "../../../controllers/publishedItem/utilities/constructPublishedItemsFromParts";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { assembleRenderablePublishingChannelById } from "../../../controllers/publishingChannel/utilities/assembleRenderablePublishingChannel";
import { BlobStorageService } from "../../../services/blobStorageService";

export async function assembleRenderableAcceptedPublishingChannelSubmissionNotification({
  controller,
  userNotification,
  blobStorageService,
  databaseService,
  clientUserId,
}: {
  controller: Controller;
  userNotification: DBUserNotification;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  clientUserId: string;
}): Promise<
  InternalServiceResponse<
    ErrorReasonTypes<string>,
    RenderableAcceptedPublishingChannelSubmissionNotification
  >
> {
  const {
    publishing_channel_submission_reference,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  //////////////////////////////////////////////////
  // GET THE PUBLISHING CHANNEL SUBMISSION
  //////////////////////////////////////////////////

  const getPublishingChannelSubmissionByIdResponse =
    await databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.getPublishingChannelSubmissionById(
      {
        controller,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        publishingChannelSubmissionId: publishing_channel_submission_reference!,
      },
    );
  if (getPublishingChannelSubmissionByIdResponse.type === EitherType.failure) {
    return getPublishingChannelSubmissionByIdResponse;
  }
  const { success: maybePublishingChannelSubmission } =
    getPublishingChannelSubmissionByIdResponse;

  if (!maybePublishingChannelSubmission) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error:
        "Publishing Channel Submission not found at assembleRenderableAcceptedPublishingChannelSubmissionNotification",
      additionalErrorInformation:
        "Error at assembleRenderableAcceptedPublishingChannelSubmissionNotification",
    });
  }

  const {
    published_item_id: publishedItemId,
    publishing_channel_id: publishingChannelId,
    timestamp_of_resolution_decision: timestampOfResolutionDecision,
  } = maybePublishingChannelSubmission;

  //////////////////////////////////////////////////
  // GET THE COUNT OF UNREAD NOTIFICATIONS
  //////////////////////////////////////////////////

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: clientUserId },
    );

  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // Get Published Item
  //////////////////////////////////////////////////
  const constructPublishedItemFromPartsByIdResponse =
    await constructPublishedItemFromPartsById({
      controller,
      blobStorageService,
      databaseService,
      publishedItemId: publishedItemId,
      requestorUserId: clientUserId,
    });
  if (constructPublishedItemFromPartsByIdResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsByIdResponse;
  }
  const { success: publishedItem } = constructPublishedItemFromPartsByIdResponse;

  //////////////////////////////////////////////////
  // Get Publishing Channel
  //////////////////////////////////////////////////
  const assembleRenderablePublishingChannelByIdResponse =
    await assembleRenderablePublishingChannelById({
      controller,
      blobStorageService,
      databaseService,
      publishingChannelId,
      requestorUserId: clientUserId,
    });
  if (assembleRenderablePublishingChannelByIdResponse.type === EitherType.failure) {
    return assembleRenderablePublishingChannelByIdResponse;
  }
  const { success: publishingChannel } = assembleRenderablePublishingChannelByIdResponse;

  //////////////////////////////////////////////////
  // RETURN
  //////////////////////////////////////////////////

  return Success({
    eventTimestamp: parseInt(timestampOfResolutionDecision),
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.ACCEPTED_PUBLISHING_CHANNEL_SUBMISSION,
    countOfUnreadNotifications,

    publishedItem,
    publishingChannel,
  });
}
