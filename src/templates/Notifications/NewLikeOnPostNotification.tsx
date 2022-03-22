import Link from "next/link";
import Image from "next/image";
import Router from "next/router";
import { RenderableNewLikeOnPostNotification } from "#/api";
import { Avatar } from "#/components/Avatar";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { Grid, Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { styled } from "#/styling";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";

export const NewLikeOnPostNotification = ({
  notification,
}: {
  notification: RenderableNewLikeOnPostNotification;
}) => {
  const {
    userThatLikedPost: { username, profilePictureTemporaryUrl },
    post,
    eventTimestamp,
  } = notification;

  return (
    <Grid
      css={{
        px: "$5",
        py: "$4",
        gridTemplateColumns: "auto minmax(0, 1fr) auto",
        columnGap: "$4",
        alignItems: "center",
        borderBottom: "solid $borderWidths$1 $border",
      }}
    >
      <Avatar
        alt={`@${username}'s profile picture`}
        src={profilePictureTemporaryUrl}
        size="$8"
        onClick={() => Router.push(getProfilePageUrl({ username }))}
      />

      <Stack css={{ gap: "$1" }}>
        <Body>
          <Link href={getProfilePageUrl({ username })}>{username}</Link> liked your post.
        </Body>
        <Body css={{ color: "$secondaryText", fontStyle: "italic" }}>
          {getShortRelativeTimestamp(eventTimestamp)} ago
        </Body>
      </Stack>

      <ImageWrapper>
        <Image
          alt="Post Media"
          src={post.contentElementTemporaryUrls[0]}
          layout="fill"
          objectFit="cover"
          unoptimized // Optimization caching is broken because signed urls aren't stable
          priority
        />
      </ImageWrapper>
    </Grid>
  );
};

const ImageWrapper = styled("div", {
  position: "relative",
  size: "$9",
  bg: "$background3",
});
