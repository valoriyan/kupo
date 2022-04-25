import { useEffect, useState } from "react";
import { useSearchForHashtags } from "#/api/queries/discover/useSearchForHashtags";
import { HashTag } from "#/components/HashTags";
import { Flex, Stack } from "#/components/Layout";
import { Paginator } from "#/components/Paginator";
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
    >
      {!data ? null : (
        <Stack css={{ gap: "$4", alignItems: "center" }}>
          <Flex css={{ gap: "$3", flexWrap: "wrap", alignSelf: "flex-start" }}>
            {data.hashtags.map((hashtag) => (
              <HashTag key={hashtag} hashtag={hashtag} />
            ))}
          </Flex>
          {Math.ceil(data.totalCount / pageSize) > 1 && (
            <Paginator
              currentPage={page}
              setCurrentPage={setPage}
              totalPages={Math.ceil(data.totalCount / pageSize)}
            />
          )}
        </Stack>
      )}
    </ResultsWrapper>
  );
};
