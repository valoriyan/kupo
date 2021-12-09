import { useMutation, useQueryClient } from "react-query";
import { Api, RenderableUser, UnfollowUserRequestBody } from "../..";
import { CacheKeys } from "#/contexts/queryClient";

export const useUnfollowUser = (unfollowUserRequestBody: UnfollowUserRequestBody) => {
  const { userIdBeingUnfollowed } = unfollowUserRequestBody;
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.unfollowUser(unfollowUserRequestBody);
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          queryClient.setQueryData<RenderableUser | undefined>(
            [CacheKeys.User, userIdBeingUnfollowed],
            (queriedData) => {
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
            },
          );
        }
      },
    },
  );
};
