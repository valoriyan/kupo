import { BaseUserNotification } from ".";
import { RenderablePost } from "../../post/models";
import { RenderablePostComment } from "../../postComment/models";
import { RenderableUser } from "../../user/models";

export interface BaseRenderableUserNotification extends BaseUserNotification {
    eventTimestamp: number;
    timestampSeenByUser?: number;
  }
  
  
  export interface RenderableNewCommentOnPostNotification extends BaseRenderableUserNotification {
    userThatCommented: RenderableUser;
    post: RenderablePost;
    postComment: RenderablePostComment;
  }

  export interface RenderableNewFollowerNotification extends BaseRenderableUserNotification {
    userDoingFollowing: RenderableUser;
  }
  
  export interface RenderableNewLikeOnPostNotification extends BaseRenderableUserNotification {
    userThatLikedPost: RenderableUser;
    post: RenderablePost;
  }
  
  export type RenderableUserNotification =
    | RenderableNewFollowerNotification
    | RenderableNewCommentOnPostNotification
    | RenderableNewLikeOnPostNotification;