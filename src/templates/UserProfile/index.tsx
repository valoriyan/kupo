import Link from "next/link";
import { MouseEvent } from "react";
import { useGetUserProfile } from "#/api/queries/users/useGetUserProfile";
import { Avatar } from "#/components/Avatar";
import { Button } from "#/components/Button";
import { ErrorArea } from "#/components/ErrorArea";
import { Share } from "#/components/Icons";
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

const EditProfileButton = () => {
  return (
    <PrimaryButton size="md" variant="primary">
      Edit Profile
    </PrimaryButton>
  );
};

const ProfileBody = (props: ProfileBodyProps) => {
  const { user, isOwnProfile } = props;
  const { userId, isBeingFollowedByClient } = user;

  return (
    <Stack>
      <Stack css={{ height: "100%", px: "$5", pt: "$5", pb: "$4" }}>
        <Avatar alt="User Profile Picture" />
        <Stack css={{ mt: "$4", gap: "$3" }}>
          <Link href={`/profile/${props.user.username}`} passHref>
            <a>@{props.user.username}</a>
          </Link>
          <Subtext>
            {formatStat(props.user.followers.count)} followers |{" "}
            {formatStat(props.user.follows.count)} followed
          </Subtext>
          <Description>{props.user.shortBio}</Description>
          <ExternalLink target="_blank" rel="noopener noreferrer">
            {props.user.userWebsite}
          </ExternalLink>
        </Stack>
        <Flex css={{ gap: "$3", pt: "$5", pb: "$3" }}>
          {isOwnProfile ? (
            <EditProfileButton />
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
              const link = `${location.origin}/profile/${props.user.username}`;
              copyTextToClipboard(link, "Link");
            }}
          >
            <Share />
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
                userId={props.user.userId}
                username={props.user.username}
                userAvatar={props.user.profilePictureTemporaryUrl}
              />
            ),
          },
          {
            id: "shop",
            trigger: "Shop",
            content: <Stack css={{ p: "$4" }}>User Shop Items Go Here</Stack>,
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
