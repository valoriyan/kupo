import { styled } from "#/styling";

export const Button = styled("button", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "$accentText",
  bg: "$primary",
  px: "$6",
  py: "$3",
  fontWeight: "$bold",
  textDecoration: "none",
  textAlign: "center",
  transition: "background-color $1 ease",

  "&:disabled": {
    bg: "$disabled",
    color: "$disabledText",
    cursor: "not-allowed",
  },

  "&:hover": {
    filter: "brightness(0.9)",
  },
  "&:active": {
    filter: "brightness(0.8)",
  },

  variants: {
    variant: {
      primary: {},
      secondary: { bg: "$text", color: "$inverseText" },
      danger: { bg: "$failure", color: "$accentText" },
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
    round: { true: { borderRadius: "$round" } },
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
    {
      variant: "danger",
      outlined: true,
      css: {
        bg: "transparent",
        borderStyle: "solid",
        borderWidth: "$1",
        borderColor: "$failure",
        color: "$failure",
        "&:disabled": {
          bg: "transparent",
          borderColor: "$disabled",
          color: "$disabledText",
        },
      },
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    outlined: false,
    round: false,
  },
});

export const IconButton = styled("button", {
  lineHeight: 0,
  "&:disabled": {
    color: "$disabledText",
    cursor: "not-allowed",
  },
});
