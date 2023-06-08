import Link from "next/link";
import { ProfilePrivacySetting, RenderableUser } from "#/api";
import { Avatar } from "#/components/Avatar";
import { BackgroundImage } from "#/components/BackgroundImage";
import { Button } from "#/components/Button";
import { FollowUserButton } from "#/components/FollowButton";
import { HashTag } from "#/components/HashTags";
import { LinkIcon, MailIcon } from "#/components/Icons";
import { Box, Flex, Stack } from "#/components/Layout";
import { Body, bodyStyles, MainTitle, Subtext } from "#/components/Typography";
import { setPreviousLocationForMessages } from "#/pages/messages";
import { setPreviousLocationForSettings } from "#/pages/settings";
import { styled } from "#/styling";
import { copyTextToClipboard } from "#/utils/copyTextToClipboard";
import { formatStat } from "#/utils/formatStat";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { getExternalLink } from "#/utils/getExternalLink";

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
          <ActionsWrapper>
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
              <FollowUserButton
                userId={userId}
                username={username}
                isUserPrivate={
                  user.profilePrivacySetting === ProfilePrivacySetting.Private
                }
                followingStatus={followingStatusOfClientToUser}
              />
            )}
            <Link href={{ pathname: "/messages/new", query: { username } }} passHref>
              <Button
                as="a"
                size="sm"
                variant="primary"
                onClick={setPreviousLocationForMessages}
              >
                <MailIcon />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                const link = `${location.origin}${getProfilePageUrl({ username })}`;
                copyTextToClipboard(link, "Link");
              }}
            >
              <LinkIcon />
            </Button>
          </ActionsWrapper>
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
      <Stack css={{ mt: "107px", py: "$4", px: "$6", gap: "$3" }}>
        {!!shortBio && <Body>{shortBio}</Body>}
        {!!userWebsite && (
          <Flex css={{ alignItems: "center", gap: "$3", color: "$secondaryText" }}>
            <LinkIcon />
            <ExternalLink
              target="_blank"
              rel="noopener noreferrer"
              href={getExternalLink(userWebsite)}
            >
              {userWebsite}
            </ExternalLink>
          </Flex>
        )}
        {!!hashtags.length && (
          <Flex css={{ gap: "$3", pt: "$3" }}>
            {hashtags.map((hashtag) => (
              <HashTag key={hashtag} hashtag={hashtag} />
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

const ActionsWrapper = styled(Flex, {
  gap: "$3",
  position: "absolute",
  bottom: "-$9",
  right: "$4",
  zIndex: 1,
});

const ExternalLink = styled("a", bodyStyles);
