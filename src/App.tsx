import { BrowserRouter as Router, Routes, Route } from "react-router";
import { QueryClientProvider, useIsFetching } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "./hooks/queryClient";
import { useTheme } from "./hooks/clientState/useTheme";
import ThemeToggle from "./components/ToggleTheme";
import { useToken } from "./hooks/clientState/useToken";
import Home from "./pages/Home";

import NotFoundPage from "./pages/NotFoundPage";

import { TooltipProvider } from "@/components/ui/tooltip";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminManage from "./pages/admin/AdminManage";
import ScrollToTop from "./components/ScrollToTop";
import { AdminRoute, AdminOnlyRoute } from "./components/AdminGuard";
import { useEffect } from "react";

function AppReadySignal() {
  const isFetching = useIsFetching();

  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as Window & { __APP_READY__?: boolean }).__APP_READY__ =
      isFetching === 0;
  }, [isFetching]);

  return null;
}

function App() {
  useTheme();
  useToken();

  return (
    <HelmetProvider>
      <Router>
        <QueryClientProvider client={queryClient}>
          <AppReadySignal />
          <AppWithQuery />
        </QueryClientProvider>
      </Router>
    </HelmetProvider>
  );
}

function AppWithQuery() {
  return (
    <TooltipProvider>
      <ScrollToTop />
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>
      <div id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<AdminHome />} />
              <Route path="blog" element={<AdminBlogs />} />
              <Route element={<AdminOnlyRoute />}>
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
              <Route path="manage" element={<AdminManage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-popover text-popover-foreground border border-border shadow-lg rounded-md z-100",
          style: {
            background: "inherit",
            color: "inherit",
            padding: "8px 12px",
          },
        }}
      />
      <ThemeToggle />
      <ReactQueryDevtools initialIsOpen={false} />
    </TooltipProvider>
  );
}

export default App;
