export interface PSQLFieldAndValue<T> {
  field: string;
  value: T | undefined;
}

export function generatePostgreSQLCreateEnumTypeQueryString({
  typeName,
  enumValues,
}: {
  typeName: string;
  enumValues: string[];
}): string {
  const quotedEnumValues = enumValues.map((enumValue) => `'${enumValue}'`).join(", ");

  const queryString = `
      CREATE TYPE
        ${typeName}
      AS ENUM (
        ${quotedEnumValues}
      );
    `;

  return queryString;
}

export function generatePSQLGenericCreateRowQueryString<T>({
  rows,
  tableName,
}: {
  rows: PSQLFieldAndValue<T>[];
  tableName: string;
}): string {
  const activeRows = rows.filter((row) => !!row.value);

  const rowFieldNamesString = activeRows.map(({ field }) => field).join(", ");

  const rowValuesString = activeRows
    .map(({ value }) => {
      return `'${value}'`;
    })
    .join(", ");

  const queryString = `
    INSERT INTO ${tableName} (
      ${rowFieldNamesString}
    )
    VALUES (
      ${rowValuesString}
    )
    ;
  `;

  return queryString;
}

export function generatePSQLGenericUpdateRowQueryString<T>({
  updatedFields,
  fieldUsedToIdentifyUpdatedRow,
  tableName,
}: {
  updatedFields: PSQLFieldAndValue<T>[];
  fieldUsedToIdentifyUpdatedRow: PSQLFieldAndValue<T>;
  tableName: string;
}): string {
  const updateString: string = updatedFields.reduce(
    (accumulatedString, { field, value }) => {
      if (!!value) {
        return (accumulatedString += `
          ${field} = '${value}'
        `);
      } else {
        return accumulatedString;
      }
    },
    "",
  );

  if (updateString === "") {
    return "";
  }

  const escapedFieldUsedToIdentifyUpdatedRowValue = Number.isFinite(
    fieldUsedToIdentifyUpdatedRow.value,
  )
    ? fieldUsedToIdentifyUpdatedRow.value
    : `'${fieldUsedToIdentifyUpdatedRow.value}'`;

  const queryString = `
    UPDATE
      ${tableName}
    SET
      ${updateString}
    WHERE
      ${fieldUsedToIdentifyUpdatedRow.field} = ${escapedFieldUsedToIdentifyUpdatedRowValue}
    ;
  `;

  return queryString;
}
