import { TableService } from "./tableServices/models";
import { Pool, QueryResult } from "pg";
import { DATABASE_NAME } from "./config";
import { Promise as BluebirdPromise } from "bluebird";

async function doesDatabaseExist({
  datastorePool,
}: {
  datastorePool: Pool;
}): Promise<boolean> {
  const response: QueryResult<{ datname: string }> = await datastorePool.query(`
    SELECT datname FROM pg_database
    WHERE datistemplate = false;
  `);

  const databaseExists: boolean = response.rows.some(
    (row: { datname: string }): boolean => {
      return row.datname === DATABASE_NAME;
    },
  );

  return databaseExists;
}

async function setupDatabase() {
  const datastorePool = new Pool({});

  const databaseExists = await doesDatabaseExist({ datastorePool });

  if (!databaseExists) {
    await datastorePool.query(`
      CREATE DATABASE ${DATABASE_NAME};
    `);
  }

  await datastorePool.end();
}

async function setupTables({
  tableNameToServicesMap,
}: {
  tableNameToServicesMap: { [key: string]: TableService };
}): Promise<void> {
  await BluebirdPromise.map(
    Object.entries(tableNameToServicesMap),
    async ([tableName, tableService]) => {
      console.log(`Setting up table ${tableName}`);
      tableService.setup();
    },
  );
}

export async function setupDatabaseService({
  tableNameToServicesMap,
}: {
  tableNameToServicesMap: { [key: string]: TableService };
}): Promise<void> {
  await setupDatabase();
  await setupTables({ tableNameToServicesMap });
}
