import Link from "next/link";
import { ComponentType } from "react";
import { RenderablePost } from "#/api";
import { styled } from "#/styling";
import { Avatar } from "../Avatar";
import { Bookmark, Comment, Heart, MailForward, MoreVerticalAlt } from "../Icons";
import { Flex, Grid } from "../Layout";
import { Body } from "../Typography";

export interface PostProps {
  post: RenderablePost;
  postRelativeTimestamp: string;
  authorUserName?: string;
  authorUserAvatar?: string;
  handleClickOfLikeButton: () => void;
}



export const Post = (props: PostProps) => {
  const { post, handleClickOfLikeButton, authorUserName, authorUserAvatar, postRelativeTimestamp } = props;
  const { isLikedByClient, caption, contentElementTemporaryUrls, hashtags } = post;

  return (
    <Grid>
      <Flex css={{ p: "$3", gap: "$3", alignItems: "center" }}>
        <Avatar
          alt={`@${authorUserName}'s profile picture`}
          src={authorUserAvatar}
          size="$6"
        />
        <Link href="/profile" passHref>
          <a>{authorUserName ? `@${authorUserName}` : "User"}</a>
        </Link>

        <Flex css={{marginLeft: "auto", gap: "$4"}}>
          <Timestamp>
            {postRelativeTimestamp ? postRelativeTimestamp : ""}
          </Timestamp>
          <MoreVerticalAlt />
        </Flex>
      </Flex>
      <Body css={{ px: "$3", py: "$2" }}>{caption}</Body>
      <PostImage alt="Post Media" src={contentElementTemporaryUrls[0]} />
      <Flex css={{ gap: "$3", px: "$3", py: "$2", width: "100%", overflow: "auto" }}>
        {hashtags.map((tag) => (
          <HashTag key={tag}>#{tag}</HashTag>
        ))}
      </Flex>
      <Flex css={{ justifyContent: "space-between", px: "$4", py: "$4" }}>
        <PostAction
          Icon={Heart}
          isSelected={isLikedByClient}
          onClick={handleClickOfLikeButton}
        />
        <PostAction Icon={Comment} />
        <PostAction Icon={MailForward} />
        <PostAction Icon={Bookmark} />
      </Flex>
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
