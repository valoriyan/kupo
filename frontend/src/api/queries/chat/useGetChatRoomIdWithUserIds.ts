import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, DoesChatRoomExistWithUserIdsSuccess } from "../..";

export interface GetChatRoomIdArgs {
  userIds: string[];
}

export const useGetChatRoomIdWithUserIds = ({ userIds }: GetChatRoomIdArgs) => {
  return useQuery<DoesChatRoomExistWithUserIdsSuccess, Error>(
    [CacheKeys.ChatRoomMembers, userIds],
    async () => {
      const res = await Api.doesChatRoomExistWithUserIds({
        userIds,
      });

      if (res.data.success) {
        return res.data.success;
      }
      throw new Error((res.data.error.reason as string) ?? "Failed to look up chat room");
    },
    { enabled: !!userIds.length },
  );
};
