import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

/**
 * ThemeProvider manages global dark/light state.
 *
 * SWE Design Patterns applied:
 * 1. Single Source of Truth (SSOT): All components query theme from here.
 * 2. Progressive Enhancement: Checks localStorage first, then falls back to OS system preference.
 * 3. DOM Encapsulation: Synchronizes Tailwind's 'dark' class on <html> in a single controlled effect.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Check user preference stored in localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        return stored;
      }
      // 2. Fall back to user's OS / browser color scheme preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to consume theme state safely with guard against missing provider.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
