import { BrowserRouter as Router, Routes, Route } from "react-router";
import { QueryClientProvider, useIsFetching } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "./hooks/queryClient";
import { useTheme } from "./hooks/clientState/useTheme";
import ThemeToggle from "./components/ToggleTheme";
import { useToken } from "./hooks/clientState/useToken";
import Home from "./pages/user/Home";
import SingleBlog from "./pages/user/SingleBlog";
import Blogs from "./pages/user/Blogs";
import FAQs from "./pages/user/FAQs";
import PrivacyPolicy from "./pages/user/PrivacyPolicy";
import TermsOfService from "./pages/user/TermsOfService";
import NotFoundPage from "./pages/NotFoundPage";
import ManageAccount from "./pages/user/ManageAccount";
import { TooltipProvider } from "@/components/ui/tooltip";
import SideMenu from "./components/SideMenu";
import { useToggleState } from "./hooks/clientState/useToggles";
import AuthCallback from "./pages/user/AuthCallback";
import Services from "./pages/user/Services";
import PrimalSurvey from "./pages/user/PrimalSurvey";
import WebsiteBenefits from "./pages/user/WebsiteBenefits";
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
      <Router basename="/web">
        <QueryClientProvider client={queryClient}>
          <AppReadySignal />
          <AppWithQuery />
        </QueryClientProvider>
      </Router>
    </HelmetProvider>
  );
}

function AppWithQuery() {
  const sidebarOpen = useToggleState((state) => state.sidebarOpen);
  const toggleSidebarOpen = useToggleState((state) => state.toggleSidebarOpen);

  return (
    <TooltipProvider>
      <ScrollToTop />
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>
      <div id="main-content">
        <Routes>
          <Route path="/website-survey" element={<PrimalSurvey />} />
          <Route path="/website-benefits" element={<WebsiteBenefits />} />
          <Route path="/" element={<Home />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/blog/:slug" element={<SingleBlog />} />
          <Route path="/manage-account" element={<ManageAccount />} />

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
        {sidebarOpen && (
          <SideMenu
            isOpen={sidebarOpen}
            onClose={() => toggleSidebarOpen(false)}
          />
        )}
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
