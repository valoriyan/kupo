import { IdProvider } from "@radix-ui/react-id";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { AppLayout } from "#/components/AppLayout";
import { QueryClientProvider } from "#/contexts/queryClient";
import { globalStyles } from "#/styling/globalStyles";
import { ThemeProvider } from "#/styling/ThemeProvider";
import { ModalContainer } from "#/components/Modal";
import "#/styling/modernNormalize.css";

export interface WithPageWithLayout {
  getLayout?: (page: ReactElement) => ReactNode;
}

type NextPageWithLayout = NextPage & WithPageWithLayout;

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const KuponoApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  globalStyles();
  const router = useRouter();

  /** These routes aren't a part of the app experience and should not include the footer, etc. */
  const noAppLayout = ["/login", "/sign-up", "/forgot-password", "/"].includes(
    router.pathname,
  );

  /** Use the layout defined at the page level, if available */
  const getLayout = Component.getLayout ?? ((page) => page);

  const page = getLayout(<Component {...pageProps} />);

  return (
    <ThemeProvider>
      <IdProvider>
        <QueryClientProvider>
          <ModalContainer />
          {noAppLayout ? page : <AppLayout>{page}</AppLayout>}
        </QueryClientProvider>
      </IdProvider>
    </ThemeProvider>
  );
};

export default KuponoApp;
