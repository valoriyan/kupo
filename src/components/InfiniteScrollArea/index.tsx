import { ReactElement, ReactNode, useCallback, useEffect, useRef } from "react";
import mergeRefs from "react-merge-refs";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import InfiniteLoader from "react-virtualized/dist/commonjs/InfiniteLoader";
import List, { ListRowProps } from "react-virtualized/dist/commonjs/List";
import WindowScroller from "react-virtualized/dist/commonjs/WindowScroller";
import { useWindowSize } from "#/utils/useWindowSize";
import { Body } from "../Typography";
import "react-virtualized/styles.css";

export interface InfiniteScrollItemRenderProps {
  updateItemHeight: () => void;
}

export interface InfiniteScrollAreaProps {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => void;
  items: Array<
    ReactElement | ((renderProps: InfiniteScrollItemRenderProps) => ReactElement)
  >;
}

export const InfiniteScrollArea = ({
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  items,
}: InfiniteScrollAreaProps) => {
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const listRef = useRef<List>(null);
  const rowHeights = useRef<Record<number, number>>({});

  useEffect(() => {
    listRef.current?.recomputeRowHeights(0);
  }, [windowHeight, windowWidth]);

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  const loadMoreItems = async () => {
    if (!isNextPageLoading) loadNextPage();
  };

  const isItemLoaded = ({ index }: { index: number }) =>
    !hasNextPage || index < items.length;

  const Item = ({ index, style }: ListRowProps) => {
    const rowRef = useRef<HTMLDivElement>(null);

    const updateItemHeight = useCallback(() => {
      if (rowRef.current) {
        rowHeights.current = {
          ...rowHeights.current,
          [index]: rowRef.current.clientHeight,
        };
        listRef.current?.recomputeRowHeights(index);
      }
    }, [index]);

    useEffect(() => {
      updateItemHeight();
    }, [updateItemHeight]);

    let content: ReactNode;
    if (!isItemLoaded({ index })) {
      content = <Body css={{ textAlign: "center", p: "$3" }}>Loading...</Body>;
    } else {
      const currentItem = items[index];
      content =
        typeof currentItem === "function"
          ? currentItem({ updateItemHeight })
          : currentItem;
    }

    return (
      <div style={style}>
        <div ref={rowRef}>{content}</div>
      </div>
    );
  };

  return (
    <WindowScroller>
      {({ height, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <InfiniteLoader
              isRowLoaded={isItemLoaded}
              rowCount={itemCount}
              loadMoreRows={loadMoreItems}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  ref={mergeRefs([registerChild, listRef])}
                  autoHeight
                  height={height}
                  width={width}
                  scrollTop={scrollTop}
                  rowCount={itemCount}
                  rowHeight={({ index }) => rowHeights.current[index] ?? 30}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={(rowProps) => <Item {...rowProps} />}
                />
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
};
