import { styled } from "#/styling";
import { mainTitleStyles } from "../Typography";

export const BasicListWrapper = styled("div", {
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  height: "100%",
});

export const BasicListHeader = styled("h1", mainTitleStyles, {
  display: "flex",
  px: "$6",
  py: "$5",
  gap: "$5",
  borderBottom: "solid $borderWidths$1 $text",
  bg: "$pageBackground",
  position: "sticky",
  top: 0,
  zIndex: 1,
});
