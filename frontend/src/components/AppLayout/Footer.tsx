import Link from "next/link";
import { PropsWithChildren } from "react";
import { styled } from "#/styling";
import { Avatar } from "../Avatar";
import { Drawer } from "../Drawer";
import { BellIcon, HomeIcon, MailIcon, MathPlusIcon } from "../Icons";
import { Box, Flex } from "../Layout";
import { VerifyEmailState } from "../VerifyEmailModal";
import { NavigationDrawer } from "./NavigationDrawer";
import { UploadButton } from "./shared";

export const APP_FOOTER_HEIGHT = "57px";

export interface FooterProps {
  verifyEmailState: VerifyEmailState;
}

export const Footer = ({ verifyEmailState }: FooterProps) => {
  return (
    <Wrapper>
      <IconLink href="/feed">
        <HomeIcon />
      </IconLink>
      <IconLink href="/notifications">
        <BellIcon />
      </IconLink>
      <UploadButton verifyEmailState={verifyEmailState}>
        <MathPlusIcon />
      </UploadButton>
      <IconLink href="/messages">
        <MailIcon />
      </IconLink>
      <Drawer
        trigger={
          <Avatar
            alt="User Avatar"
            src={verifyEmailState.clientUser?.profilePictureTemporaryUrl}
            size="$7"
          />
        }
        position={{ top: "0", bottom: APP_FOOTER_HEIGHT }}
      >
        {({ hide }) => <NavigationDrawer hide={hide} />}
      </Drawer>
    </Wrapper>
  );
};

const Wrapper = styled(Flex, {
  bg: "$background1",
  px: "$8",
  py: "$3",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopStyle: "solid",
  borderTopWidth: "$1",
  borderTopColor: "$border",
  "> *": { lineHeight: 0 },
});

const IconLink = ({ children, href }: PropsWithChildren<{ href: string }>) => {
  return (
    <Link href={href} passHref>
      <Box as="a" css={{ color: "$text", lineHeight: 0 }}>
        {children}
      </Box>
    </Link>
  );
};
