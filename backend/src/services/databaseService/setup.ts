import { TableService } from "./tableServices/models";
import { Pool, QueryResult } from "pg";
import { DATABASE_NAME } from "./config";
import { Promise as BluebirdPromise } from "bluebird";
import { sleep } from "../../utilities";

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

function hasTableResolvedAllDependencies({
  tableNameToServicesMap,
  tableKey,
  resolvedDependencies,
}: {
  tableNameToServicesMap: { [key: string]: TableService };
  tableKey: string;
  resolvedDependencies: string[];
}): boolean {
  const unresolvedDependenciesOfTable = new Set(
    tableNameToServicesMap[tableKey].dependencies,
  );
  resolvedDependencies.forEach((resolvedDependency) => {
    unresolvedDependenciesOfTable.delete(resolvedDependency);
  });

  return unresolvedDependenciesOfTable.size === 0;
}

export function topologicalSortTables({
  tableNameToServicesMap,
}: {
  tableNameToServicesMap: { [key: string]: TableService };
}): { tableKey: string; tableService: TableService }[] {
  const orderedTableEntities: { tableKey: string; tableService: TableService }[] = [];

  // The remaining tables that must still be ordered
  const setOfUnorderedTableKeys = new Set(Object.keys(tableNameToServicesMap));

  // Until complete
  while (setOfUnorderedTableKeys.size > 0) {
    const iterationStartSize = setOfUnorderedTableKeys.size;

    // Iterate through the remaining tables
    setOfUnorderedTableKeys.forEach((unorderedTableKey) => {
      // If all dependencies of the table have been added to the completed list (0 remaining dependencies)
      // then add to the completed list
      const isTableResolvedOfAllDependencies = hasTableResolvedAllDependencies({
        tableNameToServicesMap,
        tableKey: unorderedTableKey,
        resolvedDependencies: orderedTableEntities.map(
          ({ tableService }) => tableService.tableName,
        ),
      });

      if (isTableResolvedOfAllDependencies) {
        orderedTableEntities.push({
          tableKey: unorderedTableKey,
          tableService: tableNameToServicesMap[unorderedTableKey],
        });
        setOfUnorderedTableKeys.delete(unorderedTableKey);
      }
    });

    const iterationEndSize = setOfUnorderedTableKeys.size;
    if (iterationStartSize === iterationEndSize) {
      throw new Error(
        `Tables contain circular dependencies: ${[...setOfUnorderedTableKeys]}`,
      );
    }
  }

  return orderedTableEntities;
}

async function setupTables({
  tableNameToServicesMap,
}: {
  tableNameToServicesMap: { [key: string]: TableService };
}): Promise<void> {
  const orderedTablesEntities = topologicalSortTables({ tableNameToServicesMap });

  await BluebirdPromise.each(
    orderedTablesEntities,
    async ({ tableKey, tableService }) => {
      await sleep(1500);
      console.log(`Setting up table ${tableKey}`);
      await tableService.setup();
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
