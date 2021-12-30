import { RenderablePostComment } from "#/api";
import { styled } from "#/styling";

export interface CommentsProps {
  postComments?: RenderablePostComment[];
}

export const Comments = ({ postComments }: CommentsProps) => {
  return (
    <div>
      <CommentInput type="textarea" placeholder="Add comment" />
      <CommentContainer postComments={postComments} />
    </div>
  );
};

const CommentInput = styled("input", {
  width: "100%",
  height: "$10",
});

const CommentContainer = ({ postComments }: CommentsProps) => {
  return (
    <div>
      {postComments?.map((postComment) => (
        <div key={postComment.postCommentId}>
          {postComment.user.username}: {postComment.text}
        </div>
      ))}
    </div>
  );
};
