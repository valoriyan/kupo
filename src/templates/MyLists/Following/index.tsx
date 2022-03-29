import { useGetFollowingUsers } from "#/api/queries/users/useGetFollowingUsers";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { Flex, Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { useCurrentUserId } from "#/contexts/auth";
import { ListUser } from "../ListUser";

export const Following = () => {
  const userId = useCurrentUserId();
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetFollowingUsers({ userId });

  if (error && !isLoading) {
    return <ErrorMessage>{error.message ?? "An error occurred"}</ErrorMessage>;
  }

  if (isLoading || !data) {
    return (
      <Flex css={{ p: "$5" }}>
        <LoadingArea size="md" />
      </Flex>
    );
  }

  const users = data.pages.flatMap((page) => page.users);

  if (!users.length) {
    return <ErrorMessage>You aren&apos;t following anyone yet</ErrorMessage>;
  }

  return (
    <Stack css={{ size: "100%" }}>
      <InfiniteScrollArea
        hasNextPage={hasNextPage ?? false}
        isNextPageLoading={isFetchingNextPage}
        loadNextPage={fetchNextPage}
        items={users.map((user) => (
          <ListUser key={user.userId} user={user} />
        ))}
      />
    </Stack>
  );
};
