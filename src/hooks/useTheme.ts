import { ThemeContext } from "@/stores/themeContext";
import { useContext } from "react";

export function useTheme() {
  return useContext(ThemeContext);
}
