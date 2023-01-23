import { RenderablePost } from "#/api";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { Flex, Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { styled } from "#/styling";
import { goToPostPage } from "#/templates/SinglePost";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";

export const PostPreview = ({ post }: { post: RenderablePost }) => {
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
