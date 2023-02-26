import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ProfilePrivacySetting, RenderableUser } from "#/api";
import { Avatar } from "#/components/Avatar";
import { FollowUserButton } from "#/components/FollowButton";
import { ArrowLeftIcon } from "#/components/Icons";
import { Box, Flex } from "#/components/Layout";
import { styled } from "#/styling";
import { translucentBg } from "#/styling/mixins";

export interface ProfileBannerProps {
  isOwnProfile: boolean | undefined;
  scrollPosition: number;
  backRoute: string | null;
  user: RenderableUser;
}

export const ProfileBanner = ({
  isOwnProfile,
  scrollPosition,
  backRoute,
  user,
}: ProfileBannerProps) => {
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
          alt={`@${user.username}'s profile picture`}
          src={user.profilePictureTemporaryUrl}
          size="$7"
        />
        <Username onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          @{user.username}
        </Username>
      </Flex>
      <AnimatePresence>
        {scrollPosition > 0 && !isOwnProfile && (
          <motion.div
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FollowUserButton
              userId={user.userId}
              username={user.username}
              isUserPrivate={user.profilePrivacySetting === ProfilePrivacySetting.Private}
              followingStatus={user.followingStatusOfClientToUser}
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
const Username = styled("div", {
  fontFamily: "$body",
  fontWeight: "$bold",
  fontSize: "$3",
});
