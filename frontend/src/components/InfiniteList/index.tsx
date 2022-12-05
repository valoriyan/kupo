import { ReactNode } from "react";
import { Virtuoso } from "react-virtuoso";
import { styled } from "#/styling";
import { useAppLayoutState } from "../AppLayout";
import { Body } from "../Typography";

export const DEFAULT_EOL_MESSAGE = "Amazing! You've seen it all 😎";

export interface InfiniteListProps<T> {
  data: T[];
  renderItem: (index: number, item: T) => ReactNode;
  hasNextPage: boolean;
  loadNextPage: () => void;
  isNextPageLoading: boolean;
  scrollParent?: HTMLElement | undefined;
  endOfListMessage?: string; // TODO: Handle this
}

type ListContext = Pick<
  InfiniteListProps<unknown>,
  "isNextPageLoading" | "endOfListMessage"
>;

export const InfiniteList = <T,>(props: InfiniteListProps<T>) => {
  const contentContainer = useAppLayoutState((store) => store.contentContainer);

  return (
    <Virtuoso
      customScrollParent={props.scrollParent ?? contentContainer}
      overscan={600}
      data={props.data}
      itemContent={props.renderItem}
      endReached={props.hasNextPage ? props.loadNextPage : undefined}
      context={{
        isNextPageLoading: props.isNextPageLoading,
        endOfListMessage: props.endOfListMessage,
      }}
      components={{ Footer }}
    />
  );
};

const Footer = ({ context }: { context?: ListContext }) => {
  const message = context?.isNextPageLoading
    ? "Loading..."
    : context?.endOfListMessage
    ? context.endOfListMessage
    : "";

  if (!message) return null;
  return <FooterWrapper>{message}</FooterWrapper>;
};

const FooterWrapper = styled(Body, {
  textAlign: "center",
  px: "$3",
  py: "$4",
  color: "$secondaryText",
});
