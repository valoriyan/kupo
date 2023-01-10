import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../utilities/monads/unwrapListOfResponses";
import { NotificationController } from "./../notificationController";
import { Promise as BluebirdPromise } from "bluebird";
import { assembleRenderableNewCommentOnPostNotification } from "./../renderableNotificationAssemblers/assembleRenderableNewCommentOnPublishedItemNotification";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { assembleRenderableNewFollowerNotification } from "./../renderableNotificationAssemblers/assembleRenderableNewFollowerNotification";
import { assembleRenderableNewLikeOnPublishedItemNotification } from "./../renderableNotificationAssemblers/assembleRenderableNewLikeOnPublishedItemNotification";
import { RenderableUserNotification } from "./../models/renderableUserNotifications";
import { assembleRenderableNewTagInPublishedItemCommentNotification } from "./../renderableNotificationAssemblers/assembleRenderableNewTagInPublishedItemCommentNotification";
import { GenericResponseFailedReason } from "../../models";
import { assembleRenderableNewUserFollowRequestNotification } from "./../renderableNotificationAssemblers/assembleRenderableNewUserFollowRequestNotification";
import { assembleRenderableAcceptedUserFollowRequestNotification } from "./../renderableNotificationAssemblers/assembleRenderableAcceptedUserFollowRequestNotification";
import { assembleRenderableAcceptedPublishingChannelSubmissionNotification } from "./../renderableNotificationAssemblers/assembleRenderableAcceptedPublishingChannelSubmissionNotification";
import { assembleRenderableRejectedPublishingChannelSubmissionNotification } from "./../renderableNotificationAssemblers/assembleRenderableRejectedPublishingChannelSubmissionNotification";
import { assembleRenderableNewShareOfPublishedItemNotification } from "../renderableNotificationAssemblers/assembleRenderableNewShareOfPublishedItemNotification";
import { assembleRenderableNewTagInPublishedItemCaptionNotification } from "../renderableNotificationAssemblers/assembleRenderableNewTagInPublishedItemCaptionNotification";
import { assembleRenderableShopItemSoldNotification } from "../renderableNotificationAssemblers/assembleRenderableShopItemSoldNotification";

export async function assembleNotifications({
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
        if (false) {
        }
        //////////////////////////////////////////////////
        // Followers
        //////////////////////////////////////////////////
        else if (
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
          NOTIFICATION_EVENTS.NEW_USER_FOLLOW_REQUEST
        ) {
          return await assembleRenderableNewUserFollowRequestNotification({
            controller,
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        }
        //////////////////////////////////////////////////
        // Published Items
        //////////////////////////////////////////////////
        else if (
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
          NOTIFICATION_EVENTS.NEW_SHARE_OF_PUBLISHED_ITEM
        ) {
          return await assembleRenderableNewShareOfPublishedItemNotification({
            controller,
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else if (
          userNotification.notification_type ===
          NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_CAPTION
        ) {
          return await assembleRenderableNewTagInPublishedItemCaptionNotification({
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
        }
        //////////////////////////////////////////////////
        // Publishing Channels
        //////////////////////////////////////////////////
        else if (
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
        }
        //////////////////////////////////////////////////
        // Transactions
        //////////////////////////////////////////////////
        else if (
          userNotification.notification_type === NOTIFICATION_EVENTS.SHOP_ITEM_SOLD
        ) {
          return await assembleRenderableShopItemSoldNotification({
            controller,
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        }
        //////////////////////////////////////////////////
        // Missing Types
        //////////////////////////////////////////////////
        else {
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
