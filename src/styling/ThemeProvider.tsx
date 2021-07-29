import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { darkTheme } from ".";

export type ThemeName = "light" | "dark";

const ThemeContext = createContext({
  currentTheme: undefined as ThemeName | undefined,
  setCurrentTheme: (() => {}) as (value: ThemeName) => void, // Implement in ThemeProvider
});

export const useThemeSelector = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: PropsWithChildren<{}>) => {
  const [currentTheme, setCurrentThemeState] = useState<ThemeName | undefined>(undefined);

  // Set the initial theme
  useEffect(() => {
    const initialTheme = document.documentElement.classList.contains(darkTheme)
      ? "dark"
      : "light";
    setCurrentThemeState(initialTheme as ThemeName);
  }, []);

  // Listen for operating system preference change if the user doesn't have a stored
  // preference in local storage
  useEffect(() => {
    const persistedColorPreference = window.localStorage.getItem("current-theme");
    const hasPersistedPreference = typeof persistedColorPreference === "string";
    if (hasPersistedPreference) return;

    const query = "(prefers-color-scheme: dark)";
    const onChange = (e: MediaQueryListEvent) =>
      e.matches ? setCurrentThemeState("dark") : setCurrentThemeState("light");

    window.matchMedia(query).addEventListener("change", onChange);
    return () => {
      window.matchMedia(query).removeEventListener("change", onChange);
    };
  }, []);

  // Update document theme class on state change
  useEffect(() => {
    if (!currentTheme) return;
    currentTheme === "dark"
      ? document.documentElement.classList.add(darkTheme)
      : document.documentElement.classList.remove(darkTheme);
  }, [currentTheme]);

  const setCurrentTheme = (value: ThemeName) => {
    setCurrentThemeState(value);
    window.localStorage.setItem("current-theme", value);
  };

  const value = useMemo(() => ({ currentTheme, setCurrentTheme }), [currentTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
