import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import { RenderablePostComment } from "#/api";
import { useDeleteCommentFromPost } from "#/api/mutations/posts/deleteCommentFromPost";
import { Avatar } from "#/components/Avatar";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfoIcon, TrashIcon } from "#/components/Icons";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { Box, Flex, Grid, Stack } from "#/components/Layout";
import { Body, truncateByLines } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { useCurrentUserId } from "#/contexts/auth";
import { styled } from "#/styling";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { ActionMenu } from "../ActionMenu";

export interface CommentListProps {
  comments: RenderablePostComment[];
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export const CommentList = (props: CommentListProps) => {
  if (!props.comments.length) {
    return <ErrorMessage>No comments yet</ErrorMessage>;
  }

  return (
    <Stack css={{ height: "100%", width: "100%" }}>
      <InfiniteScrollArea
        hasNextPage={props.hasNextPage ?? false}
        isNextPageLoading={props.isFetchingNextPage}
        loadNextPage={props.fetchNextPage}
        items={props.comments.map((comment) => (
          <Comment key={comment.postCommentId} comment={comment} />
        ))}
      />
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
      <Avatar
        size="$7"
        src={userAvatarUrl}
        alt={`@${username}'s profile picture`}
        onClick={() => Router.push(getProfilePageUrl({ username }))}
      />
      <Stack css={{ gap: "$3" }}>
        <Flex css={{ justifyContent: "space-between", alignItems: "center" }}>
          <Flex css={{ gap: "$3", alignItems: "baseline" }}>
            <UserName username={username} />
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
  bg: "$background2",
  whiteSpace: "pre-wrap",
  borderBottom: "solid $borderWidths$1 $border",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  columnGap: "$4",
  px: "$4",
  py: "$5",
});

const CommentText = styled(Body, truncateByLines(2));
