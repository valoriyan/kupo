import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfullyDeterminedIfChatRoomExistsWithUserIdsResponse } from "../..";

export interface GetChatRoomIdArgs {
  userIds: string[];
}

export const useGetChatRoomIdWithUserIds = ({ userIds }: GetChatRoomIdArgs) => {
  return useQuery<SuccessfullyDeterminedIfChatRoomExistsWithUserIdsResponse, Error>(
    [CacheKeys.ChatRoomMembers, userIds],
    async () => {
      const res = await Api.doesChatRoomExistWithUserIds({
        userIds,
      });

      if (res.data.success) {
        return res.data.success;
      }
      throw new Error(res.data.error?.reason ?? "Failed to look up chat room");
    },
    { enabled: !!userIds.length },
  );
};
