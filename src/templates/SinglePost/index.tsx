import Router from "next/router";
import { useGetPostById } from "#/api/queries/posts/useGetPostById";
import { DetailLayout } from "#/components/DetailLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { getSinglePostUrl } from "#/utils/generateLinkUrls";
import { SessionStorageItem } from "#/utils/storage";

const previousLocation = SessionStorageItem<string>("previous-location-single-post");

export const goToPostPage = (postId: string) => {
  previousLocation.set(Router.asPath);
  Router.push(getSinglePostUrl(postId));
};

export interface SinglePostProps {
  postId: string;
}

export const SinglePost = ({ postId }: SinglePostProps) => {
  const { data, isLoading, error } = useGetPostById({ postId });

  return (
    <DetailLayout heading="Post" backRoute={previousLocation.get() ?? "/feed"}>
      {!isLoading && error ? (
        <ErrorArea>{error.message || "An error occurred"}</ErrorArea>
      ) : isLoading || !data ? (
        <LoadingArea size="lg" />
      ) : (
        <Post post={data} />
      )}
    </DetailLayout>
  );
};
