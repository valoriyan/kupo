import Link from "next/link";
import { RenderablePublishingChannel } from "#/api";
import { Avatar } from "#/components/Avatar";
import { BackgroundImage } from "#/components/BackgroundImage";
import { Button } from "#/components/Button";
import { FollowCommunityButton } from "#/components/FollowButton";
import { ShareIcon } from "#/components/Icons";
import { Box, Flex, Stack } from "#/components/Layout";
import { Body, MainTitle, Subtext } from "#/components/Typography";
import { setPreviousLocationForSettings } from "#/pages/settings";
import { styled } from "#/styling";
import { copyTextToClipboard } from "#/utils/copyTextToClipboard";
import { formatStat } from "#/utils/formatStat";
import { getCommunityPageUrl } from "#/utils/generateLinkUrls";

export interface CommunityHeaderProps {
  isOwnCommunity: boolean | undefined;
  community: RenderablePublishingChannel;
}

export const CommunityHeader = ({ isOwnCommunity, community }: CommunityHeaderProps) => {
  const {
    publishingChannelId,
    name,
    description,
    followingStatusOfClientToPublishingChannel,
  } = community;

  return (
    <Stack>
      <Wrapper>
        <Flex css={{ position: "relative", width: "100%" }}>
          <BackgroundImage
            src={community.backgroundImageTemporaryUrl}
            alt="Community Background Image"
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
            {isOwnCommunity ? (
              <Link href={`/settings/community/${name}`} passHref>
                <Button
                  as="a"
                  size="sm"
                  variant="primary"
                  css={{ flex: 1 }}
                  onClick={setPreviousLocationForSettings}
                >
                  Edit Community
                </Button>
              </Link>
            ) : (
              <FollowCommunityButton
                communityId={publishingChannelId}
                communityName={name}
                followingStatus={followingStatusOfClientToPublishingChannel}
              />
            )}
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                const link = `${location.origin}${getCommunityPageUrl({ name })}`;
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
              src={community.profilePictureTemporaryUrl}
              alt="Community Profile Picture"
              size="$11"
            />
          </Box>
          <Stack css={{ gap: "$3" }}>
            <Link href={getCommunityPageUrl({ name })} passHref>
              <MainTitle as="a">+{name}</MainTitle>
            </Link>
            <Subtext css={{ color: "$secondaryText" }}>
              {formatStat(community.followers.count)} followers
            </Subtext>
          </Stack>
        </AvatarAndName>
      </Wrapper>
      <Stack css={{ mt: "107px", py: "$4", px: "$6", gap: "$4" }}>
        {!!description && <Body>{description}</Body>}
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
