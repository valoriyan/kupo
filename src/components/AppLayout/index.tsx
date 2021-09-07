import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { Box, Grid } from "#/components/Layout";
import { useIsAuthenticated } from "#/contexts/auth";
import { TransitionArea } from "../TransitionArea";
import { Footer } from "./Footer";
import { NoAuthFooter } from "./NoAuthFooter";

export const AppLayout = ({ children }: PropsWithChildren<unknown>) => {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const pageTransition = router.pathname.includes("add-content")
    ? slideUpFromBottom
    : slideInFromRight;

  return (
    <Grid
      css={{
        height: "100vh",
        gridTemplateRows: "minmax(0, 1fr) auto",
        overflow: "hidden",
      }}
    >
      <TransitionArea transitionKey={router.route} animation={pageTransition}>
        {children}
      </TransitionArea>
      <Box css={{ zIndex: 1 }}>
        {isAuthenticated === "unset" ? null : isAuthenticated ? (
          <Footer />
        ) : (
          <NoAuthFooter />
        )}
      </Box>
    </Grid>
  );
};

const slideInFromRight = {
  initial: { translateX: "100%" },
  animate: { translateX: 0 },
  exit: { translateX: "100%" },
};

const slideUpFromBottom = {
  initial: { translateY: "100%" },
  animate: { translateY: 0 },
  exit: { translateY: "100%" },
};
