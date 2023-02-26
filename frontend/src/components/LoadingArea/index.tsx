import { Flex } from "../Layout";
import { Spinner, SpinnerProps } from "../Spinner";
import { CSS, styled } from "#/styling";

export const LoadingArea = ({ css, ...props }: SpinnerProps & { css?: CSS }) => {
  return (
    <LoadingAreaWrapper css={css}>
      <Spinner {...props} />
    </LoadingAreaWrapper>
  );
};

const LoadingAreaWrapper = styled(Flex, {
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
  p: "$6",
});

export const FullScreenLoadingArea = ({
  css,
  ...props
}: SpinnerProps & { css?: CSS }) => {
  return (
    <FullScreenLoadingAreaWrapper css={css}>
      <Spinner {...props} />
    </FullScreenLoadingAreaWrapper>
  );
};

const FullScreenLoadingAreaWrapper = styled(Flex, {
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
});
