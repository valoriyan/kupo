import { HTTPResponse } from "../../../types/httpResponse";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword } from "../utilities";
import { AuthController } from "../authController";
import { grantNewAccessToken } from "../utilities/grantNewAccessToken";
import { SuccessfulAuthResponse } from "../models";
import { getEnvironmentVariable } from "../../../utilities";
import { validateUsername } from "./validations";

export interface RegisterUserRequestBody {
  email: string;
  password: string;
  username: string;
}

export enum FailedToRegisterUserResponseReason {
  UnknownCause = "Unknown Cause",
  AllUsernameCharactersMustBeLowercaseEnglishLettersOrDigits = "AllUsernameCharactersMustBeLowercaseEnglishLettersOrDigits",
}

export interface FailedToRegisterUserResponse {
  reason: FailedToRegisterUserResponseReason;
}

export async function handleRegisterUser({
  requestBody,
  controller,
}: {
  requestBody: RegisterUserRequestBody;
  controller: AuthController;
}): Promise<HTTPResponse<FailedToRegisterUserResponse, SuccessfulAuthResponse>> {
  const userId = uuidv4();
  const { email, username, password } = requestBody;

  const usernameErrorReason = validateUsername({ username });
  if (!!usernameErrorReason) {
    return {
      error: {
        reason: usernameErrorReason,
      },
    };
  }

  const encryptedPassword = encryptPassword({ password });

  try {
    await controller.databaseService.tableNameToServicesMap.usersTableService.createUser({
      userId,
      email,
      username,
      encryptedPassword,
    });

    const newAccessTokenResponse = grantNewAccessToken({
      controller,
      userId,
      jwtPrivateKey: getEnvironmentVariable("JWT_PRIVATE_KEY"),
      successStatusCode: 201,
    });

    if (newAccessTokenResponse.success) {
      try {
        const user =
          await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
            { userId },
          );
        if (!!user) {
          controller.emailService.sendWelcomeEmail({ user });
        }
      } catch (error) {
        console.log(`FAILED TO SEND WELCOME EMAIL | ${error}`);
      }

      return {
        success: newAccessTokenResponse.success,
      };
    }
    return {
      error: {
        reason: FailedToRegisterUserResponseReason.UnknownCause,
      },
    };
  } catch (error) {
    console.log("error", error);
    controller.setStatus(401);
    return { error: { reason: FailedToRegisterUserResponseReason.UnknownCause } };
  }
}
