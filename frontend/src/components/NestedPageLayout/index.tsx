import Link from "next/link";
import { ReactNode } from "react";
import { MAX_APP_CONTENT_WIDTH, SIDE_PANEL_WIDTH } from "#/constants";
import { styled } from "#/styling";
import { translucentBg } from "#/styling/mixins";
import { ChevronLeftIcon, CloseIcon } from "../Icons";
import { Flex, Stack } from "../Layout";
import { MainTitle } from "../Typography";

const NESTED_PAGE_LAYOUT_HEADER_HEIGHT = "82px";

export interface NestedPageLayoutProps {
  children: ReactNode;
  heading: ReactNode;
  closeHref: string;
  backHref?: string;
  handleScroll?: boolean;
}

export const NestedPageLayout = (props: NestedPageLayoutProps) => {
  return (
    <>
      <Header>
        <Link href={props.closeHref} passHref>
          <NavButton>
            <CloseIcon />
          </NavButton>
        </Link>
        <Flex css={{ gap: "$4" }}>
          {!!props.backHref && (
            <Link href={props.backHref} passHref>
              <NavButton css={{ ml: "-8px" }}>
                <ChevronLeftIcon />
              </NavButton>
            </Link>
          )}
          <MainTitle as="h1">{props.heading}</MainTitle>
        </Flex>
      </Header>
      <Stack css={{ pt: NESTED_PAGE_LAYOUT_HEADER_HEIGHT }}>{props.children}</Stack>
    </>
  );
};

const Header = styled(Stack, translucentBg, {
  position: "fixed",
  top: 0,
  zIndex: 2,
  px: "$6",
  py: "$5",
  gap: "$1",
  borderBottomStyle: "solid",
  borderBottomWidth: "$1",
  borderBottomColor: "$border",
  width: "100%",
  "@md": {
    width: `calc(100vw - ${SIDE_PANEL_WIDTH})`,
    maxWidth: MAX_APP_CONTENT_WIDTH,
  },
});

const NavButton = styled("a", {
  color: "$text",
  fontWeight: "$bold",
  fontSize: "$4",
  height: "$6",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "flex-end",
});
