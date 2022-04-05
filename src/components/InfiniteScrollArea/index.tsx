import {
  CSSProperties,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import mergeRefs from "react-merge-refs";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { useWindowSize } from "#/utils/useWindowSize";
import { Body } from "../Typography";

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
  const listRef = useRef<VariableSizeList<unknown>>(null);
  const rowHeights = useRef<Record<number, number>>({});

  useEffect(() => {
    listRef.current?.resetAfterIndex(0);
  }, [windowHeight, windowWidth]);

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  const Item = ({ index, style }: { index: number; style: CSSProperties }) => {
    const rowRef = useRef<HTMLDivElement>(null);

    const updateItemHeight = useCallback(() => {
      if (rowRef.current) {
        rowHeights.current = {
          ...rowHeights.current,
          [index]: rowRef.current.clientHeight,
        };
        listRef.current?.resetAfterIndex(index);
      }
    }, [index]);

    useEffect(() => {
      updateItemHeight();
    }, [updateItemHeight]);

    let content: ReactNode;
    if (!isItemLoaded(index)) {
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
