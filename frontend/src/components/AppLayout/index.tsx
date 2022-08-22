import { PropsWithChildren, useEffect, useState } from "react";
import create from "zustand";
import { Box, Flex, Grid } from "#/components/Layout";
import { MAX_APP_CONTENT_WIDTH } from "#/constants";
import { getAccessToken, useIsAuthenticated } from "#/contexts/auth";
import { styled } from "#/styling";
import { useScrollPosition } from "#/utils/useScrollPosition";
import { ScrollArea } from "../ScrollArea";
import { Footer } from "./Footer";
import { NoAuthFooter } from "./NoAuthFooter";
import { NoAuthSidePanel } from "./NoAuthSidePanel";
import { SidePanel } from "./SidePanel";
import { useWebsocketState, WebsocketStateProvider } from "./WebsocketContext";

export interface AppLayoutScrollPositionState {
  scrollPosition: number;
  setScrollPosition: (scrollPosition: number) => void;
  contentContainer: HTMLDivElement | undefined;
  setContentContainer: (contentContainer: HTMLDivElement | undefined) => void;
}

export const useAppLayoutState = create<AppLayoutScrollPositionState>((set) => ({
  scrollPosition: 0,
  setScrollPosition: (scrollPosition) => set({ scrollPosition }),
  contentContainer: undefined,
  setContentContainer: (contentContainer) => set({ contentContainer }),
}));

export interface AppLayoutProps {
  trackContentScroll?: boolean;
}

export const AppLayout = (props: PropsWithChildren<AppLayoutProps>) => {
  return (
    <WebsocketStateProvider>
      <AppLayoutInner {...props} />
    </WebsocketStateProvider>
  );
};

const AppLayoutInner = ({
  children,
  trackContentScroll,
}: PropsWithChildren<AppLayoutProps>) => {
  const isAuthenticated = useIsAuthenticated();
  const generateSocket = useWebsocketState((state) => state.generateSocket);
  const hasAccessToken = isAuthenticated === true;
  const setScrollPosition = useAppLayoutState((store) => store.setScrollPosition);
  const setContentContainer = useAppLayoutState((store) => store.setContentContainer);

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      if (!accessToken) return;
      generateSocket({ accessToken });
    });
  }, [generateSocket, hasAccessToken]);

  const [container, ref] = useState<HTMLDivElement | null>(null);
  useScrollPosition(trackContentScroll ? container : null, setScrollPosition);

  useEffect(() => {
    setContentContainer(container ?? undefined);
  }, [container, setContentContainer]);

  return (
    <Wrapper>
      <SidePanelWrapper>
        {isAuthenticated === "unset" ? null : isAuthenticated ? (
          <SidePanel />
        ) : (
          <NoAuthSidePanel />
        )}
      </SidePanelWrapper>
      <Content ref={ref}>{children}</Content>
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
  maxWidth: `calc((100vw - ${MAX_APP_CONTENT_WIDTH}) / 2)`,
  display: "none",
  "@md": { display: "block" },
});

const Content = styled(ScrollArea, {
  "@md": { maxWidth: MAX_APP_CONTENT_WIDTH },
  height: "100%",
});
