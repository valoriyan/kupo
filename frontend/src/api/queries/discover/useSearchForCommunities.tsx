import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import {
  Api,
  SearchForPublishingChannelsRequestBody,
  SearchForPublishingChannelsSuccess,
} from "../..";

export const useSearchForPublishingChannels = ({
  query,
  pageNumber,
  pageSize,
}: SearchForPublishingChannelsRequestBody) => {
  return useQuery<SearchForPublishingChannelsSuccess, Error>(
    [CacheKeys.SearchForPublishingChannels, query, pageNumber, pageSize],
    async () => {
      const res = await Api.searchForPublishingChannels({ query, pageNumber, pageSize });

      if (res.data.success) return res.data.success;
      throw new Error(
        (res.data.error.reason as string) ?? "Failed to search for communities",
      );
    },
    { enabled: !!query, keepPreviousData: true },
  );
};
