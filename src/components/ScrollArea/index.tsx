import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { ReactNode } from "react";
import { styled } from "#/styling";

export interface ScrollAreaProps {
  children?: ReactNode;
  className?: string;
}

export const ScrollArea = ({ children, className }: ScrollAreaProps) => {
  return (
    <StyledScrollArea>
      <StyledViewport className={className}>{children}</StyledViewport>
      <StyledScrollbar orientation="vertical">
        <StyledThumb />
      </StyledScrollbar>
      <StyledScrollbar orientation="horizontal">
        <StyledThumb />
      </StyledScrollbar>
      <StyledCorner />
    </StyledScrollArea>
  );
};

const SCROLLBAR_SIZE = 10;

const StyledScrollArea = styled(ScrollAreaPrimitive.Root, {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  boxShadow: `0 2px 10px $scrollBarTrack`,
});

const StyledViewport = styled(ScrollAreaPrimitive.Viewport, {
  size: "100%",
  borderRadius: "inherit",
  "> *": { size: "100%" },
});

const StyledScrollbar = styled(ScrollAreaPrimitive.Scrollbar, {
  display: "flex",
  // ensures no selection
  userSelect: "none",
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: "none",
  padding: "$1",
  background: "$scrollBarTrack",
  transition: "background $1 ease-out",
  "&:hover": { background: "$scrollBarTrack" },
  '&[data-orientation="vertical"]': { width: SCROLLBAR_SIZE },
  '&[data-orientation="horizontal"]': {
    flexDirection: "column",
    height: SCROLLBAR_SIZE,
  },
});

const StyledThumb = styled(ScrollAreaPrimitive.Thumb, {
  flex: 1,
  background: "$scrollBar",
  borderRadius: SCROLLBAR_SIZE,
  // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  position: "relative",
  "&::before": {
    content: "",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
  },
});

const StyledCorner = styled(ScrollAreaPrimitive.Corner, {
  background: "$scrollBar",
});
