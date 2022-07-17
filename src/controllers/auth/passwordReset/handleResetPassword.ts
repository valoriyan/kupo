import { getEnvironmentVariable } from "../../../utilities";
import { EitherType, HTTPResponse } from "../../../utilities/monads";
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

export async function handleResetPassword({
  controller,
  requestBody,
}: {
  controller: AuthController;
  requestBody: ResetPasswordRequestBody;
}): Promise<HTTPResponse<ResetPasswordFailedReason, ResetPasswordSuccess>> {
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");

  const { token, password } = requestBody;

  try {
    const jwtData = verify(token, jwtPrivateKey) as ResetPasswordJWTData;
    const userId = jwtData.resetPasswordData.userId;

    const encryptedPassword = encryptPassword({ password });

    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserPassword(
      {
        controller,
        userId,
        encryptedPassword,
      },
    );

    return {
      type: EitherType.success,
      success: {},
    };
  } catch (error) {
    console.log(`handleResetPassword error: ${error}`);
    return {
      type: EitherType.failure,
      error: { reason: ResetPasswordFailedReason.InvalidToken },
    };
  }
}
