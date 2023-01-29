import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { UserContentFeedFilter } from "#/api";
import { useUpdateContentFilters } from "#/api/mutations/feed/updateContentFilters";
import { useGetContentFilters } from "#/api/queries/feed/useGetContentFilters";
import { useAppLayoutState } from "#/components/AppLayout";
import { FeedIcon, SearchIcon } from "#/components/Icons";
import { Flex, Grid, Stack } from "#/components/Layout";
import { MainTitle, truncateByWidth } from "#/components/Typography";
import { useVerifyEmailReminder } from "#/components/VerifyEmailModal";
import { VerticalSlideDialog } from "#/components/VerticalSlideDialog";
import { useCurrentUserId } from "#/contexts/auth";
import { styled } from "#/styling";
import { translucentBg } from "#/styling/mixins";
import { SessionStorageItem } from "#/utils/storage";
import { ContentFeed } from "./ContentFeed";
import { FeedListEditor } from "./FeedListEditor";
import { getContentFeedFilterDisplayName } from "./utilities";

const storedFilter = SessionStorageItem<UserContentFeedFilter>("selectedContentFilter");

export const Feed = () => {
  const clientUserId = useCurrentUserId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollToTop = useAppLayoutState((store) => store.scrollToTop);

  const { data: contentFilters } = useGetContentFilters({
    clientUserId: clientUserId ?? "",
  });
  const { mutateAsync: updateContentFilters } = useUpdateContentFilters();

  const [selectedFilter, _setSelectedFilter] = useState(
    storedFilter.get() ?? contentFilters[0],
  );
  const setSelectedFilter = useCallback(
    (filter: UserContentFeedFilter) => {
      scrollToTop();
      _setSelectedFilter(filter);
      storedFilter.set(filter);
    },
    [scrollToTop],
  );

  const currentFilterDisplayName = getContentFeedFilterDisplayName(selectedFilter);

  useVerifyEmailReminder();

  return (
    <Stack ref={containerRef} css={{ position: "relative" }}>
      <Header>
        <Flex css={{ alignItems: "center", gap: "$4", color: "$text" }}>
          <Logo />
          <CurrentFilter as="h1" onClick={() => scrollToTop(true)}>
            {currentFilterDisplayName}
          </CurrentFilter>
        </Flex>
        <Flex css={{ alignItems: "center", gap: "$2" }}>
          <Link href="/discover" passHref>
            <Flex as="a" css={{ color: "$text", p: "$3" }} data-cy="search-button">
              <SearchIcon />
            </Flex>
          </Link>
          <VerticalSlideDialog
            origin="fromTop"
            container={containerRef.current}
            trigger={
              <Flex css={{ p: "$3" }}>
                <FeedIcon />
              </Flex>
            }
          >
            {({ hide }) => (
              <FeedListEditor
                hide={hide}
                contentFilters={contentFilters}
                updateContentFilters={updateContentFilters}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
              />
            )}
          </VerticalSlideDialog>
        </Flex>
      </Header>
      <ContentFeed selectedContentFilter={selectedFilter} />
    </Stack>
  );
};

const Logo = styled("div", {
  size: "$8",
  bg: "$text",
  "-webkit-mask": "url(otter-outline.svg) no-repeat",
  mask: "url(otter-outline.svg) no-repeat",
  "-webkit-mask-size": "100%",
  maskSize: "100%",
  transform: "translateY(3px)",
});

const Header = styled(Grid, translucentBg, {
  position: "sticky",
  top: 0,
  zIndex: 1,
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "center",
  width: "100%",
  py: "$3",
  pl: "$5",
  pr: "$3",
  borderBottom: "solid $borderWidths$1 $border",
});

const CurrentFilter = styled(MainTitle, truncateByWidth("100%"));
