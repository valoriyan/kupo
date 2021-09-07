import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import "reflect-metadata";
import { DatabaseService } from "../services/databaseService";

async function teardownScript(): Promise<void> {
  const databaseService = new DatabaseService();

  await databaseService.teardownDatabaseService();
}

teardownScript();
