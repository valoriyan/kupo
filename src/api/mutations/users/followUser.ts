import { useMutation, useQueryClient } from "react-query";
import { Api, RenderableUser } from "../..";
import { UpdateQueriedUserDataFunction, updateUsersCache } from "./utilities";

export const useFollowUser = ({
  userIdBeingFollowed,
  usernameBeingFollowed,
}: {
  userIdBeingFollowed: string;
  usernameBeingFollowed: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.followUser({ userIdBeingFollowed });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          const updateQueriedUserDataFunction: UpdateQueriedUserDataFunction = (
            queriedData: RenderableUser | undefined,
          ) => {
            if (!!queriedData) {
              return {
                ...queriedData,
                followers: {
                  ...queriedData.followers,
                  count: queriedData.followers.count + 1,
                },
                isBeingFollowedByClient: true,
              };
            }

            return queriedData;
          };

          updateUsersCache({
            updateQueriedUserDataFunction,
            queryClient,
            userId: userIdBeingFollowed,
            username: usernameBeingFollowed,
          });
        }
      },
    },
  );
};
