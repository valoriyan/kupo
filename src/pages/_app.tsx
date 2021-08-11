import type { AppProps } from "next/app";
import { QueryClientProvider } from "#/contexts/queryClient";
import { globalStyles } from "#/styling/globalStyles";
import { ThemeProvider } from "#/styling/ThemeProvider";
import "#/styling/modernNormalize.css";

const PlayHouseApp = ({ Component, pageProps }: AppProps) => {
  globalStyles();
  return (
    <ThemeProvider>
      <QueryClientProvider>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default PlayHouseApp;
