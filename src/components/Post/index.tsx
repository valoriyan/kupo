import Link from "next/link";
import { ComponentType, useState } from "react";
import { RenderablePost, RenderablePostComment } from "#/api";
import { styled } from "#/styling";
import { Avatar } from "../Avatar";
import {
  BookmarkIcon,
  CommentIcon,
  HeartIcon,
  MailForwardIcon,
  MoreVerticalAltIcon,
} from "../Icons";
import { Flex, Grid, Stack } from "../Layout";
import { Body } from "../Typography";
import { Popover } from "../Popover";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";

export interface PostMenuOption {
  Icon: ComponentType;
  label: string;
  onClick: () => void;
}

export interface PostProps {
  post: RenderablePost;
  postRelativeTimestamp: string;
  authorUserName?: string;
  authorUserAvatar?: string;
  handleClickOfLikeButton: () => void;
  menuOptions: PostMenuOption[];
  postComments?: RenderablePostComment[];
}

const CommentContainer = ({
  postComments,
}: {
  postComments?: RenderablePostComment[];
}) => {
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

const Comments = ({ postComments }: { postComments?: RenderablePostComment[] }) => {
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

//////////////////////////////////////////////////
//////////////////////////////////////////////////

//////////////////////////////////////////////////
//////////////////////////////////////////////////

export const Post = (props: PostProps) => {
  const [displayComments, setDisplayComments] = useState(false);

  const {
    post,
    handleClickOfLikeButton,
    authorUserName,
    authorUserAvatar,
    postRelativeTimestamp,
    postComments,
  } = props;
  const { isLikedByClient, caption, contentElementTemporaryUrls, hashtags, likes } = post;

  return (
    <Grid>
      <Flex css={{ p: "$3", gap: "$3", alignItems: "center" }}>
        <Avatar
          alt={`@${authorUserName}'s profile picture`}
          src={authorUserAvatar}
          size="$7"
        />
        <Link href={getProfilePageUrl({ username: authorUserName || "" })} passHref>
          <a>{authorUserName ? `@${authorUserName}` : "User"}</a>
        </Link>

        <Flex css={{ marginLeft: "auto", gap: "$5", alignItems: "center" }}>
          <Timestamp>{postRelativeTimestamp ? postRelativeTimestamp : ""}</Timestamp>
          <Popover trigger={<MoreVerticalAltIcon />}>
            {({ hide }) => (
              <Stack>
                {props.menuOptions.map(({ Icon, label, onClick }) => (
                  <MenuOption
                    key={label}
                    onClick={() => {
                      onClick();
                      hide();
                    }}
                  >
                    <Icon />
                    <Body>{label}</Body>
                  </MenuOption>
                ))}
              </Stack>
            )}
          </Popover>
        </Flex>
      </Flex>
      <Body css={{ px: "$3", py: "$2" }}>{caption}</Body>
      <PostImage alt="Post Media" src={contentElementTemporaryUrls[0]} />
      <Flex css={{ gap: "$3", px: "$3", py: "$2", width: "100%", overflow: "auto" }}>
        {hashtags.map((tag) => (
          <HashTag key={tag}>#{tag}</HashTag>
        ))}
      </Flex>
      <Flex css={{ justifyContent: "space-between", px: "$5", py: "$5" }}>
        <PostAction
          Icon={HeartIcon}
          isSelected={isLikedByClient}
          onClick={handleClickOfLikeButton}
          metric={likes.count}
        />
        <PostAction
          Icon={CommentIcon}
          onClick={() => setDisplayComments(!displayComments)}
        />
        <PostAction Icon={MailForwardIcon} />
        <PostAction Icon={BookmarkIcon} />
      </Flex>
      {displayComments ? <Comments postComments={postComments} /> : null}
    </Grid>
  );
};

const Timestamp = styled("div", {
  color: "$secondaryText",
});

const PostImage = styled("img", {
  py: "$3",
  width: "100%",
  height: "auto",
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
}

const PostAction = ({ Icon, metric, onClick, isSelected }: PostActionProps) => {
  return (
    <Flex
      as="button"
      css={{
        alignItems: "center",
        gap: "$1",
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

const MenuOption = styled("button", {
  display: "flex",
  gap: "$3",
  p: "$3",
  color: "$secondaryText",
});
