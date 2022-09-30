export interface ColumnStructure {
  // table_catalog: "kupo_dev";
  // table_schema: "public";
  // table_name: "chat_room_joins";
  table_name: string;
  // column_name: "chat_room_id";
  column_name: string;
  // ordinal_position: 1;
  // column_default: null;
  column_default: string | null;
  // is_nullable: "NO";
  is_nullable: string;
  // data_type: "character varying";
  data_type: string;
  // character_maximum_length: 64;
  character_maximum_length: number;
  // character_octet_length: 256;
  character_octet_length: number;
  // numeric_precision: null;
  numeric_precision: number | null;
  // numeric_precision_radix: null;
  numeric_precision_radix: number | null;
  // numeric_scale: null;
  numeric_scale: number | null;
  // datetime_precision: null;
  datetime_precision: number | null;
  // interval_type: null;
  interval_type: number | null;
  // interval_precision: null;
  interval_precision: number | null;
  // character_set_catalog: null;
  character_set_catalog: number | null;
  // character_set_schema: null;
  character_set_schema: string | null;
  // character_set_name: null;
  character_set_name: string | null;
  // collation_catalog: null;
  collation_catalog: string | null;
  // collation_schema: null;
  collation_schema: string | null;
  // collation_name: null;
  collation_name: string | null;
  // domain_catalog: null;
  domain_catalog: string | null;
  // domain_schema: null;
  domain_schema: string | null;
  // domain_name: null;
  domain_name: string | null;
  // udt_catalog: "kupo_dev";
  // udt_schema: "pg_catalog";
  udt_schema: string;
  // udt_name: "varchar";
  udt_name: string;
  // scope_catalog: null;
  scope_catalog: string | null;
  // scope_schema: null;
  scope_schema: string | null;
  // scope_name: null;
  scope_name: string | null;
  // maximum_cardinality: null;
  maximum_cardinality: number | null;
  // dtd_identifier: "1";
  // dtd_identifier: string;
  // is_self_referencing: "NO";
  is_self_referencing: string;
  // is_identity: "NO";
  is_identity: string;
  // identity_generation: null;
  identity_generation: string | null;
  // identity_start: null;
  identity_start: string | null;
  // identity_increment: null;
  identity_increment: string | null;
  // identity_maximum: null;
  identity_maximum: number | null;
  // identity_minimum: null;
  identity_minimum: number | null;
  // identity_cycle: "NO";
  identity_cycle: string;
  // is_generated: "NEVER";
  is_generated: string;
  // generation_expression: null;
  generation_expression: string | null;
  // is_updatable: "YES";
  is_updatable: string;
}
