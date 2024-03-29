import Router from "next/router";
import { useGetPostById } from "#/api/queries/posts/useGetPostById";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { getSinglePostUrl } from "#/utils/generateLinkUrls";
import { SessionStorage } from "#/utils/storage";

const PREVIOUS_LOCATION_BASE_KEY = "previous-location-single-post-";

export const goToPostPage = (postId: string) => {
  SessionStorage.setItem<string>(PREVIOUS_LOCATION_BASE_KEY + postId, Router.asPath);
  Router.push(getSinglePostUrl(postId));
};

export interface SinglePostProps {
  postId: string;
}

export const SinglePost = ({ postId }: SinglePostProps) => {
  const { data, isLoading, error } = useGetPostById({ postId });

  const backHref =
    SessionStorage.getItem<string>(PREVIOUS_LOCATION_BASE_KEY + postId) ?? "/feed";

  return (
    <StandardPageLayout heading="Post" backHref={backHref}>
      {!isLoading && error ? (
        <ErrorArea>{error.message || "An error occurred"}</ErrorArea>
      ) : isLoading || !data ? (
        <LoadingArea size="lg" />
      ) : (
        <Post post={data} />
      )}
    </StandardPageLayout>
  );
};
