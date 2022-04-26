import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SearchForUsersRequestBody, SearchForUsersSuccess } from "../..";

export const useSearchForUsers = ({
  query,
  pageNumber,
  pageSize,
}: SearchForUsersRequestBody) => {
  return useQuery<SearchForUsersSuccess, Error>(
    [CacheKeys.SearchForUsers, query, pageNumber, pageSize],
    async () => {
      const res = await Api.searchForUsers({ query, pageNumber, pageSize });

      if (res.data.success) return res.data.success;
      throw new Error(res.data.error?.reason ?? "Failed to search for users");
    },
    { enabled: !!query, keepPreviousData: true },
  );
};
