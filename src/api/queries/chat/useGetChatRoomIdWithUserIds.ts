import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "../..";

export interface GetChatRoomIdArgs {
  userIds: Set<string>;
}

export const useGetChatRoomIdWithUserIds = ({ userIds }: GetChatRoomIdArgs) => {
  return useQuery(
    [CacheKeys.ChatRoomMembers, userIds],
    async () => {
      const res = await Api.doesChatRoomExistWithUserIds({
        userIds: Array.from(userIds),
      });

      console.log("res.data");
      console.log(res.data);
      if (!!res.data.success) {
        return res.data.success;
      }
      throw new Error(res.data.error!.reason);
    },
    { enabled: !!userIds && userIds.size > 0 },
  );
};
