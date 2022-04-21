import { AuthFailed } from "../controllers/auth/models";

export interface HTTPResponse<ErrorType, SuccessType> {
  error?: ErrorType;
  success?: SuccessType;
}

export interface SecuredHTTPResponse<ErrorType, SuccessType> {
  error?: ErrorType | AuthFailed;
  success?: SuccessType;
}
