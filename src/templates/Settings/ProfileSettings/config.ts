import { Color } from "#/api";

export const colorOption1: Color = {
  red: 94,
  green: 95,
  blue: 239,
};

const colorOption2: Color = {
  red: 255,
  green: 77,
  blue: 0,
};

const colorOption3: Color = {
  red: 128,
  green: 255,
  blue: 0,
};

const colorOption4: Color = {
  red: 51,
  green: 0,
  blue: 255,
};

const colorOption5: Color = {
  red: 196,
  green: 196,
  blue: 196,
};

export const colorOptions: Color[] = [
  colorOption1,
  colorOption2,
  colorOption3,
  colorOption4,
  colorOption5,
];

export const defaultPreferredPagePrimaryColor: Color = colorOption1;
