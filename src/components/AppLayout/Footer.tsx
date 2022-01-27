import Link from "next/link";
import { PropsWithChildren } from "react";
import { styled } from "#/styling";
import { Avatar } from "../Avatar";
import { Drawer } from "../Drawer";
import { BellIcon, HomeIcon, MailIcon, MathPlusIcon } from "../Icons";
import { Box, Flex } from "../Layout";
import { NavigationDrawer } from "./NavigationDrawer";
import { UploadLink } from "./shared";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";

export const Footer = () => {
  const { data, isLoading, error } = useGetClientUserProfile();

  if (error && !isLoading) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  const { username } = data;

  return (
    <Wrapper>
      <IconLink href="/feed">
        <HomeIcon />
      </IconLink>
      <IconLink href="/notifications">
        <BellIcon />
      </IconLink>
      <Link href="/add-content" passHref>
        <UploadLink>
          <MathPlusIcon />
        </UploadLink>
      </Link>
      <IconLink href="/messages">
        <MailIcon />
      </IconLink>
      <Drawer
        trigger={<Avatar src="" alt="User Avatar" size="$7" />}
        position={{ top: "0", bottom: "57px" /* Top of Footer */ }}
      >
        {({ hide }) => <NavigationDrawer hide={hide} username={username} />}
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
