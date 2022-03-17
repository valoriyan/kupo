import { CSSProperties, ReactNode, useEffect, useRef } from "react";
import mergeRefs from "react-merge-refs";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Body } from "../Typography";

export interface InfiniteScrollAreaProps {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => void;
  items: ReactNode[];
}

export const InfiniteScrollArea = ({
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  items,
}: InfiniteScrollAreaProps) => {
  const listRef = useRef<VariableSizeList<unknown>>(null);
  const rowHeights = useRef<Record<number, number>>({});

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  const Item = ({ index, style }: { index: number; style: CSSProperties }) => {
    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (rowRef.current) {
        listRef.current?.resetAfterIndex(0);
        rowHeights.current = {
          ...rowHeights.current,
          [index]: rowRef.current.clientHeight,
        };
      }
    }, [index, rowRef]);

    let content;
    if (!isItemLoaded(index)) {
      content = <Body css={{ textAlign: "center", p: "$3" }}>Loading...</Body>;
    } else {
      content = items[index];
    }

    return (
      <div style={style}>
        <div ref={rowRef}>{content}</div>
      </div>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <VariableSizeList
              ref={mergeRefs([ref, listRef])}
              height={height}
              width={width}
              itemCount={itemCount}
              itemSize={(index) => rowHeights.current[index] ?? 30}
              onItemsRendered={onItemsRendered}
            >
              {Item}
            </VariableSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};
