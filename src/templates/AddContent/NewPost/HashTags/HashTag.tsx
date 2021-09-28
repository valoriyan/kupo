import { css, keyframes, styled } from "#/styling";

export interface HashTagProps {
  tag: string;
}

export const HashTag = ({ tag }: HashTagProps) => {
  return (
    <Wrapper>
      #{tag}
      <HashTagBackground />
      <HashTagText>#{tag}</HashTagText>
    </Wrapper>
  );
};

const textStyles = css({
  color: "$accentText",
  py: "$1",
  px: "$3",
});

const Wrapper = styled("span", textStyles, {
  borderRadius: "$round",
  overflow: "hidden",
  position: "relative",
});

const HashTagText = styled("div", textStyles, {
  position: "absolute",
  top: 0,
  left: 0,
  size: "max-content",
});

const growFromCorner = keyframes({
  "0%": { transform: "translate(100%, 100%) scale(0)" },
  "100%": { transform: "translate(0%, 0%) scale(1)" },
});

const HashTagBackground = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  size: "100%",
  borderRadius: "round",
  bg: "$primary",
  animation: `${growFromCorner} $2 ease`,
});
