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

export interface GetPasswordResetEmailFailed {
  reason: GetPasswordResetEmailFailedReason;
}

export async function handleGetPasswordResetEmail({
  controller,
  requestBody,
}: {
  controller: AuthController;
  requestBody: GetPasswordResetEmailRequestBody;
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | GetPasswordResetEmailFailed>,
    GetPasswordResetEmailSuccess
  >
> {
  const { email } = requestBody;

  const selectUserByEmailResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByEmail(
      { controller, email },
    );
  if (selectUserByEmailResponse.type === EitherType.failure) {
    return selectUserByEmailResponse;
  }
  const { success: user } = selectUserByEmailResponse;

  if (!!user) {
    controller.emailService.sendResetPasswordEmail({ user });
  }

  return {
    type: EitherType.success,
    success: {},
  };
}
