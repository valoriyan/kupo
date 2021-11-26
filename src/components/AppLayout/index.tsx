import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import { Box, Flex, Grid } from "#/components/Layout";
import { getAccessToken, useIsAuthenticated } from "#/contexts/auth";
import { styled } from "#/styling";
import { TransitionArea } from "../TransitionArea";
import { Footer } from "./Footer";
import { NoAuthFooter } from "./NoAuthFooter";
import { NoAuthSidePanel } from "./NoAuthSidePanel";
import { SidePanel } from "./SidePanel";
import { useWebsocketState, WebsocketStateProvider } from "./WebsocketContext";

const AppLayoutInner = ({ children }: PropsWithChildren<unknown>) => {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const pageTransition = router.pathname.includes("add-content")
    ? slideUpFromBottom
    : slideInFromRight;

  const { generateSocket } = useWebsocketState();

  const onMount = async () => {
    getAccessToken().then((accessToken) => {
      if (!!accessToken) {
        generateSocket({ accessToken });
      }
    });
  };

  useEffect(() => {
    onMount();
  });

  return (
    <Wrapper>
      <SidePanelWrapper>
        {isAuthenticated === "unset" ? null : isAuthenticated ? (
          <SidePanel />
        ) : (
          <NoAuthSidePanel />
        )}
      </SidePanelWrapper>
      <TransitionArea transitionKey={router.route} animation={pageTransition}>
        <Box css={{ "@md": { maxWidth: "600px" }, height: "100%" }}>{children}</Box>
      </TransitionArea>
      <Box css={{ zIndex: 1, "@md": { display: "none" } }}>
        {isAuthenticated === "unset" ? null : isAuthenticated ? (
          <Footer />
        ) : (
          <NoAuthFooter />
        )}
      </Box>
    </Wrapper>
  );
};

export const AppLayout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <WebsocketStateProvider>
      <AppLayoutInner>
        {children}
      </AppLayoutInner>
    </WebsocketStateProvider>
  );
};

const Wrapper = styled(Grid, {
  height: "100vh",
  overflow: "hidden",
  gridTemplateRows: "minmax(0, 1fr) auto",
  "@md": {
    gridTemplateRows: "minmax(0, 1fr)",
    gridTemplateColumns: "auto minmax(0, 1fr)",
  },
});

const SidePanelWrapper = styled(Flex, {
  height: "100%",
  minWidth: "260px",
  width: "100vw",
  maxWidth: "calc((100vw - 600px) / 2)",
  display: "none",
  "@md": { display: "block" },
});

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
