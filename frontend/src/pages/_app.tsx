import { IdProvider } from "@radix-ui/react-id";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { ModalContainer } from "#/components/Modal";
import { QueryClientProvider } from "#/contexts/queryClient";
import { globalStyles } from "#/styling/globalStyles";
import { ThemeProvider } from "#/styling/ThemeProvider";
import "#/styling/modernNormalize.css";

export interface WithPageWithLayout {
  getLayout?: (page: ReactElement) => ReactNode;
}

type NextPageWithLayout = NextPage & WithPageWithLayout;

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const KupoApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  globalStyles();

  const page = Component.getLayout?.(<Component {...pageProps} />) ?? (
    <Component {...pageProps} />
  );

  return (
    <ThemeProvider>
      <IdProvider>
        <QueryClientProvider>
          <ModalContainer />
          {page}
        </QueryClientProvider>
      </IdProvider>
    </ThemeProvider>
  );
};

export default KupoApp;
