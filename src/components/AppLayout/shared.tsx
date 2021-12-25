import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { styled } from "#/styling";
import { Grid } from "../Layout";
import { headingStyles, mainTitleStyles } from "../Typography";

export interface NavLinkProps {
  href: string;
  Icon: React.ComponentType;
  label: string;
  onClick?: () => void;
}

export const NavLink = (props: NavLinkProps) => {
  return (
    <Link href={props.href} passHref>
      <NavItem onClick={props.onClick}>
        <props.Icon />
        <div>{props.label}</div>
      </NavItem>
    </Link>
  );
};

export const NavItem = styled("a", headingStyles, {
  display: "flex",
  alignItems: "center",
  gap: "$5",
  color: "$text",
});

export const SidePanelWrapper = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <Grid
      css={{
        justifyItems: "end",
        gridTemplateRows: "minmax(0, 1fr)",
        height: "100%",
        px: "$8",
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
