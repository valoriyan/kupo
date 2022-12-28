import express from "express";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../utilities/monads/unwrapListOfResponses";
import { checkAuthentication } from "../auth/utilities";
import { NotificationController } from "./notificationController";
import { Promise as BluebirdPromise } from "bluebird";
import { assembleRenderableNewCommentOnPostNotification } from "./renderableNotificationAssemblers/assembleRenderableNewCommentOnPublishedItemNotification";
import { DBUserNotification } from "../../services/databaseService/tableServices/userNotificationsTableService";
import { assembleRenderableNewFollowerNotification } from "./renderableNotificationAssemblers/assembleRenderableNewFollowerNotification";
import { assembleRenderableNewLikeOnPublishedItemNotification } from "./renderableNotificationAssemblers/assembleRenderableNewLikeOnPublishedItemNotification";
import { RenderableUserNotification } from "./models/renderableUserNotifications";
import { decodeTimestampCursor } from "../utilities/pagination";
import { assembleRenderableNewTagInPublishedItemCommentNotification } from "./renderableNotificationAssemblers/assembleRenderableNewTagInPublishedItemCommentNotification";
import { GenericResponseFailedReason } from "../models";
import { assembleRenderableNewUserFollowRequestNotification } from "./renderableNotificationAssemblers/assembleRenderableNewUserFollowRequestNotification";
import { assembleRenderableAcceptedUserFollowRequestNotification } from "./renderableNotificationAssemblers/assembleRenderableAcceptedUserFollowRequestNotification";
import { assembleRenderableAcceptedPublishingChannelSubmissionNotification } from "./renderableNotificationAssemblers/assembleRenderableAcceptedPublishingChannelSubmissionNotification";
import { assembleRenderableRejectedPublishingChannelSubmissionNotification } from "./renderableNotificationAssemblers/assembleRenderableRejectedPublishingChannelSubmissionNotification";

export interface GetPageOfNotificationsRequestBody {
  cursor?: string;
  pageSize: number;
  isUserReadingNotifications?: boolean;
}

export interface GetPageOfNotificationsSuccess {
  userNotifications: RenderableUserNotification[];

  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetPageOfNotificationsFailedReason {
  UnknownCause = "Unknown Cause",
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
    ErrorReasonTypes<string | GetPageOfNotificationsFailedReason>,
    GetPageOfNotificationsSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const now = Date.now();

  const { isUserReadingNotifications, cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  //////////////////////////////////////////////////
  // Mark Notifications as Read
  //////////////////////////////////////////////////

  if (isUserReadingNotifications) {
    const markAllUserNotificationsAsSeenResponse =
      await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.markAllUserNotificationsAsSeen(
        {
          controller,
          recipientUserId: clientUserId,
          timestampSeenByUser: now,
        },
      );
    if (markAllUserNotificationsAsSeenResponse.type === EitherType.failure) {
      return markAllUserNotificationsAsSeenResponse;
    }
  }

  //////////////////////////////////////////////////
  // Read Page of Notifications from DB
  //////////////////////////////////////////////////

  const selectUserNotificationsByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectUserNotificationsByUserId(
      {
        controller,
        userId: clientUserId,
        limit: pageSize,
        getNotificationsUpdatedBeforeTimestamp: pageTimestamp,
      },
    );
  if (selectUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectUserNotificationsByUserIdResponse;
  }
  const { success: userNotifications } = selectUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // Assemble Renderable Notifications
  //////////////////////////////////////////////////

  const assembleNotifcationsResponse = await assembleNotifications({
    userNotifications,
    clientUserId,
    controller,
  });
  if (assembleNotifcationsResponse.type === EitherType.failure) {
    return assembleNotifcationsResponse;
  }
  const { success: renderableUserNotifications } = assembleNotifcationsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    userNotifications: renderableUserNotifications,
  });
}

async function assembleNotifications({
  userNotifications,
  clientUserId,
  controller,
}: {
  userNotifications: DBUserNotification[];
  clientUserId: string;
  controller: NotificationController;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderableUserNotification[]>
> {
  //////////////////////////////////////////////////
  // Call Appropriate Assembler for Each Notification by Type
  //////////////////////////////////////////////////

  const assembleRenderableNotificationResponses = await BluebirdPromise.map(
    userNotifications,
    async (
      userNotification,
    ): Promise<
      InternalServiceResponse<ErrorReasonTypes<string>, RenderableUserNotification | null>
    > => {
      try {
        if (
          userNotification.notification_type ===
          NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM
        ) {
          return await assembleRenderableNewCommentOnPostNotification({
            controller,
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else if (
          userNotification.notification_type === NOTIFICATION_EVENTS.NEW_FOLLOWER
        ) {
          return await assembleRenderableNewFollowerNotification({
            controller,
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else if (
          userNotification.notification_type ===
          NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM
        ) {
          return await assembleRenderableNewLikeOnPublishedItemNotification({
            controller,
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else if (
          userNotification.notification_type ===
          NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT
        ) {
          return await assembleRenderableNewTagInPublishedItemCommentNotification({
            controller,
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else if (
          userNotification.notification_type ===
          NOTIFICATION_EVENTS.NEW_USER_FOLLOW_REQUEST
        ) {
          return await assembleRenderableNewUserFollowRequestNotification({
            controller,
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else if (
          userNotification.notification_type ===
          NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST
        ) {
          return await assembleRenderableAcceptedUserFollowRequestNotification({
            controller,
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else if (
          userNotification.notification_type ===
          NOTIFICATION_EVENTS.ACCEPTED_PUBLISHING_CHANNEL_SUBMISSION
        ) {
          return await assembleRenderableAcceptedPublishingChannelSubmissionNotification({
            controller,
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else if (
          userNotification.notification_type ===
          NOTIFICATION_EVENTS.REJECTED_PUBLISHING_CHANNEL_SUBMISSION
        ) {
          return await assembleRenderableRejectedPublishingChannelSubmissionNotification({
            controller,
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else {
          return Failure({
            controller,
            httpStatusCode: 500,
            reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
            error: "Unknown event type at assembleNotifcations",
            additionalErrorInformation: `Unknown event type '${userNotification.notification_type}' at assembleNotifcations`,
          });
        }
      } catch (error) {
        return Failure({
          controller,
          httpStatusCode: 500,
          reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
          error: "Unhandled error at assembleNotifications",
          additionalErrorInformation: "Unhandled error at assembleNotifications",
        });
      }
    },
  );

  const renderableUserNotificationsResponse = unwrapListOfEitherResponses({
    eitherResponses: assembleRenderableNotificationResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
  if (renderableUserNotificationsResponse.type === EitherType.failure) {
    return renderableUserNotificationsResponse;
  }
  const { success: renderableUserNotifications } = renderableUserNotificationsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success(
    renderableUserNotifications.filter(
      (renderableUserNotification) => !!renderableUserNotification,
    ) as RenderableUserNotification[],
  );
}
