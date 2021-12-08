import { Options, Search } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { styled } from "#/styling";

export const ChatRoomsListSearchBar = () => {
  return (
    <FlexWrapper>
      <SearchBox placeholder="Search..." type="text" />
      <Flex css={{ gap: "$4" }}>
        <Search />
        <Options />
      </Flex>
    </FlexWrapper>
  );
};

const FlexWrapper = styled(Flex, {
  height: "100%",
  width: "100%",
  textAlign: "center",
  alignContent: "center",
  padding: "$4",
  borderBottom: "1px solid $background3",
});

const SearchBox = styled("input", {
  width: "100%",
  background: "transparent",
  border: "none",
});
