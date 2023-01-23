import create from "zustand";
import { SearchIcon } from "#/components/Icons";
import { Flex, Grid, Stack } from "#/components/Layout";
import { MainTitle } from "#/components/Typography";
import { styled } from "#/styling";
import { SearchResults } from "./SearchResults";
import { SuggestedContent } from "./SuggestedContent";

const useSearchText = create<{
  searchText: string;
  setSearchText: (searchText: string) => void;
}>((set) => ({
  searchText: "",
  setSearchText: (searchText) => set({ searchText }),
}));

export const Discover = () => {
  const { searchText, setSearchText } = useSearchText();

  return (
    <Grid
      css={{
        gridTemplateRows: "auto minmax(0, 1fr)",
        position: "relative",
        height: "100%",
      }}
    >
      <Stack>
        <Flex css={{ gap: "$4", p: "$5" }}>
          <MainTitle>Discover</MainTitle>
        </Flex>
        <SearchBar>
          <SearchIcon />
          <SearchInput
            type="text"
            autoComplete="off"
            name="search"
            placeholder="Search @user, #tag, +community, or caption"
            value={searchText}
            onChange={(e) => setSearchText(e.currentTarget.value)}
            data-cy="discover-search-input"
          />
        </SearchBar>
        {searchText ? <SearchResults query={searchText} /> : <SuggestedContent />}
      </Stack>
    </Grid>
  );
};

const SearchBar = styled("label", {
  display: "flex",
  alignItems: "center",
  border: "solid $borderWidths$1 $border",
  borderRadius: "$round",
  gap: "$2",
  pl: "$3",
  py: "$3",
  mx: "$4",
  transition: "border-color $1 ease",
  svg: { color: "$border", transition: "color $1 ease" },

  "&:focus-within": {
    borderColor: "$primary",
    svg: { color: "$primary" },
  },
});

const SearchInput = styled("input", {
  fontSize: "$2",
  px: "$3",
  background: "none",
  border: "none",
  flex: 1,

  "&:focus": {
    outline: "none",
  },
});
