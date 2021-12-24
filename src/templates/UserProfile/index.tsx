import Link from "next/link";
import { MouseEvent } from "react";
import { useGetUserProfile } from "#/api/queries/users/useGetUserProfile";
import { Avatar } from "#/components/Avatar";
import { Button } from "#/components/Button";
import { ErrorArea } from "#/components/ErrorArea";
import { ShareIcon } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Tabs } from "#/components/Tabs";
import { styled } from "#/styling";
import { copyTextToClipboard } from "#/utils/copyTextToClipboard";
import { formatStat } from "#/utils/formatStat";
import { Subtext, subtextStyles } from "#/components/Typography";
import { RenderableUser } from "#/api";
import { UserPosts } from "./UserPosts";
import { useFollowUser } from "#/api/mutations/users/followUser";
import { useUnfollowUser } from "#/api/mutations/users/unfollowUser";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { generateUserProfilePageUrl } from "#/utils/generateLinkUrls";
export interface UserProfileProps {
  isOwnProfile?: boolean;
  username?: string;
}

const UserProfileInner = ({
  isOwnProfile,
  user,
}: {
  isOwnProfile?: boolean;
  user: RenderableUser;
}) => {
  const { userId } = user;
  const { data, isLoading, error } = useGetUserByUserId({ userId });

  return !isLoading && error ? (
    <ErrorArea>{error.message || "An Unexpected Error Occurred"}</ErrorArea>
  ) : isLoading || !data ? (
    <LoadingArea size="lg" />
  ) : (
    <ProfileBody isOwnProfile={isOwnProfile} user={data} />
  );
};

export const UserProfile = ({ isOwnProfile, username }: UserProfileProps) => {
  const { data, isLoading, error } = useGetUserProfile({ username, isOwnProfile });

  return !isLoading && error ? (
    <ErrorArea>{error.message || "An Unexpected Error Occurred"}</ErrorArea>
  ) : isLoading || !data ? (
    <LoadingArea size="lg" />
  ) : (
    <UserProfileInner isOwnProfile={isOwnProfile} user={data} />
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
  } = props.user;

  return (
    <Stack>
      <Stack css={{ height: "100%", px: "$6", pt: "$6", pb: "$5" }}>
        <Avatar src={profilePictureTemporaryUrl} alt="User Profile Picture" />
        <Stack css={{ mt: "$5", gap: "$3" }}>
          <Link href={generateUserProfilePageUrl({ username })} passHref>
            <a>@{username}</a>
          </Link>
          <Subtext>
            {formatStat(followers.count)} followers | {formatStat(follows.count)} followed
          </Subtext>
          <Description>{shortBio}</Description>
          <ExternalLink target="_blank" rel="noopener noreferrer">
            {userWebsite}
          </ExternalLink>
        </Stack>
        <Flex css={{ gap: "$3", pt: "$6", pb: "$3" }}>
          {props.isOwnProfile ? (
            <Link href="/edit-profile" passHref>
              <Button as="a" size="md" variant="primary" css={{ flex: 1 }}>
                Edit Profile
              </Button>
            </Link>
          ) : (
            <FollowButton
              userId={userId}
              isBeingFollowedByClient={isBeingFollowedByClient}
            />
          )}
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              const link = `${location.origin}${generateUserProfilePageUrl({
                username,
              })}`;
              copyTextToClipboard(link, "Link");
            }}
          >
            <ShareIcon />
          </Button>
        </Flex>
      </Stack>
      <Tabs
        ariaLabel="User Content Categories"
        tabs={[
          {
            id: "posts",
            trigger: "Posts",
            content: (
              <UserPosts
                userId={userId}
                username={username}
                userAvatar={profilePictureTemporaryUrl}
              />
            ),
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

const Description = styled(Subtext, { fontWeight: "$light" });

const ExternalLink = styled("a", subtextStyles);

const PrimaryButton = styled(Button, {
  flex: 1,
});

const FollowButton = ({
  userId,
  isBeingFollowedByClient,
}: {
  userId: string;
  isBeingFollowedByClient: boolean;
}) => {
  const { mutateAsync: followUser } = useFollowUser({
    userIdBeingFollowed: userId,
  });

  const { mutateAsync: unfollowUser } = useUnfollowUser({
    userIdBeingUnfollowed: userId,
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
