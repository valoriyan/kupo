import { Root, Trigger, Content } from "@radix-ui/react-popover";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { styled, usePrefersMotion } from "#/styling";

export interface PopoverRenderProps {
  hide: () => void;
}

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode | ((renderProps: PopoverRenderProps) => ReactNode);
  align?: "start" | "center" | "end" | undefined;
  side?: "bottom" | "left" | "right" | "top" | undefined;
}

export const Popover = (props: PopoverProps) => {
  const prefersMotion = usePrefersMotion();
  const [open, setOpen] = useState(false);
  const hide = () => setOpen(false);

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger>{props.trigger}</Trigger>
      <AnimatePresence initial={false}>
        {open ? (
          <ContentWrapper sideOffset={8} align={props.align} side={props.side} forceMount>
            <ContentBody
              transition={{ duration: prefersMotion ? 0.25 : 0 }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0.5 }}
            >
              {typeof props.children === "function"
                ? props.children({ hide })
                : props.children}
            </ContentBody>
          </ContentWrapper>
        ) : null}
      </AnimatePresence>
    </Root>
  );
};

const ContentWrapper = styled(Content, {
  zIndex: "$dropdown",
});

const ContentBody = styled(motion.div, {
  bg: "$background1",
  borderRadius: "$1",
  border: "solid $borderWidths$1 $border",
  transformOrigin: "var(--radix-popover-content-transform-origin)",
});
