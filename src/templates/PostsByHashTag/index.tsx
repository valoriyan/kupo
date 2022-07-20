import Router from "next/router";
import { RenderablePost, UserContentFeedFilterType } from "#/api";
import { useGetPageOfContentFeed } from "#/api/queries/feed/useGetPageOfContentFeed";
import { DetailLayout } from "#/components/DetailLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { getPostsByHashtagUrl } from "#/utils/generateLinkUrls";
import { SessionStorage } from "#/utils/storage";
import { goToPostPage } from "../SinglePost";

const PREVIOUS_LOCATION_BASE_KEY = "previous-location-post-by-hashtag";

export const goToPostByHashTagPage = (hashtag: string) => {
  SessionStorage.setItem<string>(PREVIOUS_LOCATION_BASE_KEY + hashtag, Router.asPath);
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

  const posts = data?.pages.flatMap((page) => page.publishedItems);

  const backRoute =
    SessionStorage.getItem<string>(PREVIOUS_LOCATION_BASE_KEY + hashTag) ?? "/feed";

  return (
    <DetailLayout heading={`#${hashTag}`} backRoute={backRoute}>
      {!isLoading && error ? (
        <ErrorArea>{error.message || "An error occurred"}</ErrorArea>
      ) : isLoading || !posts ? (
        <LoadingArea size="lg" />
      ) : (
        <InfiniteScrollArea
          hasNextPage={hasNextPage ?? false}
          isNextPageLoading={isFetchingNextPage}
          loadNextPage={fetchNextPage}
          items={posts.map((post) => (
            <Post
              key={post.id}
              post={post as unknown as RenderablePost}
              handleClickOfCommentsButton={() => goToPostPage(post.id)}
            />
          ))}
        />
      )}
    </DetailLayout>
  );
};
