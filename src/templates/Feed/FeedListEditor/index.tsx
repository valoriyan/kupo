import { FormEventHandler, useState } from "react";
import { motion } from "framer-motion";
import { useUpdateContentFilters } from "#/api/mutations/feed/updateContentFilters";
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
import { UserContentFeedFilter, UserContentFeedFilterType } from "#/api";
import { useCurrentUserId } from "#/contexts/auth";

export interface FeedListEditorProps {
  hide: () => void;
  contentFilters: UserContentFeedFilter[];
  updateContentFilters: ReturnType<typeof useUpdateContentFilters>["mutateAsync"];
}

export const FeedListEditor = (props: FeedListEditorProps) => {
  const [newFilterText, setNewFilterText] = useState("");
  const clientUserId = useCurrentUserId();

  const onMoveUp = (contentFeedFilterId: string) => () => {
    const newFilters = props.contentFilters.splice(1);
    const index = newFilters.findIndex(
      (filter) => filter.contentFeedFilterId === contentFeedFilterId,
    );
    newFilters[index - 1] = newFilters.splice(index, 1, newFilters[index - 1])[0];
    props.updateContentFilters(newFilters);
  };

  const onMoveDown = (contentFeedFilterId: string) => () => {
    const newFilters = props.contentFilters.splice(1);
    const index = newFilters.findIndex(
      (filter) => filter.contentFeedFilterId === contentFeedFilterId,
    );
    newFilters[index + 1] = newFilters.splice(index, 1, newFilters[index + 1])[0];
    props.updateContentFilters(newFilters);
  };

  const onDelete = (contentFeedFilterId: string) => () => {
    props.updateContentFilters(
      props.contentFilters
        .splice(1)
        .filter((filter) => filter.contentFeedFilterId !== contentFeedFilterId),
    );
  };

  const addFilter: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!isFilterValid(newFilterText)) return;
    const isHashTag = newFilterText.startsWith("#");
    const value = newFilterText.split(isHashTag ? "#" : "@")[1];
    const type = isHashTag
      ? UserContentFeedFilterType.Hashtag
      : UserContentFeedFilterType.Username;

    const contentFeedFilterId = type + value;
    if (
      props.contentFilters.some(
        (filter) => filter.contentFeedFilterId === contentFeedFilterId,
      )
    ) {
      setNewFilterText("");
      return;
    }
    const newFilters = [
      ...props.contentFilters.splice(1),
      {
        contentFeedFilterId,
        userId: clientUserId ?? "",
        type,
        value,
        creationTimestamp: Date.now(),
      },
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
    <Stack
      as={motion.div}
      layout
      transition={{ duration: 0.2 }}
      css={{ bg: "$background1", boxShadow: "$1" }}
    >
      <Flex
        as={motion.div}
        layout
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
          key={filter.contentFeedFilterId}
          filter={filter}
          actions={
            filter.type === UserContentFeedFilterType.FollowingUsers
              ? undefined
              : {
                  moveUp: i === 1 ? undefined : onMoveUp(filter.contentFeedFilterId),
                  moveDown:
                    i === props.contentFilters.length - 1
                      ? undefined
                      : onMoveDown(filter.contentFeedFilterId),
                  delete: onDelete(filter.contentFeedFilterId),
                }
          }
        />
      ))}
      <Grid
        as="form"
        onSubmit={addFilter}
        css={{ gridTemplateColumns: "minmax(0, 1fr) auto" }}
      >
        <FilterInput
          placeholder="@username, #hashtag"
          value={newFilterText}
          onChange={(e) => setNewFilterText(e.currentTarget.value)}
        />
        <AddButton type="submit" disabled={!isFilterValid(newFilterText)}>
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
  marginTop: "-1px",
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
  filter: UserContentFeedFilter;
  actions?: {
    moveUp?: () => void;
    moveDown?: () => void;
    delete?: () => void;
  };
}

const FilterRow = ({ filter, actions }: FilterRowProps) => {
  let filterDisplayName;

  if (filter.type === UserContentFeedFilterType.Username) {
    filterDisplayName = `@${filter.value}`;
  } else if (filter.type === UserContentFeedFilterType.Hashtag) {
    filterDisplayName = `#${filter.value}`;
  } else if (filter.type === UserContentFeedFilterType.FollowingUsers) {
    filterDisplayName = `Following Users`;
  }

  return (
    <FilterRowWrapper layout transition={{ duration: 0.2 }}>
      <Body>{filterDisplayName}</Body>
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

const FilterRowWrapper = styled(motion.div, {
  display: "flex",
  borderTop: "solid $borderWidths$1 $border",
  borderBottom: "solid $borderWidths$1 $border",
  p: "$5",
  justifyContent: "space-between",
  bg: "$background1",
  marginTop: "-1px",
});

const IconButton = styled("button", { lineHeight: 0 });
