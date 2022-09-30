import {
  Constraint,
  TableConstaints,
} from "../models/TableConstraintStructure";

export function assertMatchingTableConstaints({
  localTableConstraints,
  betaTableConstraints,
  tableName,
}: {
  localTableConstraints: TableConstaints;
  betaTableConstraints: TableConstaints;
  tableName: string;
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
    });
  });
}

function assertMatchingConstraintValues({
  localConstraint,
  betaConstraint,
  tableName,
  constraintType,
  constraintName,
}: {
  localConstraint: Constraint;
  betaConstraint: Constraint;
  tableName: string;
  constraintType: string;
  constraintName: string;
}) {
  const localConstraintDefinition: string =
    localConstraint.constraint_definition;
  const betaConstraintDefinition: string = betaConstraint.constraint_definition;

  if (localConstraintDefinition !== betaConstraintDefinition) {
    throw new Error(
      `Non matching definitions for constraint '${tableName}->${constraintName}->${constraintType}' |  local:'${localConstraintDefinition}' | beta:'${betaConstraintDefinition}'`
    );
  }
}

function assertMatchingConstraintsByType({
  localTableConstraints,
  betaTableConstraints,
  tableName,
  constraintType,
}: {
  localTableConstraints: TableConstaints;
  betaTableConstraints: TableConstaints;
  tableName: string;
  constraintType: string;
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
  });

  localConstraintNames.forEach((constraintName) => {
    assertMatchingConstraintValues({
      localConstraint: localTableConstraints[constraintType][constraintName],
      betaConstraint: betaTableConstraints[constraintType][constraintName],
      tableName,
      constraintType,
      constraintName,
    });
  });
}

function assertMatchingConstraintNames({
  localConstraintNames,
  betaConstraintNames,
  tableName,
  constraintType,
}: {
  localConstraintNames: string[];
  betaConstraintNames: string[];
  tableName: string;
  constraintType: string;
}) {
  localConstraintNames.forEach((constraintName) => {
    if (!betaConstraintNames.includes(constraintName)) {
      throw new Error(
        `constraint '${constraintName}' | '${constraintType}' missing from BETA table '${tableName}'`
      );
    }
  });
  betaConstraintNames.forEach((constraintName) => {
    if (!localConstraintNames.includes(constraintName)) {
      throw new Error(
        `constraint '${constraintName}' | '${constraintType}' of table '${tableName}' IS IN BETA BUT NOT LOCAL`
      );
    }
  });
}
