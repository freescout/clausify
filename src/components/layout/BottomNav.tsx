import { NavLink } from "react-router-dom";
import { LayoutDashboard, List, Settings } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const NAV_ITEMS = [
  { to: ROUTES.dashboard, icon: LayoutDashboard, label: "Dashboard" },
  { to: ROUTES.sites, icon: List, label: "Sites" },
  { to: ROUTES.settings, icon: Settings, label: "Settings" },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-(--surface) border-t border-(--border) z-50">
      <div className="flex items-center justify-around py-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.dashboard}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-5 py-2 rounded-md transition-colors
              ${isActive ? "text-primary" : "text-(--fg-tertiary)"}`
            }
          >
            <Icon size={18} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
