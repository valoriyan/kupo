import Router from "next/router";
import { ComponentType, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { LocalStorageItem } from "#/utils/storage";
import { Api } from "#/api";
import { FullScreenLoadingArea } from "#/components/LoadingArea";

const storedAccessToken = LocalStorageItem<string>("accessToken");

export const getAccessToken = async () => {
  const storedToken = storedAccessToken.get();

  if (storedToken) {
    const tokenData = jwt.decode(storedToken);
    if (!tokenData || typeof tokenData !== "object") {
      logout();
      return;
    }
    const expiresAt = new Date((tokenData.exp ?? 0) * 1000);
    // Whether or not the token has at least a minute of life left
    const expiresSoon = expiresAt.valueOf() - Date.now() < 1000 * 60;

    if (expiresSoon) {
      try {
        const newTokenResponse = await Api.refreshAccessToken();
        const newToken = newTokenResponse.data.success?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          return newToken;
        }
      } catch {
        return storedToken;
      }
    }
  }

  return storedToken;
};

export const setAccessToken = (accessToken: string) => {
  storedAccessToken.set(accessToken);
};

export const logout = async () => {
  storedAccessToken.remove();
  await Api.logout();
  Router.push("/login");
};

export const ProtectedPage = <T extends unknown>(Component: ComponentType<T>) => {
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
      return <FullScreenLoadingArea size="large" />;
    }

    // Cast to `any` to get around TypeScript limitation regaring HOCs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Component {...(props as any)} />;
  };
  return ProtectedComponent;
};

export const RedirectAfterAuth = <T extends unknown>(Component: ComponentType<T>) => {
  const ProtectedComponent = (props: T) => {
    const [isAuthenticated, setIsAuthenticated] = useState<"unset" | boolean>("unset");

    useEffect(() => {
      const checkIsAuthenticated = async () => {
        const accessToken = await getAccessToken();
        if (accessToken) {
          setIsAuthenticated(true);
          Router.replace("/");
        } else {
          setIsAuthenticated(false);
        }
      };
      checkIsAuthenticated();
    }, []);

    if (isAuthenticated === "unset" || isAuthenticated === true) {
      return <FullScreenLoadingArea size="large" />;
    }

    // Cast to `any` to get around TypeScript limitation regaring HOCs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Component {...(props as any)} />;
  };
  return ProtectedComponent;
};
