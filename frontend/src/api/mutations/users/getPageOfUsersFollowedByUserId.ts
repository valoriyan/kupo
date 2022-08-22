import { useMutation } from "react-query";
import { Api } from "../..";

export const useGetPageOfUsersFollowedByUserId = ({
  userIdBeingFollowed,
}: {
  userIdBeingFollowed: string;
  usernameBeingFollowed: string;
}) => {
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
