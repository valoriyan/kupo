import { styled } from "#/styling";
import { bodyStyles } from "../Typography";

export const Chip = styled("div", bodyStyles, {
  borderRadius: "$round",
  py: "$1",
  px: "$3",
  color: "$primaryStrong",
  bg: "$primarySubdued",
  fontWeight: "$bold",
});
