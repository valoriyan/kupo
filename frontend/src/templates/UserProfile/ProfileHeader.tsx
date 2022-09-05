import Link from "next/link";
import { ProfilePrivacySetting, RenderableUser } from "#/api";
import { Avatar } from "#/components/Avatar";
import { BackgroundImage } from "#/components/BackgroundImage";
import { Button } from "#/components/Button";
import { HashTag } from "#/components/HashTags";
import { ShareIcon } from "#/components/Icons";
import { Box, Flex, Stack } from "#/components/Layout";
import { Body, MainTitle, Subtext, subtextStyles } from "#/components/Typography";
import { setPreviousLocationForSettings } from "#/pages/settings";
import { styled } from "#/styling";
import { copyTextToClipboard } from "#/utils/copyTextToClipboard";
import { formatStat } from "#/utils/formatStat";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { FollowButton } from "./FollowButton";

export interface ProfileHeaderProps {
  isOwnProfile: boolean | undefined;
  user: RenderableUser;
}

export const ProfileHeader = ({ isOwnProfile, user }: ProfileHeaderProps) => {
  const {
    userId,
    followingStatusOfClientToUser,
    shortBio,
    username,
    followers,
    follows,
    userWebsite,
    profilePictureTemporaryUrl,
    backgroundImageTemporaryUrl,
  } = user;

  const hashtags = user.hashtags.filter((x) => x);

  return (
    <Stack>
      <Wrapper>
        <Flex css={{ position: "relative", width: "100%" }}>
          <BackgroundImage
            src={backgroundImageTemporaryUrl}
            alt="User Background Image"
          />
          <Flex
            css={{
              gap: "$3",
              position: "absolute",
              bottom: "-$9",
              right: "$4",
              zIndex: 1,
            }}
          >
            {isOwnProfile ? (
              <Link href="/settings/profile" passHref>
                <Button
                  as="a"
                  size="sm"
                  variant="primary"
                  css={{ flex: 1 }}
                  onClick={setPreviousLocationForSettings}
                >
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <FollowButton
                userId={userId}
                username={username}
                isUserPrivate={
                  user.profilePrivacySetting === ProfilePrivacySetting.Private
                }
                followingStatus={followingStatusOfClientToUser}
              />
            )}
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                const link = `${location.origin}${getProfilePageUrl({ username })}`;
                copyTextToClipboard(link, "Link");
              }}
            >
              <ShareIcon />
            </Button>
          </Flex>
        </Flex>
        <AvatarAndName>
          <Box
            css={{
              border: "solid $borderWidths$3 $background1",
              borderRadius: "$round",
            }}
          >
            <Avatar
              src={profilePictureTemporaryUrl}
              alt="User Profile Picture"
              size="$11"
            />
          </Box>
          <Stack css={{ gap: "$3" }}>
            <Link href={getProfilePageUrl({ username })} passHref>
              <MainTitle as="a">@{username}</MainTitle>
            </Link>
            <Subtext css={{ color: "$secondaryText" }}>
              {formatStat(followers.count)} followers | {formatStat(follows.count)}{" "}
              followed
            </Subtext>
          </Stack>
        </AvatarAndName>
      </Wrapper>
      <Stack css={{ mt: "107px", py: "$4", px: "$6", gap: "$4" }}>
        {!!shortBio && <Body>{shortBio}</Body>}
        {!!userWebsite && (
          <ExternalLink target="_blank" rel="noopener noreferrer" href={userWebsite}>
            {userWebsite}
          </ExternalLink>
        )}
        {!!hashtags.length && (
          <Flex css={{ gap: "$3" }}>
            {hashtags.map((hashtag) => (
              <HashTag key={hashtag} hashtag={hashtag} outlined />
            ))}
          </Flex>
        )}
      </Stack>
    </Stack>
  );
};

const Wrapper = styled(Flex, {
  position: "relative",
});

const AvatarAndName = styled(Stack, {
  position: "absolute",
  bottom: "-100px", // Magic number
  width: "100%",
  alignItems: "flex-start",
  gap: "$5",
  px: "$6",
});

const ExternalLink = styled("a", subtextStyles, { cursor: "pointer" });
