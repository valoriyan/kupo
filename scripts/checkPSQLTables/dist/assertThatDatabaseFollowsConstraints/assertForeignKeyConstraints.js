"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertForeignKeyConstraintsForTable = void 0;
const bluebird_1 = require("bluebird");
function assertForeignKeyConstraintsForTable({ pool, tableConstaints, tableName, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const foreignKeyConstraints = tableConstaints.foreignKeyConstraints;
        yield bluebird_1.Promise.each(Object.values(foreignKeyConstraints), ({ constraint_definition }) => __awaiter(this, void 0, void 0, function* () {
            yield assertForeignKeyConstraintForTable({
                pool,
                constraintDefinition: constraint_definition,
                tableName,
            });
        }));
    });
}
exports.assertForeignKeyConstraintsForTable = assertForeignKeyConstraintsForTable;
function assertForeignKeyConstraintForTable({ pool, constraintDefinition, tableName, }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log();
        console.log(constraintDefinition);
        const foreignKey = constraintDefinition
            .split("FOREIGN KEY (")[1]
            .split(") REFERENCES")[0];
        console.log(`foreignKey: "${foreignKey}"`);
        const referencedTable = constraintDefinition
            .split("REFERENCES ")[1]
            .split("(")[0];
        console.log(`referencedTable: "${referencedTable}"`);
        const referencedKey = constraintDefinition
            .split("REFERENCES ")[1]
            .split("(")[1]
            .split(")")[0];
        console.log(`referencedKey: "${referencedKey}"`);
        const query = {
            text: `
      SELECT
        ${foreignKey}
      FROM
        ${tableName}
      ;
   `,
        };
        const response = yield pool.query(query);
        const distinctForeignKeyValues = new Set(response.rows.map((row) => row[foreignKey]));
        if (distinctForeignKeyValues.size === 0) {
            return;
        }
        const distinctForeignKeyValuesQueryString = Array.from(distinctForeignKeyValues)
            .map((distinctForeignKeyValue) => {
            return `'${distinctForeignKeyValue}'`;
        })
            .join(", ");
        const foreignTableQuery = {
            text: `
      SELECT
        ${referencedKey}
      FROM
        ${referencedTable}
      WHERE
        ${referencedKey} IN ( ${distinctForeignKeyValuesQueryString} )
      ;
   `,
            // values: [tableName],
        };
        const foreignTableResponse = yield pool.query(foreignTableQuery);
        const distinctForeignTableValues = new Set(foreignTableResponse.rows.map((row) => row[referencedKey]));
        distinctForeignKeyValues.forEach((distinctForeignKeyValue) => {
            if (!distinctForeignTableValues.has(distinctForeignKeyValue)) {
                throw new Error(`'Reviewing table '${tableName}'  |   ${distinctForeignKeyValue}' foreign key value missing from table "${tableName}", column ${referencedKey}`);
            }
        });
    });
}
//# sourceMappingURL=assertForeignKeyConstraints.js.map