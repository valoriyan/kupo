import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useRef, useState } from "react";
import { keyframes, prefersMotionSelector, styled } from "#/styling";

export interface VerticalSlideDialogProps {
  trigger: ReactNode;
  origin: "fromTop" | "fromBottom";
  container?: HTMLElement | null;
  position?: { top?: string; bottom?: string; left?: string; right?: string };
  children: (renderProps: { hide: () => void }) => ReactNode;
}

export const VerticalSlideDialog = (props: VerticalSlideDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hide = () => setIsOpen(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const container = props.container ?? triggerRef.current?.parentElement;

  const leftProp = props.position?.left ?? 0;
  const rightProp = props.position?.right ?? 0;

  const position = {
    top: props.position?.top ?? props.origin === "fromTop" ? 0 : "unset",
    bottom: props.position?.bottom ?? props.origin === "fromBottom" ? 0 : "unset",
    left: `calc(${typeof leftProp === "string" ? leftProp : `${leftProp}px`} + ${
      container?.getBoundingClientRect().left ?? 0
    }px)`,
    right: `calc(${typeof rightProp === "string" ? rightProp : `${rightProp}px`} + ${
      window.innerWidth - (container?.getBoundingClientRect().right ?? 0)
    }px)`,
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger ref={triggerRef}>{props.trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent css={position} origin={props.origin}>
          {props.children({ hide })}
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const slideInFromTop = keyframes({
  "0%": { transform: "translateY(-100%)" },
  "100%": { transform: "translateX(0%)" },
});
const slideOutToTop = keyframes({
  "0%": { transform: "translateY(0%)" },
  "100%": { transform: "translateY(-100%)" },
});

const slideInFromBottom = keyframes({
  "0%": { transform: "translateY(100%)" },
  "100%": { transform: "translateX(0%)" },
});
const slideOutToBottom = keyframes({
  "0%": { transform: "translateY(0%)" },
  "100%": { transform: "translateY(100%)" },
});

const DialogContent = styled(Dialog.Content, {
  zIndex: "$dialog",
  position: "fixed",
  variants: {
    origin: {
      fromTop: {
        [prefersMotionSelector]: {
          "&[data-state='open']": {
            animation: `${slideInFromTop} $3 ease`,
          },
          "&[data-state='closed']": {
            animation: `${slideOutToTop} $3 ease`,
          },
        },
      },
      fromBottom: {
        [prefersMotionSelector]: {
          "&[data-state='open']": {
            animation: `${slideInFromBottom} $3 ease`,
          },
          "&[data-state='closed']": {
            animation: `${slideOutToBottom} $3 ease`,
          },
        },
      },
    },
  },
});

const fadeIn = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});
const fadeOut = keyframes({
  "0%": { opacity: 1 },
  "100%": { opacity: 0 },
});

const DialogOverlay = styled(Dialog.Overlay, {
  zIndex: "$dialog",
  bg: "$overlay",
  position: "fixed",
  inset: 0,
  [prefersMotionSelector]: {
    "&[data-state='open']": {
      animation: `${fadeIn} $3 ease`,
    },
    "&[data-state='closed']": {
      animation: `${fadeOut} $3 ease`,
    },
  },
});
