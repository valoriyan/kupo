import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "..";

export const useGetChatRooms = () => {
  return useQuery([CacheKeys.chatRooms], async () => {
    const res = await Api.getPageOfChatRooms({ pageSize: 5 });
    return res.data;
  });
};
