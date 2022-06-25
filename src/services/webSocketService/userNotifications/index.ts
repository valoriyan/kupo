import { Server } from "socket.io";
import {
  UnrenderableCanceledCommentOnPostNotification,
  UnrenderableCanceledNewFollowerNotification,
  UnrenderableCanceledNewLikeOnPostNotification,
  UnrenderableCanceledNewTagInPublishedItemCommentNotification,
} from "../../../controllers/notification/models/unrenderableCanceledUserNotifications";
import {
  RenderableNewCommentOnPostNotification,
  RenderableNewFollowerNotification,
  RenderableNewLikeOnPostNotification,
  RenderableNewTagInPublishedItemCommentNotification,
} from "../../../controllers/notification/models/renderableUserNotifications";
import { notifyUserIdOfCanceledNewLikeOnPost } from "./canceledNotifications/notifyUserIdOfCanceledNewLikeOnPost";
import { notifyUserIdOfNewCommentOnPost } from "./notifications/notifyUserIdOfNewCommentOnPost";
import { notifyUserIdOfNewFollower } from "./notifications/notifyUserIdOfNewFollower";
import { notifyUserIdOfNewLikeOnPost } from "./notifications/notifyUserIdOfNewLikeOnPost";
import { notifyUserIdOfCanceledNewCommentOnPost } from "./canceledNotifications/notifyUserIdOfCanceledNewCommentOnPost";
import { notifyUserIdOfCanceledNewFollower } from "./canceledNotifications/notifyUserIdOfCanceledNewFollower";
import { notifyUserIdOfNewTagInPublishedItemComment } from "./notifications/notifyUserIdOfNewTagInPublishedItemComment";
import { notifyUserIdOfCanceledNewTagInPublishedItemComment } from "./canceledNotifications/notifyUserIdOfCanceledNewTagInPublishedItemComment";

export class UserNotificationsWebsocketService {
  constructor(public websocketIO: Server) {}

  public async notifyUserIdOfNewCommentOnPost({
    renderableNewCommentOnPostNotification,
    userId,
  }: {
    renderableNewCommentOnPostNotification: RenderableNewCommentOnPostNotification;
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
    unrenderableCanceledCommentOnPostNotification: UnrenderableCanceledCommentOnPostNotification;
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

  public async notifyUserIdOfNewLikeOnPost({
    renderableNewLikeOnPostNotification,
    userId,
  }: {
    renderableNewLikeOnPostNotification: RenderableNewLikeOnPostNotification;
    userId: string;
  }) {
    await notifyUserIdOfNewLikeOnPost({
      userId,
      io: this.websocketIO,
      renderableNewLikeOnPostNotification,
    });
  }

  public async notifyUserIdOfCanceledNewLikeOnPost({
    unrenderableCanceledNewLikeOnPostNotification,
    userId,
  }: {
    unrenderableCanceledNewLikeOnPostNotification: UnrenderableCanceledNewLikeOnPostNotification;
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
}
