import { useGetPageOfPostCommentsByPostId } from "#/api/queries/posts/useGetPageOfPostCommentsByPostId";
import { ErrorMessage } from "../../ErrorArea";
import { Flex, Stack } from "../../Layout";
import { LoadingArea } from "../../LoadingArea";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

export interface CommentsProps {
  postId: string;
}

export const Comments = ({ postId }: CommentsProps) => {
  const {
    data,
    isLoading,
    error,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetPageOfPostCommentsByPostId({
    postId,
  });

  if (isError && !isLoading) {
    return <ErrorMessage>Error: {(error as Error).message}</ErrorMessage>;
  }

  if (isLoading || !data) {
    return (
      <Flex css={{ p: "$5" }}>
        <LoadingArea size="md" />
      </Flex>
    );
  }

  const comments = data.pages.flatMap((page) => page.postComments);

  return (
    <Stack css={{ height: "100%" }}>
      <CommentInput postId={postId} />
      <CommentList
        comments={comments}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </Stack>
  );
};
