import Link from "next/link";
import { LockIcon, UserIcon } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { mainTitleStyles } from "#/components/Typography";
import { styled } from "#/styling";

export const Settings = () => {
  return (
    <Stack>
      <Link href="/settings/profile" passHref>
        <NavButton>
          <UserIcon /> Profile
        </NavButton>
      </Link>
      <Link href="/settings/account" passHref>
        <NavButton>
          <LockIcon /> Account
        </NavButton>
      </Link>
    </Stack>
  );
};

const NavButton = styled("a", mainTitleStyles, {
  display: "flex",
  alignItems: "center",
  gap: "$6",
  px: "$9",
  py: "$7",
  color: "$text",
  fontSize: "$3",
  fontWeight: "$bold",
  borderBottomStyle: "solid",
  borderBottomWidth: "$1",
  borderBottomColor: "$border",
});
