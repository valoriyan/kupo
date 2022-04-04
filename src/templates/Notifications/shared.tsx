import { Grid } from "#/components/Layout";
import { styled } from "#/styling";

export const NotificationWrapper = styled(Grid, {
  p: "$5",
  gridTemplateColumns: "auto minmax(0, 1fr) auto",
  columnGap: "$5",
  alignItems: "center",
  borderBottom: "solid $borderWidths$1 $border",
});
