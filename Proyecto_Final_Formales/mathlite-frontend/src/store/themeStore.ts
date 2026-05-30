import { create } from "zustand";

export type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: typeof window !== "undefined"
    ? ((localStorage.getItem("mathlite-theme") as Theme) || "dark")
    : "dark",
  toggle: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("mathlite-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return { theme: next };
    }),
}));
