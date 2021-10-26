import { Root, Trigger, Content } from "@radix-ui/react-popover";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { styled } from "#/styling";

export interface PopoverRenderProps {
  hide: () => void;
}

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode | ((renderProps: PopoverRenderProps) => ReactNode);
}

export const Popover = (props: PopoverProps) => {
  const [open, setOpen] = useState(false);
  const hide = () => setOpen(false);

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger>{props.trigger}</Trigger>
      <AnimatePresence initial={false}>
        {open ? (
          <Content sideOffset={8} align="start" forceMount>
            <ContentBody
              transition={{ duration: 0.25 }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0.5 }}
            >
              {typeof props.children === "function"
                ? props.children({ hide })
                : props.children}
            </ContentBody>
          </Content>
        ) : null}
      </AnimatePresence>
    </Root>
  );
};

const ContentBody = styled(motion.div, {
  bg: "$background1",
  borderRadius: "$1",
  border: "solid $borderWidths$1 $border",
  zIndex: "$dropdown",
  transformOrigin: "var(--radix-popover-content-transform-origin)",
});
