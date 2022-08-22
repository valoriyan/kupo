import "axios";

declare module "axios" {
  // Extends Axios request config to support custom properties
  interface AxiosRequestConfig {
    authStrat?: "noToken" | "tryToken" | "requireToken";
  }
}
