import Router from "next/router";
import { FollowingStatus, RenderablePublishingChannel } from "#/api";
import { useFollowCommunity } from "#/api/mutations/community/followCommunity";
import { useUnfollowCommunity } from "#/api/mutations/community/unfollowCommunity";
import { Avatar } from "#/components/Avatar";
import { Button } from "#/components/Button";
import { CommunityName } from "#/components/CommunityName";
import { Flex } from "#/components/Layout";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { styled } from "#/styling";
import { getCommunityPageUrl } from "#/utils/generateLinkUrls";

export interface ListCommunityProps {
  community: RenderablePublishingChannel;
}

export const ListCommunity = ({ community }: ListCommunityProps) => {
  const profilePageUrl = getCommunityPageUrl({ name: community.name });
  const followingStatus = community.followingStatusOfClientToPublishingChannel;

  const { mutateAsync: followCommunity, isLoading: isFollowing } = useFollowCommunity({
    communityIdBeingFollowed: community.publishingChannelId,
    communityNameBeingFollowed: community.name,
  });

  const { mutateAsync: unfollowCommunity, isLoading: isUnfollowing } =
    useUnfollowCommunity({
      communityIdBeingUnfollowed: community.publishingChannelId,
      communityNameBeingUnfollowed: community.name,
    });

  const toggleFollow = () => {
    if (followingStatus === FollowingStatus.IsFollowing) {
      unfollowCommunity();
    } else followCommunity();
  };

  return (
    <Wrapper>
      <Flex css={{ gap: "$4", alignItems: "center" }}>
        <Avatar
          alt={`@${community.name}'s profile picture`}
          src={community.profilePictureTemporaryUrl}
          size="$8"
          onClick={() => Router.push(profilePageUrl)}
        />
        <CommunityName name={community.name} />
      </Flex>
      <Flex css={{ gap: "$6" }}>
        <Button
          size="sm"
          outlined
          variant={
            followingStatus === FollowingStatus.IsFollowing ? "secondary" : "primary"
          }
          onClick={toggleFollow}
          disabled={isFollowing || isUnfollowing}
        >
          <TextOrSpinner isLoading={isFollowing || isUnfollowing}>
            {followingStatus === FollowingStatus.IsFollowing
              ? "Unfollow"
              : followingStatus === FollowingStatus.Pending
              ? "Pending"
              : "Follow"}
          </TextOrSpinner>
        </Button>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "flex",
  px: "$5",
  py: "$4",
  gap: "$4",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "solid $borderWidths$1 $border",
});
