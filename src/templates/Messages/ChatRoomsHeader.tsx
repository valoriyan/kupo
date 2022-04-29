import Link from "next/link";
import { AddRIcon, SearchIcon } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { styled } from "#/styling";

export interface ChatRoomsHeaderProps {
  query: string;
  setQuery: (newQuery: string) => void;
}

export const ChatRoomsHeader = (props: ChatRoomsHeaderProps) => {
  return (
    <Wrapper>
      <Flex css={{ gap: "$2", alignItems: "center", flex: 1, color: "$secondaryText" }}>
        <SearchIcon />
        <SearchBox
          type="text"
          placeholder="Search..."
          value={props.query}
          onChange={(e) => props.setQuery(e.currentTarget.value)}
        />
      </Flex>
      <Flex css={{ gap: "$5", alignItems: "center" }}>
        <Link href="/messages/new" passHref>
          <Flex as="a" css={{ color: "$text", p: "$2" }}>
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
  top: 0,
  zIndex: 1,
});

const SearchBox = styled("input", {
  width: "100%",
  background: "transparent",
  border: "none",
  p: "$3",
});
