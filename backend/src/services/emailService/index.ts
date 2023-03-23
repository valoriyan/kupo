import { getEnvironmentVariable } from "../../utilities";
import { singleton } from "tsyringe";
import { EmailServiceInterface, EmailServiceType } from "./models";
import { SendGridEmailService } from "./SendGridEmailService";
import { LocalEmailService } from "./LocalEmailService";

@singleton()
export class EmailService extends EmailServiceInterface {
  static implementation: EmailServiceInterface =
    EmailService.selectEmailServiceImplementation();

  constructor() {
    super();
  }

  sendResetPasswordEmail = EmailService.implementation.sendResetPasswordEmail;
  sendWelcomeEmail = EmailService.implementation.sendWelcomeEmail;
  sendOrderReceiptEmail = EmailService.implementation.sendOrderReceiptEmail;
  sendVerifyUserEmailEmail = EmailService.implementation.sendVerifyUserEmailEmail;
  sendKupoTeamUpdate = EmailService.implementation.sendKupoTeamUpdate;
  sendUserOfflineNotification = EmailService.implementation.sendUserOfflineNotification;

  static selectEmailServiceImplementation(): EmailServiceInterface {
    const implementedBlobStorageServiceType: string = getEnvironmentVariable(
      "IMPLEMENTED_EMAIL_SERVICE_TYPE",
    );

    if (implementedBlobStorageServiceType === EmailServiceType.LOCAL) {
      return new LocalEmailService();
    } else if (implementedBlobStorageServiceType === EmailServiceType.SEND_GRID) {
      SendGridEmailService.get();
      return new SendGridEmailService();
    } else {
      throw new Error(
        `Failed to initialize blob storage of type "${implementedBlobStorageServiceType}"`,
      );
    }
  }
}
