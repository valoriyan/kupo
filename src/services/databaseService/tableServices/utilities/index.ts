import { QueryConfig } from "pg";
import {
  PSQLFieldAndArrayOfValues,
  PSQLFieldAndValue,
  PSQLUpdateFieldAndValue,
} from "./models";

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

export function generatePSQLGenericUpdateRowQueryString<T>({
  updatedFields,
  fieldsUsedToIdentifyUpdatedRows,
  tableName,
}: {
  updatedFields: PSQLUpdateFieldAndValue<T>[];
  fieldsUsedToIdentifyUpdatedRows: PSQLFieldAndValue<T>[];
  tableName: string;
}): QueryConfig {
  const filteredUpdatedFields = updatedFields
    .map((updatedField) => {
      if (typeof updatedField.value === "number") {
        return {
          ...updatedField,
          value: updatedField.value.toString(),
        };
      }
      return updatedField;
    })
    .filter(({ value, settings }) => {
      const includeIfEmpty = !!settings && !!settings.includeIfEmpty;
      return includeIfEmpty || !!value;
    });

  if (filteredUpdatedFields.length === 0) {
    return {
      text: "",
      values: [],
    };
  }

  const queryValues: (T | string | undefined)[] = filteredUpdatedFields.map(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ({ value }) => value,
  );
  let queryValueIndex = 0;

  const updateString = filteredUpdatedFields
    .map(({ field }, index) => {
      const commaSeperator = index < filteredUpdatedFields.length - 1 ? "," : "";

      queryValueIndex += 1;
      return `${field} = $${queryValueIndex}${commaSeperator}`;
    })
    .join("\n");

  let conditionsUsedToIdentifyUpdatedRows = "";
  fieldsUsedToIdentifyUpdatedRows.forEach(
    (fieldUsedToIdentifyUpdatedRows: PSQLFieldAndValue<T>, index) => {
      conditionsUsedToIdentifyUpdatedRows += "\n";
      if (index > 0) {
        conditionsUsedToIdentifyUpdatedRows += " AND ";
      }
      conditionsUsedToIdentifyUpdatedRows += `${
        fieldUsedToIdentifyUpdatedRows.field
      } = $${queryValueIndex + index + 1}`;

      queryValues.push(fieldUsedToIdentifyUpdatedRows.value);
    },
  );

  const queryText = `
    UPDATE
      ${tableName}
    SET
      ${updateString}
    WHERE
      ${conditionsUsedToIdentifyUpdatedRows}
    RETURNING
      *
    ;
  `;

  return {
    text: queryText,
    values: queryValues,
  };
}

export function isQueryEmpty({ query }: { query: QueryConfig }): boolean {
  return query.text.length === 0;
}

export function generatePSQLGenericDeleteRowsQueryString<T>({
  fieldsUsedToIdentifyRowsToDelete,
  fieldsUsedToIdentifyRowsToDeleteUsingInClauses,
  tableName,
}: {
  fieldsUsedToIdentifyRowsToDelete: PSQLFieldAndValue<T>[];
  fieldsUsedToIdentifyRowsToDeleteUsingInClauses?: PSQLFieldAndArrayOfValues<T>[];
  tableName: string;
}): QueryConfig {
  const filteredFields = fieldsUsedToIdentifyRowsToDelete.filter(({ value }) => {
    return !!value;
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const queryValues: T[] = filteredFields.map((fields) => fields.value!);
  let queryValueIndex = 0;

  const parameterizedValuesString = filteredFields
    .map(({ field }) => {
      queryValueIndex += 1;
      return `${field} = $${queryValueIndex}`;
    })
    .join(" AND ");

  let stringOfValuesForInCondition = "";
  if (
    !!fieldsUsedToIdentifyRowsToDeleteUsingInClauses &&
    fieldsUsedToIdentifyRowsToDeleteUsingInClauses.length > 0
  ) {
    if (queryValues.length > 0) {
      stringOfValuesForInCondition += "\n AND \n";
    }

    stringOfValuesForInCondition += fieldsUsedToIdentifyRowsToDeleteUsingInClauses
      .map(({ field, values }) => {
        const stringOfValuesForInCondition = `( ${values
          .map((_, index) => "$" + (index + 1 + queryValueIndex))
          .join(", ")} )`;
        values.forEach((value) => queryValues.push(value));
        queryValueIndex += values.length;

        return `${field} IN ${stringOfValuesForInCondition}`;
      })
      .join("\n AND ");
  }

  const queryText = `
    DELETE FROM ${tableName}
    WHERE
      ${parameterizedValuesString}
      ${stringOfValuesForInCondition}
    RETURNING
      *
    ;
  `;

  return {
    text: queryText,
    values: queryValues,
  };
}
