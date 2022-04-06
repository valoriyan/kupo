export interface PSQLFieldAndValue<T> {
  field: string;
  value: T | undefined;
}

export interface PSQLFieldAndArrayOfValues<T> {
  field: string;
  values: T[];
}
