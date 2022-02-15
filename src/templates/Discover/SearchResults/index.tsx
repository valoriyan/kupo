import { Flex, Stack } from "#/components/Layout";
import { HashtagResults } from "./HashtagResults";
import { PostResults } from "./PostResults";
import { UserResults } from "./UserResults";

export interface SearchResultsProps {
  query: string;
}

export const SearchResults = ({ query }: SearchResultsProps) => {
  return (
    <Stack css={{ pt: "$6" }}>
      <HashtagResults query={query} />
      <Flex css={{ height: "1px", width: "100%", bg: "$border", my: "$5" }} />
      <UserResults query={query} />
      <Flex css={{ height: "1px", width: "100%", bg: "$border", my: "$5" }} />
      <PostResults query={query} />
    </Stack>
  );
};
