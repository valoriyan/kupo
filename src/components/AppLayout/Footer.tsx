import Link from "next/link";
import { PropsWithChildren } from "react";
import { styled } from "#/styling";
import { Avatar } from "../Avatar";
import { Drawer } from "../Drawer";
import { Bell, Home, Mail, MathPlus } from "../Icons";
import { Box, Flex } from "../Layout";
import { NavigationDrawer } from "./NavigationDrawer";
import { UploadLink } from "./shared";

export const Footer = () => {
  return (
    <Wrapper>
      <IconLink href="/">
        <Home />
      </IconLink>
      <IconLink href="/notifications">
        <Bell />
      </IconLink>
      <Link href="/add-content" passHref>
        <UploadLink>
          <MathPlus />
        </UploadLink>
      </Link>
      <IconLink href="/messages">
        <Mail />
      </IconLink>
      <Drawer
        trigger={<Avatar src="" alt="User Avatar" size="$6" />}
        position={{ top: "0", bottom: "57px" /* Top of Footer */ }}
      >
        {({ hide }) => <NavigationDrawer hide={hide} />}
      </Drawer>
    </Wrapper>
  );
};

const Wrapper = styled(Flex, {
  bg: "$background1",
  px: "$7",
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
