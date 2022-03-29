import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { styled } from "#/styling";
import { Content } from "./Content";
import { range } from "#/utils/range";
import { ChevronLeftIcon, ChevronRightIcon } from "#/components/Icons";
import { ContentElement } from "#/api";

export interface ContentViewerProps {
  contentElements: ContentElement[];
  setCurrentMediaUrl?: (url: string | undefined) => void;
  contentHeight?: string;
}

export const ContentViewer = ({
  contentElements,
  setCurrentMediaUrl,
  contentHeight,
}: ContentViewerProps) => {
  const { page, direction, paginate } = usePagination([0, 0], contentElements.length);

  const currentImageUrl = contentElements[page].temporaryUrl;
  const hasMultiple = contentElements.length > 1;

  useEffect(() => {
    setCurrentMediaUrl?.(currentImageUrl);
  }, [currentImageUrl, setCurrentMediaUrl]);

  return (
    <AnimatePresence initial={false} custom={direction}>
      <MotionWrapper
        css={{
          height: contentHeight ?? "62vh",
          cursor: hasMultiple ? "grab" : "default",
        }}
      >
        <motion.div
          key={page}
          style={{ height: "100%", width: "100%" }}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag={hasMultiple ? "x" : undefined}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >
          <Content contentUrl={currentImageUrl} />
        </motion.div>
        {hasMultiple && (
          <>
            {page > 0 && (
              <ArrowButton direction="left" onClick={() => paginate(-1)}>
                <ChevronLeftIcon />
              </ArrowButton>
            )}
            <IndexDots>
              {range(contentElements.length).map((index) => (
                <IndexDot key={index} active={page === index} />
              ))}
            </IndexDots>
            {page < contentElements.length - 1 && (
              <ArrowButton direction="right" onClick={() => paginate(1)}>
                <ChevronRightIcon />
              </ArrowButton>
            )}
          </>
        )}
      </MotionWrapper>
    </AnimatePresence>
  );
};

export const usePagination = (
  initialState: [number, number] | (() => [number, number]),
  totalLength: number,
) => {
  const [[page, direction], setPage] = useState<[number, number]>(initialState);

  const paginate = (newDirection: number) => {
    if (page + newDirection < 0 || page + newDirection >= totalLength) return;
    setPage([page + newDirection, newDirection]);
  };

  return { page, direction, paginate } as const;
};

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const MotionWrapper = styled("div", {
  overflow: "hidden",
  position: "relative",
  bg: "$background3",
  img: {
    "user-select": "none",
    "-webkit-user-drag": "none",
  },
  "&:hover": {
    "> button": {
      display: "flex",
    },
  },
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
