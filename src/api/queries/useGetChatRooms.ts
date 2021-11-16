import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "..";

export interface GetChatRoomsArgs {
  cursor?: string;
}


export const useGetChatRooms = ({ cursor }: GetChatRoomsArgs) => {
  return useQuery([CacheKeys.chatRooms, cursor], async () => {
    const res = await Api.getPageOfChatRooms({ cursor, pageSize: 5 });
    return res.data;
  });
};
