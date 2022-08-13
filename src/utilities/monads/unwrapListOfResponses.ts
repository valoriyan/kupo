import {
  InternalServiceResponse,
  FailureResponse,
  SuccessResponse,
  EitherType,
  ErrorReasonTypes,
  Success,
} from "./index";

export enum UnwrapListOfEitherResponsesFailureHandlingMethod {
  FAIL_UPON_ENCOUNTERING_FIRST_FAILURE = "FAIL_UPON_ENCOUNTERING_FIRST_FAILURE",
  SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE = "SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE",
}

export const unwrapListOfEitherResponses = <T>({
  eitherResponses,
  failureHandlingMethod,
}: {
  eitherResponses: InternalServiceResponse<string, T>[];
  failureHandlingMethod: UnwrapListOfEitherResponsesFailureHandlingMethod;
}): FailureResponse<string> | SuccessResponse<T[]> => {
  if (
    failureHandlingMethod ===
    UnwrapListOfEitherResponsesFailureHandlingMethod.FAIL_UPON_ENCOUNTERING_FIRST_FAILURE
  ) {
    return unwrapListOfEitherResponsesFailingUponFirstFailure({ eitherResponses });
  } else if (
    failureHandlingMethod ===
    UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE
  ) {
    return unwrapListOfEitherResponsesSucceedingWithAnySuccessesElseFailingOnFirstFailure(
      {
        eitherResponses,
      },
    );
  }

  throw new Error("Unknown failure handling method provided.");
};

const unwrapListOfEitherResponsesSucceedingWithAnySuccessesElseFailingOnFirstFailure = <
  T,
>({
  eitherResponses,
}: {
  eitherResponses: InternalServiceResponse<string, T>[];
}): FailureResponse<string> | SuccessResponse<T[]> => {
  // If eitherResponses are already empty, successfully return empty array
  if (eitherResponses.length === 0) {
    return Success([]);
  }

  // Get all the successes
  const successfulResponses = eitherResponses
    .filter(
      (eitherResponse): eitherResponse is SuccessResponse<T> =>
        eitherResponse.type === EitherType.success,
    )
    .map((successResponse) => successResponse.success);

  if (successfulResponses.length > 0) {
    return Success(successfulResponses);
  }

  const firstOccuringFailure = eitherResponses.find((responseElement) => {
    return responseElement.type === EitherType.failure;
  });

  return firstOccuringFailure as FailureResponse<ErrorReasonTypes<string>>;
};

const unwrapListOfEitherResponsesFailingUponFirstFailure = <T>({
  eitherResponses,
}: {
  eitherResponses: InternalServiceResponse<string, T>[];
}): FailureResponse<string> | SuccessResponse<T[]> => {
  const firstOccuringFailure = eitherResponses.find((responseElement) => {
    return responseElement.type === EitherType.failure;
  });

  if (firstOccuringFailure) {
    return firstOccuringFailure as FailureResponse<ErrorReasonTypes<string>>;
  }

  const successes = eitherResponses.map(
    (responseElement) => (responseElement as SuccessResponse<T>).success,
  );

  return Success(successes);
};
