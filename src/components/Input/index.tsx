import { styled } from "#/styling";

export const Input = styled("input", {
  borderRadius: "$4",
  borderStyle: "solid",
  borderWidth: "$1",
  borderColor: "$text",
  backgroundColor: "$background1",
  color: "$text",

  variants: {
    size: {
      md: {
        fontSize: "$2",
        px: "$3",
        py: "$2",
      },
      lg: {
        fontSize: "$4",
        px: "$5",
        py: "$3",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
