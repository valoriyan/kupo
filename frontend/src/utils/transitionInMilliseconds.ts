import { theme } from "#/styling";

export const transitionInMilliseconds = (
  transitionsKey: keyof typeof theme.transitions,
) => parseFloat(theme.transitions[transitionsKey].value.split("s")[0]) * 1000;
