import { motion } from "framer-motion";
import { UserContentFeedFilter } from "#/api";
import { ChevronDownOIcon, ChevronUpOIcon, TrashIcon } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { Body, truncateByWidth } from "#/components/Typography";
import { styled } from "#/styling";
import { getContentFeedFilterDisplayName } from "../utilities";

export type ActionEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

export interface FilterRowProps {
  filter: UserContentFeedFilter;
  isActive: boolean;
  makeActive: () => void;
  actions?: {
    moveUp?: (e: ActionEvent) => void;
    moveDown?: (e: ActionEvent) => void;
    delete?: (e: ActionEvent) => void;
  };
}

export const FilterRow = ({ filter, isActive, makeActive, actions }: FilterRowProps) => {
  const filterDisplayName = getContentFeedFilterDisplayName(filter);

  return (
    <FilterRowWrapper layout transition={{ duration: 0.2 }} onClick={makeActive}>
      <DisplayName css={{ color: isActive ? "$primary" : "$secondaryText" }}>
        {filterDisplayName}
      </DisplayName>
      {actions && (
        <Flex>
          {actions.moveUp && (
            <Flex
              onClick={actions.moveUp}
              css={{ color: "$secondaryText", px: "$2", py: "$3" }}
            >
              <ChevronUpOIcon />
            </Flex>
          )}
          {actions.moveDown && (
            <Flex
              onClick={actions.moveDown}
              css={{ color: "$secondaryText", px: "$2", py: "$3" }}
            >
              <ChevronDownOIcon />
            </Flex>
          )}
          {actions.delete && (
            <Flex
              onClick={actions.delete}
              css={{ color: "$failure", px: "$2", py: "$3", ml: "$3" }}
            >
              <TrashIcon />
            </Flex>
          )}
        </Flex>
      )}
    </FilterRowWrapper>
  );
};

const FilterRowWrapper = styled(motion.button, {
  display: "grid",
  alignItems: "center",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  bg: "$background2",
  borderBottom: "solid $borderWidths$1 $border",
  width: "100%",
  pr: "$3",
});

const DisplayName = styled(Body, truncateByWidth("100%"), {
  fontWeight: "$bold",
  p: "$5",
  textAlign: "left",
});
