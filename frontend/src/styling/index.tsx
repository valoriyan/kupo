import Stitches, {
  createStitches,
  defaultThemeMap,
  PropertyValue,
} from "@stitches/react";
import { NoInfer } from "#/types/noInfer";

export * from "./utils";

export type ThemeScale<TScale extends keyof typeof theme> =
  | `$${Exclude<keyof (typeof theme)[TScale], bigint | symbol>}`
  | NoInfer<string>;

const primaryColor = {
  50: "hsl(107, 53%, 97%)",
  100: "hsl(108, 53%, 93%)",
  200: "hsl(109, 50%, 85%)",
  300: "hsl(110, 49%, 73%)",
  350: "hsl(110, 47%, 64%)",
  400: "hsl(110, 44%, 55%)",
  500: "hsl(111, 45%, 45%)",
  600: "hsl(111, 48%, 36%)",
  700: "hsl(111, 45%, 29%)",
  800: "hsl(111, 40%, 24%)",
  899: "hsl(111, 53%, 20%)",
  900: "hsl(111, 38%, 20%)",
  901: "hsl(111, 53%, 12%)",
};

const lightThemeColors = {
  /**
   * Primary accent color. It will be used for actionable items and accents
   */
  primary: primaryColor[500],
  primarySubdued: primaryColor[300],
  primaryStrong: primaryColor[899],
  primaryTranslucent: "hsla(111, 45%, 45%, 0.2)",
  primaryBlendTop: primaryColor[400],
  primaryBlendBottom: "hsl(140, 64%, 40%)",

  secondary: "#EF5DA8",

  /**
   * The background colors include colors for the backgrounds of app content.
   *
   * The app content backgrounds are appended with numbers that increase in the order
   * that the colors should be layered on top of each other.
   */
  pageBackground: "hsl(110, 4%, 99%)",
  modalBackground: "hsl(110, 4%, 98%)",
  background1: "hsl(110, 4%, 99%)",
  background2: "hsl(110, 4%, 96%)", // Backgrounds that sit on top of background1
  background3: "hsla(242, 16%, 94%, 1)", // Backgrounds that sit on top of background2
  background1Translucent: "hsla(110, 16%, 99%, 0.7)",
  overlay: "rgba(0,0,0,0.5)",
  heavyOverlay: "rgba(255,255,255,0.6)",
  mediaOverlay: "rgba(115, 115, 115, 0.5)",

  text: "hsla(242, 14%, 8%, 1)", // Text that sits on the background colors
  secondaryText: "hsla(242, 8%, 50%, 1)", // Secondary text that sits on background colors
  accentText: "hsla(242, 16%, 100%, 1)", // Text that sits on primary and secondary accent colors
  inverseText: "hsla(242, 16%, 100%, 1)",
  disabledText: "hsl(0, 0%, 27%)",

  link: primaryColor[600], // Link color

  border: "hsl(0, 0%, 78%)", // For borders around elements
  borderSubdued: "hsl(0, 0%, 85%)", // For secondary borders around elements

  success: "hsl(119, 82%, 65%)", // For success messages
  warning: "hsl(49, 100%, 44%)", // For warning messages
  failure: "hsl(359, 82%, 60%)", // For error messages
  disabled: "hsl(0, 0%, 69%)", // For disabled elements

  heart: "hsl(359, 82%, 65%)",
  save: "hsl(49, 100%, 50%)",

  scrollBar: "rgba(194, 194, 194, 1)",
  scrollBarTrack: "rgba(250, 250, 250, 0.3)",

  transparent: "rgba(0,0,0,0)",
};

const darkThemeColors = {
  primary: primaryColor[400],
  primarySubdued: primaryColor[350],
  primaryStrong: primaryColor[901],
  primaryTranslucent: "hsla(110, 44%, 55%, 0.2)",
  primaryBlendTop: primaryColor[350],
  primaryBlendBottom: "hsl(140, 64%, 40%)",

  secondary: "#EF5DA8",

  pageBackground: "hsl(110, 2%, 6%)",
  modalBackground: "hsl(110, 2%, 12%)",
  background1: "hsl(110, 2%, 6%)",
  background2: "hsl(110, 2%, 9%)",
  background3: "hsl(110, 2%, 12%)",
  background1Translucent: "hsla(110, 2%, 6%, 0.7)",
  overlay: "rgba(0,0,0,0.5)",
  heavyOverlay: "rgba(0,0,0,0.6)",
  mediaOverlay: "rgba(115, 115, 115, 0.7)",

  text: "hsla(232, 16%, 98%, 1)",
  secondaryText: "hsla(232, 8%, 60%, 1)",
  accentText: "hsla(232, 16%, 100%, 1)",
  inverseText: "hsla(242, 14%, 8%, 1)",
  disabledText: "hsl(0, 0%, 20%)",

  link: primaryColor[350],

  border: "hsl(0, 0%, 52%)",
  borderSubdued: "hsl(0, 0%, 35%)",

  success: "hsl(119, 82%, 65%)",
  warning: "hsl(49, 100%, 44%)",
  failure: "hsl(359, 82%, 60%)",
  disabled: "hsl(0, 0%, 63%)",

  heart: "hsl(359, 82%, 65%)",
  save: "hsl(49, 100%, 50%)",

  scrollBar: "rgba(127, 127, 127, 1)",
  scrollBarTrack: "rgba(46, 46, 46, 0.3)",

  transparent: "rgba(0,0,0,0)",
};

