import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/stores/authStore";

const NAV_ITEMS = [
  { to: ROUTES.dashboard, icon: LayoutDashboard, label: "Dashboard" },
  { to: ROUTES.sites, icon: List, label: "Sites list" },
  { to: ROUTES.settings, icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = useAuthStore();

  const navItems = NAV_ITEMS.filter(
    ({ to }) => to !== ROUTES.settings || !!token,
  );

  return (
    <aside
      className={`hidden md:flex flex-col bg-(--surface) border-r border-(--border) transition-all duration-200 shrink-0 ${collapsed ? "w-14" : "w-52"}`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-2.5 px-4 py-4 border-b border-(--border) ${collapsed ? "justify-center px-0" : ""}`}
      >
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Shield size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-display font-semibold text-sm text-(--fg) leading-none">
              Clausify
            </div>
            <div className="text-xs text-(--fg-tertiary) mt-0.5">
              Know what you sign
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.dashboard}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-150
              ${collapsed ? "justify-center px-0 py-2.5" : ""}
              ${
                isActive
                  ? "bg-primary-subtle text-primary font-medium"
                  : "text-(--fg-secondary) hover:text-(--fg) hover:bg-(--bg-secondary)"
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={16} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-(--border)">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-(--fg-tertiary) hover:text-(--fg) hover:bg-(--bg-secondary) transition-colors ${collapsed ? "justify-center px-0" : ""}`}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <>
              <ChevronLeft size={14} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
