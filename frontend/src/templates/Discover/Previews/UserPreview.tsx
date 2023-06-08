import { RenderableUser } from "#/api";
import { Avatar } from "#/components/Avatar";
import { HashTag } from "#/components/HashTags";
import { Flex, Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { styled } from "#/styling";
import { goToUserProfilePage } from "#/templates/UserProfile";

export const UserPreview = ({ user }: { user: RenderableUser }) => {
  const hashtags = user.hashtags.filter((x) => x);

  return (
    <UserWrapper>
      <Flex css={{ alignItems: "center", gap: "$4" }}>
        <Avatar
          src={user.profilePictureTemporaryUrl}
          alt={`${user.username}'s profile picture`}
          size="$8"
          onClick={() => goToUserProfilePage(user.username)}
        />
        <UserName username={user.username} />
      </Flex>
      <Body>{user.shortBio}</Body>
      {!!hashtags.length && (
        <Flex css={{ gap: "$3" }}>
          {hashtags.map((hashtag) => (
            <HashTag key={hashtag} hashtag={hashtag} />
          ))}
        </Flex>
      )}
    </UserWrapper>
  );
};

const UserWrapper = styled(Stack, {
  gap: "$4",
  borderRadius: "$3",
  px: "$5",
  py: "$4",
  bg: "$background2",
  boxShadow: "$1",
});
