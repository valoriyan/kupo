import { css, styled } from "#/styling";

export * from "./utils";

export const sloganStyles = css({
  fontFamily: "$body",
  fontWeight: "$regular",
  fontSize: "$4",
  color: "$primary",
});
export const Slogan = styled("div", sloganStyles);

export const mainTitleStyles = css({
  fontFamily: "$body",
  fontWeight: "$bold",
  fontSize: "$4",
});
export const MainTitle = styled("div", mainTitleStyles);

export const headingStyles = css({
  fontFamily: "$body",
  fontWeight: "$regular",
  fontSize: "$3",
});
export const Heading = styled("div", headingStyles);

export const bodyStyles = css({
  fontFamily: "$body",
  fontWeight: "$regular",
  fontSize: "$2",
});
export const Body = styled("div", bodyStyles);

export const subtextStyles = css({
  fontFamily: "$body",
  fontWeight: "$regular",
  fontSize: "$1",
});
export const Subtext = styled("div", subtextStyles);
