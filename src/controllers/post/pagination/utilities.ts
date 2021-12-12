import { UnrenderablePostWithoutElementsOrHashtags } from "../models";

export function getNextPageOfPostsEncodedCursor({
  posts,
}: {
  posts: UnrenderablePostWithoutElementsOrHashtags[];
}): string | undefined {
  if (posts.length > 0) {
    const timestamp = posts[posts.length - 1]!.scheduledPublicationTimestamp;
    return encodeCursor({timestamp});
  }

  return undefined;
}

export function encodeCursor({timestamp}: {timestamp: number}) {
  return Buffer.from(String(timestamp), "binary").toString("base64");
}

export function decodeCursor({ encodedCursor }: { encodedCursor: string }): number {
  const decodedCursor = Number(Buffer.from(encodedCursor, "base64").toString("binary"));
  return decodedCursor;
}

export function getPageOfPostsFromAllPosts({
  unrenderablePostsWithoutElementsOrHashtags,
  encodedCursor,
  pageSize,
}: {
  unrenderablePostsWithoutElementsOrHashtags: UnrenderablePostWithoutElementsOrHashtags[];
  encodedCursor?: string;
  pageSize: number;
}): UnrenderablePostWithoutElementsOrHashtags[] {
  if (!!encodedCursor) {
    const timestamp = decodeCursor({ encodedCursor });

    const filteredUnrenderablePostsWithoutElements: UnrenderablePostWithoutElementsOrHashtags[] =
      unrenderablePostsWithoutElementsOrHashtags
        .filter((unrenderablePostWithoutElementsOrHashtags) => {
          const { scheduledPublicationTimestamp} = unrenderablePostWithoutElementsOrHashtags;
          return (
            scheduledPublicationTimestamp < timestamp
          );
        })
        .slice(-pageSize);

    return filteredUnrenderablePostsWithoutElements;
  }

  const filteredUnrenderablePostsWithoutElements =
    unrenderablePostsWithoutElementsOrHashtags.slice(-pageSize);

  return filteredUnrenderablePostsWithoutElements;
}
