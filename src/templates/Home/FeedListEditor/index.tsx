import { useState } from "react";
import { useUpdateContentFilters } from "#/api/mutations/feed/updateContentFilters";
import {
  ContentFilter,
  ContentFilterType,
} from "#/api/queries/feed/useGetContentFilters";
import {
  ChevronDownRIcon,
  ChevronUpIcon,
  ChevronUpRIcon,
  MathPlusIcon,
  TrashIcon,
} from "#/components/Icons";
import { Flex, Grid, Stack } from "#/components/Layout";
import { Body, bodyStyles, MainTitle } from "#/components/Typography";
import { styled } from "#/styling";

export interface FeedListEditorProps {
  hide: () => void;
  contentFilters: ContentFilter[];
  updateContentFilters: ReturnType<typeof useUpdateContentFilters>["mutateAsync"];
}

export const FeedListEditor = (props: FeedListEditorProps) => {
  const [newFilterText, setNewFilterText] = useState("");

  const onMoveUp = (id: string) => () => {
    const newFilters = props.contentFilters.splice(1);
    const index = newFilters.findIndex((filter) => filter.id === id);
    newFilters[index - 1] = newFilters.splice(index, 1, newFilters[index - 1])[0];
    props.updateContentFilters(newFilters);
  };
  const onMoveDown = (id: string) => () => {
    const newFilters = props.contentFilters.splice(1);
    const index = newFilters.findIndex((filter) => filter.id === id);
    newFilters[index + 1] = newFilters.splice(index, 1, newFilters[index + 1])[0];
    props.updateContentFilters(newFilters);
  };
  const onDelete = (id: string) => () => {
    props.updateContentFilters(
      props.contentFilters.splice(1).filter((filter) => filter.id !== id),
    );
  };

  const addFilter = () => {
    if (!isFilterValid(newFilterText)) return;
    const isHashTag = newFilterText.includes("#");
    const value = newFilterText.split(isHashTag ? "#" : "@")[1];
    const type = isHashTag ? ContentFilterType.Hashtag : ContentFilterType.User;
    const newFilters = [
      ...props.contentFilters.splice(1),
      { id: type + value, type, value },
    ];
    props.updateContentFilters(newFilters);
    setNewFilterText("");
  };

  const isFilterValid = (filterText: string) => {
    const isHashTag = filterText.includes("#") && !filterText.includes("@");
    const isUser = !filterText.includes("#") && filterText.includes("@");
    return (isHashTag || isUser) && filterText.length >= 2;
  };

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
      {props.contentFilters.map((filter, i) => (
        <FilterRow
          key={filter.id}
          filter={filter}
          actions={
            filter.type === ContentFilterType.FollowingUsers
              ? undefined
              : {
                  moveUp: i === 1 ? undefined : onMoveUp(filter.id),
                  moveDown:
                    i === props.contentFilters.length - 1
                      ? undefined
                      : onMoveDown(filter.id),
                  delete: onDelete(filter.id),
                }
          }
        />
      ))}
      <Grid css={{ gridTemplateColumns: "minmax(0, 1fr) auto" }}>
        <FilterInput
          placeholder="@username, #hashtag"
          value={newFilterText}
          onChange={(e) => setNewFilterText(e.currentTarget.value)}
        />
        <AddButton onClick={addFilter} disabled={!isFilterValid(newFilterText)}>
          <MathPlusIcon />
        </AddButton>
      </Grid>
    </Stack>
  );
};

const FilterInput = styled("input", bodyStyles, {
  background: "none",
  border: "none",
  p: "$5",
  borderTop: "solid $borderWidths$1 $border",
});

const AddButton = styled("button", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  bg: "$primary",
  color: "$accentText",
  px: "$4",
  cursor: "pointer",
  transition: "background-color $1 ease",

  "&:disabled": {
    bg: "$disabled",
    color: "$disabledText",
    cursor: "not-allowed",
  },
});

interface FilterRowProps {
  filter: ContentFilter;
  actions?: {
    moveUp?: () => void;
    moveDown?: () => void;
    delete?: () => void;
  };
}

const FilterRow = ({ filter, actions }: FilterRowProps) => {
  return (
    <FilterRowWrapper>
      <Body>{filter.type + filter.value}</Body>
      {actions && (
        <Flex css={{ gap: "$3" }}>
          {actions.moveUp && (
            <IconButton onClick={actions.moveUp}>
              <ChevronUpRIcon />
            </IconButton>
          )}
          {actions.moveDown && (
            <IconButton onClick={actions.moveDown}>
              <ChevronDownRIcon />
            </IconButton>
          )}
          {actions.delete && (
            <IconButton onClick={actions.delete} css={{ color: "$failure" }}>
              <TrashIcon />
            </IconButton>
          )}
        </Flex>
      )}
    </FilterRowWrapper>
  );
};

const FilterRowWrapper = styled(Flex, {
  borderTop: "solid $borderWidths$1 $border",
  p: "$5",
  justifyContent: "space-between",
});

const IconButton = styled("button", { lineHeight: 0 });
