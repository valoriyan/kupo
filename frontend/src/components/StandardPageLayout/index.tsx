import Link from "next/link";
import { ReactNode } from "react";
import {
  STANDARD_PAGE_HEADER_HEIGHT,
  MAX_APP_CONTENT_WIDTH,
  SIDE_PANEL_WIDTH,
} from "#/constants";
import { styled } from "#/styling";
import { translucentBg } from "#/styling/mixins";
import { IconButton } from "../Button";
import { ArrowLeftIcon, CloseIcon } from "../Icons";
import { Box, Flex } from "../Layout";
import { MainTitle } from "../Typography";

export interface StandardPageLayoutProps {
  heading: ReactNode;
  children: ReactNode;
  backHref?: string;
  closeHref?: string;
}

export const StandardPageLayout = (props: StandardPageLayoutProps) => {
  return (
    <>
      <Header css={{ pl: props.backHref ? "$4" : "$6" }}>
        <Flex css={{ gap: "$4" }}>
          {props.backHref && (
            <Link href={props.backHref} passHref>
              <IconButton as="a" css={{ color: "$text" }}>
                <ArrowLeftIcon />
              </IconButton>
            </Link>
          )}
          <MainTitle
            as="h1"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {props.heading}
          </MainTitle>
        </Flex>
        {props.closeHref && (
          <Link href={props.closeHref} passHref>
            <NavButton>
              <CloseIcon />
            </NavButton>
          </Link>
        )}
      </Header>
      <Box css={{ pt: STANDARD_PAGE_HEADER_HEIGHT }}>{props.children}</Box>
    </>
  );
};

const Header = styled(Flex, translucentBg, {
  position: "fixed",
  top: 0,
  zIndex: 2,
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "solid $borderWidths$1 $border",
  px: "$6",
  py: "$5",
  gap: "$1",
  height: STANDARD_PAGE_HEADER_HEIGHT,
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
