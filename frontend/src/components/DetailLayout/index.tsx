import Link from "next/link";
import { ReactNode } from "react";
import { styled } from "#/styling";
import { translucentBg } from "#/styling/mixins";
import { ArrowLeftIcon } from "../Icons";
import { Box, Flex, Grid } from "../Layout";
import { MainTitle } from "../Typography";

export interface DetailLayoutProps {
  heading: string;
  backRoute: string;
  children: ReactNode;
}

export const DetailLayout = (props: DetailLayoutProps) => {
  return (
    <Grid css={{ gridTemplateRows: "auto minmax(0, 1fr)", height: "100%" }}>
      <Header>
        <Link href={props.backRoute} passHref>
          <Flex as="a" css={{ color: "$text", gap: "$4" }}>
            <ArrowLeftIcon />
            <MainTitle>{props.heading}</MainTitle>
          </Flex>
        </Link>
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
