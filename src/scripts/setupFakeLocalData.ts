/* eslint-disable @typescript-eslint/no-explicit-any */
import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import "reflect-metadata";
import { encryptPassword } from "../controllers/auth/utilities";
import { getEnvironmentVariable } from "../utilities";
import { DatabaseService } from "../services/databaseService";
import { fakeController } from "./fakeData";

async function run() {
  const productionEnvironment: string = getEnvironmentVariable("PRODUCTION_ENVIRONMENT");

  if (["dev", "test"].includes(productionEnvironment)) {
    console.log("\nSetting up Fake Local Data");

    const databaseService = new DatabaseService();

    await databaseService.tableNameToServicesMap.usersTableService.createUser({
      controller: fakeController,
      userId: "1001",
      email: "mr.testman@gmail.com",
      username: "testman",
      encryptedPassword: encryptPassword({ password: "dontStealMyPa$$word!" }),
      creationTimestamp: Date.now(),
      paymentProcessorCustomerId: "789",
    });

    await databaseService.tableNameToServicesMap.usersTableService.createUser({
      controller: fakeController,
      userId: "1002",
      email: "mrs.testwoman@gmail.com",
      username: "testwoman",
      encryptedPassword: encryptPassword({ password: "dontStealMyPa$$word!Either" }),
      creationTimestamp: Date.now(),
      paymentProcessorCustomerId: "456",
    });
  }
}

run();
