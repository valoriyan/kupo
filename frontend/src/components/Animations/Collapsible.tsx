import { ReactNode } from "react";
import { styled } from "#/styling";
import { Grid } from "../Layout";

export interface CollapsibleProps {
  isCollapsed: boolean;
  children: ReactNode;
}

export const Collapsible = ({ isCollapsed, children }: CollapsibleProps) => (
  <Wrapper css={{ gridTemplateRows: isCollapsed ? "0fr" : "1fr" }}>
    <div>{children}</div>
  </Wrapper>
);

const Wrapper = styled(Grid, {
  overflow: "hidden",
  "> div": { minHeight: 0 },
  transition: "grid-template-rows $2 ease",
});
