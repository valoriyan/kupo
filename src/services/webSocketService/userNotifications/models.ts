import { RenderablePostComment } from "../../../controllers/postComment/models";
import { RenderablePost } from "../../../controllers/post/models";
import { RenderableUser } from "../../../controllers/user/models";

// TO DO: REMOVE/MOVE TO CONTROLLER
export interface NewMentionInPostNotification {
  userThatMentionedClient: RenderableUser;
  post: RenderablePost;
}

// TO DO: REMOVE/MOVE TO CONTROLLER
export interface NewMentionInPostCommentNotification {
  userThatMentionedClient: RenderableUser;
  post: RenderablePost;
  commentWithinPost: RenderablePostComment;
}
