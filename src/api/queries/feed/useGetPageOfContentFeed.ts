import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import {
  Api,
  GetPageOfPostFromFollowedUsersSuccess,
  RenderablePost,
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
    GetPageOfPostFromFollowedUsersSuccess,
    Error,
    GetPageOfPostFromFollowedUsersSuccess,
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
  username,
}: {
  pageParam: string | undefined;
  username: string;
}) {
  const res = await Api.getPostsByUsername({
    username,
    cursor: pageParam,
    pageSize: 5,
  });

  if (res.data.success) return res.data.success;
  throw new Error(res.data.error?.reason ?? "Unknown Error");
}

async function fetchPageOfAllPublishedItems({
  pageParam = undefined,
}: {
  pageParam: string | undefined;
}): Promise<GetPageOfPostFromFollowedUsersSuccess> {
  const res = await Api.getPageOfALLPUBLISHEDITEMS({
    cursor: pageParam,
    pageSize: 5,
  });

  if (res.data.success) {
    return {
      posts: res.data.success.renderablePublishedItems as unknown as RenderablePost[],
      previousPageCursor: res.data.success.previousPageCursor,
      nextPageCursor: res.data.success.nextPageCursor,
    };
  }
  throw new Error(res.data.error?.reason ?? "Unknown Error");
}
