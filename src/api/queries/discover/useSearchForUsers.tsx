import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SearchForUsersParams, SearchForUsersSuccess } from "../..";

export const useSearchForUsers = ({ query, cursor, pageSize }: SearchForUsersParams) => {
  return useQuery<SearchForUsersSuccess, Error>(
    [CacheKeys.SearchForUsers, query, cursor, pageSize],
    async () => {
      const res = await Api.searchForUsers({
        query,
        cursor,
        pageSize,
      });

      if (res.data.success) {
        return res.data.success;
      }
      throw new Error(res.data.error?.reason ?? "Failed to search for users");
    },
    { enabled: !!query },
  );
};
