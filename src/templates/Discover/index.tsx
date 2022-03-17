import { AnimatePresence, motion } from "framer-motion";
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
            placeholder="@username, #hashtag, caption"
            value={searchText}
            onChange={(e) => setSearchText(e.currentTarget.value)}
          />
        </SearchBar>
        <AnimatePresence>
          <motion.div
            key={searchText ? "search" : "suggested"}
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {searchText ? <SearchResults query={searchText} /> : <SuggestedContent />}
          </motion.div>
        </AnimatePresence>
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
  mx: "$3",
  transition: "border-color $1 ease",
  svg: { color: "$border", transition: "color $1 ease" },

  "&:focus-within": {
    borderColor: "$link",
    svg: { color: "$link" },
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
