import Link from "next/link";
import { RenderablePost } from "#/api";
import { useSearchForPosts } from "#/api/queries/discover/useSearchForPosts";
import { Flex, Grid, Stack } from "#/components/Layout";
import { ResultsWrapper } from "./ResultsWrapper";
import { styled } from "#/styling";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { Body } from "#/components/Typography";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";

export interface PostResultsProps {
  query: string;
}

export const PostResults = ({ query }: PostResultsProps) => {
  const { data, isLoading, isError } = useSearchForPosts({ query, pageSize: 5 });

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
    >
      {!data ? null : (
        <Grid
          css={{
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            columnGap: "$3",
            rowGap: "$3",
          }}
        >
          {data.posts.map((post) => (
            <PostPreview key={post.postId} post={post} />
          ))}
        </Grid>
      )}
    </ResultsWrapper>
  );
};

const PostPreview = ({ post }: { post: RenderablePost }) => {
  const { data: user } = useGetUserByUserId({ userId: post.authorUserId });
  const profileUrl = user?.username
    ? getProfilePageUrl({ username: user?.username })
    : "";

  return (
    <PostWrapper>
      {!!post.contentElementTemporaryUrls[0] && (
        <PostImage src={post.contentElementTemporaryUrls[0]} />
      )}
      <Stack css={{ gap: "$4", px: "$5", pb: "$5" }}>
        <Flex css={{ alignItems: "center", gap: "$4" }}>
          <Link href={profileUrl} passHref>
            <a>@{user?.username ?? "User"}</a>
          </Link>
          <Body css={{ color: "$secondaryText" }}>
            {getShortRelativeTimestamp(post.creationTimestamp)}
          </Body>
        </Flex>
        {post.caption && <Body>{post.caption}</Body>}
      </Stack>
    </PostWrapper>
  );
};

const PostWrapper = styled(Stack, {
  gap: "$4",
  borderRadius: "$3",
  bg: "$background2",
  boxShadow: "$1",
  overflow: "hidden",
});

const PostImage = styled("img", {
  width: "100%",
  height: "$12",
  objectFit: "cover",
});
