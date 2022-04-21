import Router from "next/router";
import { RenderableUser } from "#/api";
import { useSearchForUsers } from "#/api/queries/discover/useSearchForUsers";
import { Avatar } from "#/components/Avatar";
import { HashTag } from "#/components/HashTags";
import { Flex, Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { styled } from "#/styling";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { ResultsWrapper } from "./ResultsWrapper";

export interface UserResultsProps {
  query: string;
}

export const UserResults = ({ query }: UserResultsProps) => {
  const { data, isLoading, isError } = useSearchForUsers({ query, pageSize: 5 });

  return (
    <ResultsWrapper
      heading="Users"
      isLoading={isLoading}
      errorMessage={
        isError
          ? "Failed to search users"
          : data && !data.users.length
          ? "No Results Found"
          : undefined
      }
    >
      {!data ? null : (
        <Stack css={{ gap: "$3" }}>
          {data.users.map((user) => (
            <UserPreview key={user.userId} user={user} />
          ))}
        </Stack>
      )}
    </ResultsWrapper>
  );
};

const UserPreview = ({ user }: { user: RenderableUser }) => {
  const hashtags = user.hashtags.filter((x) => x);
  const profileUrl = getProfilePageUrl({ username: user.username });

  return (
    <UserWrapper>
      <Flex css={{ alignItems: "center", gap: "$4" }}>
        <Avatar
          src={user.profilePictureTemporaryUrl}
          alt={`${user.username}'s profile picture`}
          size="$8"
          onClick={() => Router.push(profileUrl)}
        />
        <UserName username={user.username} />
      </Flex>
      <Body>{user.shortBio}</Body>
      {!!hashtags.length && (
        <Flex css={{ gap: "$3" }}>
          {hashtags.map((hashtag) => (
            <HashTag key={hashtag} hashtag={hashtag} outlined />
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
