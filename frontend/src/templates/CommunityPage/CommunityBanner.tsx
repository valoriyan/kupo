import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { RenderablePublishingChannel } from "#/api";
import { Avatar } from "#/components/Avatar";
import { FollowCommunityButton } from "#/components/FollowButton";
import { ArrowLeftIcon } from "#/components/Icons";
import { Box, Flex } from "#/components/Layout";
import { styled } from "#/styling";
import { translucentBg } from "#/styling/mixins";

export interface CommunityBannerProps {
  isOwnCommunity: boolean | undefined;
  scrollPosition: number;
  backRoute: string | null;
  community: RenderablePublishingChannel;
}

export const CommunityBanner = ({
  isOwnCommunity,
  scrollPosition,
  backRoute,
  community,
}: CommunityBannerProps) => {
  return (
    <Wrapper>
      <Flex css={{ gap: "$3", alignItems: "center" }}>
        {backRoute && (
          <Link href={backRoute} passHref>
            <Box as="a" css={{ color: "$text" }}>
              <ArrowLeftIcon />
            </Box>
          </Link>
        )}
        <Avatar
          alt={`+${community.name}'s profile picture`}
          src={community.profilePictureTemporaryUrl}
          size="$7"
        />
        <CommunityName>+{community.name}</CommunityName>
      </Flex>
      <AnimatePresence>
        {scrollPosition > 0 && !isOwnCommunity && (
          <motion.div
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FollowCommunityButton
              communityId={community.publishingChannelId}
              communityName={community.name}
              followingStatus={community.followingStatusOfClientToPublishingChannel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

const Wrapper = styled("div", translucentBg, {
  position: "sticky",
  top: 0,
  zIndex: 2,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  p: "$4",
});

// TODO: Make bold variants of regular fonts
const CommunityName = styled("div", {
  fontFamily: "$body",
  fontWeight: "$bold",
  fontSize: "$3",
});
