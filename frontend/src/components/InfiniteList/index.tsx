import { ReactNode } from "react";
import { Virtuoso } from "react-virtuoso";
import { styled } from "#/styling";
import { Body } from "../Typography";

export const DEFAULT_EOL_MESSAGE = "Amazing! You've seen it all 😎";
const OVERSCAN_PIXELS = 600;

export interface InfiniteListProps<T> {
  data: T[];
  renderItem: (index: number, item: T) => ReactNode;
  hasNextPage: boolean;
  loadNextPage: () => void;
  isNextPageLoading: boolean;
  scrollParent?: HTMLElement | undefined;
  endOfListMessage?: string;
}

type ListContext = Pick<
  InfiniteListProps<unknown>,
  "isNextPageLoading" | "endOfListMessage"
>;

export const InfiniteList = <T,>(props: InfiniteListProps<T>) => {
  return (
    <Virtuoso
      useWindowScroll={!props.scrollParent}
      customScrollParent={props.scrollParent}
      overscan={OVERSCAN_PIXELS}
      data={props.data}
      itemContent={props.renderItem}
      endReached={props.hasNextPage ? props.loadNextPage : undefined}
      context={{
        isNextPageLoading: props.isNextPageLoading,
        endOfListMessage: props.endOfListMessage,
      }}
      components={{ Footer: EndOfList }}
    />
  );
};

export const ReverseInfiniteList = <T,>(props: InfiniteListProps<T>) => {
  return (
    <Virtuoso
      useWindowScroll={!props.scrollParent}
      customScrollParent={props.scrollParent}
      overscan={OVERSCAN_PIXELS}
      firstItemIndex={Number.MAX_SAFE_INTEGER - props.data.length}
      initialTopMostItemIndex={props.data.length - 1}
      data={props.data}
      itemContent={props.renderItem}
      startReached={props.hasNextPage ? props.loadNextPage : undefined}
      context={{
        isNextPageLoading: props.isNextPageLoading,
        endOfListMessage: props.endOfListMessage,
      }}
      components={{ Header: EndOfList }}
      followOutput="smooth"
    />
  );
};

const EndOfList = ({ context }: { context?: ListContext }) => {
  const message = context?.isNextPageLoading
    ? "Loading..."
    : context?.endOfListMessage
    ? context.endOfListMessage
    : "";

  if (!message) return null;
  return <EndOfListWrapper>{message}</EndOfListWrapper>;
};

const EndOfListWrapper = styled(Body, {
  textAlign: "center",
  px: "$3",
  py: "$4",
  color: "$secondaryText",
});
