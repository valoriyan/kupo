import Link from "next/link";
import { ComponentType } from "react";
import { RenderablePost } from "#/api";
import { styled } from "#/styling";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { Avatar } from "../Avatar";
import { BookmarkIcon, CommentIcon, HeartIcon, PaperPlanIcon } from "../Icons";
import { Box, Flex } from "../Layout";
import { Body } from "../Typography";
import { ActionMenu, MenuAction } from "./ActionMenu";
import { Comments } from "./Comments";
import { ContentViewer } from "./ContentViewer";

export interface PostMenuOption {
  Icon: ComponentType;
  label: string;
  onClick: () => void;
}

export interface PostProps {
  post: RenderablePost;
  authorUserName?: string;
  authorUserAvatar?: string;
  handleClickOfLikeButton: () => void;
  handleClickOfShareButton: () => void;
  handleClickOfCommentsButton?: () => void;
  menuActions: MenuAction[];
}

export const Post = ({
  post,
  handleClickOfLikeButton,
  handleClickOfShareButton,
  handleClickOfCommentsButton,
  authorUserName,
  authorUserAvatar,
  menuActions,
}: PostProps) => {
  const {
    isLikedByClient,
    caption,
    contentElementTemporaryUrls,
    hashtags,
    likes,
    comments,
    shared,
  } = post;
  const relativeTimestamp = getRelativeTimestamp(post.creationTimestamp);

  let contentUrls;
  if (shared && shared.type === "post") {
    contentUrls = shared.post.contentElementTemporaryUrls;
  } else {
    contentUrls = contentElementTemporaryUrls;
  }

  return (
    <Box>
      <Flex
        css={{
          px: "$4",
          py: "$3",
          gap: "$3",
          alignItems: "center",
        }}
      >
        <Avatar
          alt={`@${authorUserName}'s profile picture`}
          src={authorUserAvatar}
          size="$7"
        />
        <Link href={getProfilePageUrl({ username: authorUserName || "" })} passHref>
          <a>{authorUserName ? `@${authorUserName}` : "User"}</a>
        </Link>
        <Flex css={{ marginLeft: "auto", gap: "$5", alignItems: "center" }}>
          <Timestamp>{relativeTimestamp}</Timestamp>
          <ActionMenu actions={menuActions} />
        </Flex>
      </Flex>
      <Body css={{ px: "$4", py: "$2" }}>{caption}</Body>
      {contentUrls?.length && <ContentViewer contentUrls={contentUrls} />}
      <Flex css={{ gap: "$3", px: "$4", py: "$2", width: "100%", overflow: "auto" }}>
        {hashtags.map((tag) => (
          <HashTag key={tag}>#{tag}</HashTag>
        ))}
      </Flex>
      <Flex
        css={{
          justifyContent: "space-between",
          px: "$5",
          py: "$5",
          borderBottom: "solid $borderWidths$1 $border",
        }}
      >
        <PostAction
          Icon={HeartIcon}
          isSelected={isLikedByClient}
          onClick={handleClickOfLikeButton}
          metric={likes.count}
        />
        {handleClickOfCommentsButton ? (
          <PostAction
            Icon={CommentIcon}
            metric={comments.count}
            onClick={handleClickOfCommentsButton}
          />
        ) : (
          <PostAction Icon={CommentIcon} metric={comments.count} />
        )}
        <PostAction Icon={PaperPlanIcon} onClick={handleClickOfShareButton} />
        <PostAction Icon={BookmarkIcon} />
      </Flex>
      {!handleClickOfCommentsButton && <Comments postId={post.postId} />}
    </Box>
  );
};

const Timestamp = styled("div", {
  color: "$secondaryText",
});

const HashTag = styled(Body, {
  bg: "$primary",
  color: "$accentText",
  py: "$1",
  px: "$3",
  borderRadius: "$round",
});

interface PostActionProps {
  Icon: ComponentType;
  metric?: number;
  onClick?: () => void;
  isSelected?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: string | ComponentType<any>;
}

const PostAction = (props: PostActionProps) => {
  const { Icon, metric, onClick, isSelected } = props;
  return (
    <Flex
      as={props.as ?? "button"}
      css={{
        alignItems: "center",
        gap: "$2",
        color: isSelected ? "$primary" : "$secondaryText",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Icon />
      {metric && <Body>{metric}</Body>}
    </Flex>
  );
};
