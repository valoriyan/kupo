export interface SecuredHTTPRequest<T> {
  accessToken: string;
  data: T;
}
