import { useGetFollowingUsers } from "#/api/queries/users/useGetFollowingUsers";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteList } from "#/components/InfiniteList";
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
    return <LoadingArea size="md" />;
  }

  const users = data.pages.flatMap((page) => page.users);

  if (!users.length) {
    return <ErrorMessage>You aren&apos;t following anyone yet</ErrorMessage>;
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
