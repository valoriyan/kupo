import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import "reflect-metadata";
import { PaymentProcessingService } from "../services/paymentProcessingService";

async function teardownScript(): Promise<void> {
  const paymentProcessingService = new PaymentProcessingService();



  const customerId = await paymentProcessingService.registerCustomer({
    customerEmail: "julian.trajanson@gmail.com",
  });

  console.log(`customerId: ${customerId}`);
}

teardownScript();
