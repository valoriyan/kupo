import { HTTPResponse } from "../../types/httpResponse";
import { AuthController } from "./authController";

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
}): Promise<HTTPResponse<GetPasswordResetEmailFailed, GetPasswordResetEmailSuccess>> {
  const { email } = requestBody;

  console.log("handleGetPasswordResetEmail WAS CALLED!!");

  const user =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByEmail(
      { email },
    );

  if (!!user) {
    controller.emailService.sendResetPasswordEmail({ user });
  }

  return {
    success: {},
  };
}
