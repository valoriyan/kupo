import Link from "next/link";
import { SuccessfulGetUserProfileResponse } from "#/api";
import { useGetUserProfile } from "#/api/queries/useGetUserProfile";
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

export interface UserProfileProps {
  isOwnProfile?: boolean;
  username?: string;
}

export const UserProfile = ({ isOwnProfile, username }: UserProfileProps) => {
  const { data, isLoading, error } = useGetUserProfile({ username, isOwnProfile });

  return !isLoading && (error || data?.error) ? (
    <ErrorArea>{data?.error?.reason || "An Unexpected Error Occurred"}</ErrorArea>
  ) : isLoading || !data?.success ? (
    <LoadingArea size="lg" />
  ) : (
    <ProfileBody isOwnProfile={isOwnProfile} user={data.success} />
  );
};

interface ProfileBodyProps {
  isOwnProfile?: boolean;
  user: SuccessfulGetUserProfileResponse;
}

const ProfileBody = (props: ProfileBodyProps) => {
  return (
    <Stack>
      <Stack css={{ height: "100%", px: "$5", pt: "$5", pb: "$4" }}>
        <Avatar alt="User Profile Picture" />
        <Stack css={{ mt: "$4", gap: "$3" }}>
          <Link href={`/profile/${props.user.username}`} passHref>
            <a>@{props.user.username}</a>
          </Link>
          <UserStats>
            {formatStat(props.user.followers.count)} followers |{" "}
            {formatStat(props.user.subscribers.count)} subscribers |{" "}
            {formatStat(props.user.follows.count)} followed
          </UserStats>
          <Description>{props.user.bio}</Description>
          <ExternalLink target="_blank" rel="noopener noreferrer">
            linktr.ee/cheese
          </ExternalLink>
        </Stack>
        <Flex css={{ gap: "$3", pt: "$5", pb: "$3" }}>
          <Button size="md" variant="primary" css={{ flex: 1 }}>
            {props.isOwnProfile ? "Edit Profile" : "Follow"}
          </Button>
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
            content: <Stack css={{ p: "$4" }}>User Posts Go Here</Stack>,
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

const UserStats = styled("div", {
  fontSize: "$1",
});

const Description = styled("div", {
  fontWeight: "$light",
  fontSize: "$1",
});

const ExternalLink = styled("a", {
  fontSize: "$1",
});
