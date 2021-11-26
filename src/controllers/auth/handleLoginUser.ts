import { AuthController } from "./authController";
import { AuthFailureReason } from "./models";
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
    requestBody: LoginUserRequestBody,
}) {
    const { username, password } = requestBody;
    const jwtPrivateKey = process.env.JWT_PRIVATE_KEY as string;

    try {
      const user_WITH_PASSWORD =
        await controller.databaseService.tableNameToServicesMap.usersTableService.selectUser_WITH_PASSWORD_ByUsername(
          {
            username,
          },
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
      return { error: { reason: AuthFailureReason.WrongPassword } };
    } catch (error) {
      console.log("error", error);
      controller.setStatus(401);
      return { error: { reason: AuthFailureReason.UnknownCause } };
    }    
}