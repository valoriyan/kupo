import { PropsWithChildren, useEffect } from "react";
import { Flex } from "#/components/Layout";
import { APP_FOOTER_HEIGHT, MAX_APP_CONTENT_WIDTH, SIDE_PANEL_WIDTH } from "#/constants";
import { getAccessToken, useIsAuthenticated } from "#/contexts/auth";
import { styled } from "#/styling";
import { useVerifyEmailState } from "../VerifyEmailModal";
import { Footer } from "./Footer";
import { NoAuthFooter, NO_AUTH_FOOTER_HEIGHT } from "./NoAuthFooter";
import { NoAuthSidePanel } from "./NoAuthSidePanel";
import { SidePanel } from "./SidePanel";
import { useWebsocketState, WebsocketStateProvider } from "./WebsocketContext";
export interface AppLayoutScrollPositionState {
  scrollPosition: number;
  setScrollPosition: (scrollPosition: number) => void;
  contentContainer: HTMLDivElement | undefined;
  setContentContainer: (contentContainer: HTMLDivElement | undefined) => void;
  scrollToTop: (animate?: boolean) => void;
}

export const AppLayout = (props: PropsWithChildren<unknown>) => {
  return (
    <WebsocketStateProvider>
      <AppLayoutInner {...props} />
    </WebsocketStateProvider>
  );
};

const AppLayoutInner = ({ children }: PropsWithChildren<unknown>) => {
  const isAuthenticated = useIsAuthenticated();
  const verifyEmailState = useVerifyEmailState();
  const generateSocket = useWebsocketState((state) => state.generateSocket);
  const hasAccessToken = isAuthenticated === true;

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      if (!accessToken) return;
      generateSocket({ accessToken });
    });
  }, [generateSocket, hasAccessToken]);

  const contentPaddingBottom =
    isAuthenticated === "unset"
      ? 0
      : isAuthenticated
      ? APP_FOOTER_HEIGHT
      : NO_AUTH_FOOTER_HEIGHT;

  return (
    <>
      <SidePanelWrapper>
        {isAuthenticated === "unset" ? null : isAuthenticated ? (
          <SidePanel verifyEmailState={verifyEmailState} />
        ) : (
          <NoAuthSidePanel />
        )}
      </SidePanelWrapper>
      <Content css={{ pb: contentPaddingBottom, "@md": { pb: 0 } }}>{children}</Content>
      <FooterWrapper>
        {isAuthenticated === "unset" ? null : isAuthenticated ? (
          <Footer verifyEmailState={verifyEmailState} />
        ) : (
          <NoAuthFooter />
        )}
      </FooterWrapper>
    </>
  );
};

const SidePanelWrapper = styled(Flex, {
  position: "fixed",
  zIndex: 1,
  width: SIDE_PANEL_WIDTH,
  height: "100vh",
  display: "none",
  "@md": { display: "block" },
});

const Content = styled("div", {
  "@md": {
    maxWidth: MAX_APP_CONTENT_WIDTH,
    marginLeft: SIDE_PANEL_WIDTH,
  },
});

const FooterWrapper = styled("div", {
  "@md": { display: "none" },
  zIndex: 1,
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
});
