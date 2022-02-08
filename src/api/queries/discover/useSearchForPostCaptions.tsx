import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SearchForPostCaptionsParams, SearchForPostCaptionsSuccess } from "../..";

export const useSearchForPostCaptions = ({
  query,
  cursor,
  pageSize,
}: SearchForPostCaptionsParams) => {
  return useQuery<SearchForPostCaptionsSuccess, Error>(
    [CacheKeys.SearchForPostCaptions, query, cursor, pageSize],
    async () => {
      const res = await Api.searchForPostCaptions({
        query,
        cursor,
        pageSize,
      });

      if (res.data.success) {
        return res.data.success;
      }
      throw new Error(res.data.error?.reason ?? "Failed to search for post captions");
    },
    { enabled: !!query },
  );
};
