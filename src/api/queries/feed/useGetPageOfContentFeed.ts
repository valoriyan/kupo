import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfulGetPageOfPostFromFollowedUsersResponse } from "../..";
import {
  ContentFeedFilter,
  ContentFeedFilterType,
} from "#/templates/Home/ContentFeedContext";

export const useGetPageOfContentFeed = ({
  contentFeedFilter,
}: {
  contentFeedFilter: ContentFeedFilter;
}) => {
  if (contentFeedFilter.type === ContentFeedFilterType.FOLLOWING_USERS) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useInfiniteQuery<
      SuccessfulGetPageOfPostFromFollowedUsersResponse,
      Error,
      SuccessfulGetPageOfPostFromFollowedUsersResponse,
      string[]
    >(
      [CacheKeys.ContentFeed],
      ({ pageParam }) => {
        return fetchPageOfContentFromFromFollowedUsers({ pageParam });
      },
      {
        getPreviousPageParam: (lastPage) => lastPage.previousPageCursor,
      },
    );
  } else {
    const hashtag = contentFeedFilter.displayValue;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useInfiniteQuery<
      SuccessfulGetPageOfPostFromFollowedUsersResponse,
      Error,
      SuccessfulGetPageOfPostFromFollowedUsersResponse,
      string[]
    >(
      [CacheKeys.ContentFeed],
      ({ pageParam }) => {
        return fetchPageOfContentFromFromFollowedHashtag({ pageParam, hashtag });
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPageCursor,
      },
    );
  }
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
  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error?.reason);
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
  if (res.data && res.data.success) {
    const data = res.data.success;
    return data;
  }

  throw new Error(res.data.error?.reason);
}
