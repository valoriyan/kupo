import { FailedAuthResponse } from "../controllers/auth/authController";

export interface HTTPResponse<ErrorType, SuccessType> {
  error?: ErrorType;
  success?: SuccessType;
}

export interface SecuredHTTPResponse<ErrorType, SuccessType> {
  error?: ErrorType | FailedAuthResponse;
  success?: SuccessType;
}
