import { useUpdateContentFilters } from "#/api/mutations/feed/updateContentFilters";
import { useGetContentFilters } from "#/api/queries/feed/useGetContentFilters";
import { ChevronDownIcon, SearchIcon } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { SlideDownDialog } from "#/components/SlideDownDialog";
import { Tabs } from "#/components/Tabs";
import { useCurrentUserId } from "#/contexts/auth";
import { ContentFeed } from "./ContentFeed";
import { FeedListEditor } from "./FeedListEditor";
import { generateContentFeedFilterDisplayName } from "./utilities";

export const Feed = () => {
  const clientUserId = useCurrentUserId();
  const { data: contentFilters } = useGetContentFilters({
    clientUserId: clientUserId ?? "",
  });
  const { mutateAsync: updateContentFilters } = useUpdateContentFilters();

  return (
    <Flex css={{ position: "relative", height: "100%" }}>
      <Tabs
        ariaLabel="Content Filters"
        tabs={contentFilters.map((userContentFeedFilter) => ({
          id: userContentFeedFilter.contentFeedFilterId,
          trigger: generateContentFeedFilterDisplayName({ userContentFeedFilter }),
          content: <ContentFeed selectedContentFilter={userContentFeedFilter} />,
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
                <FeedListEditor
                  hide={hide}
                  contentFilters={contentFilters}
                  updateContentFilters={updateContentFilters}
                />
              )}
            </SlideDownDialog>
            <SearchIcon />
          </Flex>
        }
      />
    </Flex>
  );
};
