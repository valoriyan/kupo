"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertMatchingTableConstaints = void 0;
function assertMatchingTableConstaints({ localTableConstraints, betaTableConstraints, tableName, devEnvironmentBeingReviewed, }) {
    [
        "foreignKeyConstraints",
        "primaryKeyConstraints",
        "uniqueIndexConstraints",
    ].forEach((constraintType) => {
        assertMatchingConstraintsByType({
            localTableConstraints,
            betaTableConstraints,
            tableName,
            constraintType,
            devEnvironmentBeingReviewed,
        });
    });
}
exports.assertMatchingTableConstaints = assertMatchingTableConstaints;
function assertMatchingConstraintValues({ localConstraint, betaConstraint, tableName, constraintType, constraintName, devEnvironmentBeingReviewed, }) {
    const localConstraintDefinition = localConstraint.constraint_definition;
    const betaConstraintDefinition = betaConstraint.constraint_definition;
    if (localConstraintDefinition !== betaConstraintDefinition) {
        throw new Error(`Non matching definitions for constraint '${tableName}->${constraintName}->${constraintType}' |  local:'${localConstraintDefinition}' | ${devEnvironmentBeingReviewed}:'${betaConstraintDefinition}'`);
    }
}
function assertMatchingConstraintsByType({ localTableConstraints, betaTableConstraints, tableName, constraintType, devEnvironmentBeingReviewed, }) {
    const localConstraintNames = Object.keys(localTableConstraints[constraintType]);
    const betaConstraintNames = Object.keys(betaTableConstraints[constraintType]);
    assertMatchingConstraintNames({
        localConstraintNames,
        betaConstraintNames,
        tableName,
        constraintType,
        devEnvironmentBeingReviewed,
    });
    localConstraintNames.forEach((constraintName) => {
        assertMatchingConstraintValues({
            localConstraint: localTableConstraints[constraintType][constraintName],
            betaConstraint: betaTableConstraints[constraintType][constraintName],
            tableName,
            constraintType,
            constraintName,
            devEnvironmentBeingReviewed,
        });
    });
}
function assertMatchingConstraintNames({ localConstraintNames, betaConstraintNames, tableName, constraintType, devEnvironmentBeingReviewed, }) {
    localConstraintNames.forEach((constraintName) => {
        if (!betaConstraintNames.includes(constraintName)) {
            throw new Error(`constraint '${constraintName}' | '${constraintType}' missing from ${devEnvironmentBeingReviewed} table '${tableName}'`);
        }
    });
    betaConstraintNames.forEach((constraintName) => {
        if (!localConstraintNames.includes(constraintName)) {
            throw new Error(`constraint '${constraintName}' | '${constraintType}' of table '${tableName}' IS IN ${devEnvironmentBeingReviewed} BUT NOT LOCAL`);
        }
    });
}
//# sourceMappingURL=assertMatchingTableConstaints.js.map