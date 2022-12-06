import { useGetFollowerUsers } from "#/api/queries/users/useGetFollowerUsers";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteList } from "#/components/InfiniteList";
import { Flex } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { useCurrentUserId } from "#/contexts/auth";
import { ListUser } from "../ListUser";

export const Followers = () => {
  const userId = useCurrentUserId();
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetFollowerUsers({ userId });

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
    return <ErrorMessage>You dont&apos;t have any followers yet</ErrorMessage>;
  }

  return (
    <InfiniteList
      hasNextPage={hasNextPage ?? false}
      isNextPageLoading={isFetchingNextPage}
      loadNextPage={fetchNextPage}
      data={users}
      renderItem={(index, user) => <ListUser key={user.userId} user={user} />}
    />
  );
};
