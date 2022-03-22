import { FormEventHandler, useState } from "react";
import { useCommentOnPost } from "#/api/mutations/posts/commentOnPost";
import { Button } from "#/components/Button";
import { CommentIcon } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Subtext } from "#/components/Typography";
import { styled } from "#/styling";

const COMMENT_CHAR_LIMIT = 300;

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
      css={{ borderBottom: "solid $borderWidths$1 $border" }}
    >
      <Stack css={{ flex: 1 }}>
        <TextArea
          rows={3}
          placeholder="Add comment"
          value={text}
          onChange={(e) => setText(e.currentTarget.value.slice(0, COMMENT_CHAR_LIMIT))}
        />
        <Subtext css={{ color: "$secondaryText", p: "$2", alignSelf: "flex-end" }}>
          {text.length}/{COMMENT_CHAR_LIMIT} character limit
        </Subtext>
      </Stack>
      <SubmitButton type="submit">
        <TextOrSpinner isLoading={isLoading}>
          <CommentIcon />
        </TextOrSpinner>
      </SubmitButton>
    </Flex>
  );
};

const TextArea = styled("textarea", {
  resize: "vertical",
  fontSize: "$2",
  p: "$3",
  border: "none",
  backgroundColor: "$background1",
  color: "$text",
});

const SubmitButton = styled(Button, {
  borderRadius: "0 !important",
  px: "$5",
});
