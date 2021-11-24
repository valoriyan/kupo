import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import "reflect-metadata";
import { DatabaseService } from "../services/databaseService";

async function run() {
  const databaseService = new DatabaseService();
  await databaseService.tableNameToServicesMap.usersTableService.createUser({
    userId: "1001",
    email: "richard.morgan@sweetemail.com",
    username: "richard",
    encryptedPassword: "adfohfhallk1323ban9323",
  });

  await databaseService.tableNameToServicesMap.usersTableService.createUser({
    userId: "1002",
    email: "gloria.lamb@woahcoolemail.com",
    username: "gloria",
    encryptedPassword: "a;jfdsaidfsioadfsadfh",
  });

  await databaseService.tableNameToServicesMap.usersTableService.createUser({
    userId: "1003",
    email: "jayjayrogers@okayyeah.com",
    username: "jay",
    encryptedPassword: "a;adfadkadjhluiehaKSdf",
  });
}

run();
