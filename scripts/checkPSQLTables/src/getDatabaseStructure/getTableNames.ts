import { Pool } from "pg";

export async function getTableNames({
  pool,
}: {
  pool: Pool;
}): Promise<string[]> {
  const query = {
    text: `
      SELECT
        *
      FROM
        pg_catalog.pg_tables
      WHERE
        tablename NOT LIKE 'pg_%' AND
        tablename NOT LIKE 'sql_%'
      ;
   `,
    values: [],
  };

  const response = await pool.query(query);
  return response.rows.map((row) => row.tablename);
}
