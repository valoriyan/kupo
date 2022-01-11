import { FormEventHandler, useState } from "react";
import { useCommentOnPost } from "#/api/mutations/posts/commentOnPost";
import { Button } from "#/components/Button";
import { CommentIcon } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { styled } from "#/styling";

export interface CommentInputProps {
  postId: string;
}

export const CommentInput = ({ postId }: CommentInputProps) => {
  const { mutateAsync: commentOnPost, isLoading } = useCommentOnPost();
  const [text, setText] = useState("");

  const onSubmitComment: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await commentOnPost({ postId, text });
      setText("");
    } catch {
      return;
    }
  };

  return (
    <Flex
      as="form"
      onSubmit={onSubmitComment}
      css={{ borderY: "solid $borderWidths$1 $border" }}
    >
      <TextArea
        rows={3}
        placeholder="Add comment"
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <SubmitButton type="submit">
        <TextOrSpinner isLoading={isLoading}>
          <CommentIcon />
        </TextOrSpinner>
      </SubmitButton>
    </Flex>
  );
};

const TextArea = styled("textarea", {
  fontSize: "$2",
  p: "$3",
  border: "none",
  backgroundColor: "$background1",
  color: "$text",
  flex: 1,
});

const SubmitButton = styled(Button, {
  borderRadius: "0 !important",
  p: "$4",
});
