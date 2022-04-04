import Link from "next/link";
import { AddRIcon, SearchIcon } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { styled } from "#/styling";

export const ChatRoomsHeader = () => {
  return (
    <Wrapper>
      <Flex css={{ gap: "$2", alignItems: "center", flex: 1, color: "$secondaryText" }}>
        <SearchIcon />
        <SearchBox placeholder="Search..." type="text" />
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
});

const SearchBox = styled("input", {
  width: "100%",
  background: "transparent",
  border: "none",
  p: "$3",
});
