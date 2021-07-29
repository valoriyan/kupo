import { createCss } from "@stitches/react";
import { OverflowProperty } from "@stitches/react/types/css-types";

export const { styled, css, global, keyframes, getCssString, theme } = createCss({
  theme: {
    colors: {
      /**
       * Primary accent color. It will be used for actionable items and accents
       */
      primary: "#EF5DA8",

      /**
       * The background colors include colors for the backgrounds of app content.
       *
       * The app content backgrounds are appended with numbers that increase in the order
       * that the colors should be layered on top of each other.
       */
      background1: "#ffffff", // Base background of app content
      background2: "#ededed", // Backgrounds that sit on top of background1
      background3: "#dddddd", // Backgrounds that sit on top of background2

      text: "#000000", // Text that sits on the background colors
      secondaryText: "#acacac", // Secondary text that sits on background colors
      accentText: "#ffffff", // Text that sits on primary and secondary accent colors
      inverseText: "#ffffff",

      link: "#6fb8ff", // Link color
      linkHover: "#4ba6ff", // For alternate states on links like hover

      border: "#cacaca", // For borders around elements

      success: "#00ff00", // For success messages
      warning: "#ffff00", // For warning messages
      failure: "#ff0000", // For error messages
      disabled: "#acacac", // For disabled elements

      transparent: "rgba(0,0,0,0)",
    },
    space: {
      0: "0px",
      1: "2px",
      2: "4px",
      3: "8px",
      4: "16px",
      5: "24px",
      6: "32px",
      7: "40px",
      8: "48px",
      9: "64px",
      10: "96px",
      11: "128px",
      12: "192px",
      13: "256px",
      14: "384px",
      15: "512px",
    },
    sizes: {
      0: "0px",
      1: "2px",
      2: "4px",
      3: "8px",
      4: "16px",
      5: "24px",
      6: "32px",
      7: "40px",
      8: "48px",
      9: "64px",
      10: "96px",
      11: "128px",
      12: "192px",
      13: "256px",
      14: "384px",
      15: "512px",
    },
    fontSizes: {
      0: "0.75rem", // 12px
      1: "0.875rem", // 14px
      2: "1rem", // 16px
      3: "1.125rem", // 18px
      4: "1.25rem", // 20px
      5: "1.5rem", // 24px
      6: "1.75rem", // 28px
      7: "2rem", // 32px
      8: "2.25rem", // 36px
      9: "2.5rem", // 40px
      10: "2.75rem", // 44px
      11: "3.25rem", // 52px
      12: "6rem", // 96px
    },
    fonts: {
      heading: "Elephant, serif",
      body: "'Work Sans', Helvetica, sans-serif",
    },
    fontWeights: {
      light: 300,
      regular: 400,
      bold: 700,
    },
    lineHeights: {},
    letterSpacings: {},
    borderStyles: {},
    borderWidths: {
      0: "0px",
      1: "1px",
      2: "2px",
      3: "4px",
      4: "6px",
    },
    radii: {
      0: "0px",
      1: "2px",
      2: "4px",
      3: "8px",
      4: "16px",
      5: "9999px", // Completely round (for circles)
    },
    shadows: {
      0: "0 0 0 rgba(0,0,0,0.12), 0 0 0 rgba(0,0,0,0.12)",
      1: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
      2: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
      3: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      4: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      5: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
    },
    zIndices: {
      dropdown: 100,
      drawer: 200,
      dialog: 300,
    },
    transitions: {
      0: "0s",
      1: "0.25s",
      2: "0.5s",
      3: "0.75s",
      4: "1s",
      5: "1.5s",
      6: "2s",
      7: "2.5s",
      8: "3s",
    },
  },
  media: {
    // sm: No specified breakpoint because it's the default case we code for
    md: "(min-width: 48em)", // 768px
    lg: "(min-width: 62em)", // 992px
    xl: "(min-width: 75em)", // 1200px
  },
  utils: {
    m:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        margin: value,
      }),
    mx:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        marginLeft: value,
        marginRight: value,
      }),
    my:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        marginTop: value,
        marginBottom: value,
      }),
    mt:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        marginTop: value,
      }),
    mr:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        marginRight: value,
      }),
    mb:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        marginBottom: value,
      }),
    ml:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        marginLeft: value,
      }),
    p:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        padding: value,
      }),
    px:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        paddingLeft: value,
        paddingRight: value,
      }),
    py:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        paddingTop: value,
        paddingBottom: value,
      }),
    pt:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        paddingTop: value,
      }),
    pr:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        paddingRight: value,
      }),
    pb:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        paddingBottom: value,
      }),
    pl:
      (config) =>
      (value: `$${keyof typeof config["theme"]["space"]}` | (string & {})) => ({
        paddingLeft: value,
      }),
    size:
      (config) =>
      (value: `$${keyof typeof config["theme"]["sizes"]}` | (string & {})) => ({
        height: value,
        width: value,
      }),
    bg:
      (config) =>
      (value: `$${keyof typeof config["theme"]["colors"]}` | (string & {})) => ({
        backgroundColor: value,
      }),
    height:
      (config) => (value: `$${keyof typeof config["theme"]["sizes"]}` | (string & {})) =>
        value === "100vh"
          ? { height: `${value}; height: -webkit-fill-available; max-height: 100vh;` }
          : { height: value },
    overflow: () => (value: OverflowProperty) =>
      value === "auto" || value === "scroll"
        ? { overflow: "auto; -webkit-overflow-scrolling: touch;" }
        : { overflow: value },
  },
});

export const darkTheme = theme("dark", {
  colors: {
    primary: "#EF5DA8",

    background1: "#191919",
    background2: "#333333",
    background3: "#4c4c4c",

    text: "#ffffff",
    secondaryText: "#acacac",
    accentText: "#ffffff",
    inverseText: "#000000",

    link: "#6fb8ff",
    linkHover: "#4ba6ff",

    border: "#cacaca",

    success: "#00ff00",
    warning: "#ffff00",
    failure: "#ff0000",
    disabled: "#acacac",

    transparent: "rgba(0,0,0,0)",
  },
});
