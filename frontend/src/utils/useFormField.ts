import { SetStateAction, useState } from "react";
import isEqual from "react-fast-compare";

export const useFormField = <T>(initialValue: T) => {
  const [value, setValue] = useState(initialValue);
  const [isTouched, setIsTouched] = useState(false);

  const updateValue = (newValue: SetStateAction<T>) => {
    setIsTouched(!isEqual(initialValue, newValue));
    setValue(newValue);
  };

  return [value, updateValue, isTouched, setIsTouched] as const;
};
