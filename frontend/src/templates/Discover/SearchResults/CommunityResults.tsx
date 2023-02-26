import { useEffect, useMemo, useState } from "react";
import { useSearchForPublishingChannels } from "#/api/queries/discover/useSearchForCommunities";
import { Stack } from "#/components/Layout";
import { CommunityPreview } from "../Previews/CommunityPreview";
import { ResultsWrapper } from "../ResultsWrapper";

export interface CommunityResultsProps {
  query: string;
}

export const CommunityResults = ({ query }: CommunityResultsProps) => {
  const [page, setPage] = useState(0);
  const pageSize = 6;

  const { data, isLoading, isError } = useSearchForPublishingChannels({
    query,
    pageNumber: page + 1,
    pageSize,
  });

  useEffect(() => {
    setPage(0);
  }, [query]);

  const pagination = useMemo(() => {
    if (!data) return undefined;
    return { totalCount: data.totalCount, pageSize, page, setPage };
  }, [data, page]);

  return (
    <ResultsWrapper
      heading="Communities"
      isLoading={isLoading}
      errorMessage={
        isError
          ? "Failed to search communities"
          : data && !data.publishingChannels.length
          ? "No Results Found"
          : undefined
      }
      pagination={pagination}
    >
      {!data ? null : (
        <Stack css={{ gap: "$3", width: "100%" }}>
          {data.publishingChannels.map((community) => (
            <CommunityPreview key={community.publishingChannelId} community={community} />
          ))}
        </Stack>
      )}
    </ResultsWrapper>
  );
};
