import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import "reflect-metadata";
import { getEnvironmentVariable } from "../utilities";
import { DatabaseService } from "../services/databaseService";

async function teardownScript(): Promise<void> {
  const productionEnvironment: string = getEnvironmentVariable("PRODUCTION_ENVIRONMENT");

  if (["dev", "test"].includes(productionEnvironment)) {
    const databaseService = new DatabaseService();

    await databaseService.teardownDatabaseService();
  }
}

teardownScript();
