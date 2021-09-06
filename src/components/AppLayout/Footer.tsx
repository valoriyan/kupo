import Link from "next/link";
import { PropsWithChildren } from "react";
import { Box, Flex } from "../Layout";
import { styled } from "#/styling";
import { Bell, Home, Mail, Plus } from "../Icons";
import { Drawer } from "../Drawer";
import { NavigationDrawer } from "./NavigationDrawer";
import { Avatar } from "../Avatar";

export const Footer = () => {
  return (
    <Wrapper>
      <IconLink href="/">
        <Home />
      </IconLink>
      <IconLink href="/">
        <Bell />
      </IconLink>
      <Link href="/add-content" passHref>
        <Upload>
          <Plus />
        </Upload>
      </Link>
      <IconLink href="/">
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

const Upload = styled("a", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "$accentText",
  borderRadius: "$5",
  px: "$5",
  py: "$3",
  background: "linear-gradient(202.17deg, #FF00D6 8.58%, #FF4D00 91.42%)",
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
