"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertMatchingTableStructures = void 0;
const assertMatchingColumnStructures_1 = require("./assertMatchingColumnStructures");
const assertMatchingTableConstaints_1 = require("./assertMatchingTableConstaints");
function assertMatchingTableStructures({ localTableStructure, betaTableStructure, tableName, devEnvironmentBeingReviewed, }) {
    (0, assertMatchingColumnStructures_1.assertMatchingColumnStructures)({
        localTableStructure,
        betaTableStructure,
        tableName,
    });
    (0, assertMatchingTableConstaints_1.assertMatchingTableConstaints)({
        localTableConstraints: localTableStructure.constraints,
        betaTableConstraints: betaTableStructure.constraints,
        tableName,
        devEnvironmentBeingReviewed,
    });
}
exports.assertMatchingTableStructures = assertMatchingTableStructures;
//# sourceMappingURL=assertMatchingTableStructures.js.map