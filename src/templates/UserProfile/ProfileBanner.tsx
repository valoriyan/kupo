import { RenderableUser } from "#/api";
import { Avatar } from "#/components/Avatar";
import { Flex } from "#/components/Layout";
import { Heading } from "#/components/Typography";
import { MAX_APP_CONTENT_WIDTH } from "#/constants";
import { styled } from "#/styling";
import { FollowButton } from "./FollowButton";

export interface ProfileBannerProps {
  isOwnProfile: boolean | undefined;
  user: RenderableUser;
  scrollPosition: number;
}

export const ProfileBanner = ({
  isOwnProfile,
  user,
  scrollPosition,
}: ProfileBannerProps) => {
  return (
    <Wrapper css={{ transform: `translateY(${scrollPosition > 0 ? "0%" : "-100%"})` }}>
      <Flex css={{ gap: "$3", alignItems: "center" }}>
        <Avatar
          alt={`@${user.username ?? "User"}'s profile picture`}
          src={user.profilePictureTemporaryUrl}
          size="$7"
        />
        <Username>@{user.username}</Username>
      </Flex>
      {!isOwnProfile && (
        <FollowButton
          userId={user.userId}
          username={user.username}
          isBeingFollowedByClient={user.isBeingFollowedByClient}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  maxWidth: MAX_APP_CONTENT_WIDTH,
  zIndex: 1,
  p: "$4",
  bg: "$heavyOverlay",
  backdropFilter: "blur($sizes$4)",
  transition: "transform $1 ease",
});

const Username = styled(Heading, { fontWeight: "$bold" });
