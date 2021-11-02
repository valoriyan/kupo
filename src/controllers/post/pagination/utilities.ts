import { RenderablePost, UnrenderablePostWithoutElementsOrHashtags } from "../models";

export function getEncodedNextPageCursor({
  renderablePosts,
}: {
  renderablePosts: RenderablePost[];
}): string | undefined {
  const encodedNextPageCursor =
    renderablePosts.length > 0
      ? Buffer.from(
          String(
            renderablePosts[renderablePosts.length - 1]?.scheduledPublicationTimestamp,
          ),
          "binary",
        ).toString("base64")
      : undefined;

  return encodedNextPageCursor;
}

export function decodeCursor({ encodedCursor }: { encodedCursor: string }): number {
  const decodedCursor = Number(Buffer.from(encodedCursor, "base64").toString("binary"));
  return decodedCursor;
}

export function getPageOfPosts({
  unfilteredUnrenderablePostsWithoutElementsOrHashtags,
  encodedCursor,
  pageSize,
}: {
  unfilteredUnrenderablePostsWithoutElementsOrHashtags: UnrenderablePostWithoutElementsOrHashtags[];
  encodedCursor?: string;
  pageSize: number;
}): UnrenderablePostWithoutElementsOrHashtags[] {
  // For simplicity, we are returning posts ordered by timestamp
  // However, we will want to return posts with the highest clickthrough rate (or some other criterion)

  if (!!encodedCursor) {
    const decodedCursor = decodeCursor({ encodedCursor });

    const filteredUnrenderablePostsWithoutElements: UnrenderablePostWithoutElementsOrHashtags[] =
      unfilteredUnrenderablePostsWithoutElementsOrHashtags
        .filter((unrenderablePostWithoutElementsOrHashtags) => {
          return (
            unrenderablePostWithoutElementsOrHashtags.scheduledPublicationTimestamp >
            decodedCursor
          );
        })
        .slice(-pageSize);

    return filteredUnrenderablePostsWithoutElements;
  }

  const filteredUnrenderablePostsWithoutElements: UnrenderablePostWithoutElementsOrHashtags[] =
    unfilteredUnrenderablePostsWithoutElementsOrHashtags.slice(-pageSize);

  return filteredUnrenderablePostsWithoutElements;
}
