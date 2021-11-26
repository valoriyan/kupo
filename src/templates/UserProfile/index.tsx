import Link from "next/link";
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

export interface UserProfileProps {
  isOwnProfile?: boolean;
  username?: string;
}

export const UserProfile = ({ isOwnProfile, username }: UserProfileProps) => {
  const { data, isLoading, error } = useGetUserProfile({ username, isOwnProfile });

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

const Description = styled(Subtext, { fontWeight: "$light" });

const ExternalLink = styled("a", subtextStyles);
