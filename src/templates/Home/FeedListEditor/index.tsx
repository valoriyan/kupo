import { ChevronUpIcon } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { MainTitle } from "#/components/Typography";
import { styled } from "#/styling";
import { ContentFilter } from "..";

export interface FeedListEditorProps {
  hide: () => void;
  contentFilters: ContentFilter[];
}

export const FeedListEditor = (props: FeedListEditorProps) => {
  return (
    <Stack css={{ bg: "$background1" }}>
      <Flex
        css={{
          gap: "$2",
          p: "$3",
          pl: "$5",
          justifyContent: "space-between",
        }}
      >
        <MainTitle>Feed</MainTitle>
        <IconButton onClick={props.hide}>
          <ChevronUpIcon />
        </IconButton>
      </Flex>
      {props.contentFilters.map((filter) => (
        <Stack
          key={filter.id}
          css={{ borderTop: "solid $borderWidths$1 $border", p: "$5" }}
        >
          {filter.type + filter.value}
        </Stack>
      ))}
    </Stack>
  );
};

const IconButton = styled("button", { lineHeight: 0 });
