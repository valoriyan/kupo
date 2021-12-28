import { useGetPageOfContentFeed } from "#/api/queries/feed/useGetPageOfContentFeed";
import { ErrorMessage } from "#/components/ErrorArea";
import { ChevronDownIcon, SearchIcon } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Tabs } from "#/components/Tabs";
import { styled } from "#/styling";
import { ContentFeedPostBox } from "./ContentFeedPostBox";

export enum ContentFilterType {
  FollowingUsers = "Following",
  Hashtag = "#",
  User = "@",
}

export interface ContentFilter {
  id: string;
  type: ContentFilterType;
  value: string;
}

export const Home = () => {
  // Eventually turn into hook that fetches filters from server
  const contentFilters: ContentFilter[] = [
    { id: "following", type: ContentFilterType.FollowingUsers, value: "" },
    { id: "cute", type: ContentFilterType.Hashtag, value: "cute" },
    { id: "ugly", type: ContentFilterType.Hashtag, value: "ugly" },
  ];

  return (
    <Tabs
      ariaLabel="Content Filters"
      tabs={contentFilters.map((filter) => ({
        id: filter.id,
        trigger: filter.type + filter.value,
        content: <ContentFeed selectedContentFilter={filter} />,
      }))}
      headerRightContent={
        <Flex css={{ gap: "$5", px: "$3", alignItems: "center" }}>
          <ChevronDownIcon />
          <SearchIcon />
        </Flex>
      }
    />
  );
};

interface ContentFeedProps {
  selectedContentFilter: ContentFilter;
}

const ContentFeed = ({ selectedContentFilter }: ContentFeedProps) => {
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
        return <ContentFeedPostBox key={post.postId} post={post} />;
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
