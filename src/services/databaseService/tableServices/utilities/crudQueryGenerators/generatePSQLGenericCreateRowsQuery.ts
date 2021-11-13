import { QueryConfig } from "pg";
import { PSQLFieldAndValue } from "../models";

export function generatePSQLGenericCreateRowsQuery<T>({
  rowsOfFieldsAndValues,
  tableName,
}: {
  rowsOfFieldsAndValues: PSQLFieldAndValue<T>[][];
  tableName: string;
}): QueryConfig {
  let queryText = "";
  const queryValues: T[] = [];
  let queryValueIndex = 0;

  rowsOfFieldsAndValues.forEach((rowOfFieldsAndValues) => {
    const activeFieldsAndValuesInRow = rowOfFieldsAndValues.filter(
      (rowFieldAndValue) => !!rowFieldAndValue.value,
    );

    const rowFieldNamesString = activeFieldsAndValuesInRow
      .map(({ field }) => field)
      .join(", ");

    const rowParameterizedValuesString = activeFieldsAndValuesInRow
      .map(() => {
        queryValueIndex += 1;

        return `$${queryValueIndex}`;
      })
      .join(", ");

    const rowQueryText = `
        INSERT INTO ${tableName} (
          ${rowFieldNamesString}
        )
        VALUES (
          ${rowParameterizedValuesString}
        )
        ;
      `;

    queryText += "\n" + rowQueryText;

    activeFieldsAndValuesInRow.forEach((row) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      queryValues.push(row.value!);
    });
  });

  return {
    text: queryText,
    values: queryValues,
  };
}
