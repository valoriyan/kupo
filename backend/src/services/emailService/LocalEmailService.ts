/* eslint-disable @typescript-eslint/ban-types */
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { UnrenderableUser } from "../../controllers/user/models";
import { getEnvironmentVariable } from "../../utilities";
import { EmailServiceInterface } from "./models";
import {
  generateResetPasswordToken,
  generateResetPasswordURL,
  generateVerifyUserEmailToken,
  generateVerifyUserEmailURL,
} from "./utilities";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../controllers/models";
import { RenderableShopItemPurchaseSummary } from "../../controllers/publishedItem/shopItem/payments/models";
import { KupoTeamUpdateMetrics } from "./templates/generateKupoTeamUpdateEmailHtml";

export class LocalEmailService extends EmailServiceInterface {
  private static JWT_PRIVATE_KEY: string = getEnvironmentVariable("JWT_PRIVATE_KEY");
  private static FRONTEND_BASE_URL: string = getEnvironmentVariable("FRONTEND_BASE_URL");

  constructor() {
    super();
  }

  async sendResetPasswordEmail({
    controller,
    user,
  }: {
    controller: Controller;
    user: UnrenderableUser;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
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
      const { username } = user;

      console.log(`
        Hi ${username}!
      `);

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
      const { username } = user;
      const { transactionTimestamp, purchasedShopItem } =
        renderableShopItemPurchaseSummary;
      const { id: contentItemId } = purchasedShopItem;

      console.log(`
        Hi ${username}!

        At ${transactionTimestamp} you purchased ${contentItemId}
      `);

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
        jwtPrivateKey: LocalEmailService.JWT_PRIVATE_KEY,
      });

      const verifyUserEmailUrlWithToken = generateVerifyUserEmailURL({
        frontendBaseUrl: LocalEmailService.FRONTEND_BASE_URL,
        verifyUserEmailToken,
      });

      console.log(`
        To verify your email, go to ${verifyUserEmailUrlWithToken}
      `);

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
      console.log(
        `Team Update time ${name} ${email} | countOfNewUsersInPastWeek : ${kupoTeamUpdateMetrics.countOfNewUsersInPastWeek} | countOfNewUsersInPastDay: ${kupoTeamUpdateMetrics.countOfNewUsersInPastDay}`,
      );
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

  async sendUserOfflineNotification({
    controller,
    email,
  }: {
    controller: Controller;
    email: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      console.log(`Sending sendUserOfflineNotification to ${email}`);
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
}
