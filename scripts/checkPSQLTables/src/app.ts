import { config as injectEnvironmentVariables } from "dotenv";
import { assertMatchingDatabaseStructures } from "./assertMatchingDatabaseStructures";

import { getDatabaseStructure } from "./getDatabaseStructure";
import { DatabaseStructure } from "./models";

async function run() {
  injectEnvironmentVariables();

  const localDatabaseConfig = {
    databaseName: process.env.LOCAL_DATABASE_NAME,
    implementedDatabaseServiceType:
      process.env.LOCAL_IMPLEMENTED_DATABASE_SERVICE_TYPE,
    databaseUrl: process.env.LOCAL_DATABASE_URL,
  };

  const betaDatabaseConfig = {
    databaseName: process.env.BETA_DATABASE_NAME,
    implementedDatabaseServiceType:
      process.env.BETA_IMPLEMENTED_DATABASE_SERVICE_TYPE,
    databaseUrl: process.env.BETA_DATABASE_URL,
  };

  const localDatabaseStructure: DatabaseStructure = await getDatabaseStructure(
    localDatabaseConfig
  );

  const betaDatabaseStructure: DatabaseStructure = await getDatabaseStructure(
    betaDatabaseConfig
  );

  assertMatchingDatabaseStructures(
    localDatabaseStructure,
    betaDatabaseStructure
  );
}

run();
