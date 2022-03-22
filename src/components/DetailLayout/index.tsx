import Link from "next/link";
import { ReactNode } from "react";
import { styled } from "#/styling";
import { ArrowLeftIcon } from "../Icons";
import { Flex, Grid } from "../Layout";
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
      {props.children}
    </Grid>
  );
};

const Header = styled(Flex, {
  position: "sticky",
  top: 0,
  zIndex: 1,
  alignItems: "center",
  bg: "$background1",
  borderBottom: "solid $borderWidths$1 $border",
  px: "$4",
  py: "$5",
});
