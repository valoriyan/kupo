import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import {
  Api,
  GetPublishedItemsFromFollowedUsersSuccess,
  RenderablePublishedItem,
  UserContentFeedFilterType,
} from "../..";

export const useGetPageOfContentFeed = ({
  filterType,
  filterValue,
}: {
  filterType: UserContentFeedFilterType;
  filterValue: string;
}) => {
  return useInfiniteQuery<
    GetPublishedItemsFromFollowedUsersSuccess,
    Error,
    GetPublishedItemsFromFollowedUsersSuccess,
    string[]
  >(
    [CacheKeys.ContentFeed, filterType, filterValue],
    ({ pageParam }) => {
      if (filterType === UserContentFeedFilterType.FollowingUsers) {
        return fetchPageOfContentFromFromFollowedUsers({ pageParam });
      } else if (filterType === UserContentFeedFilterType.Hashtag) {
        return fetchPageOfContentFromFromFollowedHashtag({
          pageParam,
          hashtag: filterValue,
        });
      } else if (filterType === UserContentFeedFilterType.AllPostsForAdmins) {
        return fetchPageOfAllPublishedItems({ pageParam });
      } else {
        return fetchPageOfContentFromFromFollowedUsername({
          pageParam,
          username: filterValue,
        });
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
  const res = await Api.getPublishedItemsFromFollowedUsers({
    cursor: pageParam,
    pageSize: 5,
  });

  if (res.data.success) return res.data.success;
  throw new Error((res.data.error.reason as string) ?? "Unknown Error");
}

async function fetchPageOfContentFromFromFollowedHashtag({
  pageParam = undefined,
  hashtag,
}: {
  pageParam: string | undefined;
  hashtag: string;
}) {
  const res = await Api.getPublishedItemsFromFollowedHashtag({
    hashtag,
    cursor: pageParam,
    pageSize: 5,
  });

  if (res.data.success) return res.data.success;
  throw new Error((res.data.error.reason as string) ?? "Unknown Error");
}

async function fetchPageOfContentFromFromFollowedUsername({
  pageParam = undefined,
  username,
}: {
  pageParam: string | undefined;
  username: string;
}) {
  const res = await Api.getPublishedItemsByUsername({
    username,
    cursor: pageParam,
    pageSize: 5,
  });

  if (res.data.success) return res.data.success;
  throw new Error((res.data.error.reason as string) ?? "Unknown Error");
}

async function fetchPageOfAllPublishedItems({
  pageParam = undefined,
}: {
  pageParam: string | undefined;
}): Promise<GetPublishedItemsFromFollowedUsersSuccess> {
  const res = await Api.getPageOfALLPUBLISHEDITEMS({
    cursor: pageParam,
    pageSize: 5,
  });

  if (res.data.success) {
    return {
      publishedItems: res.data.success
        .renderablePublishedItems as unknown as RenderablePublishedItem[],
      previousPageCursor: res.data.success.previousPageCursor,
      nextPageCursor: res.data.success.nextPageCursor,
    };
  }
  throw new Error((res.data.error.reason as string) ?? "Unknown Error");
}
