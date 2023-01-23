import { useRecommendedUsers } from "#/api/queries/discover/useRecommendedUsers";
import { Stack } from "#/components/Layout";
import { UserPreview } from "../Previews/UserPreview";
import { ResultsWrapper } from "../ResultsWrapper";

export const UserSuggestions = () => {
  const { data, isLoading, isError } = useRecommendedUsers();

  return (
    <ResultsWrapper
      heading="Suggested Users"
      isLoading={isLoading}
      errorMessage={
        isError
          ? "Failed to find users"
          : data && !data.users.length
          ? "No Results Found"
          : undefined
      }
    >
      {!data ? null : (
        <Stack css={{ gap: "$3", width: "100%" }}>
          {data.users.map((user) => (
            <UserPreview key={user.userId} user={user} />
          ))}
        </Stack>
      )}
    </ResultsWrapper>
  );
};
