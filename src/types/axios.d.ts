import "axios";

declare module "axios" {
  // Extends Axios request config to have noAuth property
  interface AxiosRequestConfig {
    noAuth?: boolean;
  }
}
