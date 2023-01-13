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
    { status: number; message: string },
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
      } else if (filterType === UserContentFeedFilterType.PublishingChannel) {
        return fetchPageOfContentFromFromPublishingChannel({
          pageParam,
          publishingChannelName: filterValue,
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
      retry: (failureCount, error) => {
        const statusCode = error.status;
        if (statusCode === 404) return false;
        if (failureCount > 2) return false;
        return true;
      },
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
  throw {
    status: res.status,
    message:
      res.status === 404 ? "No posts not found" : "Failed to fetch posts from followers",
  };
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
  throw {
    status: res.status,
    message:
      res.status === 404 ? "No tagged posts found" : "Failed to fetch posts with tag",
  };
}

async function fetchPageOfContentFromFromPublishingChannel({
  pageParam = undefined,
  publishingChannelName,
}: {
  pageParam: string | undefined;
  publishingChannelName: string;
}) {
  const res = await Api.getPublishedItemsInPublishingChannel({
    publishingChannelName,
    cursor: pageParam,
    pageSize: 5,
  });
  if (res.data.success) return res.data.success;
  throw {
    status: res.status,
    message:
      res.status === 404 ? "Community not found" : "Failed to fetch community's posts",
  };
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
  throw {
    status: res.status,
    message: res.status === 404 ? "User not found" : "Failed to fetch user's posts",
  };
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
  throw {
    status: res.status,
    message: res.status === 404 ? "No posts found" : "Failed to fetch posts",
  };
}
