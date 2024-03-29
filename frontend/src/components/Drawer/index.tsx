import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import { styled, keyframes, prefersMotionSelector } from "#/styling";

export interface DrawerProps {
  trigger: ReactNode;
  position?: { top?: string; bottom?: string };
  children: (renderProps: { hide: () => void }) => ReactNode;
}

export const Drawer = (props: DrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hide = () => setIsOpen(false);

  const position = {
    top: props.position?.top ?? 0,
    bottom: props.position?.bottom ?? 0,
    left: "unset",
    right: 0,
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>{props.trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay css={{ ...position, left: "0" }} />
        <DialogContent css={position}>{props.children({ hide })}</DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const slideInFromRight = keyframes({
  "0%": { transform: "translateX(100%)" },
  "100%": { transform: "translateX(0%)" },
});
const slideOutToRight = keyframes({
  "0%": { transform: "translateX(0%)" },
  "100%": { transform: "translateX(100%)" },
});

const DialogContent = styled(Dialog.Content, {
  position: "fixed",
  boxShadow: "$1",
  zIndex: "$dialog",
  [prefersMotionSelector]: {
    "&[data-state='open']": {
      animation: `${slideInFromRight} $3 ease`,
    },
    "&[data-state='closed']": {
      animation: `${slideOutToRight} $3 ease`,
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
