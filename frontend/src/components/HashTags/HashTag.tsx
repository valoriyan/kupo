import { css, keyframes, styled } from "#/styling";
import { goToPostByHashTagPage } from "#/templates/PostsByHashTag";

export interface HashTagProps {
  hashtag: string;
  outlined?: boolean;
}

export const HashTag = ({ hashtag, outlined }: HashTagProps) => {
  return (
    <HashTagElement onClick={() => goToPostByHashTagPage(hashtag)} outlined={outlined}>
      #{hashtag}
    </HashTagElement>
  );
};

const HashTagElement = styled("button", {
  borderRadius: "$round",
  py: "$1",
  px: "$3",
  color: "$primaryStrong",
  bg: "$primarySubdued",
  fontWeight: "$bold",
  border: "solid $borderWidths$1 $primarySubdued",

  variants: {
    outlined: {
      true: {
        color: "$primary",
        bg: "$transparent",
        borderColor: "$primary",
      },
    },
  },
});

export interface AnimatedHashTagProps {
  tag: string;
}

export const AnimatedHashTag = ({ tag }: AnimatedHashTagProps) => {
  return (
    <Wrapper>
      #{tag}
      <HashTagBackground />
      <HashTagText>#{tag}</HashTagText>
    </Wrapper>
  );
};

const textStyles = css({
  color: "$primaryStrong",
  fontWeight: "$bold",
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
  borderRadius: "$round",
  bg: "$primarySubdued",
  animation: `${growFromCorner} $3 ease`,
});
