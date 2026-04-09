import { create } from "zustand";

type Theme = "light" | "dark" | "system";

type ThemeStore = {
  theme: Theme;
  setTheme: (newTheme: Theme) => void;
};

const getStoredTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  }
  return "system";
};

const applyTheme = (theme: Theme) => {
  const root = window.document.documentElement;

  // Remove existing theme class
  root.classList.remove("light", "dark");

  if (theme === "light") {
    root.classList.add("light");
  } else if (theme === "dark") {
    root.classList.add("dark");
  } else {
    // System theme
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    root.classList.add(systemDark ? "dark" : "light");
  }
};

export const useTheme = create<ThemeStore>((set) => ({
  theme: getStoredTheme(),
  setTheme: (newTheme: Theme) => {
    set({ theme: newTheme });
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  },
}));

if (typeof window !== "undefined") {
  applyTheme(getStoredTheme());

  // Listen for system theme changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemThemeChange = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme === "system") {
      applyTheme("system");
    }
  };
  mediaQuery.addEventListener("change", handleSystemThemeChange);
}
