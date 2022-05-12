import { UnrenderableUser } from "../../controllers/user/models";
import { getEnvironmentVariable } from "../../utilities";
import { EmailServiceInterface } from "./models";
import { generateResetPasswordToken, generateResetPasswordURL } from "./utilities";

export class LocalEmailService extends EmailServiceInterface {
  private static JWT_PRIVATE_KEY: string = getEnvironmentVariable("JWT_PRIVATE_KEY");
  private static FRONTEND_BASE_URL: string = getEnvironmentVariable("FRONTEND_BASE_URL");

  constructor() {
    super();
  }

  async sendResetPasswordEmail({ user }: { user: UnrenderableUser }): Promise<void> {
    const { userId } = user;
    const resetPasswordToken = generateResetPasswordToken({
      userId,
      jwtPrivateKey: LocalEmailService.JWT_PRIVATE_KEY,
    });

    const resetPasswordUrlWithToken = generateResetPasswordURL({
      frontendBaseUrl: LocalEmailService.FRONTEND_BASE_URL,
      resetPasswordToken,
    });

    console.log(`
      To reset password, go to ${resetPasswordUrlWithToken}
    `);

    return;
  }

  async sendWelcomeEmail({ user }: { user: UnrenderableUser }): Promise<void> {
    const { username } = user;

    console.log(`
      Hi ${username}!
    `);

    return;
  }
}
