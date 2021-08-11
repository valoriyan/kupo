import React from "react";
import { QueryClient, QueryClientProvider as BaseQueryClientProvider } from "react-query";

/**
 * An enum containing all of the cache keys that get passed to
 * `react-query`'s `useQuery` hook.
 */
export enum CacheKeys {
  User = "user",
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable React Query automatically refreshing data in the background.
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 3, // Will retry failed requests 3 times before displaying an error
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export const QueryClientProvider = (props: React.PropsWithChildren<unknown>) => {
  return (
    <BaseQueryClientProvider client={queryClient}>
      {props.children}
    </BaseQueryClientProvider>
  );
};
