import { Pool, QueryResult } from "pg";
import {
  Constraint,
  TableConstraints,
} from "../models/TableConstraintStructure";

async function getUniqueConstraintsOfTable({
  tableName,
  pool,
}: {
  tableName: string;
  pool: Pool;
}): Promise<{
  [constraintName: string]: Constraint;
}> {
  const query = {
    text: `
      SELECT
        conname as name_of_constraint,
        -- conkey,
        pg_get_constraintdef(pg_constraint.oid) as constraint_definition
      FROM
        pg_constraint
      INNER JOIN
        pg_class
          ON
            pg_class.oid = pg_constraint.conrelid
      INNER JOIN
        pg_attribute
          ON
            pg_attribute.attrelid = pg_class.oid
      LEFT JOIN
        pg_index
          ON
              pg_index.indrelid = pg_class.oid
            AND
              pg_attribute.attnum = ANY (pg_index.indkey[0:(pg_index.indnkeyatts - 1)])
      WHERE
          conrelid = $1 ::regclass::oid
        AND
          pg_index.indisunique IS TRUE
        AND
          pg_attribute.attnum > 0 -- not a system column
        AND
          contype='u'
      GROUP BY
        name_of_constraint,
        constraint_definition
      ;
    `,
    values: [tableName],
  };

  const response: QueryResult<Constraint> = await pool.query(query);
  const rows: Constraint[] = response.rows;

  return _mapConstraintsByKeys(rows);
}

async function getForeignKeysOfTable({
  tableName,
  pool,
}: {
  tableName: string;
  pool: Pool;
}): Promise<{
  [constraintName: string]: Constraint;
}> {
  const query = {
    text: `
      SELECT
        conname AS name_of_constraint,
        pg_get_constraintdef(oid) AS constraint_definition
      FROM
        pg_constraint
      WHERE
          contype IN ('f')
        AND
          connamespace = 'public'::regnamespace  -- your schema here
        AND
          conrelid::regclass = (SELECT oid FROM pg_class WHERE relname = $1)
      ORDER BY
        conrelid::regclass::text,
        contype
      DESC
      ;
   `,
    values: [tableName],
  };

  const response: QueryResult<Constraint> = await pool.query(query);
  const rows: Constraint[] = response.rows;

  return _mapConstraintsByKeys(rows);
}

async function getPrimaryKeysOfTable({
  tableName,
  pool,
}: {
  tableName: string;
  pool: Pool;
}): Promise<{
  [constraintName: string]: Constraint;
}> {
  const query = {
    text: `
      SELECT
        conname AS name_of_constraint,
        pg_get_constraintdef(oid) AS constraint_definition
      FROM
        pg_constraint
      WHERE
          contype IN ('p ')
        AND
          connamespace = 'public'::regnamespace  -- your schema here
        AND
          conrelid::regclass = (SELECT oid FROM pg_class WHERE relname = $1)
      ORDER BY
        conrelid::regclass::text,
        contype
      DESC
      ;
   `,
    values: [tableName],
  };

  const response: QueryResult<Constraint> = await pool.query(query);
  const rows: Constraint[] = response.rows;

  return _mapConstraintsByKeys(rows);
}

export async function getTableConstraints({
  tableName,
  pool,
}: {
  tableName: string;
  pool: Pool;
}): Promise<TableConstraints> {
  const foreignKeyConstraints = await getForeignKeysOfTable({
    tableName,
    pool,
  });
  const primaryKeyConstraints = await getPrimaryKeysOfTable({
    tableName,
    pool,
  });
  const uniqueIndexConstraints = await getUniqueConstraintsOfTable({
    tableName,
    pool,
  });

  return {
    foreignKeyConstraints,
    primaryKeyConstraints,
    uniqueIndexConstraints,
  };
}

function _mapConstraintsByKeys(constraints: Constraint[]): {
  [constraintName: string]: Constraint;
} {
  return constraints.reduce(
    (
      accum: {
        [constraintName: string]: Constraint;
      },
      constraint: Constraint
    ): {
      [constraintName: string]: Constraint;
    } => {
      return {
        ...accum,
        [constraint.name_of_constraint]: constraint,
      };
    },
    {}
  );
}
