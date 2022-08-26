import { useEffect, useState } from "react";
import { useSearchForHashtags } from "#/api/queries/discover/useSearchForHashtags";
import { HashTag } from "#/components/HashTags";
import { Flex } from "#/components/Layout";
import { ResultsWrapper } from "./ResultsWrapper";

export interface HashtagResultsProps {
  query: string;
}

export const HashtagResults = ({ query }: HashtagResultsProps) => {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading, isError } = useSearchForHashtags({
    query,
    pageNumber: page + 1,
    pageSize,
  });

  useEffect(() => {
    setPage(0);
  }, [query]);

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
      totalCount={data?.totalCount}
      pageSize={pageSize}
      page={page}
      setPage={setPage}
    >
      {!data ? null : (
        <Flex css={{ gap: "$3", flexWrap: "wrap", alignSelf: "flex-start" }}>
          {data.hashtags.map((hashtag) => (
            <HashTag key={hashtag} hashtag={hashtag} />
          ))}
        </Flex>
      )}
    </ResultsWrapper>
  );
};