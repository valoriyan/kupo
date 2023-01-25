import { EitherType, ErrorReasonTypes, HTTPResponse } from "../../../utilities/monads";
import { AuthController } from "../authController";

export interface GetPasswordResetEmailRequestBody {
  email: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetPasswordResetEmailSuccess {}

export enum GetPasswordResetEmailFailedReason {
  TooManyAttempts = "Too Many Attempts",
}

export async function handleGetPasswordResetEmail({
  controller,
  requestBody,
}: {
  controller: AuthController;
  requestBody: GetPasswordResetEmailRequestBody;
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | GetPasswordResetEmailFailedReason>,
    GetPasswordResetEmailSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const { email } = requestBody;

  //////////////////////////////////////////////////
  // Get User By Email
  //////////////////////////////////////////////////

  const selectMaybeUserByEmail =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByEmail(
      { controller, email },
    );
  if (selectMaybeUserByEmail.type === EitherType.failure) {
    return selectMaybeUserByEmail;
  }
  const { success: maybeUser } = selectMaybeUserByEmail;

  //////////////////////////////////////////////////
  // Don't Let Requestor Know If User With Email Exists or Not
  //////////////////////////////////////////////////
  if (!maybeUser) {
    return {
      type: EitherType.success,
      success: {},
    };
  }

  const user = maybeUser;

  //////////////////////////////////////////////////
  // Send Reset Password or Alert Requestor if Error
  //////////////////////////////////////////////////

  return await controller.emailService.sendResetPasswordEmail({ controller, user });
}
