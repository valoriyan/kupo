import { Key, ReactNode } from "react";
import { AnimatePresence, motion, Variant, Variants } from "framer-motion";
import { CSS, styled, usePrefersMotion } from "#/styling";

export type Transition = Record<"initial" | "animate" | "exit", Variant> & {
  duration?: number;
};

export interface TransitionAreaProps {
  transitionKey: Key;
  animation: Transition;
  children: ReactNode;
  css?: CSS;
  // custom is defined as being any by framer-motion
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom?: any;
}

export const TransitionArea = (props: TransitionAreaProps) => {
  const prefersMotion = usePrefersMotion();
  const { duration, ...animation } = props.animation;
  const transitionAnimation = !prefersMotion ? noAnimation : animation;

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
          <CurrentContent>{props.children}</CurrentContent>
        </TransitionWrapper>
      </AnimatePresence>
    </ContentArea>
  );
};

const ContentArea = styled("div", {
  height: "100%",
  width: "100%",
  overflow: "hidden",
  position: "relative",
});

const TransitionWrapper = styled(motion.div, {
  height: "100%",
  width: "100%",
  overflow: "hidden",
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
});

const CurrentContent = styled("div", {
  height: "100%",
  width: "100%",
  overflow: "auto",
  bg: "$background1",
});

const noAnimation = {
  initial: { translateX: 0, translateY: 0 },
  animate: { translateX: 0, translateY: 0 },
  exit: { translateX: 0, translateY: 0 },
};
