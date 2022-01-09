import { UnrenderableUser } from "../../controllers/user/models";
import { getEnvironmentVariable } from "../../utilities";
import { EmailServiceInterface } from "./models";
import { generateResetPasswordToken } from "./utilities";

export class LocalEmailService extends EmailServiceInterface {
  private static JWT_PRIVATE_KEY: string = getEnvironmentVariable("JWT_PRIVATE_KEY");

  constructor() {
    super();
  }

  async sendResetPasswordEmail({ user }: { user: UnrenderableUser }): Promise<void> {
    const { userId } = user;
    const resetPasswordToken = generateResetPasswordToken({
      userId,
      jwtPrivateKey: LocalEmailService.JWT_PRIVATE_KEY,
    });

    console.log(`
      To reset password, go to http://localhost:6006/resetpassword?token=${resetPasswordToken}
    `);

    return;
  }
}
