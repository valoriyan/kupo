import { PropsWithChildren } from "react";
import { styled } from "#/styling";
import { Flex } from "../Layout";

export const ErrorArea = (props: PropsWithChildren<unknown>) => {
  return (
    <Flex
      css={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <ErrorMessage>{props.children}</ErrorMessage>
    </Flex>
  );
};

export const FullScreenErrorArea = (props: PropsWithChildren<unknown>) => {
  return (
    <Flex
      css={{
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <ErrorMessage>{props.children}</ErrorMessage>
    </Flex>
  );
};

const ErrorMessage = styled("div", {
  fontWeight: "$bold",
  fontSize: "$3",
  textAlign: "center",
  p: "$5",
});
