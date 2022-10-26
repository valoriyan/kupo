import { Pool, QueryResult } from "pg";
import { getDatabasePool } from "../getDatabasePool";
import { DatabaseConfig, DatabaseStructure, TableStructure } from "../models";
import { TableConstaints } from "../models/TableConstraintStructure";
import { Promise as BluebirdPromise } from "bluebird";
import { assertForeignKeyConstraint } from "./assertForeignKeyConstraints";

export async function assertThatDatabaseFollowsConstraints({
  databaseConfig,
  databaseStructure,
}: {
  databaseConfig: DatabaseConfig;
  databaseStructure: DatabaseStructure;
}) {
  const pool: Pool = await getDatabasePool(databaseConfig);

  const tableNames = Object.keys(databaseStructure);

  await BluebirdPromise.each(tableNames, async (tableName, index) => {
    // if (tableName !== "post_content_elements") {
    //   return;
    // }
    console.log(`tableName: "${tableName}"`);

    const tableStructure: TableStructure = databaseStructure[tableName];

    const tableConstaints: TableConstaints = tableStructure.constraints;

    await assertForeignKeyConstraint({
      pool,
      tableConstaints,
      tableName,
    });
  });
}
