import { getEnvironmentVariable } from "../../utilities";
import { EmailServiceInterface } from "./models";
import { generateResetPasswordToken } from "./utilities";
import SendgridMailer from "@sendgrid/mail";
import { UnrenderableUser } from "../../controllers/user/models";
import { generateForgotPasswordEmailHtml } from "./templates/generateForgotPasswordEmailHtml";
import { generateWelcomeEmailHtml } from "./templates/generateWelcomeEmailHtml";

export class SendGridEmailService extends EmailServiceInterface {
  private static SENDGRID_API_KEY: string = getEnvironmentVariable("SENDGRID_API_KEY");
  private static JWT_PRIVATE_KEY: string = getEnvironmentVariable("JWT_PRIVATE_KEY");
  private static FRONTEND_BASE_URL: string = getEnvironmentVariable("FRONTEND_BASE_URL");

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
      jwtPrivateKey: SendGridEmailService.JWT_PRIVATE_KEY,
    });

    const resetPasswordUrlWithToken = `${SendGridEmailService.FRONTEND_BASE_URL}/reset-password?token=${resetPasswordToken}`;

    const message = {
      to: email,
      from: "help@kupono.io",
      subject: "Password Reset",
      html: generateForgotPasswordEmailHtml({ resetPasswordUrlWithToken }),
    };

    await SendgridMailer.send(message)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error: Error) => {
        console.error(error);
      });

    return;
  }

  async sendWelcomeEmail({ user }: { user: UnrenderableUser }): Promise<void> {
    const { email } = user;

    const message = {
      to: email,
      from: "welcome@kupono.io",
      subject: "Welcome to Kupono.io",
      html: generateWelcomeEmailHtml(),
    };

    await SendgridMailer.send(message)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error: Error) => {
        console.error(error);
      });

    return;
  }
}
