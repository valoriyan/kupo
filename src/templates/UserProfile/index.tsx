import Link from "next/link";
import { MouseEvent } from "react";
import { RenderableUser } from "#/api";
import { useFollowUser } from "#/api/mutations/users/followUser";
import { useUnfollowUser } from "#/api/mutations/users/unfollowUser";
import { useGetUserProfile } from "#/api/queries/users/useGetUserProfile";
import { Avatar } from "#/components/Avatar";
import { Button } from "#/components/Button";
import { ErrorArea } from "#/components/ErrorArea";
import { ShareIcon } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Tabs } from "#/components/Tabs";
import { Subtext, subtextStyles } from "#/components/Typography";
import { useCurrentUserId } from "#/contexts/auth";
import { styled } from "#/styling";
import { copyTextToClipboard } from "#/utils/copyTextToClipboard";
import { formatStat } from "#/utils/formatStat";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { UserPosts } from "./UserPosts";
import { HashTag } from "#/components/HashTags";

export interface UserProfileProps {
  username?: string;
}

export const UserProfile = ({ username }: UserProfileProps) => {
  const { data, isLoading, error } = useGetUserProfile({ username });
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
  } = props.user;

  const hashtags = props.user.hashtags.filter((x) => x);

  return (
    <Stack>
      <Stack css={{ height: "100%", px: "$6", pt: "$6", pb: "$5" }}>
        <Avatar src={profilePictureTemporaryUrl} alt="User Profile Picture" />
        <Stack css={{ mt: "$5", gap: "$4" }}>
          <Link href={getProfilePageUrl({ username })} passHref>
            <a>@{username}</a>
          </Link>
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

const Description = styled(Subtext, { fontWeight: "$light" });

const ExternalLink = styled("a", subtextStyles, { cursor: "pointer" });

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
