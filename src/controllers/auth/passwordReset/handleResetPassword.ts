import { getEnvironmentVariable } from "../../../utilities";
import { HTTPResponse } from "../../../types/httpResponse";
import { AuthController } from "../authController";
import { verify } from "jsonwebtoken";
import { ResetPasswordJWTData } from "../../../services/emailService/models";
import { encryptPassword } from "../utilities";

export interface ResetPasswordRequestBody {
  token: string;
  password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResetPasswordSuccess {}

export enum ResetPasswordFailedReason {
  InvalidToken = "InvalidToken",
  InvalidPassword = "InvalidPassword",
}

export interface ResetPasswordFailed {
  reason: ResetPasswordFailedReason;
}

export async function handleResetPassword({
  controller,
  requestBody,
}: {
  controller: AuthController;
  requestBody: ResetPasswordRequestBody;
}): Promise<HTTPResponse<ResetPasswordFailed, ResetPasswordSuccess>> {
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");

  const { token, password } = requestBody;

  try {
    const jwtData = verify(token, jwtPrivateKey) as ResetPasswordJWTData;
    const userId = jwtData.resetPasswordData.userId;

    const encryptedPassword = encryptPassword({ password });

    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserPassword(
      {
        userId,
        encryptedPassword,
      },
    );

    return {
      success: {},
    };
  } catch {
    return { error: { reason: ResetPasswordFailedReason.InvalidToken } };
  }
}
