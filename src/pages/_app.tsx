import type { AppProps } from "next/app";
import { ThemeProvider } from "#/styling/ThemeProvider";
import { globalStyles } from "#/styling/globalStyles";
import "#/styling/modernNormalize.css";

const PlayHouseApp = ({ Component, pageProps }: AppProps) => {
  globalStyles();
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default PlayHouseApp;
