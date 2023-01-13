import { motion } from "framer-motion";
import { FormEventHandler, useState } from "react";
import { UserContentFeedFilter, UserContentFeedFilterType } from "#/api";
import { useUpdateContentFilters } from "#/api/mutations/feed/updateContentFilters";
import { IconButton } from "#/components/Button";
import { ChevronUpIcon, MathPlusIcon } from "#/components/Icons";
import { Flex, Grid, Stack } from "#/components/Layout";
import { bodyStyles, MainTitle } from "#/components/Typography";
import { useCurrentUserId } from "#/contexts/auth";
import { styled } from "#/styling";
import { FilterRow } from "./FilterRow";

export interface FeedListEditorProps {
  hide: () => void;
  contentFilters: UserContentFeedFilter[];
  updateContentFilters: ReturnType<typeof useUpdateContentFilters>["mutateAsync"];
}

export const FeedListEditor = (props: FeedListEditorProps) => {
  const [newFilterText, setNewFilterText] = useState("");
  const clientUserId = useCurrentUserId();

  const onMoveUp = (contentFeedFilterId: string) => () => {
    const newFilters = props.contentFilters.filter((filter) => filter.value);
    const index = newFilters.findIndex(
      (filter) => filter.contentFeedFilterId === contentFeedFilterId,
    );
    newFilters[index - 1] = newFilters.splice(index, 1, newFilters[index - 1])[0];
    props.updateContentFilters(newFilters);
  };

  const onMoveDown = (contentFeedFilterId: string) => () => {
    const newFilters = props.contentFilters.filter((filter) => filter.value);
    const index = newFilters.findIndex(
      (filter) => filter.contentFeedFilterId === contentFeedFilterId,
    );
    newFilters[index + 1] = newFilters.splice(index, 1, newFilters[index + 1])[0];
    props.updateContentFilters(newFilters);
  };

  const onDelete = (contentFeedFilterId: string) => () => {
    props.updateContentFilters(
      props.contentFilters
        .filter((filter) => filter.value)
        .filter((filter) => filter.contentFeedFilterId !== contentFeedFilterId),
    );
  };

  const addFilter: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!isFilterValid(newFilterText)) return;

    const isHashTag = newFilterText.startsWith("#");
    const isUser = newFilterText.startsWith("@");
    const isPublishingChannel = newFilterText.startsWith("+");

    const value = newFilterText.slice(1);
    let type: UserContentFeedFilterType | null = null;
    if (isHashTag) type = UserContentFeedFilterType.Hashtag;
    if (isUser) type = UserContentFeedFilterType.Username;
    if (isPublishingChannel) type = UserContentFeedFilterType.PublishingChannel;
    if (type === null) return;

    const contentFeedFilterId = type + value;
    if (
      props.contentFilters.some(
        (filter) => filter.contentFeedFilterId === contentFeedFilterId,
      )
    ) {
      setNewFilterText("");
      return;
    }
    const newFilters = props.contentFilters
      .filter((filter) => filter.value)
      .concat({
        contentFeedFilterId,
        userId: clientUserId ?? "",
        type,
        value,
        creationTimestamp: Date.now(),
      });
    props.updateContentFilters(newFilters);
    setNewFilterText("");
  };

  const isFilterValid = (filterText: string) => {
    // TODO: We should do a more comprehensive to prevent the user from entering invalid characters
    const isHashTag =
      filterText.startsWith("#") &&
      !filterText.includes("@") &&
      !filterText.includes("+");
    const isUser =
      filterText.startsWith("@") &&
      !filterText.includes("#") &&
      !filterText.includes("+");
    const isCommunity =
      filterText.startsWith("+") &&
      !filterText.includes("@") &&
      !filterText.includes("#");
    return (isHashTag || isUser || isCommunity) && filterText.length >= 2;
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
          borderBottom: "solid $borderWidths$1 $background1",
        }}
      >
        <MainTitle>Feeds</MainTitle>
        <IconButton onClick={props.hide}>
          <ChevronUpIcon />
        </IconButton>
      </Flex>
      {props.contentFilters.map((filter, i, filters) => (
        <FilterRow
          key={filter.contentFeedFilterId}
          filter={filter}
          actions={
            !filter.value
              ? undefined
              : {
                  moveUp: !filters[i - 1]?.value
                    ? undefined
                    : onMoveUp(filter.contentFeedFilterId),
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
          type="text"
          autoComplete="off"
          name="add filter"
          placeholder="Add #tag, @user, or +community"
          value={newFilterText}
          onChange={(e) => setNewFilterText(e.currentTarget.value.toLocaleLowerCase())}
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
