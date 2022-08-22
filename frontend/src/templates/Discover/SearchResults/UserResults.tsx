import { useEffect, useState } from "react";
import { RenderableUser } from "#/api";
import { useSearchForUsers } from "#/api/queries/discover/useSearchForUsers";
import { Avatar } from "#/components/Avatar";
import { HashTag } from "#/components/HashTags";
import { Flex, Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { styled } from "#/styling";
import { goToUserProfilePage } from "#/templates/UserProfile";
import { ResultsWrapper } from "./ResultsWrapper";

export interface UserResultsProps {
  query: string;
}

export const UserResults = ({ query }: UserResultsProps) => {
  const [page, setPage] = useState(0);
  const pageSize = 6;

  const { data, isLoading, isError } = useSearchForUsers({
    query,
    pageNumber: page + 1,
    pageSize,
  });

  useEffect(() => {
    setPage(0);
  }, [query]);

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
      totalCount={data?.totalCount}
      pageSize={pageSize}
      page={page}
      setPage={setPage}
    >
      {!data ? null : (
        <Stack css={{ gap: "$3", width: "100%" }}>
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
