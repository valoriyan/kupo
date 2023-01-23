import { useRecommendedCommunities } from "#/api/queries/discover/useRecommendedCommunities";
import { Stack } from "#/components/Layout";
import { CommunityPreview } from "../Previews/CommunityPreview";
import { ResultsWrapper } from "../ResultsWrapper";

export const CommunitySuggestions = () => {
  const { data, isLoading, isError } = useRecommendedCommunities();

  return (
    <ResultsWrapper
      heading="Suggested Communities"
      isLoading={isLoading}
      errorMessage={
        isError
          ? "Failed to find communities"
          : data && !data.publishingChannels.length
          ? "No Results Found"
          : undefined
      }
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
