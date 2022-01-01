import { HTTPResponse } from "src/types/httpResponse";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword } from "./utilities";
import { AuthController } from "./authController";
import { grantNewAccessToken } from "./utilities/grantNewAccessToken";
import { SuccessfulAuthResponse } from "./models";

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

  const usernameErrorReason = validateUsername({username});
  if (!!usernameErrorReason) {
    return {
      error: {
        reason: usernameErrorReason,
      }
    }
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
      jwtPrivateKey: process.env.JWT_PRIVATE_KEY as string,
      successStatusCode: 201,
    });

    if (newAccessTokenResponse.success) {
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

function validateUsername({
  username,
}: {
  username: string;
}): null | FailedToRegisterUserResponseReason {
  if (/^[0-9a-z]+$/.test(username)) {
    return FailedToRegisterUserResponseReason.AllUsernameCharactersMustBeLowercaseEnglishLettersOrDigits;
  }

  return null;
}
