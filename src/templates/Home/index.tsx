import { ChevronDownIcon, SearchIcon } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { SlideDownDialog } from "#/components/SlideDownDialog";
import { Tabs } from "#/components/Tabs";
import { ContentFeed } from "./ContentFeed";
import { FeedListEditor } from "./FeedListEditor";

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
    <Flex css={{ position: "relative", height: "100%" }}>
      <Tabs
        ariaLabel="Content Filters"
        tabs={contentFilters.map((filter) => ({
          id: filter.id,
          trigger: filter.type + filter.value,
          content: <ContentFeed selectedContentFilter={filter} />,
        }))}
        headerRightContent={
          <Flex css={{ gap: "$5", px: "$3", alignItems: "center" }}>
            <SlideDownDialog
              position={{ right: "40px" }}
              trigger={
                <Flex>
                  <ChevronDownIcon />
                </Flex>
              }
            >
              {({ hide }) => (
                <FeedListEditor hide={hide} contentFilters={contentFilters} />
              )}
            </SlideDownDialog>
            <SearchIcon />
          </Flex>
        }
      />
    </Flex>
  );
};
