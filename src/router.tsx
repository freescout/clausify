import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppShell from "@/components/layout/AppShell";
import PageLoader from "@/components/ui/PageLoader";

const Dashboard = lazy(() => import("@/pages/dashboard/DashboardPage"));
const SitesList = lazy(() => import("@/pages/sites/SitesListPage"));
const SiteDetail = lazy(() => import("@/pages/sites/SiteDetailPage"));
const SiteHistory = lazy(() => import("@/pages/sites/SiteHistoryPage"));
const Settings = lazy(() => import("@/pages/settings/SettingsPage"));
const Login = lazy(() => import("@/pages/auth/LoginPage"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "sites",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SitesList />
          </Suspense>
        ),
      },
      {
        path: "sites/:domain",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SiteDetail />
          </Suspense>
        ),
      },
      {
        path: "sites/:domain/history",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SiteHistory />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
