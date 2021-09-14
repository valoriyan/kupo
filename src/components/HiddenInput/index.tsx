import { styled } from "#/styling";

export const HiddenInput = styled("input", {
  position: "absolute",
  appearance: "none",
  border: "none",
  size: 0,
  padding: 0,
  opacity: 0,
});
