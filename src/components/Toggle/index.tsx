import { Dispatch, SetStateAction } from "react";
import { styled } from "#/styling";

export interface ToggleProps {
  toggled: boolean;
  setToggled: Dispatch<SetStateAction<boolean>>;
  id?: string;
}

export const Toggle = (props: ToggleProps) => {
  return (
    <ToggleInput
      type="checkbox"
      id={props.id}
      checked={props.toggled}
      onChange={(e) => props.setToggled(e.currentTarget.checked)}
    />
  );
};

const ToggleInput = styled("input", {
  position: "relative",
  appearance: "none",
  m: 0,
  width: "$8",
  height: "$6",
  borderRadius: "$4",
  bg: "$border",
  cursor: "pointer",
  transition: "background-color $1 ease",
  "&:before": {
    content: "",
    display: "block",
    position: "absolute",
    width: "$5",
    height: "$5",
    top: "calc(($6 / 2) - ($5 / 2))",
    left: "$2",
    borderRadius: "$round",
    bg: "$background1",
    transition: "transform $1 ease",
    zIndex: 1,
  },
  "&:checked": {
    bg: "$primary",
    "&:before": {
      transform: "translateX($space$5)",
    },
  },
});
