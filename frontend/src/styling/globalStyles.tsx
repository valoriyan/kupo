import { globalCss } from ".";
import "react-toastify/dist/ReactToastify.css";

export const globalStyles = globalCss({
  body: {
    p: "0 !important",
    fontFamily: "$body !important",
    bg: "$pageBackground",
    color: "$text",
    transition: "background-color $1 ease",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
    overflow: "auto",
    "@supports (-webkit-touch-callout: none)": {
      // Disable focus outlines for touch devices since they don't use keyboard navigation
      "*:focus": { outline: "none" },
    },
    "@media(hover: hover)": {
      "scrollbar-width": "thin",
      "scrollbar-color": "transparent transparent",
      "::-webkit-scrollbar": {
        size: "8px",
        backgroundColor: "transparent",
      },
      "::-webkit-scrollbar-thumb": {
        borderRadius: "8px",
        backgroundColor: "transparent",
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },
      "&:hover": {
        "scrollbar-color": "$scrollBar transparent",
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "$scrollBar",
          padding: "0 1px",
          borderLeft: "solid 1px transparent",
          borderRight: "solid 1px transparent",
          backgroundClip: "padding-box",
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: "$scrollBarTrack",
        },
      },
    },
  },
  "h1, h2, h3, h4, h5, h6, p": { margin: 0 },
  button: {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    color: "$text",
    "&:hover": {
      filter: "brightness(0.9)",
    },
    "&:active": {
      filter: "brightness(0.8)",
    },
  },
  input: { padding: "0" },
  a: {
    color: "$link",
    textDecoration: "none",
    "&:hover": {
      filter: "brightness(0.9)",
    },
    "&:active": {
      filter: "brightness(0.8)",
    },
  },
  "[data-radix-portal]": {
    // Lower z-index of portals so that toast messages sit on top
    zIndex: "999 !important",
  },
});
