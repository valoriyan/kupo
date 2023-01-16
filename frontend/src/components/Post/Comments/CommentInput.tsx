import { FormEventHandler, useState } from "react";
import { useCommentOnPublishedItem } from "#/api/mutations/posts/commentOnPublishedItem";
import { Button } from "#/components/Button";
import { CommentIcon } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Subtext } from "#/components/Typography";
import { styled } from "#/styling";
import { useWarnUnsavedChanges } from "#/utils/useWarnUnsavedChanges";

const COMMENT_CHAR_LIMIT = 300;

export interface CommentInputProps {
  postId: string;
}

export const CommentInput = ({ postId }: CommentInputProps) => {
  const { mutateAsync: commentOnPost, isLoading } = useCommentOnPublishedItem();
  const [text, setText] = useState("");

  useWarnUnsavedChanges(!!text);

  const onSubmitComment: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await commentOnPost({ publishedItemId: postId, text });
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
          placeholder="leave a comment..."
          value={text}
          onChange={(e) => setText(e.currentTarget.value.slice(0, COMMENT_CHAR_LIMIT))}
        />
        <Subtext
          css={{
            bg: "$background1",
            width: "100%",
            color: "$secondaryText",
            p: "$2",
            textAlign: "right",
          }}
        >
          {text.length} / {COMMENT_CHAR_LIMIT}
        </Subtext>
      </Stack>
      <SubmitButton type="submit" disabled={!text} data-cy="submit-comment-button">
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
