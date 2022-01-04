import { HTTPResponse } from "../../types/httpResponse";
import { AuthController } from "./authController";

export interface ResetPasswordRequestBody {
  email: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyResetPasswordResponse {}

export enum FailedToResetPasswordResponseReason {
  TooManyAttempts = "Too Many Attempts",
}

export interface FailedToResetPasswordResponse {
  reason: FailedToResetPasswordResponseReason;
}

export async function handleResetPassword({
  controller,
  requestBody,
}: {
  controller: AuthController;
  requestBody: ResetPasswordRequestBody;
}): Promise<
  HTTPResponse<FailedToResetPasswordResponse, SuccessfullyResetPasswordResponse>
> {
  const { email } = requestBody;

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
