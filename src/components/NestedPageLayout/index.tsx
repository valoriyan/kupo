import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef } from "react";
import { styled } from "#/styling";
import { ChevronLeftIcon, CloseIcon } from "../Icons";
import { Flex, Stack } from "../Layout";
import { TransitionArea } from "../TransitionArea";
import { MainTitle } from "../Typography";

export interface NestedPageLayoutProps {
  children: ReactNode;
  heading: string;
  closeHref: string;
  backHref?: string;
}

export const NestedPageLayout = (props: NestedPageLayoutProps) => {
  const router = useRouter();
  const currentRoute = router.asPath;
  const lastRoute = useRef<string>(currentRoute);

  useEffect(() => {
    lastRoute.current = currentRoute;
  }, [currentRoute]);

  const isGoingBack =
    currentRoute.split("/").length - lastRoute.current.split("/").length < 0;

  return (
    <Wrapper>
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
      <TransitionArea
        transitionKey={currentRoute}
        custom={isGoingBack}
        animation={{
          initial: (isGoingBack: boolean) => ({
            translateX: isGoingBack ? "-100%" : "100%",
          }),
          animate: { translateX: 0 },
          exit: (isGoingBack: boolean) => ({
            translateX: isGoingBack ? "100%" : "-100%",
          }),
        }}
      >
        {props.children}
      </TransitionArea>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  height: "100%",
  bg: "$background1",
});

const Header = styled(Stack, {
  px: "$6",
  py: "$5",
  gap: "$1",
  borderBottomStyle: "solid",
  borderBottomWidth: "$1",
  borderBottomColor: "$text",
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
