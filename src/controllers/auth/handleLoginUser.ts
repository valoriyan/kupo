import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  HTTPResponse,
} from "../../utilities/monads";
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
}): Promise<HTTPResponse<ErrorReasonTypes<string | AuthFailedReason>, AuthSuccess>> {
  const { username, password } = requestBody;
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");

  const selectUser_WITH_PASSWORD_ByUsernameResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUser_WITH_PASSWORD_ByUsername(
      { controller, username },
    );
  if (selectUser_WITH_PASSWORD_ByUsernameResponse.type === EitherType.failure) {
    return selectUser_WITH_PASSWORD_ByUsernameResponse;
  }
  const { success: user_WITH_PASSWORD } = selectUser_WITH_PASSWORD_ByUsernameResponse;

  if (!!user_WITH_PASSWORD) {
    const hasMatchedPassword =
      encryptPassword({ password }) === user_WITH_PASSWORD.encryptedPassword;
    if (hasMatchedPassword) {
      const userId = user_WITH_PASSWORD.userId;
      return grantNewAccessToken({ controller, userId, jwtPrivateKey });
    }
  }
  return Failure({
    controller,
    httpStatusCode: 401,
    reason: AuthFailedReason.WrongPassword,
    error: "Wrong password at handleLoginUser",
    additionalErrorInformation: "Wrong password at handleLoginUser",
  });
}
