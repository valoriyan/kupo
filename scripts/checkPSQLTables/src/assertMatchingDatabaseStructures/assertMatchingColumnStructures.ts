import { TableStructure } from "../models";

export function assertMatchingColumnStructures({
  localTableStructure,
  betaTableStructure,
  tableName,
}: {
  localTableStructure: TableStructure;
  betaTableStructure: TableStructure;
  tableName: string;
}) {
  const localColumnNames = Object.keys(localTableStructure.columns);
  const betaColumnNames = Object.keys(betaTableStructure.columns);

  localColumnNames.forEach((columnName) => {
    if (!betaColumnNames.includes(columnName)) {
      throw new Error(
        `column '${columnName}' missing from BETA table ${tableName}`
      );
    }
  });
  betaColumnNames.forEach((columnName) => {
    if (!localColumnNames.includes(columnName)) {
      throw new Error(
        `column '${columnName}' of table ${tableName} IS IN BETA BUT NOT LOCAL`
      );
    }
  });

  localColumnNames.forEach((columnName: string) => {
    const localColumnStructure = localTableStructure.columns[columnName];
    const betaColumnStructure = betaTableStructure.columns[columnName];
    const columnAttributes = Object.keys(localColumnStructure);

    columnAttributes.forEach((columnAttribute) => {
      const localColumnAttribute = localColumnStructure[columnAttribute];
      const betaColumnAttribute = betaColumnStructure[columnAttribute];

      if (localColumnAttribute !== betaColumnAttribute) {
        throw new Error(
          `Non matching attribute for '${tableName}.${columnName}.${columnAttribute}' |  local:'${localColumnAttribute}' | beta:'${betaColumnAttribute}'`
        );
      }
    });
  });
}
