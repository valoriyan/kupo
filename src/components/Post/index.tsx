import Image from "next/image";
import Link from "next/link";
import { ComponentType, useState } from "react";
import { RenderablePost, RenderablePostComment } from "#/api";
import { styled } from "#/styling";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { Avatar } from "../Avatar";
import {
  BookmarkIcon,
  CommentIcon,
  HeartIcon,
  MailForwardIcon,
  MoreVerticalAltIcon,
} from "../Icons";
import { Box, Flex, Grid, Stack } from "../Layout";
import { Popover } from "../Popover";
import { Body } from "../Typography";
import { Comments } from "./Comments";

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
      <Flex css={{ px: "$4", py: "$3", gap: "$3", alignItems: "center" }}>
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
          <Popover trigger={<Flex as={MoreVerticalAltIcon} />}>
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
      <Body css={{ px: "$4", py: "$2" }}>{caption}</Body>
      <ImageWrapper>
        <BlurredImage
          alt="Blurred Post Media"
          src={contentElementTemporaryUrls[0]}
          layout="fill"
          unoptimized // Optimization caching is broken because signed urls aren't stable
          priority
        />
        <Image
          alt="Post Media"
          src={contentElementTemporaryUrls[0]}
          layout="fill"
          objectFit="contain"
          unoptimized // Optimization caching is broken because signed urls aren't stable
          priority
        />
      </ImageWrapper>
      <Flex css={{ gap: "$3", px: "$4", py: "$2", width: "100%", overflow: "auto" }}>
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

const ImageWrapper = styled(Box, {
  position: "relative",
  width: "100%",
  height: "62vh",
  my: "$3",
  bg: "$background3",
});

const BlurredImage = styled(Image, {
  filter: "blur(20px)",
  opacity: 0.9,
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
