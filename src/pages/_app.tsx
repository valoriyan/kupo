import { IdProvider } from "@radix-ui/react-id";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AppLayout } from "#/components/AppLayout";
import { QueryClientProvider } from "#/contexts/queryClient";
import { globalStyles } from "#/styling/globalStyles";
import { ThemeProvider } from "#/styling/ThemeProvider";
import "#/styling/modernNormalize.css";

const KuponoApp = ({ Component, pageProps }: AppProps) => {
  globalStyles();
  const router = useRouter();

  /** These routes aren't a part of the app experience and should not include the footer, etc. */
  const noAppLayout = ["/login", "/sign-up", "/forgot-password"].includes(
    router.pathname,
  );

  return (
    <ThemeProvider>
      <IdProvider>
        <QueryClientProvider>
          {noAppLayout ? (
            <Component {...pageProps} />
          ) : (
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          )}
        </QueryClientProvider>
      </IdProvider>
    </ThemeProvider>
  );
};

export default KuponoApp;
