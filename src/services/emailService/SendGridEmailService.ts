import { getEnvironmentVariable } from "../../utilities";
import { EmailServiceInterface } from "./models";
import { generateResetPasswordToken } from "./utilities";
import SendgridMailer from "@sendgrid/mail";
import { UnrenderableUser } from "../../controllers/user/models";

export class SendGridEmailService extends EmailServiceInterface {
  private static SENDGRID_API_KEY: string = getEnvironmentVariable("SENDGRID_API_KEY");
  private static jwtPrivateKey: string = getEnvironmentVariable("JWT_PRIVATE_KEY");

  constructor() {
    super();
  }

  static async get() {
    SendgridMailer.setApiKey(SendGridEmailService.SENDGRID_API_KEY);
  }

  async sendResetPasswordEmail({ user }: { user: UnrenderableUser }): Promise<void> {
    const { userId, email } = user;

    const resetPasswordToken = generateResetPasswordToken({
      userId,
      jwtPrivateKey: SendGridEmailService.jwtPrivateKey,
    });

    const message = {
      to: email,
      from: "help@kupono.io",
      subject: "Password Reset",
      html: `
        <strong>Here is your reset password token: ${resetPasswordToken}</strong>
      `,
    };

    SendgridMailer.send(message)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error: Error) => {
        console.error(error);
      });

    return;
  }
}
