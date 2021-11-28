import { HTTPResponse } from "src/types/httpResponse";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword } from "./utilities";
import { AuthController } from "./authController";
import { grantNewAccessToken } from "./utilities/grantNewAccessToken";
import { AuthFailureReason, FailedAuthResponse, SuccessfulAuthResponse } from "./models";

export interface RegisterUserRequestBody {
  email: string;
  password: string;
  username: string;
}

export async function handleRegisterUser({
  requestBody,
  controller,
}: {
  requestBody: RegisterUserRequestBody;
  controller: AuthController;
}): Promise<HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse>> {
  const userId = uuidv4();
  const { email, username, password } = requestBody;

  const encryptedPassword = encryptPassword({ password });

  try {
    await controller.databaseService.tableNameToServicesMap.usersTableService.createUser({
      userId,
      email,
      username,
      encryptedPassword,
    });

    return grantNewAccessToken({
      controller,
      userId,
      jwtPrivateKey: process.env.JWT_PRIVATE_KEY as string,
      successStatusCode: 201,
    });
  } catch (error) {
    console.log("error", error);
    controller.setStatus(401);
    return { error: { reason: AuthFailureReason.UnknownCause } };
  }
}
