import { global } from ".";

export const globalStyles = global({
  "@font-face": {
    fontFamily: "Elephant",
    src: 'local("Elephant"), url("fonts/ElephantRegular.ttf")',
  },
  html: { height: "-webkit-fill-available" },
  body: {
    fontFamily: "$body !important",
    color: "$text",
    bg: "$background1",
    transition: "background-color $1 ease",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },
  "h1, h2, h3, h4, h5, h6, p": { margin: 0 },
  button: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },
});
