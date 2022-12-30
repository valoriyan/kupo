import { decodeTimestampCursor, encodeTimestampCursor } from "../../utilities/pagination";
import { UnassembledBasePublishedItem } from "../models";

export function getNextPageCursorOfPage<T>({
  items,
  getTimestampFromItem,
}: {
  items: T[];
  getTimestampFromItem: (item: T) => string;
}): string | undefined {
  //////////////////////////////////////////////////
  // Send Back the Timestamp of the Last Item
  //////////////////////////////////////////////////

  if (items.length > 0) {
    return getTimestampFromItem(items[items.length - 1]);
  }

  return undefined;
}

export function getEncodedCursorOfNextPageOfSequentialItems<
  T extends { scheduledPublicationTimestamp: number },
>({ sequentialFeedItems }: { sequentialFeedItems: T[] }): string | undefined {
  //////////////////////////////////////////////////
  // Send Back the Encoded Timestamp of the Last Item
  //////////////////////////////////////////////////

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
  uncompiledBasePublishedItems: UnassembledBasePublishedItem[];
  encodedCursor?: string;
  pageSize: number;
}): UnassembledBasePublishedItem[] {
  //////////////////////////////////////////////////
  // If Provided a Cursor
  //     Get the Published Items Before Timestamp
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Else
  //     Take the first page of items
  //////////////////////////////////////////////////

  const pageOfUncompiledBasePublishedItems = uncompiledBasePublishedItems.slice(
    -pageSize,
  );

  return pageOfUncompiledBasePublishedItems;
}
