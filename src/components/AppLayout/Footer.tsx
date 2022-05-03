import Link from "next/link";
import { PropsWithChildren } from "react";
import { styled } from "#/styling";
import { setPreviousLocationForAddContent } from "#/templates/AddContent";
import { Drawer } from "../Drawer";
import { BellIcon, HomeIcon, MailIcon, MathPlusIcon, UserIcon } from "../Icons";
import { Box, Flex } from "../Layout";
import { NavigationDrawer } from "./NavigationDrawer";
import { UploadLink } from "./shared";

export const Footer = () => {
  return (
    <Wrapper>
      <IconLink href="/feed">
        <HomeIcon />
      </IconLink>
      <IconLink href="/notifications">
        <BellIcon />
      </IconLink>
      <Link href="/add-content" passHref>
        <UploadLink onClick={setPreviousLocationForAddContent}>
          <MathPlusIcon />
        </UploadLink>
      </Link>
      <IconLink href="/messages">
        <MailIcon />
      </IconLink>
      <Drawer
        trigger={<UserIcon />}
        position={{ top: "0", bottom: "57px" /* Top of Footer */ }}
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
