export interface TableConstraints {
  foreignKeyConstraints: {
    [constraintName: string]: Constraint;
  };
  primaryKeyConstraints: {
    [constraintName: string]: Constraint;
  };
  uniqueIndexConstraints: {
    [constraintName: string]: Constraint;
  };
}

export interface Constraint {
  name_of_constraint: string;
  constraint_definition: string;
}
