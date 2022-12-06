import { Pool } from "pg";
import { getStructureOfTableColumns } from "./getStructureOfTableColumns";
import { getDatabasePool } from "../getDatabasePool";
import { DatabaseConfig, DatabaseStructure, TableStructure } from "../models";
import { Promise as BluebirdPromise } from "bluebird";
import { ColumnStructure } from "../models/ColumnStructure";
import { getTableNames } from "./getTableNames";
import { getTableConstraints } from "./getTableConstraints";
import { TableConstraints } from "../models/TableConstraintStructure";

export async function getDatabaseStructure(
  databaseConfig: DatabaseConfig
): Promise<DatabaseStructure> {
  const pool: Pool = await getDatabasePool(databaseConfig);

  const databaseStructure: DatabaseStructure = {};

  const tableNames: string[] = await getTableNames({ pool });

  await BluebirdPromise.each(tableNames, async (tableName: string) => {
    const tableStructure: TableStructure = await getTableStructure({
      tableName,
      pool,
    });
    databaseStructure[tableName] = tableStructure;
  });

  return databaseStructure;
}

async function getTableStructure({
  tableName,
  pool,
}: {
  tableName: string;
  pool: Pool;
}): Promise<TableStructure> {
  const columnStructures: {
    [columnName: string]: ColumnStructure;
  } = await getStructureOfTableColumns({
    pool,
    tableName,
  });

  const tableConstraints: TableConstraints = await getTableConstraints({
    tableName,
    pool,
  });

  return {
    columns: columnStructures,
    constraints: tableConstraints,
  };
}
