import { decodeTimestampCursor, encodeTimestampCursor } from "../../../controllers/utilities/pagination";
import { UnrenderablePostWithoutElementsOrHashtags } from "../models";

export function getEncodedCursorOfNextPageOfSequentialItems<
  T extends { scheduledPublicationTimestamp: number },
>({ sequentialFeedItems }: { sequentialFeedItems: T[] }): string | undefined {
  if (sequentialFeedItems.length > 0) {
    const timestamp =
      sequentialFeedItems[sequentialFeedItems.length - 1].scheduledPublicationTimestamp;
    return encodeTimestampCursor({ timestamp });
  }

  return undefined;
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
    const timestamp = decodeTimestampCursor({ encodedCursor });

    const filteredUnrenderablePostsWithoutElements: UnrenderablePostWithoutElementsOrHashtags[] =
      unrenderablePostsWithoutElementsOrHashtags
        .filter((unrenderablePostWithoutElementsOrHashtags) => {
          const { scheduledPublicationTimestamp } =
            unrenderablePostWithoutElementsOrHashtags;
          return scheduledPublicationTimestamp < timestamp;
        })
        .slice(-pageSize);

    return filteredUnrenderablePostsWithoutElements;
  }

  const filteredUnrenderablePostsWithoutElements =
    unrenderablePostsWithoutElementsOrHashtags.slice(-pageSize);

  return filteredUnrenderablePostsWithoutElements;
}
