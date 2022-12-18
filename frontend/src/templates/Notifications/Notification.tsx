import {
  NOTIFICATIONEVENTS,
  RenderableAcceptedPublishingChannelSubmissionNotification,
  RenderableAcceptedUserFollowRequestNotification,
  RenderableNewCommentOnPublishedItemNotification,
  RenderableNewFollowerNotification,
  RenderableNewLikeOnPublishedItemNotification,
  RenderableNewTagInPublishedItemCaptionNotification,
  RenderableNewTagInPublishedItemCommentNotification,
  RenderableNewUserFollowRequestNotification,
  RenderableRejectedPublishingChannelSubmissionNotification,
  RenderableShopItemSoldNotification,
  RenderableUserNotification,
} from "#/api";
import { AcceptedFollowRequest } from "./Notifications/AcceptedFollowRequest";
import { AcceptedPublishingChannelSubmission } from "./Notifications/AcceptedPublishingChannelSubmission";
import { NewCommentOnPublishedItem } from "./Notifications/NewCommentOnPublishedItem";
import { NewFollower } from "./Notifications/NewFollower";
import { NewFollowerRequest } from "./Notifications/NewFollowerRequest";
import { NewLikeOnPublishedItem } from "./Notifications/NewLikeOnPublishedItem";
import { NewTagInPublishedItemCaption } from "./Notifications/NewTagInPublishedItemCaption";
import { NewTagInPublishedItemComment } from "./Notifications/NewTagInPublishedItemComment";
import { RejectedPublishingChannelSubmission } from "./Notifications/RejectedPublishingChannelSubmission";
import { ShopItemSold } from "./Notifications/ShopItemSold";

export interface NotificationProps {
  notification: RenderableUserNotification;
}

export const Notification = ({ notification }: NotificationProps) => {
  const type = notification.type as unknown as NOTIFICATIONEVENTS;

  if (type === NOTIFICATIONEVENTS.NewFollower) {
    return (
      <NewFollower
        notification={notification as unknown as RenderableNewFollowerNotification}
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.NewUserFollowRequest) {
    return (
      <NewFollowerRequest
        notification={
          notification as unknown as RenderableNewUserFollowRequestNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.AcceptedUserFollowRequest) {
    return (
      <AcceptedFollowRequest
        notification={
          notification as unknown as RenderableAcceptedUserFollowRequestNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.NewCommentOnPublishedItem) {
    return (
      <NewCommentOnPublishedItem
        notification={
          notification as unknown as RenderableNewCommentOnPublishedItemNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.NewLikeOnPublishedItem) {
    return (
      <NewLikeOnPublishedItem
        notification={
          notification as unknown as RenderableNewLikeOnPublishedItemNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.NewTagInPublishedItemComment) {
    return (
      <NewTagInPublishedItemComment
        notification={
          notification as unknown as RenderableNewTagInPublishedItemCommentNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.NewTagInPublishedItemCaption) {
    return (
      <NewTagInPublishedItemCaption
        notification={
          notification as unknown as RenderableNewTagInPublishedItemCaptionNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.AcceptedPublishingChannelSubmission) {
    return (
      <AcceptedPublishingChannelSubmission
        notification={
          notification as unknown as RenderableAcceptedPublishingChannelSubmissionNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.RejectedPublishingChannelSubmission) {
    return (
      <RejectedPublishingChannelSubmission
        notification={
          notification as unknown as RenderableRejectedPublishingChannelSubmissionNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.ShopItemSold) {
    return (
      <ShopItemSold
        notification={notification as unknown as RenderableShopItemSoldNotification}
      />
    );
  }

  return null;
};
