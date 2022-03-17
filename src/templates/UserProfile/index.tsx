import Link from "next/link";
import { MouseEvent } from "react";
import { RenderableUser } from "#/api";
import { useFollowUser } from "#/api/mutations/users/followUser";
import { useUnfollowUser } from "#/api/mutations/users/unfollowUser";
import { useGetUserByUsername } from "#/api/queries/users/useGetUserByUsername";
import { Avatar } from "#/components/Avatar";
import { BackgroundImage } from "#/components/BackgroundImage";
import { Button } from "#/components/Button";
import { ErrorArea } from "#/components/ErrorArea";
import { HashTag } from "#/components/HashTags";
import { ShareIcon } from "#/components/Icons";
import { Box, Flex, Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Tabs } from "#/components/Tabs";
import { Subtext, subtextStyles } from "#/components/Typography";
import { useCurrentUserId } from "#/contexts/auth";
import { styled } from "#/styling";
import { copyTextToClipboard } from "#/utils/copyTextToClipboard";
import { formatStat } from "#/utils/formatStat";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { UserPosts } from "./UserPosts";

export const UserProfile = ({ username }: { username: string }) => {
  const { data, isLoading, error } = useGetUserByUsername({ username });
  const clientUserId = useCurrentUserId();

  const isOwnProfile = data && clientUserId === data?.userId;

  return !isLoading && error ? (
    <ErrorArea>{error.message || "An Unexpected Error Occurred"}</ErrorArea>
  ) : isLoading || !data ? (
    <LoadingArea size="lg" />
  ) : (
    <ProfileBody isOwnProfile={isOwnProfile} user={data} />
  );
};
interface ProfileBodyProps {
  isOwnProfile?: boolean;
  user: RenderableUser;
}

const ProfileBody = (props: ProfileBodyProps) => {
  const {
    userId,
    isBeingFollowedByClient,
    shortBio,
    username,
    followers,
    follows,
    userWebsite,
    profilePictureTemporaryUrl,
    backgroundImageTemporaryUrl,
  } = props.user;

  const hashtags = props.user.hashtags.filter((x) => x);

  return (
    <Stack css={{ size: "100%" }}>
      <Stack>
        <ProfileHeader>
          <BackgroundImage
            src={backgroundImageTemporaryUrl}
            alt="User Background Image"
          />
          <AvatarAndName>
            <Box
              css={{
                border: "solid $borderWidths$2 $background1",
                borderRadius: "$round",
              }}
            >
              <Avatar src={profilePictureTemporaryUrl} alt="User Profile Picture" />
            </Box>
            <Link href={getProfilePageUrl({ username })} passHref>
              <a>@{username}</a>
            </Link>
          </AvatarAndName>
        </ProfileHeader>
        <Stack css={{ mt: "$10", pt: "$4", px: "$6", gap: "$4" }}>
          <Subtext>
            {formatStat(followers.count)} followers | {formatStat(follows.count)} followed
          </Subtext>
          {!!shortBio && <Description>{shortBio}</Description>}
          {!!userWebsite && (
            <ExternalLink target="_blank" rel="noopener noreferrer" href={userWebsite}>
              {userWebsite}
            </ExternalLink>
          )}
          {!!hashtags.length && (
            <Flex css={{ gap: "$3" }}>
              {hashtags.map((hashtag) => (
                <HashTag key={hashtag} outlined>
                  #{hashtag}
                </HashTag>
              ))}
            </Flex>
          )}
        </Stack>
        <Flex css={{ gap: "$3", px: "$6", pt: "$6", pb: "$3" }}>
          {props.isOwnProfile ? (
            <Link href="/edit-profile" passHref>
              <Button as="a" size="md" variant="primary" css={{ flex: 1 }}>
                Edit Profile
              </Button>
            </Link>
          ) : (
            <FollowButton
              userId={userId}
              username={username}
              isBeingFollowedByClient={isBeingFollowedByClient}
            />
          )}
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              const link = `${location.origin}${getProfilePageUrl({ username })}`;
              copyTextToClipboard(link, "Link");
            }}
          >
            <ShareIcon />
          </Button>
        </Flex>
      </Stack>
      <Tabs
        ariaLabel="User Content Categories"
        stretchTabs
        tabs={[
          {
            id: "posts",
            trigger: "Posts",
            content: <UserPosts user={props.user} />,
          },
          {
            id: "shop",
            trigger: "Shop",
            content: <Stack css={{ p: "$5" }}>User Shop Items Go Here</Stack>,
          },
        ]}
      />
    </Stack>
  );
};

const ProfileHeader = styled(Flex, {
  position: "relative",
});

const AvatarAndName = styled(Stack, {
  position: "absolute",
  bottom: "-60px", // Magic number
  alignItems: "flex-start",
  gap: "$5",
  px: "$6",
});

const Description = styled(Subtext, { fontWeight: "$light" });

const ExternalLink = styled("a", subtextStyles, { cursor: "pointer" });

const PrimaryButton = styled(Button, {
  flex: 1,
});

const FollowButton = ({
  userId,
  username,
  isBeingFollowedByClient,
}: {
  userId: string;
  username: string;
  isBeingFollowedByClient: boolean;
}) => {
  const { mutateAsync: followUser } = useFollowUser({
    userIdBeingFollowed: userId,
    usernameBeingFollowed: username,
  });

  const { mutateAsync: unfollowUser } = useUnfollowUser({
    userIdBeingUnfollowed: userId,
    usernameBeingUnfollowed: username,
  });

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (isBeingFollowedByClient) {
      unfollowUser();
    } else {
      followUser();
    }
  }

  return (
    <PrimaryButton onClick={handleClick} size="md" variant="primary">
      {isBeingFollowedByClient ? "Unfollow" : "Follow"}
    </PrimaryButton>
  );
};
