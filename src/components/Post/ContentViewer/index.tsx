import { MutableRefObject, useEffect, useRef, useState } from "react";
import { MediaElement } from "#/api";
import { ChevronLeftIcon, ChevronRightIcon } from "#/components/Icons";
import { styled } from "#/styling";
import { range } from "#/utils/range";
import { Content } from "./Content";

export interface ContentViewerProps {
  mediaElements: MediaElement[];
  setCurrentMediaElement?: (elem: MediaElement | undefined) => void;
  contentHeight?: string;
}

export const ContentViewer = ({
  mediaElements,
  setCurrentMediaElement,
  contentHeight,
}: ContentViewerProps) => {
  const [curIndex, setCurIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const registeredItems = useRef<Record<number, HTMLDivElement>>({});

  const currentMediaElement = mediaElements[curIndex];
  const hasMultiple = mediaElements.length > 1;

  useEffect(() => {
    setCurrentMediaElement?.(currentMediaElement);
  }, [currentMediaElement, setCurrentMediaElement]);

  const onScroll = () => {
    if (!listRef.current) return;
    Array.from(listRef.current.children).map((child, index) => {
      if (!listRef.current) return;
      const containerRect = listRef.current.getBoundingClientRect();
      if (Math.abs(child.getBoundingClientRect().left - containerRect.left) < 10) {
        setCurIndex(index);
      }
    });
  };

  return (
    <Wrapper css={{ height: contentHeight ?? "62vh" }}>
      <ContentList ref={listRef} onScroll={onScroll}>
        {mediaElements.map((mediaElement, i) => (
          <ContentItem
            key={i}
            index={i}
            registeredItems={registeredItems}
            mediaElement={mediaElement}
          />
        ))}
      </ContentList>
      {hasMultiple && (
        <>
          {curIndex > 0 && (
            <ArrowButton
              direction="left"
              onClick={() =>
                setCurIndex((prev) => {
                  const newIndex = prev - 1;
                  scrollIntoView(registeredItems.current[newIndex]);
                  return newIndex;
                })
              }
            >
              <ChevronLeftIcon />
            </ArrowButton>
          )}
          <IndexDots>
            {range(mediaElements.length).map((index) => (
              <IndexDot key={index} active={curIndex === index} />
            ))}
          </IndexDots>
          {curIndex < mediaElements.length - 1 && (
            <ArrowButton
              direction="right"
              onClick={() =>
                setCurIndex((prev) => {
                  const newIndex = prev + 1;
                  scrollIntoView(registeredItems.current[newIndex]);
                  return newIndex;
                })
              }
            >
              <ChevronRightIcon />
            </ArrowButton>
          )}
        </>
      )}
    </Wrapper>
  );
};

const scrollIntoView = (element: HTMLDivElement | undefined) => {
  element?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "nearest",
  });
};

const ContentItem = ({
  index,
  registeredItems,
  mediaElement,
}: {
  index: number;
  registeredItems: MutableRefObject<Record<number, HTMLDivElement>>;
  mediaElement: MediaElement;
}) => {
  const [elem, setElem] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (elem) registeredItems.current[index] = elem;
  }, [elem, index, registeredItems]);

  return (
    <ContentWrapper ref={setElem}>
      <Content mediaElement={mediaElement} />
    </ContentWrapper>
  );
};

const Wrapper = styled("div", {
  position: "relative",
  width: "100%",
  "&:hover": {
    "> button": {
      display: "flex",
    },
  },
});

const ContentList = styled("div", {
  display: "flex",
  size: "100%",
  overflowX: "auto",
  "user-select": "none",
  "&::-webkit-scrollbar": { display: "none" },
  " -ms-overflow-style": "none",
  " scrollbar-width": "none",
  scrollSnapType: "x mandatory",
  img: {
    "user-select": "none",
    "-webkit-user-drag": "none",
  },
});

const ContentWrapper = styled("div", {
  height: "100%",
  width: "100%",
  flexShrink: 0,
  scrollSnapAlign: "start",
  bg: "$background3",
});

const ArrowButton = styled("button", {
  display: "none",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  size: "$7",
  borderRadius: "$round",
  bg: "$overlay",
  color: "$accentText",

  variants: {
    direction: {
      left: { left: "$3" },
      right: { right: "$3" },
    },
  },
});

const IndexDots = styled("div", {
  display: "flex",
  position: "absolute",
  bottom: "$4",
  right: "50%",
  transform: "translateX(50%)",
  gap: "$3",
});

const IndexDot = styled("div", {
  size: "$3",
  bg: "$overlay",
  borderRadius: "$round",
  transition: "background-color $1 ease",

  variants: {
    active: { true: { bg: "$primary" } },
  },
});
