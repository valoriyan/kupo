import { PropsWithChildren } from "react";
import { Box, Grid } from "#/components/Layout";
import { Footer } from "./Footer";

export const AppLayout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <Grid css={{ height: "100vh", gridTemplateRows: "minmax(0, 1fr) auto" }}>
      <Box css={{ height: "100%", overflow: "auto" }}>{children}</Box>
      <Box>
        <Footer />
      </Box>
    </Grid>
  );
};
