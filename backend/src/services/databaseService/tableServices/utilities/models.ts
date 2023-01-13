export interface PSQLFieldAndValue<T> {
  field: string;
  value: T | undefined;
}

export interface PSQLUpdateFieldAndValue<T> extends PSQLFieldAndValue<T> {
  settings?: {
    includeWheneverNotUndefined?: boolean;
  };
}

export interface PSQLFieldAndArrayOfValues<T> {
  field: string;
  values: T[];
}
