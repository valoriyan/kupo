import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "..";

export interface GetChatRoomIdArgs {
  userIds: Set<string>;
}

export const useGetChatRoomIdWithUserIds = ({ userIds }: GetChatRoomIdArgs) => {
  return useQuery([CacheKeys.chatRoomIds, userIds], async () => {
    const res = await Api.doesChatRoomExistWithUserIds({ userIds: Array.from(userIds) });

    if (!!res.data.success) {
      const chatroomId = res.data.success.chatRoomId;
      return chatroomId;
    }
    throw new Error(res.data.error!.reason);
  });
};
