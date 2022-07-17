import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, UserContentFeedFilter, UserContentFeedFilterType } from "#/api";

export const useGetContentFilters = ({ clientUserId }: { clientUserId: string }) => {
  const defaultFilters: UserContentFeedFilter[] = [
    {
      contentFeedFilterId: "following",
      userId: clientUserId,
      type: UserContentFeedFilterType.FollowingUsers,
      value: "",
      creationTimestamp: Date.now(),
    },
  ];

  const { data, ...queryResult } = useQuery([CacheKeys.ContentFilters], async () => {
    const response = await Api.getUserContentFeedFilters({});
    if (response.data.success) return response.data.success.userContentFeedFilters;
    throw new Error((response.data.error.reason as string) ?? "Unknown Error");
  });

  return { data: defaultFilters.concat(data ?? []), ...queryResult };
};
