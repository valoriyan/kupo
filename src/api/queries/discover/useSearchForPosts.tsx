import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SearchForPostsRequestBody, SearchForPostsSuccess } from "../..";

export const useSearchForPosts = ({
  query,
  pageNumber,
  pageSize,
}: SearchForPostsRequestBody) => {
  return useQuery<SearchForPostsSuccess, Error>(
    [CacheKeys.SearchForPosts, query, pageNumber, pageSize],
    async () => {
      const res = await Api.searchForPosts({ query, pageNumber, pageSize });

      if (res.data.success) return res.data.success;
      throw new Error(res.data.error?.reason ?? "Failed to search for posts");
    },
    { enabled: !!query, keepPreviousData: true },
  );
};
