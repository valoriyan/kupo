import { styled } from "#/styling";

export const Button = styled("button", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
    outlined: { true: {} },
    size: {
      sm: {
        borderRadius: "$3",
        fontSize: "$2",
        px: "$3",
        py: "$2",
      },
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
  compoundVariants: [
    {
      variant: "primary",
      outlined: true,
      css: {
        bg: "transparent",
        borderStyle: "solid",
        borderWidth: "$1",
        borderColor: "$primary",
        color: "$primary",
        "&:disabled": {
          bg: "transparent",
          borderColor: "$disabled",
          color: "$disabledText",
        },
      },
    },
    {
      variant: "secondary",
      outlined: true,
      css: {
        bg: "transparent",
        borderStyle: "solid",
        borderWidth: "$1",
        borderColor: "$text",
        color: "$text",
        "&:disabled": {
          bg: "transparent",
          borderColor: "$text",
          color: "$text",
          filter: "opacity(0.5)",
        },
      },
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
