import { Pool } from "pg";
import { DATABASE_NAME } from "./config";

// async function teardownTables({
//   tableServices,
// }: {
//   tableServices: { [key: string]: TableService };
// }): Promise<void> {
//   const teardownPromises = Object.values(tableServices).map((tableServices) =>
//     tableServices.teardown(),
//   );
//   await Promise.all(teardownPromises);
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
