import { EitherType, HTTPResponse } from "../../types/monads";
import { getEnvironmentVariable } from "../../utilities";
import { AuthController } from "./authController";
import { AuthFailedReason, AuthSuccess } from "./models";
import { encryptPassword } from "./utilities";
import { grantNewAccessToken } from "./utilities/grantNewAccessToken";

export interface LoginUserRequestBody {
  username: string;
  password: string;
}

export async function handleLoginUser({
  controller,
  requestBody,
}: {
  controller: AuthController;
  requestBody: LoginUserRequestBody;
}): Promise<HTTPResponse<AuthFailedReason, AuthSuccess>> {
  const { username, password } = requestBody;
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");

  try {
    const user_WITH_PASSWORD =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUser_WITH_PASSWORD_ByUsername(
        { username },
      );
    if (!!user_WITH_PASSWORD) {
      const hasMatchedPassword =
        encryptPassword({ password }) === user_WITH_PASSWORD.encryptedPassword;
      if (hasMatchedPassword) {
        const userId = user_WITH_PASSWORD.userId;
        return grantNewAccessToken({ controller, userId, jwtPrivateKey });
      }
    }

    controller.setStatus(401);
    return { type: EitherType.error, error: { reason: AuthFailedReason.WrongPassword } };
  } catch (error) {
    console.log("error", error);
    controller.setStatus(401);
    return { type: EitherType.error, error: { reason: AuthFailedReason.UnknownCause } };
  }
}
