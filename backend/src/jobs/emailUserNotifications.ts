import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import { fakeController } from "../scripts/fakeData";

import "reflect-metadata";
import { EmailService } from "../services/emailService";

async function emailUserNotifications(): Promise<void> {
  // const databaseService = new DatabaseService();
  const emailService = new EmailService();

  //////////////////////////////////////////////////
  // Send Emails
  //////////////////////////////////////////////////

  emailService.sendUserOfflineNotification({
    controller: fakeController,
    email: "julian.trajanson@gmail.com",
  });
}

emailUserNotifications();
