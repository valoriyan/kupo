import { GenericResponseFailedReason } from "../../controllers/models";
import { AuthFailedReason } from "../../controllers/auth/models";
import { Controller } from "tsoa";
import { getEnvironmentVariable } from "..";

export enum EitherType {
  failure = "failure",
  success = "success",
}

export type ErrorReasonTypes<ErrorReason> =
  | ErrorReason
  | AuthFailedReason
  | GenericResponseFailedReason;

export interface FailureResponse<ErrorReason> {
  type: EitherType.failure;
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
  | FailureResponse<ErrorReason>
  | SuccessResponse<SuccessType>;

export type InternalServiceResponse<ErrorReason, SuccessType> = Either<
  ErrorReason,
  SuccessType
>;

export type HTTPResponse<ErrorReason, SuccessType> = Either<ErrorReason, SuccessType>;

export type SecuredHTTPResponse<ErrorReason, SuccessType> = Either<
  ErrorReason,
  SuccessType
>;

export const Success = <SuccessType>(data: SuccessType): SuccessResponse<SuccessType> => {
  return {
    type: EitherType.success,
    success: data,
  };
};

export const Failure = <ErrorReason>({
  controller,
  httpStatusCode,
  reason,
  error,
  additionalErrorInformation,
}: {
  controller: Controller;
  httpStatusCode: number;
  reason: ErrorReason;
  error?: unknown;
  additionalErrorInformation?: string;
}): FailureResponse<ErrorReason> => {
  controller.setStatus(httpStatusCode);

  const productionEnvironment: string = getEnvironmentVariable("PRODUCTION_ENVIRONMENT");

  console.log("Error:");
  console.log(error);
  console.log(`reason: ${reason}`);
  console.log(`additionalErrorInformation: ${additionalErrorInformation}`);

  if (productionEnvironment === "prod") {
    // TODO: log error

    return {
      type: EitherType.failure,
      error: {
        reason,
        errorMessage: "Internal Server Error",
      },
    };
  }

  return {
    type: EitherType.failure,
    error: {
      reason,
      errorMessage: getMessageFromError(error),
      additionalErrorInformation,
    },
  };
};

// https://stackoverflow.com/questions/54649465/how-to-do-try-catch-and-finally-statements-in-typescript
function getMessageFromError(error: unknown): string {
  if (typeof error === "string") {
    return error.toUpperCase(); // works, `e` narrowed to string
  } else if (error instanceof Error) {
    return error.message; // works, `e` narrowed to Error
  }
  return "";
}

export const collectMappedResponses = <T>({
  mappedResponses,
}: {
  mappedResponses: InternalServiceResponse<string, T>[];
}): FailureResponse<string> | SuccessResponse<T[]> => {
  const firstOccuringError = mappedResponses.find((responseElement) => {
    return responseElement.type === EitherType.failure;
  });
  if (firstOccuringError) {
    return firstOccuringError as FailureResponse<ErrorReasonTypes<string>>;
  }

  const successes = mappedResponses.map(
    (responseElement) => (responseElement as SuccessResponse<T>).success,
  );

  return Success(successes);
};
