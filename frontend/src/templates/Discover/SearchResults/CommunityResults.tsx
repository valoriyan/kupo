import { useEffect, useState } from "react";
import { RenderablePublishingChannel } from "#/api";
import { useSearchForPublishingChannels } from "#/api/queries/discover/useSearchForCommunities";
import { Avatar } from "#/components/Avatar";
import { CommunityName } from "#/components/CommunityName";
import { Flex, Grid, Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { styled } from "#/styling";
import { goToCommunityPage } from "#/templates/CommunityPage";
import { ResultsWrapper } from "./ResultsWrapper";

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
      totalCount={data?.totalCount}
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
          {data.publishingChannels.map((community) => (
            <CommunityPreview key={community.publishingChannelId} community={community} />
          ))}
        </Grid>
      )}
    </ResultsWrapper>
  );
};

const CommunityPreview = ({ community }: { community: RenderablePublishingChannel }) => {
  return (
    <CommunityWrapper>
      <Flex css={{ alignItems: "center", gap: "$4" }}>
        <Avatar
          src={community.profilePictureTemporaryUrl}
          alt={`${community.name}'s profile picture`}
          size="$8"
          onClick={() => goToCommunityPage(community.name)}
        />
        <CommunityName name={community.name} />
      </Flex>
      <Body>{community.description}</Body>
    </CommunityWrapper>
  );
};

const CommunityWrapper = styled(Stack, {
  gap: "$4",
  borderRadius: "$3",
  px: "$5",
  py: "$4",
  bg: "$background2",
  boxShadow: "$1",
});
