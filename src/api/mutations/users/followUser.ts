import { useMutation, useQueryClient } from "react-query";
import { Api, FollowUserRequestBody, RenderableUser } from "../..";
import { CacheKeys } from "#/contexts/queryClient";

export const useFollowUser = (followUserProfileRequestBody: FollowUserRequestBody) => {
  const { userIdBeingFollowed } = followUserProfileRequestBody;
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.followUser(followUserProfileRequestBody);
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          queryClient.setQueryData<RenderableUser | undefined>(
            [CacheKeys.User, userIdBeingFollowed],
            (queriedData) => {
              console.log("queriedData", queriedData);
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
            },
          );
        }
      },
    },
  );
};
