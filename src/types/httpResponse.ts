import { GenericResponseFailedReason } from "../controllers/models";
import { AuthFailedReason } from "../controllers/auth/models";

export interface HTTPResponse<ErrorReason, SuccessType> {
  error?: {
    reason: ErrorReason | GenericResponseFailedReason;
    additionalErrorInformation?: string;
  };
  success?: SuccessType;
}

export interface SecuredHTTPResponse<ErrorReason, SuccessType> {
  error?: {
    reason: ErrorReason | GenericResponseFailedReason | AuthFailedReason;
    errorMessage?: string;
    additionalErrorInformation?: string;
  };
  success?: SuccessType;
}
