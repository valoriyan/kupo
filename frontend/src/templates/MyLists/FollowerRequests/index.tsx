import { FollowRequestDecision } from "#/api";
import { useResolveFollowRequest } from "#/api/mutations/users/resolveFollowRequest";
import { useGetFollowerRequestUsers } from "#/api/queries/users/useGetFollowerRequestUsers";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteList } from "#/components/InfiniteList";
import { Flex } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { ListUser } from "../ListUser";

export const FollowerRequests = () => {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetFollowerRequestUsers();
  const { mutateAsync: resolveFollowRequest, isLoading: isResolvingFollowRequest } =
    useResolveFollowRequest();

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
    return <ErrorMessage>You don&apos;t have any follower requests</ErrorMessage>;
  }

  return (
    <InfiniteList
      hasNextPage={hasNextPage ?? false}
      isNextPageLoading={isFetchingNextPage}
      loadNextPage={fetchNextPage}
      data={users}
      renderItem={(index, user) => (
        <ListUser
          key={user.userId}
          user={user}
          additionalActions={[
            {
              variant: "danger",
              label: "Reject",
              onClick: () =>
                resolveFollowRequest({
                  decision: FollowRequestDecision.Reject,
                  userIdDoingFollowing: user.userId,
                }),
              isLoading: isResolvingFollowRequest,
              isDisabled: isResolvingFollowRequest,
            },
            {
              variant: "primary",
              label: "Accept",
              onClick: () =>
                resolveFollowRequest({
                  decision: FollowRequestDecision.Accept,
                  userIdDoingFollowing: user.userId,
                }),
              isLoading: isResolvingFollowRequest,
              isDisabled: isResolvingFollowRequest,
            },
          ]}
        />
      )}
    />
  );
};
