import { useEffect, useMemo, useState } from "react";
import { useSearchForPosts } from "#/api/queries/discover/useSearchForPosts";
import { Grid } from "#/components/Layout";
import { PostPreview } from "../Previews/PostPreview";
import { ResultsWrapper } from "../ResultsWrapper";

export interface PostResultsProps {
  query: string;
}

export const PostResults = ({ query }: PostResultsProps) => {
  const [page, setPage] = useState(0);
  const pageSize = 6;

  const { data, isLoading, isError } = useSearchForPosts({
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
      heading="Posts"
      isLoading={isLoading}
      errorMessage={
        isError
          ? "Failed to search posts"
          : data && !data.posts.length
          ? "No Results Found"
          : undefined
      }
      pagination={pagination}
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
          {data.posts.map((post) => (
            <PostPreview key={post.id} post={post} />
          ))}
        </Grid>
      )}
    </ResultsWrapper>
  );
};
