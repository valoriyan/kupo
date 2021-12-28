import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import { styled, keyframes, prefersMotionSelector } from "#/styling";

export interface SlideDownDialogProps {
  trigger: ReactNode;
  position?: { top?: string; bottom?: string; left?: string; right?: string };
  children: (renderProps: { hide: () => void }) => ReactNode;
}

export const SlideDownDialog = (props: SlideDownDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hide = () => setIsOpen(false);

  const position = {
    top: props.position?.top ?? 0,
    bottom: props.position?.bottom ?? "unset",
    left: props.position?.left ?? 0,
    right: props.position?.right ?? "unset",
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>{props.trigger}</Dialog.Trigger>
      <DialogOverlay />
      <DialogContent css={position}>{props.children({ hide })}</DialogContent>
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

const DialogContent = styled(Dialog.Content, {
  position: "absolute",
  [prefersMotionSelector]: {
    "&[data-state='open']": {
      animation: `${slideInFromTop} $2 ease`,
    },
    "&[data-state='closed']": {
      animation: `${slideOutToTop} $2 ease`,
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
  bg: "$overlay",
  position: "absolute",
  inset: 0,
  [prefersMotionSelector]: {
    "&[data-state='open']": {
      animation: `${fadeIn} $2 ease`,
    },
    "&[data-state='closed']": {
      animation: `${fadeOut} $2 ease`,
    },
  },
});
