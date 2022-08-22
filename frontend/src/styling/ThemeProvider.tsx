import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ToastContainer, Slide } from "react-toastify";
import { darkTheme } from ".";

export type ThemeName = "light" | "dark";

const ThemeContext = createContext({
  currentTheme: undefined as ThemeName | undefined,
  setCurrentTheme: (() => {}) as (value: ThemeName) => void, // Implement in ThemeProvider
});

export const useThemeSelector = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [currentTheme, setCurrentThemeState] = useState<ThemeName | undefined>(undefined);

  // Set the initial theme
  useEffect(() => {
    const initialTheme = document.documentElement.classList.contains(darkTheme)
      ? "dark"
      : "light";
    document.documentElement.style.setProperty("color-scheme", initialTheme);
    setCurrentThemeState(initialTheme as ThemeName);
  }, []);

  // Listen for operating system preference change if the user doesn't have a stored
  // preference in local storage
  useEffect(() => {
    const persistedColorPreference = window.localStorage.getItem("current-theme");
    const hasPersistedPreference = typeof persistedColorPreference === "string";
    if (hasPersistedPreference) return;

    const query = "(prefers-color-scheme: dark)";
    const onChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      document.documentElement.style.setProperty("color-scheme", newTheme);
      setCurrentThemeState(newTheme);
    };

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
    document.documentElement.style.setProperty("color-scheme", value);
    setCurrentThemeState(value);
    window.localStorage.setItem("current-theme", value);
  };

  const value = useMemo(() => ({ currentTheme, setCurrentTheme }), [currentTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <ToastContainer position="top-right" transition={Slide} />
      {children}
    </ThemeContext.Provider>
  );
};
