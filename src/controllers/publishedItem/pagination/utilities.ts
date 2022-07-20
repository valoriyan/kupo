import { decodeTimestampCursor, encodeTimestampCursor } from "../../utilities/pagination";
import { UncompiledBasePublishedItem } from "../models";

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

export function getPageOfPublishedItemsFromAllPublishedItems({
  unrenderablePostsWithoutElementsOrHashtags,
  encodedCursor,
  pageSize,
}: {
  unrenderablePostsWithoutElementsOrHashtags: UncompiledBasePublishedItem[];
  encodedCursor?: string;
  pageSize: number;
}): UncompiledBasePublishedItem[] {
  if (!!encodedCursor) {
    const timestamp = decodeTimestampCursor({ encodedCursor });

    const filteredUnrenderablePostsWithoutElements =
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
