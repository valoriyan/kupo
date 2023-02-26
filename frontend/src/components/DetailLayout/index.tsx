import Link from "next/link";
import { ReactNode } from "react";
import { MAX_APP_CONTENT_WIDTH, SIDE_PANEL_WIDTH } from "#/constants";
import { styled } from "#/styling";
import { translucentBg } from "#/styling/mixins";
import { IconButton } from "../Button";
import { ArrowLeftIcon } from "../Icons";
import { Box, Flex } from "../Layout";
import { MainTitle } from "../Typography";

const DETAIL_LAYOUT_HEADER_HEIGHT = "56px";

export interface DetailLayoutProps {
  heading: string;
  backRoute?: string;
  children: ReactNode;
}

export const DetailLayout = (props: DetailLayoutProps) => {
  return (
    <>
      <Header css={{ pl: props.backRoute ? "$4" : "$6" }}>
        <Flex css={{ gap: "$4" }}>
          {props.backRoute && (
            <Link href={props.backRoute} passHref>
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
      </Header>
      <Box css={{ pt: DETAIL_LAYOUT_HEADER_HEIGHT }}>{props.children}</Box>
    </>
  );
};

const Header = styled(Flex, translucentBg, {
  position: "fixed",
  top: 0,
  zIndex: 2,
  alignItems: "center",
  borderBottom: "solid $borderWidths$1 $border",
  px: "$6",
  py: "$5",
  width: "100%",
  "@md": {
    width: `calc(100vw - ${SIDE_PANEL_WIDTH})`,
    maxWidth: MAX_APP_CONTENT_WIDTH,
  },
});
