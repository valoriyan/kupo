import { ReactNode } from "react";
import { styled } from "#/styling";

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export const Button = (props: ButtonProps) => {
  return <BaseButton onClick={props.onClick}>{props.children}</BaseButton>;
};

const BaseButton = styled("button", {
  color: "$accentText",
  bg: "$primary",
  px: "$2",
  py: "$3",
  borderRadius: "$2",
});
