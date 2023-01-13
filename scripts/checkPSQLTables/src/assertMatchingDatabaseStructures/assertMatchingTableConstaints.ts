import {
  Constraint,
  TableConstraints,
} from "../models/TableConstraintStructure";

export function assertMatchingTableConstaints({
  localTableConstraints,
  betaTableConstraints,
  tableName,
  devEnvironmentBeingReviewed,
}: {
  localTableConstraints: TableConstraints;
  betaTableConstraints: TableConstraints;
  tableName: string;
  devEnvironmentBeingReviewed: string;
}) {
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

function assertMatchingConstraintValues({
  localConstraint,
  betaConstraint,
  tableName,
  constraintType,
  constraintName,
  devEnvironmentBeingReviewed,
}: {
  localConstraint: Constraint;
  betaConstraint: Constraint;
  tableName: string;
  constraintType: string;
  constraintName: string;
  devEnvironmentBeingReviewed: string;
}) {
  const localConstraintDefinition: string =
    localConstraint.constraint_definition;
  const betaConstraintDefinition: string = betaConstraint.constraint_definition;

  if (localConstraintDefinition !== betaConstraintDefinition) {
    throw new Error(
      `Non matching definitions for constraint '${tableName}->${constraintName}->${constraintType}' |  local:'${localConstraintDefinition}' | ${devEnvironmentBeingReviewed}:'${betaConstraintDefinition}'`
    );
  }
}

function assertMatchingConstraintsByType({
  localTableConstraints,
  betaTableConstraints,
  tableName,
  constraintType,
  devEnvironmentBeingReviewed,
}: {
  localTableConstraints: TableConstraints;
  betaTableConstraints: TableConstraints;
  tableName: string;
  constraintType: string;
  devEnvironmentBeingReviewed: string;
}) {
  const localConstraintNames: string[] = Object.keys(
    localTableConstraints[constraintType]
  );
  const betaConstraintNames: string[] = Object.keys(
    betaTableConstraints[constraintType]
  );

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

function assertMatchingConstraintNames({
  localConstraintNames,
  betaConstraintNames,
  tableName,
  constraintType,
  devEnvironmentBeingReviewed,
}: {
  localConstraintNames: string[];
  betaConstraintNames: string[];
  tableName: string;
  constraintType: string;
  devEnvironmentBeingReviewed: string;
}) {
  localConstraintNames.forEach((constraintName) => {
    if (!betaConstraintNames.includes(constraintName)) {
      throw new Error(
        `constraint '${constraintName}' | '${constraintType}' missing from ${devEnvironmentBeingReviewed} table '${tableName}'`
      );
    }
  });
  betaConstraintNames.forEach((constraintName) => {
    if (!localConstraintNames.includes(constraintName)) {
      throw new Error(
        `constraint '${constraintName}' | '${constraintType}' of table '${tableName}' IS IN ${devEnvironmentBeingReviewed} BUT NOT LOCAL`
      );
    }
  });
}
