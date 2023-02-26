import { Flex, Stack } from "#/components/Layout";
import { CommunityResults } from "./CommunityResults";
import { HashtagResults } from "./HashtagResults";
import { PostResults } from "./PostResults";
import { UserResults } from "./UserResults";

export interface SearchResultsProps {
  query: string;
}

export const SearchResults = ({ query }: SearchResultsProps) => {
  const strippedQuery = query.replaceAll(/(#|@|\+)/g, "");

  const divider = (
    <Flex css={{ height: "1px", width: "100%", bg: "$border", my: "$5" }} />
  );

  return (
    <Stack>
      <HashtagResults query={strippedQuery} />
      {divider}
      <UserResults query={strippedQuery} />
      {divider}
      <CommunityResults query={strippedQuery} />
      {divider}
      <PostResults query={strippedQuery} />
    </Stack>
  );
};
