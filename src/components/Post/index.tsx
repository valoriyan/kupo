import Link from "next/link";
import { ComponentType } from "react";
import { RenderablePost } from "#/api";
import { styled } from "#/styling";
import { Avatar } from "../Avatar";
import { Bookmark, Comment, Heart, MailForward } from "../Icons";
import { Flex, Grid } from "../Layout";
import { Body } from "../Typography";

export interface PostProps {
  post: RenderablePost;
  authorUserName?: string;
  authorUserAvatar?: string;
}

export const Post = (props: PostProps) => {
  return (
    <Grid>
      <Flex css={{ p: "$3", gap: "$3", alignItems: "center" }}>
        <Avatar
          alt={`@${props.authorUserName}'s profile picture`}
          src={props.authorUserAvatar}
          size="$6"
        />
        <Link href="/profile" passHref>
          <a>{props.authorUserName ? `@${props.authorUserName}` : "User"}</a>
        </Link>
      </Flex>
      <Body css={{ px: "$3", py: "$2" }}>{props.post.caption}</Body>
      <PostImage alt="Post Media" src={props.post.contentElementTemporaryUrls[0]} />
      <Flex css={{ gap: "$3", px: "$3", py: "$2", width: "100%", overflow: "auto" }}>
        {props.post.hashtags.map((tag) => (
          <HashTag key={tag}>#{tag}</HashTag>
        ))}
      </Flex>
      <Flex css={{ justifyContent: "space-between", px: "$4", py: "$4" }}>
        <PostAction Icon={Heart} />
        <PostAction Icon={Comment} />
        <PostAction Icon={MailForward} />
        <PostAction Icon={Bookmark} />
      </Flex>
    </Grid>
  );
};

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
}

const PostAction = ({ Icon, metric, onClick }: PostActionProps) => {
  return (
    <Flex
      as="button"
      css={{
        alignItems: "center",
        gap: "$1",
        color: "$secondaryText",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Icon />
      {metric && <Body>{metric}</Body>}
    </Flex>
  );
};
