import Router from "next/router";
import { RenderablePost, UserContentFeedFilterType } from "#/api";
import { useGetPageOfContentFeed } from "#/api/queries/feed/useGetPageOfContentFeed";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { DEFAULT_EOL_MESSAGE, InfiniteList } from "#/components/InfiniteList";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { getPostsByHashtagUrl } from "#/utils/generateLinkUrls";
import { SessionStorage } from "#/utils/storage";
import { goToPostPage } from "../SinglePost";

const PREVIOUS_LOCATION_BASE_KEY = "previous-location-post-by-hashtag";

export const setPreviousLocationForHashTagPage = (hashtag: string) => {
  SessionStorage.setItem<string>(PREVIOUS_LOCATION_BASE_KEY + hashtag, Router.asPath);
};

export const goToPostByHashTagPage = (hashtag: string) => {
  setPreviousLocationForHashTagPage(hashtag);
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

  const backHref =
    SessionStorage.getItem<string>(PREVIOUS_LOCATION_BASE_KEY + hashTag) ?? "/feed";

  return (
    <StandardPageLayout heading={`#${hashTag}`} backHref={backHref}>
      {!isLoading && error ? (
        <ErrorArea>{error.message || "An error occurred"}</ErrorArea>
      ) : isLoading || !posts ? (
        <LoadingArea size="lg" />
      ) : (
        <InfiniteList
          hasNextPage={hasNextPage ?? false}
          isNextPageLoading={isFetchingNextPage}
          loadNextPage={fetchNextPage}
          data={posts as unknown as RenderablePost[]}
          renderItem={(index, post) => (
            <Post
              key={post.id}
              post={post}
              handleClickOfCommentsButton={() => goToPostPage(post.id)}
            />
          )}
          endOfListMessage={DEFAULT_EOL_MESSAGE}
        />
      )}
    </StandardPageLayout>
  );
};
