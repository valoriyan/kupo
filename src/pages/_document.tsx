import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { darkTheme, getCssString } from "#/styling";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en" className={darkTheme}>
        <Head>
          <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssString() }} />
          <script dangerouslySetInnerHTML={{ __html: setPreferredTheme }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

const setPreferredTheme = `
  function getInitialColorMode() {
    const persistedColorPreference = window.localStorage.getItem("current-theme");
    const hasPersistedPreference = typeof persistedColorPreference === "string";
    if (hasPersistedPreference)  return persistedColorPreference;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const hasMediaQueryPreference = typeof mql.matches === "boolean";
    if (hasMediaQueryPreference)  return mql.matches ? "dark" : "light";

    return "light";
  }
  const colorMode = getInitialColorMode();
  colorMode === "dark"
    ? document.documentElement.classList.add("dark")
    : document.documentElement.classList.remove("dark");
`;
