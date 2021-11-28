import { useGetPostsByUserId } from "#/api/queries/useGetPostsByUserId";
import { ErrorMessage } from "#/components/ErrorArea";
import { Stack } from "#/components/Layout";
import { Post } from "#/components/Post";
import { Spinner } from "#/components/Spinner";
import { styled } from "#/styling";

export interface UserPostsProps {
  userId: string;
  username: string;
  userAvatar?: string;
}

export const UserPosts = (props: UserPostsProps) => {
  const { data, isLoading, error } = useGetPostsByUserId({ userId: props.userId });
  console.log(data);

  if (error && !isLoading) {
    return <ErrorMessage>{JSON.stringify(error)}</ErrorMessage>;
  }

  if (isLoading || !data?.success) {
    return (
      <Stack css={{ pt: "$9" }}>
        <Spinner size="lg" />
      </Stack>
    );
  }

  const posts = data.success.renderablePosts;

  return (
    <Wrapper>
      {posts.map((post) => (
        <Post
          key={post.postId}
          post={post}
          authorUserName={props.username}
          authorUserAvatar={props.userAvatar}
        />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled(Stack, {
  height: "100%",
  overflow: "auto",
  gap: "$2",
  py: "$2",
  "> *:not(:last-child)": {
    borderBottom: "solid $borderWidths$1 $border",
  },
});
