import { PropsWithChildren } from "react";
import { styled } from "#/styling";
import { Spinner, SpinnerProps } from "../Spinner";

export interface TextOrSpinnerProps {
  isLoading: boolean;
  size?: SpinnerProps["size"];
}

/**
 * A component meant to be put inside a <Button />. This will change to a
 * entered loader while its `isLoading` prop is true.
 */
export const TextOrSpinner = ({
  children,
  isLoading,
  size = "md",
}: PropsWithChildren<TextOrSpinnerProps>) => {
  return (
    <Wrapper isLoading={isLoading}>
      {children}
      {isLoading && (
        <SpinnerHolder>
          <Spinner size={size} />
        </SpinnerHolder>
      )}
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  position: "relative",
  verticalAlign: "middle",
  variants: {
    isLoading: {
      true: { color: "$transparent" },
    },
  },
});

const SpinnerHolder = styled("div", {
  display: "flex",
  position: "absolute",
  top: "0px",
  left: "0px",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
});
