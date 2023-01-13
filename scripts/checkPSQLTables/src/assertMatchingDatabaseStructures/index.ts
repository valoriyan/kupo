import { DatabaseStructure } from "../models";
import { assertMatchingTableStructures } from "./assertMatchingTableStructures";

export function assertMatchingDatabaseStructures(
  localDatabaseStructure: DatabaseStructure,
  remoteDatabaseStructure: DatabaseStructure,
  devEnvironmentBeingReviewed: string
) {
  const localTableNames = Object.keys(localDatabaseStructure);
  const betaTableNames = Object.keys(remoteDatabaseStructure);

  localTableNames.forEach((tableName) => {
    if (!betaTableNames.includes(tableName)) {
      throw new Error(`table '${tableName}' MISSING FROM BETA`);
    }
  });
  betaTableNames.forEach((tableName) => {
    if (!localTableNames.includes(tableName)) {
      throw new Error(`table '${tableName}' IS IN BETA BUT NOT LOCAL`);
    }
  });

  localTableNames.forEach((tableName) => {
    assertMatchingTableStructures({
      localTableStructure: localDatabaseStructure[tableName],
      betaTableStructure: remoteDatabaseStructure[tableName],
      tableName,
      devEnvironmentBeingReviewed,
    });
  });
}
