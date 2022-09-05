import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ProfilePrivacySetting, RenderableUser } from "#/api";
import { Avatar } from "#/components/Avatar";
import { ArrowLeftIcon } from "#/components/Icons";
import { Box, Flex } from "#/components/Layout";
import { styled } from "#/styling";
import { translucentBg } from "#/styling/mixins";
import { FollowButton } from "./FollowButton";

export interface ProfileBannerProps {
  isOwnProfile: boolean | undefined;
  user: RenderableUser;
  scrollPosition: number;
  backRoute: string | null;
}

export const ProfileBanner = ({
  isOwnProfile,
  user,
  scrollPosition,
  backRoute,
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
          alt={`@${user.username ?? "User"}'s profile picture`}
          src={user.profilePictureTemporaryUrl}
          size="$7"
        />
        <Username>@{user.username}</Username>
      </Flex>
      <AnimatePresence>
        {scrollPosition > 0 && !isOwnProfile && (
          <motion.div
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FollowButton
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
