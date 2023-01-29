import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { RegisterUserFailedReason } from ".";
import { Controller } from "tsoa";

export function validateUsername({
  controller,
  username,
}: {
  controller: Controller;
  username: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
}): InternalServiceResponse<ErrorReasonTypes<string>, {}> {
  //////////////////////////////////////////////////
  // Username can only have digits or lowercase letters
  //////////////////////////////////////////////////

  if (!/^[0-9a-zåäö_-]+$/.test(username)) {
    const usernameErrorReason = RegisterUserFailedReason.ValidationError;
    return Failure({
      controller,
      httpStatusCode: 400,
      reason: usernameErrorReason,
      error: `${usernameErrorReason} at validateUsername`,
      additionalErrorInformation: `${usernameErrorReason} at validateUsername`,
    });
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
