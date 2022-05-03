import { AnimatePresence, motion, Variant, Variants } from "framer-motion";
import { Key, ReactNode } from "react";
import { CSS, styled, usePrefersMotion } from "#/styling";
import { Box } from "../Layout";
import { ScrollArea } from "../ScrollArea";

export type Transition = Record<"initial" | "animate" | "exit", Variant> & {
  duration?: number;
};

export interface TransitionAreaProps {
  transitionKey: Key;
  animation: Transition | undefined;
  children: ReactNode;
  handleScroll?: boolean;
  css?: CSS;
  // custom is defined as being any by framer-motion
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom?: any;
}

export const TransitionArea = (props: TransitionAreaProps) => {
  const prefersMotion = usePrefersMotion();
  const { duration, ...animation } = props.animation ?? noAnimation;
  const transitionAnimation = prefersMotion ? animation : noAnimation;
  const handleScroll = props.handleScroll ?? true;

  return (
    <ContentArea css={props.css as Record<string, string>}>
      <AnimatePresence initial={false} custom={props.custom}>
        <TransitionWrapper
          key={props.transitionKey}
          transition={{ duration: duration ?? 0.3 }}
          custom={props.custom}
          variants={transitionAnimation as unknown as Variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {handleScroll ? (
            <FullScrollArea>{props.children}</FullScrollArea>
          ) : (
            <Box css={{ size: "100%" }}>{props.children}</Box>
          )}
        </TransitionWrapper>
      </AnimatePresence>
    </ContentArea>
  );
};

const ContentArea = styled("div", {
  size: "100%",
  overflow: "hidden",
  position: "relative",
});

const TransitionWrapper = styled(motion.div, {
  size: "100%",
  overflow: "hidden",
  position: "absolute",
  inset: 0,
});

const FullScrollArea = styled(ScrollArea, { size: "100%" });

const noAnimation: Transition = {
  initial: { translateX: 0, translateY: 0 },
  animate: { translateX: 0, translateY: 0, zIndex: 1 },
  exit: { translateX: 0, translateY: 0 },
};
