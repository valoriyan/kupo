import { EitherType } from "../../types/monads";
import { Controller } from "tsoa";

export function generateErrorResponse<T>({
  controller,
  errorReason,
  httpStatusCode,
  additionalErrorInformation,
  error,
}: {
  controller: Controller;
  errorReason: T;
  httpStatusCode: number;
  error?: unknown;
  additionalErrorInformation?: string;
}): {
  type: EitherType.error;
  error: {
    reason: T;
    errorMessage?: string;
    additionalErrorInformation?: string;
  };
} {
  controller.setStatus(httpStatusCode);
  return {
    type: EitherType.error,
    error: {
      reason: errorReason,
      errorMessage: getMessageFromError(error),
      additionalErrorInformation,
    },
  };
}

// https://stackoverflow.com/questions/54649465/how-to-do-try-catch-and-finally-statements-in-typescript
function getMessageFromError(error: unknown): string {
  if (typeof error === "string") {
    return error.toUpperCase(); // works, `e` narrowed to string
  } else if (error instanceof Error) {
    return error.message; // works, `e` narrowed to Error
  }
  return "";
}
