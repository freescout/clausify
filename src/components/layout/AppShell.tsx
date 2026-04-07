import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";
import LoginModal from "../ui/LoginModal";

export default function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-(--bg)">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <LoginModal />
    </div>
  );
}
