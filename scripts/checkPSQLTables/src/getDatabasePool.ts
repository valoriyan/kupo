import { Pool, PoolConfig } from "pg";
import { DatabaseConfig } from "./models";

export async function getDatabasePool(
  databaseConfig: DatabaseConfig
): Promise<Pool> {
  const { databaseUrl, databaseName, implementedDatabaseServiceType } =
    databaseConfig;

  const connection_string = databaseUrl || undefined;

  const ssl = !!connection_string ? { rejectUnauthorized: false } : undefined;
  const database = !!connection_string ? undefined : databaseName;

  let poolConfig: PoolConfig;
  if (implementedDatabaseServiceType === "REMOTE_POSTGRES") {
    poolConfig = {
      connectionString: connection_string,
      ssl,
    };
    console.log(
      `STARTING DATABASE SERVICE @ '${connection_string}' | ${JSON.stringify(
        ssl
      )}`
    );
  } else if (implementedDatabaseServiceType === "LOCAL_POSTGRES") {
    poolConfig = {
      database,
    };
    console.log(`STARTING DATABASE SERVICE @ '${database}'`);
  } else {
    throw new Error(
      `Unrecognized IMPLEMENTED_DATABASE_SERVICE_TYPE: "${implementedDatabaseServiceType}"`
    );
  }

  return new Pool(poolConfig);
}
