import { useId } from "@radix-ui/react-id";
import { forwardRef } from "react";
import { CSS, styled } from "#/styling";
import { Stack } from "../Layout";
import { Body, Subtext } from "../Typography";

type InputAttributes = JSX.IntrinsicElements["input"];

export interface InputProps extends Omit<InputAttributes, "size"> {
  size?: "md" | "lg";
  label?: string;
  css?: CSS;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size, label, css, id, ...props }, ref) => {
    const generatedId = useId();
    const effectiveId = id ?? generatedId;

    const inputNode = (
      // For some reason TypeScript has a problem with the type of our ref
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <InputElement ref={ref as any} id={effectiveId} size={size} css={css} {...props} />
    );

    if (label) {
      return (
        <Stack as="label" htmlFor={effectiveId} css={{ gap: "$2", ...css }}>
          {size === "lg" ? (
            <Body css={{ color: "$secondaryText", pl: "$4" }}>{label}</Body>
          ) : (
            <Subtext css={{ color: "$secondaryText", pl: "$3" }}>{label}</Subtext>
          )}
          {inputNode}
        </Stack>
      );
    }

    return inputNode;
  },
);
Input.displayName = "Input";

const InputElement = styled("input", {
  borderRadius: "$4",
  borderStyle: "solid",
  borderWidth: "$1",
  borderColor: "$border",
  backgroundColor: "$background1",
  color: "$text",

  "&:disabled": { borderColor: "$disabledText" },

  variants: {
    size: {
      md: {
        fontSize: "$2",
        px: "$3",
        py: "$2",
      },
      lg: {
        fontSize: "$4",
        px: "$4",
        py: "$3",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
