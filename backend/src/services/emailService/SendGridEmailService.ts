/* eslint-disable @typescript-eslint/ban-types */
import { getEnvironmentVariable } from "../../utilities";
import { EmailServiceInterface } from "./models";
import {
  generateResetPasswordToken,
  generateResetPasswordURL,
  generateVerifyUserEmailToken,
  generateVerifyUserEmailURL,
} from "./utilities";
import SendgridMailer from "@sendgrid/mail";
import { UnrenderableUser } from "../../controllers/user/models";
import { generateForgotPasswordEmailHtml } from "./templates/auth/generateForgotPasswordEmailHtml";
import { generateWelcomeEmailHtml } from "./templates/auth/generateWelcomeEmailHtml";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../controllers/models";
import { RenderableShopItemPurchaseSummary } from "../../controllers/publishedItem/shopItem/payments/models";
import { generateShopItemOrderReceiptEmailHtml } from "./templates/generateShopItemOrderReceiptEmailHtml";
import { generateVerifyUserEmailHtml } from "./templates/auth/generateVerifyUserEmailHtml";
import {
  KupoTeamUpdateMetrics,
  generateKupoTeamUpdateEmailHtml,
} from "./templates/generateKupoTeamUpdateEmailHtml";
import { generateOfflineNotificationEmailHtml } from "./templates/generateOfflineNotificationEmailHtml";

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

  async sendOrderReceiptEmail({
    controller,
    user,
    renderableShopItemPurchaseSummary,
  }: {
    controller: Controller;
    user: UnrenderableUser;
    renderableShopItemPurchaseSummary: RenderableShopItemPurchaseSummary;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const { email } = user;
      const { transactionId, purchasedShopItem } = renderableShopItemPurchaseSummary;
      const { title, price } = purchasedShopItem;

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
        html: generateShopItemOrderReceiptEmailHtml({
          homepageUrl: SendGridEmailService.FRONTEND_BASE_URL,
          transactionId,
          shopItemTitle: title,
          price: price.toString(),
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

  async sendVerifyUserEmailEmail({
    controller,
    user,
  }: {
    controller: Controller;
    user: UnrenderableUser;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const { userId, email } = user;

      const verifyUserEmailToken = generateVerifyUserEmailToken({
        userId,
        email,
        jwtPrivateKey: SendGridEmailService.JWT_PRIVATE_KEY,
      });

      const verifyUserEmailUrlWithToken = generateVerifyUserEmailURL({
        frontendBaseUrl: SendGridEmailService.FRONTEND_BASE_URL,
        verifyUserEmailToken,
      });

      const message = {
        to: email,
        from: {
          name: "Kupo.social",
          email: "noreply@kupo.social",
        },
        subject: "Verify Email",
        html: generateVerifyUserEmailHtml({ verifyUserEmailUrlWithToken }),
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
        additionalErrorInformation: "Error at sendConfirmUserEmailEmail",
      });
    }
  }

  async sendKupoTeamUpdate({
    controller,
    name,
    email,
    kupoTeamUpdateMetrics,
  }: {
    controller: Controller;
    name: string;
    email: string;
    kupoTeamUpdateMetrics: KupoTeamUpdateMetrics;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const message = {
        to: email,
        from: {
          name: "Kupo.social",
          email: "noreply@kupo.social",
        },
        subject: "Kupo Team Update",
        html: await generateKupoTeamUpdateEmailHtml({
          name,
          kupoTeamUpdateMetrics,
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
        additionalErrorInformation: "Error at sendKupoTeamUpdate",
      });
    }
  }

  async sendUserOfflineNotification({
    controller,
    email,
  }: {
    controller: Controller;
    email: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const message = {
        to: email,
        from: {
          name: "Kupo.social",
          email: "noreply@kupo.social",
        },
        subject: "Kupo Team Update",
        html: await generateOfflineNotificationEmailHtml({}),
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
        additionalErrorInformation: "Error at sendUserOfflineNotification",
      });
    }
  }
}
