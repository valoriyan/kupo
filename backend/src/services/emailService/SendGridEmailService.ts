/* eslint-disable @typescript-eslint/ban-types */
import { getEnvironmentVariable } from "../../utilities";
import { EmailServiceInterface } from "./models";
import { generateResetPasswordToken, generateResetPasswordURL } from "./utilities";
import SendgridMailer from "@sendgrid/mail";
import { UnrenderableUser } from "../../controllers/user/models";
import { generateForgotPasswordEmailHtml } from "./templates/generateForgotPasswordEmailHtml";
import { generateWelcomeEmailHtml } from "./templates/generateWelcomeEmailHtml";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../controllers/models";

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

  async sendResetPasswordEmail({
    controller,
    user,
  }: {
    controller: Controller;
    user: UnrenderableUser;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const { userId, email } = user;

      const resetPasswordToken = generateResetPasswordToken({
        userId,
        jwtPrivateKey: SendGridEmailService.JWT_PRIVATE_KEY,
      });

      const resetPasswordUrlWithToken = generateResetPasswordURL({
        frontendBaseUrl: SendGridEmailService.FRONTEND_BASE_URL,
        resetPasswordToken,
      });

      const message = {
        to: email,
        from: {
          name: "Kupo.social",
          email: "noreply@kupo.social",
        },
        subject: "Password Reset Requested",
        html: generateForgotPasswordEmailHtml({ resetPasswordUrlWithToken }),
      };

      await SendgridMailer.send(message)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error: Error) => {
          console.error(error);
        });

      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.EMAIL_SERVICE_ERROR,
        error,
        additionalErrorInformation: "Error at sendResetPasswordEmail",
      });
    }
  }

  async sendWelcomeEmail({
    controller,
    user,
  }: {
    controller: Controller;
    user: UnrenderableUser;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const { email } = user;

      const message = {
        to: email,
        from: {
          name: "Kupo.social",
          email: "hello@kupo.social",
        },
        subject: "Welcome to Kupo.social",
        dynamic_template_data: {
          subject: "Welcome to Kupo.social",
        },
        html: generateWelcomeEmailHtml({
          homepageUrl: SendGridEmailService.FRONTEND_BASE_URL,
        }),
      };

      await SendgridMailer.send(message)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error: Error) => {
          console.error(error);
        });

      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.EMAIL_SERVICE_ERROR,
        error,
        additionalErrorInformation: "Error at sendWelcomeEmail",
      });
    }
  }
}
