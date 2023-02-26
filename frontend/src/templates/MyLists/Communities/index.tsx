import { useGetFollowingCommunities } from "#/api/queries/users/useGetFollowingCommunities";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteList } from "#/components/InfiniteList";
import { LoadingArea } from "#/components/LoadingArea";
import { ListCommunity } from "../ListCommunities";

export const Communities = () => {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetFollowingCommunities();

  if (error && !isLoading) {
    return <ErrorMessage>{error.message ?? "An error occurred"}</ErrorMessage>;
  }

  if (isLoading || !data) {
    return <LoadingArea size="md" />;
  }

  const communities = data.pages.flatMap((page) => page.publishingChannels);

  if (!communities.length) {
    return <ErrorMessage>You aren&apos;t following any communities yet</ErrorMessage>;
  }

  return (
    <InfiniteList
      hasNextPage={hasNextPage ?? false}
      isNextPageLoading={isFetchingNextPage}
      loadNextPage={fetchNextPage}
      data={communities}
      renderItem={(index, community) => (
        <ListCommunity key={community.publishingChannelId} community={community} />
      )}
    />
  );
};
