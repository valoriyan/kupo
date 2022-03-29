import jwt from "jsonwebtoken";
import Router from "next/router";
import { ComponentType, useEffect, useState } from "react";
import { Api } from "#/api";
import { FullScreenLoadingArea } from "#/components/LoadingArea";
import { WithPageWithLayout } from "#/pages/_app";
import { LocalStorageItem } from "#/utils/storage";
import { queryClient } from "./queryClient";

export type PageComponent<T> = ComponentType<T> & WithPageWithLayout;

export interface AccessTokenPayload {
  userId: string;
}

const storedAccessToken = LocalStorageItem<string>("accessToken");

export const getAccessToken = async () => {
  const storedToken = storedAccessToken.get();

  if (storedToken) {
    const expiresSoon = doesTokenExpireSoon(storedToken);

    if (expiresSoon) {
      try {
        const newTokenResponse = await Api.refreshAccessToken({ authStrat: "noToken" });

        const newTokenError = newTokenResponse.data.error;
        if (newTokenError) {
          logout();
          return;
        }

        const newToken = newTokenResponse.data.success?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          return newToken;
        }

        return null;
      } catch {
        return null;
      }
    }

    return storedToken;
  }

  return null;
};

export const setAccessToken = (accessToken: string) => {
  storedAccessToken.set(accessToken);
};

export const logout = async () => {
  storedAccessToken.remove();
  await Api.logout();
  queryClient.clear();
  Router.push("/login");
};

const doesTokenExpireSoon = (token: string) => {
  const tokenData = jwt.decode(token);
  if (!tokenData || typeof tokenData !== "object") {
    logout();
    return;
  }
  const expiresAt = new Date((tokenData.exp ?? 0) * 1000);
  // Whether or not the token has at least a minute of life left
  const expiresSoon = expiresAt.valueOf() - Date.now() < 1000 * 60;
  return expiresSoon;
};

export const ProtectedPage = <T,>(Component: ComponentType<T>): PageComponent<T> => {
  const ProtectedComponent = (props: T) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkIsAuthenticated = async () => {
        const accessToken = await getAccessToken();
        if (accessToken) setIsAuthenticated(true);
        else Router.push("/login");
      };
      checkIsAuthenticated();
    }, []);

    if (!isAuthenticated) {
      return <FullScreenLoadingArea size="lg" />;
    }

    // Cast to `any` to get around TypeScript limitation regaring HOCs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Component {...(props as any)} />;
  };
  return ProtectedComponent;
};

export const RedirectAfterAuth = <T,>(Component: ComponentType<T>): PageComponent<T> => {
  const ProtectedComponent = (props: T) => {
    const [isAuthenticated, setIsAuthenticated] = useState<"unset" | boolean>("unset");

    useEffect(() => {
      const checkIsAuthenticated = async () => {
        const accessToken = await getAccessToken();
        if (accessToken) {
          setIsAuthenticated(true);
          Router.replace("/feed");
        } else {
          setIsAuthenticated(false);
        }
      };
      checkIsAuthenticated();
    }, []);

    if (isAuthenticated === "unset" || isAuthenticated === true) {
      return <FullScreenLoadingArea size="lg" />;
    }

    // Cast to `any` to get around TypeScript limitation regaring HOCs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Component {...(props as any)} />;
  };
  return ProtectedComponent;
};

export const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<"unset" | boolean>("unset");

  useEffect(() => {
    setIsAuthenticated(!!storedAccessToken.get());
    const callback = () => setIsAuthenticated(!!storedAccessToken.get());
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener("storage", callback);
    };
  }, []);

  return isAuthenticated;
};

export const useCurrentUserId = () => {
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const accessToken = storedAccessToken.get();
    setUserId(accessTokenToUserId(accessToken));
    const callback = () => setUserId(accessTokenToUserId(storedAccessToken.get()));
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener("storage", callback);
    };
  }, []);

  return userId;
};

const accessTokenToUserId = (accessToken: string | null) => {
  if (accessToken) {
    const decodedToken = jwt.decode(accessToken);
    if (typeof decodedToken === "object") {
      return (decodedToken?.data as AccessTokenPayload).userId;
    }
  }
  return undefined;
};
