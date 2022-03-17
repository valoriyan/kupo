import { useGetPostById } from "#/api/queries/posts/useGetPostById";
import { DetailLayout } from "#/components/DetailLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { LoadingArea } from "#/components/LoadingArea";
import { PostWrapper } from "../Feed/ContentFeed/PostWrapper";

export interface SinglePostProps {
  postId: string;
}

export const SinglePost = ({ postId }: SinglePostProps) => {
  const { data, isLoading, error } = useGetPostById({ postId });

  return (
    <DetailLayout heading="Post">
      {!isLoading && error ? (
        <ErrorArea>{error.message || "An Unexpected Error Occurred"}</ErrorArea>
      ) : isLoading || !data ? (
        <LoadingArea size="lg" />
      ) : (
        <PostWrapper post={data} />
      )}
    </DetailLayout>
  );
};
