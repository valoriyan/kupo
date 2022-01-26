import * as Collapsible from "@radix-ui/react-collapsible";
import Image from "next/image";
import Link from "next/link";
import { ComponentType } from "react";
import { RenderablePost } from "#/api";
import { keyframes, prefersMotionSelector, styled } from "#/styling";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { Avatar } from "../Avatar";
import { BookmarkIcon, CommentIcon, HeartIcon, PaperPlanIcon } from "../Icons";
import { Box, Flex, Grid } from "../Layout";
import { Body } from "../Typography";
import { ActionMenu, MenuAction } from "./ActionMenu";
import { Comments } from "./Comments";

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
  menuActions: MenuAction[];
}

export const Post = ({
  post,
  handleClickOfLikeButton,
  handleClickOfShareButton,
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
    shared,
  } = post;
  const relativeTimestamp = getRelativeTimestamp(post.creationTimestamp);

  let imageUrl;
  if (shared && shared.type === "post") {
    imageUrl = shared.post.contentElementTemporaryUrls[0];
  } else {
    imageUrl = contentElementTemporaryUrls[0];
  }

  return (
    <Grid as={Collapsible.Root}>
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
          <Timestamp>{relativeTimestamp}</Timestamp>
          <ActionMenu actions={menuActions} />
        </Flex>
      </Flex>
      <Body css={{ px: "$4", py: "$2" }}>{caption}</Body>
      {imageUrl && (
        <ImageWrapper>
          <BlurredImage
            alt="Blurred Post Media"
            src={imageUrl}
            layout="fill"
            unoptimized // Optimization caching is broken because signed urls aren't stable
            priority
          />
          <Image
            alt="Post Media"
            src={imageUrl}
            layout="fill"
            objectFit="contain"
            unoptimized // Optimization caching is broken because signed urls aren't stable
            priority
          />
        </ImageWrapper>
      )}
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
        <PostAction Icon={CommentIcon} as={Collapsible.Trigger} />
        <PostAction Icon={PaperPlanIcon} onClick={handleClickOfShareButton} />
        <PostAction Icon={BookmarkIcon} />
      </Flex>
      <CollapsibleContent>
        <Comments postId={post.postId} />
      </CollapsibleContent>
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

const open = keyframes({
  from: { height: 0 },
  to: { height: "var(--radix-collapsible-content-height)" },
});

const close = keyframes({
  from: { height: "var(--radix-collapsible-content-height)" },
  to: { height: 0 },
});

const CollapsibleContent = styled(Collapsible.Content, {
  [prefersMotionSelector]: {
    '&[data-state="open"]': { animation: `${open} $1 ease-out` },
    '&[data-state="closed"]': { animation: `${close} $1 ease-out` },
  },
  overflow: "hidden",
});
