import Router from "next/router";
import { UserContentFeedFilterType } from "#/api";
import { useGetPageOfContentFeed } from "#/api/queries/feed/useGetPageOfContentFeed";
import { DetailLayout } from "#/components/DetailLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { getPostsByHashtagUrl } from "#/utils/generateLinkUrls";
import { SessionStorageItem } from "#/utils/storage";
import { goToPostPage } from "../SinglePost";

const previousLocation = SessionStorageItem<string>("previous-location-post-by-hashtag");

export const goToPostByHashTagPage = (hashtag: string) => {
  previousLocation.set(Router.asPath);
  Router.push(getPostsByHashtagUrl(hashtag));
};

export interface PostsByHashTagProps {
  hashTag: string;
}

export const PostsByHashTag = ({ hashTag }: PostsByHashTagProps) => {
  const { data, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPageOfContentFeed({
      filterType: UserContentFeedFilterType.Hashtag,
      filterValue: hashTag,
    });

  const posts = data?.pages.flatMap((page) => page.posts);

  return (
    <DetailLayout heading={`#${hashTag}`} backRoute={previousLocation.get() ?? "/feed"}>
      {!isLoading && error ? (
        <ErrorArea>{error.message || "An error occurred"}</ErrorArea>
      ) : isLoading || !posts ? (
        <LoadingArea size="lg" />
      ) : (
        <Stack css={{ height: "100%", width: "100%" }}>
          <InfiniteScrollArea
            hasNextPage={hasNextPage ?? false}
            isNextPageLoading={isFetchingNextPage}
            loadNextPage={fetchNextPage}
            items={posts.map((post) => (
              <Post
                key={post.postId}
                post={post}
                handleClickOfCommentsButton={() => goToPostPage(post.postId)}
              />
            ))}
          />
        </Stack>
      )}
    </DetailLayout>
  );
};
