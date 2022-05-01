import { motion } from "framer-motion";
import { UserContentFeedFilter, UserContentFeedFilterType } from "#/api";
import { IconButton } from "#/components/Button";
import { ChevronDownRIcon, ChevronUpRIcon, TrashIcon } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { styled } from "#/styling";

export interface FilterRowProps {
  filter: UserContentFeedFilter;
  actions?: {
    moveUp?: () => void;
    moveDown?: () => void;
    delete?: () => void;
  };
}

export const FilterRow = ({ filter, actions }: FilterRowProps) => {
  let filterDisplayName;

  if (filter.type === UserContentFeedFilterType.Username) {
    filterDisplayName = `@${filter.value}`;
  } else if (filter.type === UserContentFeedFilterType.Hashtag) {
    filterDisplayName = `#${filter.value}`;
  } else if (filter.type === UserContentFeedFilterType.FollowingUsers) {
    filterDisplayName = `Following`;
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
  alignItems: "center",
  justifyContent: "space-between",
  borderTop: "solid $borderWidths$1 $border",
  borderBottom: "solid $borderWidths$1 $border",
  p: "$5",
  bg: "$background1",
  marginTop: "-1px",
});
