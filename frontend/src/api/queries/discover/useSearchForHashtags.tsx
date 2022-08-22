import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SearchForHashtagsRequestBody, SearchForHashtagsSuccess } from "../..";

export const useSearchForHashtags = ({
  query,
  pageNumber,
  pageSize,
}: SearchForHashtagsRequestBody) => {
  return useQuery<SearchForHashtagsSuccess, Error>(
    [CacheKeys.SearchForHashtags, query, pageNumber, pageSize],
    async () => {
      const res = await Api.searchForHashtags({ query, pageNumber, pageSize });

      if (res.data.success) return res.data.success;
      throw new Error(
        (res.data.error.reason as string) ?? "Failed to search for hashtags",
      );
    },
    { enabled: !!query, keepPreviousData: true },
  );
};
