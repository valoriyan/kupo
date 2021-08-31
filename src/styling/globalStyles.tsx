import { globalCss } from ".";
import "react-toastify/dist/ReactToastify.css";

export const globalStyles = globalCss({
  "@font-face": {
    fontFamily: "Elephant",
    src: 'local("Elephant"), url("/fonts/ElephantRegular.ttf")',
  },
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
    padding: "0",
    cursor: "pointer",
    color: "$text",
  },
  a: {
    color: "$link",
    textDecoration: "none",
  },
  "[data-radix-portal]": {
    // Lower z-index of portals so that toast messages sit on top
    zIndex: "999 !important",
  },
});
