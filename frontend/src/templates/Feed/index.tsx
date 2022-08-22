import Link from "next/link";
import { useRef } from "react";
import { useUpdateContentFilters } from "#/api/mutations/feed/updateContentFilters";
import { useGetContentFilters } from "#/api/queries/feed/useGetContentFilters";
import { ChevronDownIcon, SearchIcon } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { Tabs } from "#/components/Tabs";
import { VerticalSlideDialog } from "#/components/VerticalSlideDialog";
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Flex ref={containerRef} css={{ position: "relative" }}>
      <Tabs
        ariaLabel="Content Filters"
        stickyTabList
        tabs={contentFilters.map((userContentFeedFilter) => ({
          id: userContentFeedFilter.contentFeedFilterId,
          trigger: generateContentFeedFilterDisplayName({ userContentFeedFilter }),
          content: <ContentFeed selectedContentFilter={userContentFeedFilter} />,
        }))}
        headerRightContent={
          <Flex css={{ gap: "$5", px: "$3", alignItems: "center" }}>
            <VerticalSlideDialog
              origin="fromTop"
              container={containerRef.current}
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
            </VerticalSlideDialog>
            <Link href="/discover" passHref>
              <Flex as="a" css={{ color: "$text" }} data-cy="search-button">
                <SearchIcon />
              </Flex>
            </Link>
          </Flex>
        }
      />
    </Flex>
  );
};
