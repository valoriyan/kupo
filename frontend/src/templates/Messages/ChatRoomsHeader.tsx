import Link from "next/link";
import { AddRIcon, SearchIcon } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { NESTED_PAGE_LAYOUT_HEADER_HEIGHT } from "#/constants";
import { styled } from "#/styling";

export interface ChatRoomsHeaderProps {
  query: string;
  setQuery: (newQuery: string) => void;
}

export const ChatRoomsHeader = (props: ChatRoomsHeaderProps) => {
  return (
    <Wrapper>
      <SearchWrapper>
        <SearchIcon />
        <SearchBox
          type="text"
          placeholder="Search..."
          value={props.query}
          onChange={(e) => props.setQuery(e.currentTarget.value)}
          data-cy="chat-room-search-input"
        />
      </SearchWrapper>
      <Flex css={{ gap: "$5", alignItems: "center" }}>
        <Link href="/messages/new" passHref>
          <Flex as="a" css={{ color: "$text", p: "$2" }} data-cy="new-chat-room-button">
            <AddRIcon />
          </Flex>
        </Link>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled(Flex, {
  textAlign: "center",
  alignItems: "center",
  p: "$3",
  borderBottom: "solid $borderWidths$1 $border",
  bg: "$background1",
  position: "sticky",
  top: NESTED_PAGE_LAYOUT_HEADER_HEIGHT,
  zIndex: 1,
});

const SearchWrapper = styled(Flex, {
  gap: "$2",
  alignItems: "center",
  flex: 1,
  color: "$secondaryText",

  "&:focus-within": {
    svg: {
      color: "$primary",
    },
  },
});

const SearchBox = styled("input", {
  width: "100%",
  background: "transparent",
  border: "none",
  p: "$3",
  outline: "none",
});
