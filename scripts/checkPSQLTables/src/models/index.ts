import { ColumnStructure } from "./ColumnStructure";
import { TableConstraints } from "./TableConstraintStructure";

export interface DatabaseConfig {
  databaseName: string;
  implementedDatabaseServiceType: string;
  databaseUrl: string;
}

export interface TableStructure {
  columns: {
    [columnName: string]: ColumnStructure;
  };
  constraints: TableConstraints;
}

export interface DatabaseStructure {
  [tableName: string]: TableStructure;
}
