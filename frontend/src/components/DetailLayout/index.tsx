import Link from "next/link";
import { ReactNode } from "react";
import { styled } from "#/styling";
import { translucentBg } from "#/styling/mixins";
import { useAppLayoutState } from "../AppLayout";
import { IconButton } from "../Button";
import { ArrowLeftIcon } from "../Icons";
import { Box, Flex, Grid } from "../Layout";
import { MainTitle } from "../Typography";

export interface DetailLayoutProps {
  heading: string;
  backRoute: string;
  children: ReactNode;
}

export const DetailLayout = (props: DetailLayoutProps) => {
  const scrollToTop = useAppLayoutState((store) => store.scrollToTop);

  return (
    <Grid css={{ gridTemplateRows: "auto minmax(0, 1fr)", height: "100%" }}>
      <Header>
        <Flex css={{ gap: "$4" }}>
          <Link href={props.backRoute} passHref>
            <IconButton as="a" css={{ color: "$text" }}>
              <ArrowLeftIcon />
            </IconButton>
          </Link>
          <MainTitle onClick={() => scrollToTop(true)}>{props.heading}</MainTitle>
        </Flex>
      </Header>
      <Box css={{ height: "100%" }}>{props.children}</Box>
    </Grid>
  );
};

const Header = styled(Flex, translucentBg, {
  position: "sticky",
  top: 0,
  zIndex: 1,
  alignItems: "center",
  borderBottom: "solid $borderWidths$1 $border",
  px: "$4",
  py: "$5",
});
