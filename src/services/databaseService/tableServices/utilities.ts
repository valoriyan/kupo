export function generatePostgreSQLCreateEnumTypeQueryString({
  typeName,
  enumValues,
}: {
  typeName: string;
  enumValues: string[];
}) {
  const quotedEnumValues = enumValues.map((enumValue) => `'${enumValue}'`).join(", ");

  const queryString = `
      DO
      $$
      BEGIN
        IF NOT EXISTS (
          SELECT *
          FROM pg_type postgrestype
          INNER JOIN pg_namespace nsp
          ON
            nsp.oid = postgrestype.typnamespace
          WHERE
              nsp.nspname = current_schema()
            AND
                postgrestype.typname = '${typeName}'
        )
        THEN
          CREATE TYPE
            ${typeName}
          AS ENUM (
            ${quotedEnumValues}
          );
        END IF;
      END;
      $$
      ;
    `;

  return queryString;
}
