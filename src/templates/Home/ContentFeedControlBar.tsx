import { MouseEvent } from "react";
import { Add, Search } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { styled } from "#/styling";
import { useContentFeedState } from "./ContentFeedContext";
import { useClearFeedCache } from "#/api/mutations/feed/useClearFeedCache";

export const ContentFeedControlBar = () => {
  const { contentFilters, selectedContentFilter, setContentFeedFilter } =
    useContentFeedState();
  const { mutateAsync: clearFeedCache } = useClearFeedCache();

  const renderedTopics = contentFilters.map((contentFilter) => {
    function handleClickUpdateContentFeedFilter(event: MouseEvent<HTMLDivElement>) {
      event.preventDefault();
      setContentFeedFilter(contentFilter);

      clearFeedCache();
    }

    if (contentFilter === selectedContentFilter) {
      return (
        <SelectedContentFeedFilter key={contentFilter.displayValue}>
          {contentFilter.displayValue}
        </SelectedContentFeedFilter>
      );
    }
    return (
      <UnselectedContentFeedFilter
        key={contentFilter.displayValue}
        onClick={handleClickUpdateContentFeedFilter}
      >
        {contentFilter.displayValue}
      </UnselectedContentFeedFilter>
    );
  });

  return (
    <FlexWrapper>
      <Flex>{renderedTopics}</Flex>
      <FlexIcons css={{ gap: "$4", marginLeft: "auto" }}>
        <Add />
        <Search />
      </FlexIcons>
    </FlexWrapper>
  );
};

const FlexWrapper = styled(Flex, {
  padding: "$4",
  borderBottom: "1px solid $background3",

  justifyContent: "flex-start",
  alignItems: "center",
  width: "100%",
  height: "100%",
});

const FlexIcons = styled(Flex, {
  gap: "$4",
  marginLeft: "auto",
});

const UnselectedContentFeedFilter = styled("div", {
  paddingLeft: "$4",
});

const SelectedContentFeedFilter = styled(UnselectedContentFeedFilter, {
  borderBottom: "12px solid $link",
  color: "$link",
});
