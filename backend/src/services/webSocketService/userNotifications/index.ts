import { Server } from "socket.io";
import {
  UnrenderableCanceledAcceptedUserFollowRequestNotification,
  UnrenderableCanceledCommentOnPublishedItemNotification,
  UnrenderableCanceledNewFollowerNotification,
  UnrenderableCanceledNewLikeOnPublishedItemNotification,
  UnrenderableCanceledNewTagInPublishedItemCaptionNotification,
  UnrenderableCanceledNewTagInPublishedItemCommentNotification,
  UnrenderableCanceledNewUserFollowRequestNotification,
} from "../../../controllers/notification/models/unrenderableCanceledUserNotifications";
import {
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
} from "../../../controllers/notification/models/renderableUserNotifications";
import { notifyUserIdOfCanceledNewLikeOnPost } from "./canceledNotifications/notifyUserIdOfCanceledNewLikeOnPost";
import { notifyUserIdOfNewCommentOnPost } from "./notifications/notifyUserIdOfNewCommentOnPost";
import { notifyUserIdOfNewFollower } from "./notifications/notifyUserIdOfNewFollower";
import { notifyUserIdOfNewLikeOnPublishedItem } from "./notifications/notifyUserIdOfNewLikeOnPublishedItem";
import { notifyUserIdOfCanceledNewCommentOnPost } from "./canceledNotifications/notifyUserIdOfCanceledNewCommentOnPost";
import { notifyUserIdOfCanceledNewFollower } from "./canceledNotifications/notifyUserIdOfCanceledNewFollower";
import { notifyUserIdOfNewTagInPublishedItemComment } from "./notifications/notifyUserIdOfNewTagInPublishedItemComment";
import { notifyUserIdOfCanceledNewTagInPublishedItemComment } from "./canceledNotifications/notifyUserIdOfCanceledNewTagInPublishedItemComment";
import { notifyUserIdOfAcceptedUserFollowRequest } from "./notifications/notifyUserIdOfAcceptedUserFollowRequest";
import { notifyUserIdOfCanceledAcceptedUserFollowRequest } from "./canceledNotifications/notifyUserIdOfCanceledAcceptedUserFollowRequest";
import { notifyUserIdOfNewUserFollowRequest } from "./notifications/notifyUserIdOfNewUserFollowRequest";
import { notifyUserIdOfCanceledNewUserFollowRequest } from "./canceledNotifications/notifyUserIdOfCanceledNewUserFollowRequest";
import { notifyUserIdOfCanceledNewTagInPublishedItemCaption } from "./canceledNotifications/notifyUserIdOfCanceledNewTagInPublishedItemCaption";
import { notifyUserIdOfNewTagInPublishedItemCaption } from "./notifications/notifyUserIdOfNewTagInPublishedItemCaption";
import { notifyUserIdOfShopItemSold } from "./notifications/notifyUserIdOfShopItemSold";
import { notifyUserIdOfAcceptedPublishingChannelSubmission } from "./notifications/notifyUserIdOfAcceptedPublishingChannelSubmission";
import { notifyUserIdOfRejectedPublishingChannelSubmission } from "./notifications/notifyUserIdOfRejectedPublishingChannelSubmission";

export class UserNotificationsWebsocketService {
  constructor(public websocketIO: Server) {}

  public async notifyUserIdOfNewCommentOnPost({
    renderableNewCommentOnPostNotification,
    userId,
  }: {
    renderableNewCommentOnPostNotification: RenderableNewCommentOnPublishedItemNotification;
    userId: string;
  }) {
    await notifyUserIdOfNewCommentOnPost({
      userId,
      io: this.websocketIO,
      renderableNewCommentOnPostNotification,
    });
  }

  public async notifyUserIdOfCanceledNewCommentOnPost({
    unrenderableCanceledCommentOnPostNotification,
    userId,
  }: {
    unrenderableCanceledCommentOnPostNotification: UnrenderableCanceledCommentOnPublishedItemNotification;
    userId: string;
  }) {
    await notifyUserIdOfCanceledNewCommentOnPost({
      userId,
      io: this.websocketIO,
      unrenderableCanceledCommentOnPostNotification,
    });
  }

  public async notifyUserIdOfNewFollower({
    renderableNewFollowerNotification,
    userId,
  }: {
    renderableNewFollowerNotification: RenderableNewFollowerNotification;
    userId: string;
  }) {
    await notifyUserIdOfNewFollower({
      userId,
      io: this.websocketIO,
      renderableNewFollowerNotification,
    });
  }

  public async notifyUserIdOfCanceledNewFollower({
    unrenderableCanceledNewFollowerNotification,
    userId,
  }: {
    unrenderableCanceledNewFollowerNotification: UnrenderableCanceledNewFollowerNotification;
    userId: string;
  }) {
    await notifyUserIdOfCanceledNewFollower({
      userId,
      io: this.websocketIO,
      unrenderableCanceledNewFollowerNotification,
    });
  }

  public async notifyUserIdOfNewLikeOnPublishedItem({
    renderableNewLikeOnPublishedItemNotification,
    userId,
  }: {
    renderableNewLikeOnPublishedItemNotification: RenderableNewLikeOnPublishedItemNotification;
    userId: string;
  }) {
    await notifyUserIdOfNewLikeOnPublishedItem({
      userId,
      io: this.websocketIO,
      renderableNewLikeOnPostNotification: renderableNewLikeOnPublishedItemNotification,
    });
  }

