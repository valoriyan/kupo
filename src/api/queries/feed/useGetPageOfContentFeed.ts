import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import {
  Api,
  SuccessfulGetPageOfPostFromFollowedUsersResponse,
  UserContentFeedFilter,
  UserContentFeedFilterType,
} from "../..";

export const useGetPageOfContentFeed = ({
  contentFeedFilter,
}: {
  contentFeedFilter: UserContentFeedFilter;
}) => {
  const { type: filterType, value } = contentFeedFilter;
  return useInfiniteQuery<
    SuccessfulGetPageOfPostFromFollowedUsersResponse,
    Error,
    SuccessfulGetPageOfPostFromFollowedUsersResponse,
    string[]
  >(
    [CacheKeys.ContentFeed, filterType, value],
    ({ pageParam }) => {
      if (filterType === UserContentFeedFilterType.FollowingUsers) {
        return fetchPageOfContentFromFromFollowedUsers({ pageParam });
      } else if (filterType === UserContentFeedFilterType.Hashtag) {
        return fetchPageOfContentFromFromFollowedHashtag({ pageParam, hashtag: value });
      } else {
        // TODO: replace with posts by username
        return fetchPageOfContentFromFromFollowedUsername({ pageParam, userId: value });
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

async function fetchPageOfContentFromFromFollowedUsername({
  pageParam = undefined,
  userId,
}: {
  pageParam: string | undefined;
  userId: string;
}) {
  const res = await Api.getPageOfPostsPagination({
    userId,
    cursor: pageParam,
    pageSize: 5,
  });

  if (res.data.success) return res.data.success;
  throw new Error(res.data.error?.reason ?? "Unknown Error");
}
