import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";
import { styled, ThemeScale } from "#/styling";
import { Grid } from "../Layout";
import { headingStyles, mainTitleStyles } from "../Typography";

export interface NavLinkProps {
  href: string;
  Icon: React.ComponentType;
  label: ReactNode;
  onClick?: () => void;
  color?: ThemeScale<"colors">;
  "data-cy"?: string;
}

export const NavLink = (props: NavLinkProps) => {
  return (
    <Link href={props.href} passHref>
      <NavItem onClick={props.onClick} css={{ color: props.color || "$text" }}>
        <props.Icon />
        <div data-cy={props["data-cy"]}>{props.label}</div>
      </NavItem>
    </Link>
  );
};

export const NavItem = styled("a", headingStyles, {
  display: "flex",
  alignItems: "center",
  gap: "$5",
});

export const SidePanelWrapper = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <Grid
      css={{
        justifyItems: "end",
        gridTemplateRows: "minmax(0, 1fr)",
        height: "100%",
        pt: "$6",
        borderRight: "solid $borderWidths$1 $border",
      }}
    >
      <Grid
        css={{
          height: "100%",
          gridTemplateRows: "auto minmax(0, 1fr)",
          rowGap: "$9",
        }}
      >
        {children}
      </Grid>
    </Grid>
  );
};

export const UploadLink = styled("a", mainTitleStyles, {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "$accentText",
  borderRadius: "$5",
  px: "$6",
  py: "$3",
  background: "linear-gradient(180deg, $primary 0%, #8913FF 100%)",
});
