import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import "reflect-metadata";
import { DatabaseService } from "../services/databaseService";

async function setupScript(): Promise<void> {
  const databaseService = new DatabaseService();

  await databaseService.setupDatabaseService();
}

setupScript();
