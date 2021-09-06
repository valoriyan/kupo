import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import { styled } from "#/styling";

export const PageTransition = ({ children }: PropsWithChildren<unknown>) => {
  const router = useRouter();
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const pageTransition = isFirstRender.current
    ? {} // Don't run transition animation on initial page load
    : router.pathname.includes("add-content")
    ? slideUpFromBottom
    : slideInFromLeft;

  return (
    <ContentArea>
      <AnimatePresence>
        <TransitionWrapper
          // By providing this key, this component will remount when the route changes
          key={router.route}
          transition={{ duration: 0.5 }}
          {...pageTransition}
        >
          <CurrentContent>{children}</CurrentContent>
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

const slideInFromLeft = {
  initial: { translateX: "100%" },
  animate: { translateX: 0 },
  exit: { translateX: "100%" },
};

const slideUpFromBottom = {
  initial: { translateY: "100%" },
  animate: { translateY: 0 },
  exit: { translateY: "100%" },
};
