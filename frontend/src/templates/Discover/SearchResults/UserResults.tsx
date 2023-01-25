import { useEffect, useMemo, useState } from "react";
import { useSearchForUsers } from "#/api/queries/discover/useSearchForUsers";
import { Stack } from "#/components/Layout";
import { UserPreview } from "../Previews/UserPreview";
import { ResultsWrapper } from "../ResultsWrapper";

export interface UserResultsProps {
  query: string;
}

export const UserResults = ({ query }: UserResultsProps) => {
  const [page, setPage] = useState(0);
  const pageSize = 6;

  const { data, isLoading, isError } = useSearchForUsers({
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
      heading="Users"
      isLoading={isLoading}
      errorMessage={
        isError
          ? "Failed to search users"
          : data && !data.users.length
          ? "No Results Found"
          : undefined
      }
      pagination={pagination}
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
