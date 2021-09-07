import { TableService } from "./tableServices/models";
import { Promise as BluebirdPromise } from "bluebird";
import { Pool, QueryResult } from "pg";
import { DATABASE_NAME } from "./config";

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
  tableServices,
}: {
  tableServices: { [key: string]: TableService };
}): Promise<void> {
  BluebirdPromise.each(
    Object.values(tableServices),
    async (tableService: TableService) => {
      await tableService.setup();
    },
  );
}

export async function setupDatabaseService({
  tableServices,
}: {
  tableServices: { [key: string]: TableService };
}): Promise<void> {
  await setupDatabase();
  await setupTables({ tableServices });
}
