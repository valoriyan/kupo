import { ComponentType, useState } from "react";
import { ContentElement, RenderablePost } from "#/api";
import { styled } from "#/styling";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { BookmarkIcon, CommentIcon, HeartIcon, PaperPlanIcon } from "../Icons";
import { Box, Flex } from "../Layout";
import { Body } from "../Typography";
import { VerticalSlideDialog } from "../VerticalSlideDialog";
import { Comments } from "./Comments";
import { PostBody } from "./PostBody";
import { ShareMenu } from "./ShareMenu";
import { usePostActions } from "./usePostActions";

export interface PostProps {
  post: RenderablePost;
  handleClickOfCommentsButton?: () => void;
}

export const Post = ({ post, handleClickOfCommentsButton }: PostProps) => {
  const { isLikedByClient, caption, contentElements, hashtags, likes, comments, shared } =
    post;

  const { handleClickOfLikeButton, menuActions, user } = usePostActions(post);

  const [currentContentElement, setCurrentContentElement] = useState<
    ContentElement | undefined
  >(contentElements.length > 0 ? contentElements[0] : undefined);

  const relativeTimestamp = getRelativeTimestamp(post.creationTimestamp);

  return (
    <Box>
      <PostBody
        authorUserName={user?.username}
        authorUserAvatar={user?.profilePictureTemporaryUrl}
        relativeTimestamp={relativeTimestamp}
        caption={caption}
        contentElements={contentElements}
        setCurrentContentElement={setCurrentContentElement}
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
        <VerticalSlideDialog
          origin="fromBottom"
          position={{ left: "0px", right: "0px" }}
          trigger={<PostAction as="div" Icon={PaperPlanIcon} />}
        >
          {({ hide }) => (
            <ShareMenu
              hide={hide}
              post={shared?.post ?? post}
              currentContentElement={currentContentElement}
            />
          )}
        </VerticalSlideDialog>
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
      }}
      onClick={onClick}
    >
      <Icon />
      {metric && <Body>{metric}</Body>}
    </Flex>
  );
};
