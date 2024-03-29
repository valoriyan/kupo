import { TableStructure } from "../models";
import { assertMatchingColumnStructures } from "./assertMatchingColumnStructures";
import { assertMatchingTableConstaints } from "./assertMatchingTableConstaints";

export function assertMatchingTableStructures({
  localTableStructure,
  betaTableStructure,
  tableName,
  devEnvironmentBeingReviewed,
}: {
  localTableStructure: TableStructure;
  betaTableStructure: TableStructure;
  tableName: string;
  devEnvironmentBeingReviewed: string;
}) {
  assertMatchingColumnStructures({
    localTableStructure,
    betaTableStructure,
    tableName,
  });

  assertMatchingTableConstaints({
    localTableConstraints: localTableStructure.constraints,
    betaTableConstraints: betaTableStructure.constraints,
    tableName,
    devEnvironmentBeingReviewed,
  });
}
