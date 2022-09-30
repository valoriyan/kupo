import { Pool, QueryResult } from "pg";
import { ColumnStructure } from "../models/ColumnStructure";

export async function getStructureOfTableColumns({
  pool,
  tableName,
}: {
  pool: Pool;
  tableName: string;
}): Promise<{
  [columnName: string]: ColumnStructure;
}> {
  const query = {
    text: `
      SELECT
        *
      FROM
        information_schema.columns
      WHERE
        table_name = $1
       ;
   `,
    values: [tableName],
  };

  const response: QueryResult<ColumnStructure> = await pool.query(query);
  const columnStructures: ColumnStructure[] = response.rows.map(
    (row): ColumnStructure => ({
      table_name: row.table_name,
      column_name: row.column_name,
      column_default: row.column_default,
      is_nullable: row.is_nullable,
      data_type: row.data_type,
      character_maximum_length: row.character_maximum_length,
      character_octet_length: row.character_octet_length,
      numeric_precision: row.numeric_precision,
      numeric_precision_radix: row.numeric_precision_radix,
      numeric_scale: row.numeric_scale,
      datetime_precision: row.datetime_precision,
      interval_type: row.interval_type,
      interval_precision: row.interval_precision,
      character_set_catalog: row.character_set_catalog,
      character_set_schema: row.character_set_schema,
      character_set_name: row.character_set_name,
      collation_catalog: row.collation_catalog,
      collation_schema: row.collation_schema,
      collation_name: row.collation_name,
      domain_catalog: row.domain_catalog,
      domain_schema: row.domain_schema,
      domain_name: row.domain_name,
      udt_schema: row.udt_schema,
      udt_name: row.udt_name,
      scope_catalog: row.scope_catalog,
      scope_schema: row.scope_schema,
      scope_name: row.scope_name,
      maximum_cardinality: row.maximum_cardinality,
      is_self_referencing: row.is_self_referencing,
      is_identity: row.is_identity,
      identity_generation: row.identity_generation,
      identity_start: row.identity_start,
      identity_increment: row.identity_increment,
      identity_maximum: row.identity_maximum,
      identity_minimum: row.identity_minimum,
      identity_cycle: row.identity_cycle,
      is_generated: row.is_generated,
      generation_expression: row.generation_expression,
      is_updatable: row.is_updatable,
    })
  );

  return columnStructures.reduce(
    (
      accum: {
        [columnName: string]: ColumnStructure;
      },
      columnStructure: ColumnStructure
    ): {
      [columnName: string]: ColumnStructure;
    } => {
      return {
        ...accum,
        [columnStructure.column_name]: columnStructure,
      };
    },
    {}
  );
}
