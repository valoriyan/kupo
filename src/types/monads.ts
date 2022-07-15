import { GenericResponseFailedReason } from "../controllers/models";
import { AuthFailedReason } from "../controllers/auth/models";

export enum EitherType {
  error = "error",
  success = "success",
}

export interface ErrorResponse<ErrorReason> {
  type: EitherType.error;
  error: {
    reason: ErrorReason | AuthFailedReason | GenericResponseFailedReason;
    errorMessage?: string;
    additionalErrorInformation?: string;
  };
}

export interface SuccessResponse<SuccessType> {
  type: EitherType.success;
  success: SuccessType;
}

export type Either<ErrorReason, SuccessType> =
  | ErrorResponse<ErrorReason>
  | SuccessResponse<SuccessType>;

export type HTTPResponse<ErrorReason, SuccessType> = Either<ErrorReason, SuccessType>;

export type SecuredHTTPResponse<ErrorReason, SuccessType> = Either<
  ErrorReason,
  SuccessType
>;
