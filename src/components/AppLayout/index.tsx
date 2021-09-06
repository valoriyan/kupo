import { PropsWithChildren } from "react";
import { Box, Grid } from "#/components/Layout";
import { useIsAuthenticated } from "#/contexts/auth";
import { Footer } from "./Footer";
import { NoAuthFooter } from "./NoAuthFooter";
import { PageTransition } from "./PageTransition";

export const AppLayout = ({ children }: PropsWithChildren<unknown>) => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Grid
      css={{
        height: "100vh",
        gridTemplateRows: "minmax(0, 1fr) auto",
        overflow: "hidden",
      }}
    >
      <PageTransition>{children}</PageTransition>
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
