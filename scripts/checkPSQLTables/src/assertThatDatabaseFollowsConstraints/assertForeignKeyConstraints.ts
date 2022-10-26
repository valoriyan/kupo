import { Pool, QueryResult } from "pg";
import { TableConstaints } from "../models/TableConstraintStructure";
import { Promise as BluebirdPromise } from "bluebird";

export async function assertForeignKeyConstraint({
  pool,
  tableConstaints,
  tableName,
}: {
  pool: Pool;
  tableConstaints: TableConstaints;
  tableName: string;
}) {
  const foreignKeyConstraints = tableConstaints.foreignKeyConstraints;

  await BluebirdPromise.each(
    Object.values(foreignKeyConstraints),
    async ({ constraint_definition }) => {
      console.log(constraint_definition);

      const foreignKey = constraint_definition
        .split("FOREIGN KEY (")[1]
        .split(") REFERENCES")[0];
      console.log(`foreignKey: "${foreignKey}"`);

      const referencedTable = constraint_definition
        .split("REFERENCES ")[1]
        .split("(")[0];
      console.log(`referencedTable: "${referencedTable}"`);

      const referencedKey = constraint_definition
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
        // values: [tableName],
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
      const foreignTableResponse: QueryResult = await pool.query(
        foreignTableQuery
      );

      const distinctForeignTableValues = new Set(
        foreignTableResponse.rows.map((row) => row[referencedKey])
      );

      distinctForeignKeyValues.forEach((distinctForeignKeyValue) => {
        if (!distinctForeignTableValues.has(distinctForeignKeyValue)) {
          throw new Error(
            `${distinctForeignKeyValue} missing from table "${tableName}", column ${referencedKey}`
          );
        }
      });
    }
  );
}
