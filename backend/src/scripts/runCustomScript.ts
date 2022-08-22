import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import "reflect-metadata";
import { PaymentProcessingService } from "../services/paymentProcessingService";
import { fakeController } from "./fakeData";

async function teardownScript(): Promise<void> {
  const paymentProcessingService = new PaymentProcessingService();

  const customerId = await paymentProcessingService.registerCustomer({
    controller: fakeController,
    customerEmail: "_______",
  });

  console.log(`customerId: ${customerId}`);
}

teardownScript();
