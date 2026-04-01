import { Sun, Moon, Plus } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/sites": "Sites list",
  "/settings": "Settings",
  "/login": "Login",
};

function getTitle(pathname: string): string {
  if (pathname.includes("/history")) return "Version history";
  if (pathname.match(/^\/sites\/[^/]+$/)) return "Site detail";
  return PAGE_TITLES[pathname] ?? "Clausify";
}

export default function Topbar() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();

  return (
    <header className="flex items-center justify-between px-6 h-14 border-b border-(--border) bg-(--surface) shrink-0">
      <h1 className="font-display font-semibold text-lg text-(--fg)">
        {getTitle(pathname)}
      </h1>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-md flex items-center justify-center text-(--fg-secondary) hover:text-(--fg) hover:bg-(--bg-secondary) transition-colors"
          title="Toggle theme"
        >
          {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={13} />
          Analyze T&amp;C
        </button>
      </div>
    </header>
  );
}
