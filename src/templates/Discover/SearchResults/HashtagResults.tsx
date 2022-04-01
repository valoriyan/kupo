import { useSearchForHashtags } from "#/api/queries/discover/useSearchForHashtags";
import { HashTag } from "#/components/HashTags";
import { Flex } from "#/components/Layout";
import { ResultsWrapper } from "./ResultsWrapper";

export interface HashtagResultsProps {
  query: string;
}

export const HashtagResults = ({ query }: HashtagResultsProps) => {
  const { data, isLoading, isError } = useSearchForHashtags({ query, pageSize: 10 });

  return (
    <ResultsWrapper
      heading="Hashtags"
      isLoading={isLoading}
      errorMessage={
        isError
          ? "Failed to search hashtags"
          : data && !data.hashtags.length
          ? "No Results Found"
          : undefined
      }
    >
      {!data ? null : (
        <Flex css={{ gap: "$3" }}>
          {data.hashtags.map((hashtag) => (
            <HashTag key={hashtag} hashtag={hashtag} />
          ))}
        </Flex>
      )}
    </ResultsWrapper>
  );
};
