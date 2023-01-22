import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";
import { styled, ThemeScale } from "#/styling";
import { setPreviousLocationForAddContent } from "#/templates/AddContent";
import { Grid } from "../Layout";
import { headingStyles, mainTitleStyles } from "../Typography";
import { openVerifyEmailModal, VerifyEmailState } from "../VerifyEmailModal";

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

export interface UploadButtonProps {
  verifyEmailState: VerifyEmailState;
  children: ReactNode;
}

export const UploadButton = ({ verifyEmailState, children }: UploadButtonProps) => {
  const { emailAddress, hasNotVerifiedEmail } = verifyEmailState;
  const disableUploads = emailAddress && hasNotVerifiedEmail;

  return disableUploads ? (
    <UploadLink as="button" onClick={() => openVerifyEmailModal({ emailAddress })}>
      {children}
    </UploadLink>
  ) : (
    <Link href="/add-content" passHref>
      <UploadLink onClick={setPreviousLocationForAddContent}>{children}</UploadLink>
    </Link>
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
