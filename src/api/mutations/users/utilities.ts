import { QueryClient } from "react-query";
import { RenderableUser } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export type UpdateQueriedUserDataFunction = (
  queriedData: RenderableUser | undefined,
) => RenderableUser | undefined;

const updateUsersByIdCache = ({
  updateQueriedUserDataFunction,
  queryClient,
  userId,
}: {
  updateQueriedUserDataFunction: UpdateQueriedUserDataFunction;
  queryClient: QueryClient;
  userId: string;
}) => {
  const queryKey = [CacheKeys.UserById, userId];

  queryClient.setQueryData<RenderableUser | undefined>(
    queryKey,
    updateQueriedUserDataFunction,
  );
};

const updateUsersByUsernameCache = ({
  updateQueriedUserDataFunction,
  queryClient,
  username,
}: {
  updateQueriedUserDataFunction: UpdateQueriedUserDataFunction;
  queryClient: QueryClient;
  username: string;
}) => {
  const queryKey = [CacheKeys.UserByUsername, username];

  queryClient.setQueryData<RenderableUser | undefined>(
    queryKey,
    updateQueriedUserDataFunction,
  );
};

export const updateUsersCache = ({
  updateQueriedUserDataFunction,
  queryClient,
  userId,
  username,
}: {
  updateQueriedUserDataFunction: UpdateQueriedUserDataFunction;
  queryClient: QueryClient;
  userId: string;
  username: string;
}) => {
  updateUsersByIdCache({
    updateQueriedUserDataFunction,
    queryClient,
    userId,
  });

  updateUsersByUsernameCache({
    updateQueriedUserDataFunction,
    queryClient,
    username,
  });
};
