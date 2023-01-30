import Document, { Html, Head, Main, NextScript } from "next/document";
import { darkTheme, getCssText } from "#/styling";

export default class KupoDocument extends Document {
  render() {
    return (
      <Html lang="en" className={darkTheme.className}>
        <Head>
          <meta property="og:title" content="Kupo" />
          <meta
            property="og:description"
            content="A social media platform made for creators by creators."
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/banner.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="/banner.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,300;0,400;0,700;1,400&display=swap"
            rel="stylesheet"
          />
          <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
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
  function getInitialColorScheme() {
    const persistedColorPreference = window.localStorage.getItem("current-theme");
    const hasPersistedPreference = typeof persistedColorPreference === "string";
    if (hasPersistedPreference)  return persistedColorPreference;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const hasMediaQueryPreference = typeof mql.matches === "boolean";
    if (hasMediaQueryPreference)  return mql.matches ? "dark" : "light";

    return "light";
  }
  const colorScheme = getInitialColorScheme();
  document.documentElement.style.setProperty("color-scheme", colorScheme)
  colorScheme === "dark"
    ? document.documentElement.classList.add("dark")
    : document.documentElement.classList.remove("dark");
`;
