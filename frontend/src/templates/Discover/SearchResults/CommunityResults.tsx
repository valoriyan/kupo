import { useEffect, useState } from "react";
import { Grid } from "#/components/Layout";
import { ResultsWrapper } from "./ResultsWrapper";

export interface CommunityResultsProps {
  query: string;
}

export const CommunityResults = ({ query }: CommunityResultsProps) => {
  const [page, setPage] = useState(0);
  const pageSize = 6;

  // TODO: Implement search for communities endpoint first
  const data = undefined;
  const isLoading = false;
  const isError = true;

  useEffect(() => {
    setPage(0);
  }, [query]);

  return (
    <ResultsWrapper
      heading="Communities"
      isLoading={isLoading}
      errorMessage={
        isError
          ? "Failed to search communities"
          : data && false // TODO: !data.communities.length
          ? "No Results Found"
          : undefined
      }
      totalCount={undefined} // TODO: data?.totalCount
      pageSize={pageSize}
      page={page}
      setPage={setPage}
    >
      {!data ? null : (
        <Grid
          css={{
            width: "100%",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            columnGap: "$3",
            rowGap: "$3",
          }}
        >
          {null} {/* TODO: Map over communities */}
        </Grid>
      )}
    </ResultsWrapper>
  );
};
