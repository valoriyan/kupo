import { Dispatch, SetStateAction, useState } from "react";
import isEqual from "react-fast-compare";

export const useFormField = <
  T extends string | number | boolean | Array<unknown> | object | undefined | null,
>(
  initialValue: T,
) => {
  const [value, setValue] = useState(initialValue);
  const [isTouched, setIsTouched] = useState(false);

  const updateValue: Dispatch<SetStateAction<T>> = (setStateAction) => {
    const newValue =
      typeof setStateAction === "function" ? setStateAction(value) : setStateAction;
    setIsTouched(!isEqual(initialValue, newValue));
    setValue(setStateAction);
  };

  return [value, updateValue, isTouched, setIsTouched] as const;
};
