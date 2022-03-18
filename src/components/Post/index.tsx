import { ComponentType } from "react";
import { RenderablePost } from "#/api";
import { styled } from "#/styling";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { BookmarkIcon, CommentIcon, HeartIcon, PaperPlanIcon } from "../Icons";
import { Box, Flex } from "../Layout";
import { Body } from "../Typography";
import { MenuAction } from "./ActionMenu";
import { Comments } from "./Comments";
import { PostBody } from "./PostBody";

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

  return (
    <Box>
      <PostBody
        authorUserName={authorUserName}
        authorUserAvatar={authorUserAvatar}
        relativeTimestamp={relativeTimestamp}
        caption={caption}
        contentUrls={contentElementTemporaryUrls}
        shared={shared}
        menuActions={menuActions}
      />
      {!!hashtags.length && (
        <HashTagsWrapper>
          {hashtags.map((tag) => (
            <HashTag key={tag}>#{tag}</HashTag>
          ))}
        </HashTagsWrapper>
      )}
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

const HashTagsWrapper = styled(Flex, {
  gap: "$3",
  px: "$4",
  pt: "$4",
  pb: "$2",
  width: "100%",
  overflow: "auto",
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
