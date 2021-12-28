import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfulGetPageOfPostFromFollowedUsersResponse } from "../..";
import { ContentFilter, ContentFilterType } from "./useGetContentFilters";

export const useGetPageOfContentFeed = ({
  contentFeedFilter,
}: {
  contentFeedFilter: ContentFilter;
}) => {
  const { type: filterType, value: hashtag } = contentFeedFilter;
  return useInfiniteQuery<
    SuccessfulGetPageOfPostFromFollowedUsersResponse,
    Error,
    SuccessfulGetPageOfPostFromFollowedUsersResponse,
    string[]
  >(
    [CacheKeys.ContentFeed, filterType, hashtag],
    ({ pageParam }) => {
      if (filterType === ContentFilterType.FollowingUsers) {
        return fetchPageOfContentFromFromFollowedUsers({ pageParam });
      } else {
        return fetchPageOfContentFromFromFollowedHashtag({ pageParam, hashtag });
      }
    },
    {
      getPreviousPageParam: (lastPage) => lastPage.previousPageCursor,
      getNextPageParam: (lastPage) => lastPage.nextPageCursor,
    },
  );
};

async function fetchPageOfContentFromFromFollowedUsers({
  pageParam = undefined,
}: {
  pageParam: string | undefined;
}) {
  const res = await Api.getPageOfPostFromFollowedUsers({
    cursor: pageParam,
    pageSize: 5,
  });

  if (res.data.success) return res.data.success;
  throw new Error(res.data.error?.reason ?? "Unknown Error");
}

async function fetchPageOfContentFromFromFollowedHashtag({
  pageParam = undefined,
  hashtag,
}: {
  pageParam: string | undefined;
  hashtag: string;
}) {
  const res = await Api.getPageOfPostFromFollowedHashtag({
    hashtag,
    cursor: pageParam,
    pageSize: 5,
  });

  if (res.data.success) return res.data.success;
  throw new Error(res.data.error?.reason ?? "Unknown Error");
}
