"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertMatchingDatabaseStructures = void 0;
const assertMatchingTableStructures_1 = require("./assertMatchingTableStructures");
function assertMatchingDatabaseStructures(localDatabaseStructure, betaDatabaseStructure) {
    const localTableNames = Object.keys(localDatabaseStructure);
    const betaTableNames = Object.keys(betaDatabaseStructure);
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
        (0, assertMatchingTableStructures_1.assertMatchingTableStructures)({
            localTableStructure: localDatabaseStructure[tableName],
            betaTableStructure: betaDatabaseStructure[tableName],
            tableName,
        });
    });
}
exports.assertMatchingDatabaseStructures = assertMatchingDatabaseStructures;
//# sourceMappingURL=index.js.map