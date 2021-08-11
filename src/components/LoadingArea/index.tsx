import { Flex } from "../Layout";
import { Spinner, SpinnerProps } from "../Spinner";

export const LoadingArea = (props: SpinnerProps) => {
  return (
    <Flex
      css={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Spinner {...props} />
    </Flex>
  );
};

export const FullScreenLoadingArea = (props: SpinnerProps) => {
  return (
    <Flex
      css={{
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Spinner {...props} />
    </Flex>
  );
};
