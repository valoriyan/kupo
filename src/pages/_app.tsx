import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { QueryClientProvider } from "#/contexts/queryClient";
import { globalStyles } from "#/styling/globalStyles";
import "#/styling/modernNormalize.css";
import { ThemeProvider } from "#/styling/ThemeProvider";
import { AppLayout } from "#/components/AppLayout";

const PlayHouseApp = ({ Component, pageProps }: AppProps) => {
  globalStyles();
  const router = useRouter();

  /** These routes aren't a part of the app experience and should not include the footer, etc. */
  const noAppLayout = ["/login", "/sign-up", "/forgot-password"].includes(
    router.pathname,
  );

  return (
    <ThemeProvider>
      <QueryClientProvider>
        {noAppLayout ? (
          <Component {...pageProps} />
        ) : (
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default PlayHouseApp;
