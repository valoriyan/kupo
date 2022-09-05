import { Pool } from "pg";
import { DATABASE_NAME } from "./config";
import { TableService } from "./tableServices/models";
import { topologicalSortTables } from "./setup";
import { Promise as BluebirdPromise } from "bluebird";

async function teardownTables({
  tableServices,
}: {
  tableServices: { [key: string]: TableService };
}): Promise<void> {
  const orderedTablesEntities = topologicalSortTables({
    tableNameToServicesMap: tableServices,
  })
    .slice()
    .reverse();

  await BluebirdPromise.each(orderedTablesEntities, async ({ tableService }) => {
    return await tableService.teardown();
  });
}

async function teardownDatabase() {
  const datastorePool = new Pool();
  console.log("Dropping Database");

  await datastorePool.query(`
    DROP DATABASE IF EXISTS ${DATABASE_NAME} WITH (FORCE);
  `);

  console.log("Completed Dropping Database\n");

  await datastorePool.end();
}

export async function teardownDatabaseService({
  tableServices,
}: {
  tableServices: { [key: string]: TableService };
}): Promise<void> {
  await teardownTables({ tableServices });
  await teardownDatabase();
}