const themedStitches = createStitches({
  theme: {
    colors: lightThemeColors,
    space: {
      0: "0px",
      1: "2px",
      2: "4px",
      3: "8px",
      4: "12px",
      5: "16px",
      6: "24px",
      7: "32px",
      8: "40px",
      9: "48px",
      10: "64px",
      11: "96px",
      12: "128px",
      13: "192px",
      14: "256px",
      15: "384px",
      16: "512px",
    },
    sizes: {
      0: "0px",
      1: "2px",
      2: "4px",
      3: "8px",
      4: "12px",
      5: "16px",
      6: "24px",
      7: "32px",
      8: "40px",
      9: "48px",
      10: "64px",
      11: "96px",
      12: "128px",
      13: "192px",
      14: "256px",
      15: "384px",
      16: "512px",
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
      body: "'Nunito Sans', Helvetica, sans-serif",
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
      5: "24px",
      round: "9999px", // Completely round (for circles)
    },
    shadows: {
      0: "0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0)",
      1: "0px 1px 0px rgba(0, 0, 0, 0.05)",
      2: "0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)",
      3: "0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)",
      4: "0px 0px 3px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.15)",
      5: "0px 0px 4px rgba(0, 0, 0, 0.1), 0px 8px 40px rgba(0, 0, 0, 0.2)",
    },
    zIndices: {
      dropdown: 100,
      drawer: 200,
      dialog: 300,
    },
    transitions: {
      0: "0s",
      1: "0.2s",
      2: "0.3s",
      3: "0.4s",
      4: "0.6s",
      5: "0.8s",
      6: "1.2s",
      7: "1.6s",
      8: "2s",
      9: "2.4s",
    },
  },
  media: {
    // sm: No specified breakpoint because it's the default case we code for
    md: "(min-width: 48em)", // 768px
    lg: "(min-width: 62em)", // 992px
    xl: "(min-width: 75em)", // 1200px
  },
  themeMap: {
    ...defaultThemeMap,
    animation: "transitions",
  },
  utils: {
    m: (value: PropertyValue<"margin">) => ({
      margin: value,
    }),
    mx: (value: PropertyValue<"margin">) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: PropertyValue<"margin">) => ({
      marginTop: value,
      marginBottom: value,
    }),
    mt: (value: PropertyValue<"margin">) => ({
      marginTop: value,
    }),
    mr: (value: PropertyValue<"margin">) => ({
      marginRight: value,
    }),
    mb: (value: PropertyValue<"margin">) => ({
      marginBottom: value,
    }),
    ml: (value: PropertyValue<"margin">) => ({
      marginLeft: value,
    }),
    p: (value: PropertyValue<"padding">) => ({
      padding: value,
    }),
    px: (value: PropertyValue<"padding">) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: PropertyValue<"padding">) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    pt: (value: PropertyValue<"padding">) => ({
      paddingTop: value,
    }),
    pr: (value: PropertyValue<"padding">) => ({
      paddingRight: value,
    }),
    pb: (value: PropertyValue<"padding">) => ({
      paddingBottom: value,
    }),
    pl: (value: PropertyValue<"padding">) => ({
      paddingLeft: value,
    }),
    borderX: (value: PropertyValue<"border">) => ({
      borderLeft: value,
      borderRight: value,
    }),
    borderY: (value: PropertyValue<"border">) => ({
      borderTop: value,
      borderBottom: value,
    }),
    size: (value: PropertyValue<"height">) => ({
      height: value,
      width: value,
    }),
    bg: (value: PropertyValue<"backgroundColor">) => ({
      background: value,
    }),
    minHeight: (value: PropertyValue<"minHeight"> | NoInfer<string>) =>
      value === "100vh"
        ? {
            minHeight: value,
            "@supports (-webkit-touch-callout: none)": {
              minHeight: "-webkit-fill-available",
            },
          }
        : { minHeight: value },
    height: (value: PropertyValue<"height"> | NoInfer<string>) =>
      value === "100vh"
        ? {
            height: value,
            "@supports (-webkit-touch-callout: none)": {
              height: "-webkit-fill-available",
            },
          }
        : { height: value },
    overflow: (value: PropertyValue<"overflow"> | NoInfer<string>) =>
      value === "auto" || value === "scroll"
        ? { overflow: "auto; -webkit-overflow-scrolling: touch;" }
        : { overflow: value },
  },
});

export const darkTheme = themedStitches.createTheme("dark", {
  colors: darkThemeColors,
});

export const { styled, css, globalCss, keyframes, theme, getCssText, config } =
  themedStitches;
export type CSS = Stitches.CSS<typeof config>;
