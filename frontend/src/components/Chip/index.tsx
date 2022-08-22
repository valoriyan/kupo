import { styled } from "#/styling";
import { bodyStyles } from "../Typography";

export const Chip = styled("div", bodyStyles, {
  display: "flex",
  alignItems: "center",
  py: "$1",
  px: "$3",
  borderRadius: "$round",
  fontWeight: "$bold",
  transition: "background-color $1 ease, color $1 ease",

  variants: {
    variant: {
      primary: {
        color: "$primaryStrong",
        bg: "$primarySubdued",
      },
      disabled: {
        color: "$disabledText",
        bg: "$disabled",
      },
    },
  },

  defaultVariants: {
    variant: "primary",
  },
});
