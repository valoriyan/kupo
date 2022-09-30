import { ColumnStructure } from "./ColumnStructure";
import { TableConstaints } from "./TableConstraintStructure";

export interface DatabaseConfig {
  databaseName: string;
  implementedDatabaseServiceType: string;
  databaseUrl: string;
}

export interface TableStructure {
  columns: {
    [columnName: string]: ColumnStructure;
  };
  constraints: TableConstaints;
}

export interface DatabaseStructure {
  [tableName: string]: TableStructure;
}
