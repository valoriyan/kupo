import { styled } from "#/styling";

export const Button = styled("button", {
  color: "$accentText",
  bg: "$primary",
  px: "$5",
  py: "$3",
  fontWeight: "$bold",
  textDecoration: "none",
  textAlign: "center",

  "&:disabled": {
    bg: "$disabled",
    color: "$disabledText",
    cursor: "not-allowed",
  },

  variants: {
    variant: {
      primary: {},
      secondary: { bg: "$text", color: "$inverseText" },
    },
    size: {
      md: {
        borderRadius: "$3",
        fontSize: "$3",
      },
      lg: {
        borderRadius: "$4",
        fontSize: "$4",
      },
    },
  },
});
