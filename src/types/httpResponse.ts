import { FailedAuthResponse } from "src/controllers/auth/models";

export interface HTTPResponse<ErrorType, SuccessType> {
  error?: ErrorType;
  success?: SuccessType;
}

export interface SecuredHTTPResponse<ErrorType, SuccessType> {
  error?: ErrorType | FailedAuthResponse;
  success?: SuccessType;
}
