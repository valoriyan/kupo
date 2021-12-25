import Link from "next/link";
import { Button } from "../Button";
import { SupportIcon } from "../Icons";
import { Stack } from "../Layout";
import { MainTitle } from "../Typography";
import { NavLink, SidePanelWrapper } from "./shared";

export const NoAuthSidePanel = () => {
  return (
    <SidePanelWrapper>
      <Stack css={{ gap: "$5" }}>
        <MainTitle css={{ textAlign: "center", mb: "$2" }}>
          Experience the full site
        </MainTitle>
        <Link href="/login" passHref>
          <Button as="a" size="lg" variant="primary">
            Log In
          </Button>
        </Link>
        <Link href="/sign-up" passHref>
          <Button as="a" size="lg" variant="secondary">
            Sign Up
          </Button>
        </Link>
      </Stack>
      <Stack css={{ gap: "$6" }}>
        <NavLink href="/support" Icon={SupportIcon} label="Support" />
      </Stack>
    </SidePanelWrapper>
  );
};
