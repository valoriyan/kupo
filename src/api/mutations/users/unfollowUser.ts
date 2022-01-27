import { useMutation, useQueryClient } from "react-query";
import { Api, RenderableUser } from "../..";
import { UpdateQueriedUserDataFunction, updateUsersCache } from "./utilities";

export const useUnfollowUser = ({
  userIdBeingUnfollowed,
  usernameBeingUnfollowed,
}: {
  userIdBeingUnfollowed: string;
  usernameBeingUnfollowed: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.unfollowUser({ userIdBeingUnfollowed });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          const updateQueriedUserDataOperation: UpdateQueriedUserDataFunction = (
            queriedData: RenderableUser | undefined,
          ) => {
            if (!!queriedData) {
              return {
                ...queriedData,
                followers: {
                  ...queriedData.followers,
                  count: queriedData.followers.count - 1,
                },
                isBeingFollowedByClient: false,
              };
            }

            return queriedData;
          };

          updateUsersCache({
            updateQueriedUserDataFunction: updateQueriedUserDataOperation,
            queryClient,
            userId: userIdBeingUnfollowed,
            username: usernameBeingUnfollowed,
          });
        }
      },
    },
  );
};
