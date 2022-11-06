import { useGetFollowingCommunities } from "#/api/queries/users/useGetFollowingCommunities";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { Flex } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { ListCommunity } from "../ListCommunities";

export const Communities = () => {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetFollowingCommunities();

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

  const communities = data.pages.flatMap((page) => page.publishingChannels);

  if (!communities.length) {
    return <ErrorMessage>You aren&apos;t following any communities yet</ErrorMessage>;
  }

  return (
    <InfiniteScrollArea
      hasNextPage={hasNextPage ?? false}
      isNextPageLoading={isFetchingNextPage}
      loadNextPage={fetchNextPage}
      items={communities.map((community) => (
        <ListCommunity key={community.publishingChannelId} community={community} />
      ))}
    />
  );
};
