import { getEnvironmentVariable } from "../../../utilities";
import { HTTPResponse } from "../../../types/httpResponse";
import { AuthController } from "../authController";
import { verify } from "jsonwebtoken";

export interface CheckResetPasswordTokenValidityRequestBody {
  token: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CheckResetPasswordTokenValiditySuccess {}

export enum CheckResetPasswordTokenValidityFailedReason {
  InvalidToken = "InvalidToken",
}

export async function handleCheckResetPasswordTokenValidity({
  requestBody,
}: {
  controller: AuthController;
  requestBody: CheckResetPasswordTokenValidityRequestBody;
}): Promise<
  HTTPResponse<
  CheckResetPasswordTokenValidityFailedReason,
    CheckResetPasswordTokenValiditySuccess
  >
> {
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");

  const { token } = requestBody;

  try {
    verify(token, jwtPrivateKey);
  } catch {
    return {
      error: { reason: CheckResetPasswordTokenValidityFailedReason.InvalidToken },
    };
  }

  return {
    success: {},
  };
}
