import { useUpdateContentFilters } from "#/api/mutations/feed/updateContentFilters";
import { useGetContentFilters } from "#/api/queries/feed/useGetContentFilters";
import { ChevronDownIcon, SearchIcon } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { SlideDownDialog } from "#/components/SlideDownDialog";
import { Tabs } from "#/components/Tabs";
import { ContentFeed } from "./ContentFeed";
import { FeedListEditor } from "./FeedListEditor";

export const Feed = () => {
  const { data: contentFilters } = useGetContentFilters();
  const { mutateAsync: updateContentFilters } = useUpdateContentFilters();

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
