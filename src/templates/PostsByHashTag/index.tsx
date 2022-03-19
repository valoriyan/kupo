import { UserContentFeedFilterType } from "#/api";
import { useGetPageOfContentFeed } from "#/api/queries/feed/useGetPageOfContentFeed";
import { DetailLayout } from "#/components/DetailLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { goToPostPage } from "#/utils/generateLinkUrls";

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
    <DetailLayout heading={`#${hashTag}`}>
      {!isLoading && error ? (
        <ErrorArea>{error.message || "An Unexpected Error Occurred"}</ErrorArea>
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
