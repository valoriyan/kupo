import Stitches, {
  createStitches,
  defaultThemeMap,
  PropertyValue,
} from "@stitches/react";
import { useEffect, useState } from "react";
import { NoInfer } from "#/types/noInfer";

export type ThemeScale<TScale extends keyof typeof theme> =
  | `$${Exclude<keyof typeof theme[TScale], bigint | symbol>}`
  | NoInfer<string>;

const themedStitches = createStitches({
  theme: {
    colors: {
      /**
       * Primary accent color. It will be used for actionable items and accents
       */
      primary: "#5D5FEF",
      primaryTranslucent: "#5D5FEF30",

      secondary: "#EF5DA8",

      /**
       * The background colors include colors for the backgrounds of app content.
       *
       * The app content backgrounds are appended with numbers that increase in the order
       * that the colors should be layered on top of each other.
       */
      background1: "#ffffff", // Base background of app content
      background2: "#ededed", // Backgrounds that sit on top of background1
      background3: "#dddddd", // Backgrounds that sit on top of background2
      overlay: "rgba(0,0,0,0.25)",
      heavyOverlay: "rgba(0,0,0,0.6)",
      mediaOverlay: "rgba(115, 115, 115, 0.5)",

      text: "#000000", // Text that sits on the background colors
      secondaryText: "#9a9a9a", // Secondary text that sits on background colors
      accentText: "#ffffff", // Text that sits on primary and secondary accent colors
      inverseText: "#ffffff",
      disabledText: "#454545",

      link: "#5D5FEF", // Link color

      border: "#cacaca", // For borders around elements

      success: "#5FEF5D", // For success messages
      warning: "#EFED5D", // For warning messages
      failure: "#EF5D5F", // For error messages
      disabled: "#b0b0b0", // For disabled elements

      transparent: "rgba(0,0,0,0)",
    },
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
      heading: "AbhayaLibre, serif",
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
      5: "24px",
      round: "9999px", // Completely round (for circles)
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
      1: "0.2s",
      2: "0.4s",
      3: "0.6s",
      4: "0.8s",
      5: "1.2s",
      6: "1.6s",
      7: "2s",
      8: "2.4s",
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
      backgroundColor: value,
    }),
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

export const { styled, css, globalCss, keyframes, theme, getCssText, config } =
  themedStitches;
export type CSS = Stitches.CSS<typeof config>;

export const darkTheme = themedStitches.createTheme("dark", {
  colors: {
    primary: "#6D6FF0",
    primaryTranslucent: "#6D6FF030",

    secondary: "#EF5DA8",

    background1: "#191919",
    background2: "#333333",
    background3: "#4c4c4c",
    overlay: "rgba(0,0,0,0.25)",
    heavyOverlay: "rgba(0,0,0,0.6)",
    mediaOverlay: "rgba(115, 115, 115, 0.5)",

    text: "#ffffff",
    secondaryText: "#acacac",
    accentText: "#ffffff",
    inverseText: "#000000",
    disabledText: "#323232",

    link: "#8D8FF3",

    border: "#858585",

    success: "#5FEF5D",
    warning: "#EFED5D",
    failure: "#EF5D5F",
    disabled: "#a0a0a0",

    transparent: "rgba(0,0,0,0)",
  },
});

export const useMediaQuery = (mediaQuery: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(mediaQuery);
    const setValue = () => setMatches(mq.matches);

    // Set the initial value
    setValue();

    // Add a listener to update the value if it changes
    mq.addEventListener("change", setValue);
    return () => {
      mq.removeEventListener("change", setValue);
    };
  }, [mediaQuery]);

  return matches;
};

const prefersMotionQuery = "(prefers-reduced-motion: no-preference)";
export const prefersMotionSelector = `@media ${prefersMotionQuery}`;
export const usePrefersMotion = () => useMediaQuery(prefersMotionQuery);