  public async notifyUserIdOfCanceledNewLikeOnPost({
    unrenderableCanceledNewLikeOnPostNotification,
    userId,
  }: {
    unrenderableCanceledNewLikeOnPostNotification: UnrenderableCanceledNewLikeOnPublishedItemNotification;
    userId: string;
  }) {
    await notifyUserIdOfCanceledNewLikeOnPost({
      userId,
      io: this.websocketIO,
      unrenderableCanceledNewLikeOnPostNotification,
    });
  }

  public async notifyUserIdOfNewTagInPublishedItemComment({
    renderableNewTagInPublishedItemCommentNotification,
    userId,
  }: {
    renderableNewTagInPublishedItemCommentNotification: RenderableNewTagInPublishedItemCommentNotification;
    userId: string;
  }) {
    await notifyUserIdOfNewTagInPublishedItemComment({
      userId,
      io: this.websocketIO,
      renderableNewTagInPublishedItemCommentNotification,
    });
  }

  public async notifyUserIdOfCanceledNewTagInPublishedItemComment({
    unrenderableCanceledNewTagInPublishedItemCommentNotification,
    userId,
  }: {
    unrenderableCanceledNewTagInPublishedItemCommentNotification: UnrenderableCanceledNewTagInPublishedItemCommentNotification;
    userId: string;
  }) {
    await notifyUserIdOfCanceledNewTagInPublishedItemComment({
      userId,
      io: this.websocketIO,
      unrenderableCanceledNewTagInPublishedItemCommentNotification,
    });
  }

  public async notifyUserIdOfNewTagInPublishedItemCaption({
    renderableNewTagInPublishedItemCaptionNotification,
    userId,
  }: {
    renderableNewTagInPublishedItemCaptionNotification: RenderableNewTagInPublishedItemCaptionNotification;
    userId: string;
  }) {
    await notifyUserIdOfNewTagInPublishedItemCaption({
      userId,
      io: this.websocketIO,
      renderableNewTagInPublishedItemCaptionNotification,
    });
  }

  public async notifyUserIdOfCanceledNewTagInPublishedItemCaption({
    unrenderableCanceledNewTagInPublishedItemCaptionNotification,
    userId,
  }: {
    unrenderableCanceledNewTagInPublishedItemCaptionNotification: UnrenderableCanceledNewTagInPublishedItemCaptionNotification;
    userId: string;
  }) {
    await notifyUserIdOfCanceledNewTagInPublishedItemCaption({
      userId,
      io: this.websocketIO,
      unrenderableCanceledNewTagInPublishedItemCaptionNotification,
    });
  }

  public async notifyUserIdOfAcceptedUserFollowRequest({
    renderableAcceptedUserFollowRequestNotification,
    userId,
  }: {
    renderableAcceptedUserFollowRequestNotification: RenderableAcceptedUserFollowRequestNotification;
    userId: string;
  }) {
    await notifyUserIdOfAcceptedUserFollowRequest({
      userId,
      io: this.websocketIO,
      renderableAcceptedUserFollowRequestNotification,
    });
  }

  public async notifyUserIdOfCanceledAcceptedUserFollowRequest({
    unrenderableCanceledAcceptedUserFollowRequestNotification,
    userId,
  }: {
    unrenderableCanceledAcceptedUserFollowRequestNotification: UnrenderableCanceledAcceptedUserFollowRequestNotification;
    userId: string;
  }) {
    await notifyUserIdOfCanceledAcceptedUserFollowRequest({
      userId,
      io: this.websocketIO,
      unrenderableCanceledAcceptedUserFollowRequestNotification,
    });
  }

  public async notifyUserIdOfNewUserFollowRequest({
    renderableNewUserFollowRequestNotification,
    userId,
  }: {
    renderableNewUserFollowRequestNotification: RenderableNewUserFollowRequestNotification;
    userId: string;
  }) {
    await notifyUserIdOfNewUserFollowRequest({
      userId,
      io: this.websocketIO,
      renderableNewUserFollowRequestNotification,
    });
  }

  public async notifyUserIdOfCanceledNewUserFollowRequest({
    unrenderableCanceledNewUserFollowRequestNotification,
    userId,
  }: {
    unrenderableCanceledNewUserFollowRequestNotification: UnrenderableCanceledNewUserFollowRequestNotification;
    userId: string;
  }) {
    await notifyUserIdOfCanceledNewUserFollowRequest({
      userId,
      io: this.websocketIO,
      unrenderableCanceledNewUserFollowRequestNotification,
    });
  }

  public async notifyUserIdOfShopItemSold({
    renderableShopItemSoldNotification,
    userId,
  }: {
    renderableShopItemSoldNotification: RenderableShopItemSoldNotification;
    userId: string;
  }) {
    await notifyUserIdOfShopItemSold({
      userId,
      io: this.websocketIO,
      renderableShopItemSoldNotification,
    });
  }

  public async notifyUserIdOfAcceptedPublishingChannelSubmission({
    renderableAcceptedPublishingChannelSubmissionNotification,
    userId,
  }: {
    renderableAcceptedPublishingChannelSubmissionNotification: RenderableAcceptedPublishingChannelSubmissionNotification;
    userId: string;
  }) {
    await notifyUserIdOfAcceptedPublishingChannelSubmission({
      userId,
      io: this.websocketIO,
      renderableAcceptedPublishingChannelSubmissionNotification,
    });
  }

  public async notifyUserIdOfRejectedPublishingChannelSubmission({
    renderableRejectedPublishingChannelSubmissionNotification,
    userId,
  }: {
    renderableRejectedPublishingChannelSubmissionNotification: RenderableRejectedPublishingChannelSubmissionNotification;
    userId: string;
  }) {
    await notifyUserIdOfRejectedPublishingChannelSubmission({
      userId,
      io: this.websocketIO,
      renderableRejectedPublishingChannelSubmissionNotification,
    });
  }
}
