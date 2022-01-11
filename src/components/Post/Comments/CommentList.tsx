import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RenderablePostComment } from "#/api";
import { useDeleteCommentFromPost } from "#/api/mutations/posts/deleteCommentFromPost";
import { Avatar } from "#/components/Avatar";
import { InfoIcon, TrashIcon } from "#/components/Icons";
import { Box, Flex, Grid, Stack } from "#/components/Layout";
import { useCurrentUserId } from "#/contexts/auth";
import { styled } from "#/styling";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { ActionMenu } from "../ActionMenu";
import { Body, truncateByLines } from "#/components/Typography";

export interface CommentListProps {
  comments: RenderablePostComment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  return (
    <Stack css={{ maxHeight: "70vh", overflow: "auto" }}>
      {comments.map((comment) => (
        <Comment key={comment.postCommentId} comment={comment} />
      ))}
    </Stack>
  );
};

interface CommentProps {
  comment: RenderablePostComment;
}

const Comment = ({ comment }: CommentProps) => {
  const userId = useCurrentUserId();
  const { mutateAsync: deleteComment } = useDeleteCommentFromPost({
    postId: comment.postId,
    postCommentId: comment.postCommentId,
  });
  const [shouldExpandComment, setShouldExpandComment] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      textRef.current &&
      Math.abs(textRef.current.scrollHeight - textRef.current.clientHeight) > 4
    ) {
      setHasOverflow(true);
    }
  }, [setHasOverflow]);

  const userAvatarUrl = comment.user.profilePictureTemporaryUrl;
  const username = comment.user.username;

  const menuActions = [];

  if (userId === comment.authorUserId) {
    menuActions.push({
      Icon: TrashIcon,
      iconColor: "$failure",
      label: "Delete Comment",
      onClick: () => {
        deleteComment();
      },
    });
  }

  menuActions.push({
    Icon: InfoIcon,
    label: "More To Come...",
    onClick: () => {},
  });

  return (
    <CommentWrapper>
      <Avatar size="$7" src={userAvatarUrl} alt={`@${username}'s profile picture`} />
      <Stack css={{ gap: "$3" }}>
        <Flex css={{ justifyContent: "space-between", alignItems: "center" }}>
          <Flex css={{ gap: "$3", alignItems: "baseline" }}>
            <Link href={getProfilePageUrl({ username })} passHref>
              <a>@{username}</a>
            </Link>
            <Flex css={{ color: "$secondaryText" }}>
              {getShortRelativeTimestamp(comment.creationTimestamp)}
            </Flex>
          </Flex>
          <ActionMenu triggerSize="$5" actions={menuActions} />
        </Flex>
        <Box>
          <CommentText
            ref={textRef}
            css={{ display: shouldExpandComment ? "block" : "-webkit-box" }}
          >
            {comment.text}
          </CommentText>
          {hasOverflow && (
            <Body
              as="button"
              css={{ color: "$primary", mt: "$2" }}
              onClick={() => setShouldExpandComment((prev) => !prev)}
            >
              {shouldExpandComment ? "less" : "more"}
            </Body>
          )}
        </Box>
      </Stack>
    </CommentWrapper>
  );
};

const CommentWrapper = styled(Grid, {
  whiteSpace: "pre-wrap",
  borderBottom: "solid $borderWidths$1 $border",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  columnGap: "$4",
  px: "$4",
  py: "$5",
});

const CommentText = styled(Body, truncateByLines(2));
