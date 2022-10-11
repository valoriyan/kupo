import { decodeTimestampCursor, encodeTimestampCursor } from "../../utilities/pagination";
import { UncompiledBasePublishedItem } from "../models";

export function getNextPageCursorOfPage<T>({
  items,
  getTimestampFromItem,
}: {
  items: T[];
  getTimestampFromItem: (item: T) => string;
}): string | undefined {
  if (items.length > 0) {
    return getTimestampFromItem(items[items.length - 1]);
  }

  return undefined;
}

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
  uncompiledBasePublishedItems,
  encodedCursor,
  pageSize,
}: {
  uncompiledBasePublishedItems: UncompiledBasePublishedItem[];
  encodedCursor?: string;
  pageSize: number;
}): UncompiledBasePublishedItem[] {
  if (!!encodedCursor) {
    const timestamp = decodeTimestampCursor({ encodedCursor });

    const filteredUncompiledBasePublishedItems = uncompiledBasePublishedItems
      .filter((uncompiledBasePublishedItem) => {
        const { scheduledPublicationTimestamp } = uncompiledBasePublishedItem;
        return scheduledPublicationTimestamp < timestamp;
      })
      .slice(-pageSize);

    return filteredUncompiledBasePublishedItems;
  }

  const pageOfUncompiledBasePublishedItems = uncompiledBasePublishedItems.slice(
    -pageSize,
  );

  return pageOfUncompiledBasePublishedItems;
}
