import { useMutation, useQueryClient } from "react-query";
import { Api } from "../..";

export const useGetPageOfUsersFollowedByUserId = ({
  userIdBeingFollowed,
}: {
  userIdBeingFollowed: string;
  usernameBeingFollowed: string;
}) => {
  const queryClient = useQueryClient();
  console.log(queryClient);

  return useMutation(
    async () => {
      return await Api.followUser({ userIdBeingFollowed });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
        }
      },
    },
  );
};
