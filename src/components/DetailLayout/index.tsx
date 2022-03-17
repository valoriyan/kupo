import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { ArrowLeftIcon } from "../Icons";
import { Flex, Grid } from "../Layout";
import { MainTitle } from "../Typography";

export interface DetailLayoutProps {
  heading: string;
  children: ReactNode;
}

export const DetailLayout = (props: DetailLayoutProps) => {
  const router = useRouter();

  return (
    <Grid css={{ gridTemplateRows: "auto minmax(0, 1fr)", height: "100%" }}>
      <Flex
        css={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          alignItems: "center",
          bg: "$background1",
          borderBottom: "solid $borderWidths$1 $border",
          px: "$4",
          py: "$5",
        }}
      >
        <Link
          href={typeof router.query.backTo === "string" ? router.query.backTo : "/feed"}
          passHref
        >
          <Flex as="a" css={{ color: "$text", gap: "$4" }}>
            <ArrowLeftIcon />
            <MainTitle>{props.heading}</MainTitle>
          </Flex>
        </Link>
      </Flex>
      {props.children}
    </Grid>
  );
};
