import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";

export enum ContentFilterType {
  FollowingUsers = "Following",
  Hashtag = "#",
  User = "@",
}

export interface ContentFilter {
  id: string;
  type: ContentFilterType;
  value: string;
}

export const useGetContentFilters = () => {
  const defaultFilters = [
    { id: "following", type: ContentFilterType.FollowingUsers, value: "" },
  ];

  const { data, ...queryResult } = useQuery([CacheKeys.ContentFilters], async () => {
    // TODO: Fetch filters from the backend
    return [];
  });

  return { data: defaultFilters.concat(data ?? []), ...queryResult };
};
