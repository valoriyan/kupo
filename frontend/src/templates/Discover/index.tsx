import create from "zustand";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { SearchIcon } from "#/components/Icons";
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
    <StandardPageLayout heading="Discover">
      <SearchBar>
        <SearchIcon />
        <SearchInput
          type="text"
          autoComplete="off"
          name="search"
          placeholder="Search Kupo"
          value={searchText}
          onChange={(e) => setSearchText(e.currentTarget.value)}
          data-cy="discover-search-input"
        />
      </SearchBar>
      {searchText ? <SearchResults query={searchText} /> : <SuggestedContent />}
    </StandardPageLayout>
  );
};

const SearchBar = styled("label", {
  display: "flex",
  alignItems: "center",
  bg: "$background1",
  border: "solid $borderWidths$1 $border",
  borderRadius: "$round",
  gap: "$2",
  pl: "$3",
  py: "$3",
  mx: "$4",
  my: "$6",
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
