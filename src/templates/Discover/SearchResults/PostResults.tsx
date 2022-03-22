import Link from "next/link";
import { RenderablePost } from "#/api";
import { useSearchForPosts } from "#/api/queries/discover/useSearchForPosts";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { Flex, Grid, Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { styled } from "#/styling";
import { goToPostPage } from "#/templates/SinglePost";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { ResultsWrapper } from "./ResultsWrapper";

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
    <PostWrapper onClick={() => goToPostPage(post.postId)}>
      {!!post.contentElementTemporaryUrls[0] && (
        <PostImage src={post.contentElementTemporaryUrls[0]} />
      )}
      <Stack css={{ gap: "$4", px: "$5", py: "$5" }}>
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
