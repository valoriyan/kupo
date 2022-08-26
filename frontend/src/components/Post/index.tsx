import { ComponentType, useState } from "react";
import {
  MediaElement,
  PublishedItemType,
  RenderablePost,
  RenderableShopItem,
  RootRenderablePost,
} from "#/api";
import { styled } from "#/styling";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { HashTag } from "../HashTags";
import { BookmarkIcon, CommentIcon, HeartIcon, PaperPlanIcon } from "../Icons";
import { Box, Flex } from "../Layout";
import { Body } from "../Typography";
import { VerticalSlideDialog } from "../VerticalSlideDialog";
import { Comments } from "./Comments";
import { PostBody } from "./PostBody";
import { ShareMenu } from "./ShareMenu";
import { usePostActions } from "./usePostActions";

export interface PostProps {
  post: RenderablePost | RenderableShopItem;
  handleClickOfCommentsButton?: () => void;
}

export const Post = ({ post, handleClickOfCommentsButton }: PostProps) => {
  const {
    type,
    isLikedByClient,
    isSavedByClient,
    caption,
    mediaElements,
    hashtags,
    likes,
    comments,
    sharedItem,
  } = post;

  const { handleLikeButton, handleSaveButton, menuActions, user } = usePostActions(post);

  const [currentMediaElement, setCurrentMediaElement] = useState<
    MediaElement | undefined
  >(mediaElements && mediaElements.length > 0 ? mediaElements[0] : undefined);

  const relativeTimestamp = getRelativeTimestamp(post.creationTimestamp);

  return (
    <Box>
      <PostBody
        type={type as unknown as PublishedItemType}
        authorUserName={user?.username}
        authorUserAvatar={user?.profilePictureTemporaryUrl}
        relativeTimestamp={relativeTimestamp}
        caption={caption}
        title={"title" in post ? post.title : undefined}
        price={"price" in post ? post.price : undefined}
        purchasedMediaElementsMetadata={
          "purchasedMediaElementsMetadata" in post
            ? post.purchasedMediaElementsMetadata
            : undefined
        }
        mediaElements={mediaElements}
        setCurrentMediaElement={setCurrentMediaElement}
        sharedItem={sharedItem}
        menuActions={menuActions}
      />
      {!!hashtags.length && (
        <HashTagsWrapper css={{ pt: "price" in post ? "$2" : "$4" }}>
          {hashtags.map((tag) => (
            <HashTag key={tag} hashtag={tag} />
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
          onClick={handleLikeButton}
          metric={likes.count}
        />
        {handleClickOfCommentsButton ? (
          <PostAction
            Icon={CommentIcon}
            metric={comments.count}
            onClick={handleClickOfCommentsButton}
            data-cy="new-comment-button"
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
              post={sharedItem ?? (post as RootRenderablePost)}
              currentMediaElement={currentMediaElement}
            />
          )}
        </VerticalSlideDialog>
        <PostAction
          Icon={BookmarkIcon}
          isSelected={isSavedByClient}
          onClick={handleSaveButton}
        />
      </Flex>
      {!handleClickOfCommentsButton && <Comments postId={post.id} />}
    </Box>
  );
};

const HashTagsWrapper = styled(Flex, {
  flexWrap: "wrap",
  gap: "$3",
  px: "$4",
  pt: "$4",
  pb: "$2",
});

interface PostActionProps {
  Icon: ComponentType;
  metric?: number;
  onClick?: () => void;
  isSelected?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: string | ComponentType<any>;
  "data-cy"?: string;
}

const PostAction = (props: PostActionProps) => {
  const { Icon, metric, onClick, isSelected, "data-cy": dataCy } = props;
  return (
    <Flex
      as={props.as ?? "button"}
      css={{
        alignItems: "center",
        gap: "$3",
        color: isSelected ? "$primary" : "$secondaryText",
      }}
      onClick={onClick}
    >
      <Icon data-cy={dataCy} />
      {metric && <Body>{metric}</Body>}
    </Flex>
  );
};
