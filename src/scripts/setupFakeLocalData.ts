/* eslint-disable @typescript-eslint/no-explicit-any */
import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import "reflect-metadata";
import { DatabaseService } from "../services/databaseService";

async function run() {
  console.log("");
  console.log("Setting up Fake Local Data");

  const databaseService = new DatabaseService();
  await databaseService.tableNameToServicesMap.usersTableService.createUser({
    controller: undefined as any,
    userId: "1001",
    email: "richard.morgan@sweetemail.com",
    username: "richard",
    encryptedPassword: "adfohfhallk1323ban9323",
    creationTimestamp: Date.now(),
    paymentProcessorCustomerId: "789",
  });

  await databaseService.tableNameToServicesMap.usersTableService.createUser({
    controller: undefined as any,
    userId: "1002",
    email: "gloria.lamb@woahcoolemail.com",
    username: "gloria",
    encryptedPassword: "a;jfdsaidfsioadfsadfh",
    creationTimestamp: Date.now(),
    paymentProcessorCustomerId: "456",
  });

  await databaseService.tableNameToServicesMap.usersTableService.createUser({
    controller: undefined as any,
    userId: "1003",
    email: "jayjayrogers@okayyeah.com",
    username: "jay",
    encryptedPassword: "a;adfadkadjhluiehaKSdf",
    creationTimestamp: Date.now(),
    paymentProcessorCustomerId: "123",
  });
}

run();
