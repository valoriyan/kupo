import { Pool, QueryResult } from "pg";
import { TableConstraints } from "../models/TableConstraintStructure";
import { Promise as BluebirdPromise } from "bluebird";

export async function assertForeignKeyConstraintsForTable({
  pool,
  tableConstaints,
  tableName,
}: {
  pool: Pool;
  tableConstaints: TableConstraints;
  tableName: string;
}) {
  const foreignKeyConstraints = tableConstaints.foreignKeyConstraints;

  await BluebirdPromise.each(
    Object.values(foreignKeyConstraints),
    async ({ constraint_definition }) => {
      await assertForeignKeyConstraintForTable({
        pool,
        constraintDefinition: constraint_definition,
        tableName,
      });
    }
  );
}

async function assertForeignKeyConstraintForTable({
  pool,
  constraintDefinition,
  tableName,
}: {
  pool: Pool;
  constraintDefinition: string;
  tableName: string;
}) {
  console.log();
  console.log(constraintDefinition);

  const foreignKey = constraintDefinition
    .split("FOREIGN KEY (")[1]
    .split(") REFERENCES")[0];
  console.log(`foreignKey: "${foreignKey}"`);

  const referencedTable = constraintDefinition
    .split("REFERENCES ")[1]
    .split("(")[0];
  console.log(`referencedTable: "${referencedTable}"`);

  const referencedKey = constraintDefinition
    .split("REFERENCES ")[1]
    .split("(")[1]
    .split(")")[0];

  console.log(`referencedKey: "${referencedKey}"`);

  const query = {
    text: `
      SELECT
        ${foreignKey}
      FROM
        ${tableName}
      ;
   `,
  };

  const response: QueryResult = await pool.query(query);
  const distinctForeignKeyValues = new Set(
    response.rows.map((row) => row[foreignKey])
  );

  if (distinctForeignKeyValues.size === 0) {
    return;
  }

  const distinctForeignKeyValuesQueryString = Array.from(
    distinctForeignKeyValues
  )
    .map((distinctForeignKeyValue) => {
      return `'${distinctForeignKeyValue}'`;
    })
    .join(", ");

  const foreignTableQuery = {
    text: `
      SELECT
        ${referencedKey}
      FROM
        ${referencedTable}
      WHERE
        ${referencedKey} IN ( ${distinctForeignKeyValuesQueryString} )
      ;
   `,
    // values: [tableName],
  };
  const foreignTableResponse: QueryResult = await pool.query(foreignTableQuery);

  const distinctForeignTableValues = new Set(
    foreignTableResponse.rows.map((row) => row[referencedKey])
  );

  distinctForeignKeyValues.forEach((distinctForeignKeyValue) => {
    if (
      !!distinctForeignKeyValue &&
      !distinctForeignTableValues.has(distinctForeignKeyValue)
    ) {
      throw new Error(
        `'Reviewing table '${tableName}'  |   '${distinctForeignKeyValue}' foreign key value missing from table "${tableName}", column ${referencedKey}`
      );
    }
  });
}
