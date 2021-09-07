import { ComponentProps, Key, ReactNode, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { styled, usePrefersMotion } from "#/styling";

export type Transition = Pick<
  ComponentProps<typeof motion.div>,
  "initial" | "animate" | "exit"
>;

export interface TransitionAreaProps {
  transitionKey: Key;
  animation: Transition;
  children: ReactNode;
}

export const TransitionArea = (props: TransitionAreaProps) => {
  const isFirstRender = useRef(true);
  const prefersMotion = usePrefersMotion();

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const transitionAnimation =
    isFirstRender.current || !prefersMotion ? noAnimation : props.animation;

  return (
    <ContentArea>
      <AnimatePresence>
        <TransitionWrapper
          key={props.transitionKey}
          transition={{ duration: 0.4 }}
          {...transitionAnimation}
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
