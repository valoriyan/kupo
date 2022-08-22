import { useEffect, useState } from "react";
import { RenderablePost } from "#/api";
import { useSearchForPosts } from "#/api/queries/discover/useSearchForPosts";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { Flex, Grid, Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { styled } from "#/styling";
import { goToPostPage } from "#/templates/SinglePost";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { ResultsWrapper } from "./ResultsWrapper";

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
          {data.posts.map((post) => (
            <PostPreview key={post.id} post={post} />
          ))}
        </Grid>
      )}
    </ResultsWrapper>
  );
};

const PostPreview = ({ post }: { post: RenderablePost }) => {
  const { data: user } = useGetUserByUserId({ userId: post.authorUserId });

  return (
    <PostWrapper onClick={() => goToPostPage(post.id)}>
      {!!post.mediaElements?.[0] && (
        <PostImage src={post.mediaElements[0].temporaryUrl} />
      )}
      <Stack css={{ gap: "$4", px: "$5", py: "$5" }}>
        <Flex css={{ alignItems: "center", gap: "$4" }}>
          <UserName username={user?.username} />
          <Body css={{ color: "$secondaryText" }}>
            {getShortRelativeTimestamp(post.creationTimestamp)}
          </Body>
        </Flex>
        {post.caption && <Body>{post.caption}</Body>}
      </Stack>
    </PostWrapper>
  );
};

const PostWrapper = styled("button", {
  display: "flex",
  flexDirection: "column",
  borderRadius: "$3",
  bg: "$background2",
  boxShadow: "$1",
  overflow: "hidden",
  textAlign: "left",
});

const PostImage = styled("img", {
  width: "100%",
  height: "$12",
  objectFit: "cover",
});
