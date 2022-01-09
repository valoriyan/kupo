import { HTTPResponse } from "../../types/httpResponse";
import { AuthController } from "./authController";

export interface GetPasswordResetEmailRequestBody {
  email: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyGotPasswordResetEmailResponse {}

export enum FailedToGetPasswordResetEmailResponseReason {
  TooManyAttempts = "Too Many Attempts",
}

export interface FailedToGetPasswordResetEmailResponse {
  reason: FailedToGetPasswordResetEmailResponseReason;
}

export async function handleGetPasswordResetEmail({
  controller,
  requestBody,
}: {
  controller: AuthController;
  requestBody: GetPasswordResetEmailRequestBody;
}): Promise<
  HTTPResponse<
    FailedToGetPasswordResetEmailResponse,
    SuccessfullyGotPasswordResetEmailResponse
  >
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