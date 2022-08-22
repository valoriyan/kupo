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
import { generateResetPasswordToken, generateResetPasswordURL } from "./utilities";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../controllers/models";

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
}
