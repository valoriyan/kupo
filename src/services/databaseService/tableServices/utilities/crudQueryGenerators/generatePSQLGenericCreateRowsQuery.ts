import { QueryConfig } from "pg";
import { PSQLFieldAndValue } from "../models";

export function generatePSQLGenericCreateRowsQuery<T>({
  rowsOfFieldsAndValues,
  tableName,
}: {
  rowsOfFieldsAndValues: PSQLFieldAndValue<T>[][];
  tableName: string;
}): QueryConfig {
  const queryValues: (T | undefined)[] = [];
  let queryValueIndex = 0;

  const setOfFields = new Set();
  rowsOfFieldsAndValues.forEach((rowOfFieldsAndValues) => {
    rowOfFieldsAndValues.forEach(({field}) => {
      setOfFields.add(field);
    });
  });

  const rowFieldNamesString = [...setOfFields].join(", ");

  const rowsOfParameterizedValues: string[] = [];

  rowsOfFieldsAndValues.forEach((rowOfFieldsAndValues) => {
    let rowOfParameterizedValues: string[] = [];

    rowOfFieldsAndValues.map(({value}) => {
      queryValueIndex += 1;
      rowOfParameterizedValues.push(`$${queryValueIndex}`);
      queryValues.push(value);
    });

    const rowOfParameterizedValuesString = `(${rowOfParameterizedValues.join(", ")})`;

    rowsOfParameterizedValues.push(rowOfParameterizedValuesString);
  });


  const parameterizedValues = rowsOfParameterizedValues.join(", ");

  const queryText = `
    INSERT INTO ${tableName} (
      ${rowFieldNamesString}
    )
    VALUES
      ${parameterizedValues}
  ;
`;

  return {
    text: queryText,
    values: queryValues,
  };
}
