import { Pool, QueryResult } from "pg";
import { DATABASE_NAME } from "./config";
import { Promise as BluebirdPromise } from "bluebird";

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

async function teardownCustomTypes({ datastorePool }: { datastorePool: Pool }) {
  // https://stackoverflow.com/questions/3660787/how-to-list-custom-types-using-postgres-information-schema
  const response: QueryResult<{ schema: string; type: string }> =
    await datastorePool.query(`
      SELECT      n.nspname as schema, t.typname as type
      FROM        pg_type t
      LEFT JOIN   pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE       (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid))
      AND     NOT EXISTS(SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid)
      AND     n.nspname NOT IN ('pg_catalog', 'information_schema');
  `);

  const customTypes = response.rows.map(({ type }) => type);

  console.log("Dropping Custom Types");
  console.log("==========");

  await BluebirdPromise.each(customTypes, async (customType) => {
    console.log(`Dropping custom type "${customType}"`);

    await datastorePool.query(`
      DROP TYPE IF EXISTS ${customType} CASCADE;
    `);
  });

  console.log("==========");
  console.log("Completed Dropping Custom Types\n");
}

async function teardownDatabase() {
  const datastorePool = new Pool();
  console.log("Dropping Database");

  await datastorePool.query(`
    DROP DATABASE IF EXISTS ${DATABASE_NAME} WITH (FORCE);
  `);

  console.log("Completed Dropping Database\n");

  await teardownCustomTypes({ datastorePool });

  await datastorePool.end();
}

export async function teardownDatabaseService(): Promise<void> {
  // await teardownTables({tableServices});
  await teardownDatabase();
}
