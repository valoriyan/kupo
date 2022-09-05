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

  const uncompletedTableServices: Set<string> = new Set(
    orderedTablesEntities.map(({ tableService }) => tableService.tableName),
  );

  try {
    await BluebirdPromise.each(orderedTablesEntities, async ({ tableService }) => {
      uncompletedTableServices.delete(tableService.tableName);
      await tableService.teardown();
    });
    console.log(`
    ------------------------
    Completed teardownTables
    ------------------------
    `);
  } catch (error) {
    console.log("\n\n\n\n\n");
    console.log("Uncompleted Table Services:");
    console.log([...uncompletedTableServices]);
    console.log("\n\n\n\n\n");
    console.log(error);
  }
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
