// import { Promise as BluebirdPromise } from "bluebird";
import { Pool } from "pg";
import { DATABASE_NAME } from "./config";

// async function teardownTables({
//   tableServices,
// }: {
//   tableServices: { [key: string]: TableService };
// }): Promise<void> {
//   BluebirdPromise.each(Object.values(tableServices), async (tableService) => {
//     await tableService.teardown();
//   });
// }

async function teardownDatabase() {
  const datastorePool = new Pool({});

  await datastorePool.query(`
    DROP DATABASE IF EXISTS ${DATABASE_NAME} WITH (FORCE);
  `);

  await datastorePool.end();
}

export async function teardownDatabaseServive(): Promise<void> {
  // await teardownTables({tableServices});
  await teardownDatabase();
}
