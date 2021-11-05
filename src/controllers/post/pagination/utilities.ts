import { UnrenderablePostWithoutRenderableDatesTimesElementsOrHashtags } from "../models";

export function getEncodedNextPageCursor({
  posts,
}: {
  posts: UnrenderablePostWithoutRenderableDatesTimesElementsOrHashtags[];
}): string | undefined {
  const encodedNextPageCursor =
    posts.length > 0
      ? Buffer.from(
          String(posts[posts.length - 1]?.scheduledPublicationTimestamp),
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
  unrenderablePostsWithoutRenderableDatesTimesElementsOrHashtags,
  encodedCursor,
  pageSize,
}: {
  unrenderablePostsWithoutRenderableDatesTimesElementsOrHashtags: UnrenderablePostWithoutRenderableDatesTimesElementsOrHashtags[];
  encodedCursor?: string;
  pageSize: number;
}): UnrenderablePostWithoutRenderableDatesTimesElementsOrHashtags[] {
  // For simplicity, we are returning posts ordered by timestamp
  // However, we will want to return posts with the highest clickthrough rate (or some other criterion)

  if (!!encodedCursor) {
    const decodedCursor = decodeCursor({ encodedCursor });

    const filteredUnrenderablePostsWithoutElements: UnrenderablePostWithoutRenderableDatesTimesElementsOrHashtags[] =
      unrenderablePostsWithoutRenderableDatesTimesElementsOrHashtags
        .filter((unrenderablePostWithoutRenderableDatesTimesElementsOrHashtags) => {
          return (
            unrenderablePostWithoutRenderableDatesTimesElementsOrHashtags.scheduledPublicationTimestamp >
            decodedCursor
          );
        })
        .slice(-pageSize);

    return filteredUnrenderablePostsWithoutElements;
  }

  const filteredUnrenderablePostsWithoutElements =
    unrenderablePostsWithoutRenderableDatesTimesElementsOrHashtags.slice(-pageSize);

  return filteredUnrenderablePostsWithoutElements;
}
