import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SearchForHashtagsRequestBody, SearchForHashtagsSuccess } from "../..";

export const useSearchForHashtags = ({
  query,
  cursor,
  pageSize,
}: SearchForHashtagsRequestBody) => {
  return useQuery<SearchForHashtagsSuccess, Error>(
    [CacheKeys.SearchForHashtags, query, cursor, pageSize],
    async () => {
      const res = await Api.searchForHashtags({
        query,
        cursor,
        pageSize,
      });

      if (res.data.success) {
        return res.data.success;
      }
      throw new Error(res.data.error?.reason ?? "Failed to search for hashtags");
    },
    { enabled: !!query },
  );
};
