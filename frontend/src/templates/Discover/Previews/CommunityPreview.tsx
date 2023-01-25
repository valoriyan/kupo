import { RenderablePublishingChannel } from "#/api";
import { Avatar } from "#/components/Avatar";
import { CommunityName } from "#/components/CommunityName";
import { Flex, Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { styled } from "#/styling";
import { goToCommunityPage } from "#/templates/CommunityPage";

export const CommunityPreview = ({
  community,
}: {
  community: RenderablePublishingChannel;
}) => {
  return (
    <CommunityWrapper>
      <Flex css={{ alignItems: "center", gap: "$4" }}>
        <Avatar
          src={community.profilePictureTemporaryUrl}
          alt={`${community.name}'s profile picture`}
          size="$8"
          onClick={() => goToCommunityPage(community.name)}
        />
        <CommunityName name={community.name} />
      </Flex>
      <Body>{community.description}</Body>
    </CommunityWrapper>
  );
};

const CommunityWrapper = styled(Stack, {
  gap: "$4",
  borderRadius: "$3",
  px: "$5",
  py: "$4",
  bg: "$background2",
  boxShadow: "$1",
});
