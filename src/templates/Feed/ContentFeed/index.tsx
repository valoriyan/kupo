import { ContentFilter } from "#/api/queries/feed/useGetContentFilters";
import { useGetPageOfContentFeed } from "#/api/queries/feed/useGetPageOfContentFeed";
import { ErrorMessage } from "#/components/ErrorArea";
import { Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { styled } from "#/styling";
import { PostWrapper } from "./PostWrapper";

export interface ContentFeedProps {
  selectedContentFilter: ContentFilter;
}

export const ContentFeed = ({ selectedContentFilter }: ContentFeedProps) => {
  const infiniteQueryResultOfFetchingPageOfContentFromFollowedUsers =
    useGetPageOfContentFeed({ contentFeedFilter: selectedContentFilter });

  const {
    data: pagesOfContentFromFrollowedUsers,
    isError: isErrorAcquiringPagesOfContentFromFrollowedUsers,
    isLoading: isLoadingPagesOfContentFromFrollowedUsers,
    error: errorAcquiringPagesOfContentFromFrollowedUsers,
  } = infiniteQueryResultOfFetchingPageOfContentFromFollowedUsers;

  if (
    isErrorAcquiringPagesOfContentFromFrollowedUsers &&
    !isLoadingPagesOfContentFromFrollowedUsers
  ) {
    return (
      <ErrorMessage>
        Error:{" "}
        {errorAcquiringPagesOfContentFromFrollowedUsers?.message ?? "Unknown Error"}
      </ErrorMessage>
    );
  }

  if (isLoadingPagesOfContentFromFrollowedUsers || !pagesOfContentFromFrollowedUsers) {
    return <LoadingArea size="lg" />;
  }

  const posts = pagesOfContentFromFrollowedUsers.pages.flatMap((page) => {
    return page.posts;
  });

  const renderedPosts =
    posts.length === 0 ? (
      <ErrorMessage>No Posts Found</ErrorMessage>
    ) : (
      posts.map((post) => {
        return <PostWrapper key={post.postId} post={post} />;
      })
    );

  return (
    <Grid>
      <ContentItemsList>{renderedPosts}</ContentItemsList>
    </Grid>
  );
};

const Grid = styled("div", {
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  height: "100%",
  width: "100%",
});

const ContentItemsList = styled(Stack, {
  height: "100%",
  overflow: "auto",
  gap: "$2",
  py: "$2",
  "> *:not(:last-child)": {
    borderBottom: "solid $borderWidths$1 $border",
  },
});
