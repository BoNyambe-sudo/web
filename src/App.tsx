import { BrowserRouter as Router, Routes, Route } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUserData } from "./hooks/serverState/useUserServer";
import SideMenu from "./components/SideMenu";
import { useToggleState } from "./hooks/clientState/useToggles";
import AuthCallback from "./pages/user/AuthCallback";
import Demos from "./pages/user/Demos";
import PrimalSurvey from "./pages/user/PrimalSurvey";
import WebsiteBenefits from "./pages/user/WebsiteBenefits";

function App() {
  useTheme();
  useToken();

  return (
    <HelmetProvider>
      <Router basename="/web">
        <QueryClientProvider client={queryClient}>
          <AppWithQuery />
        </QueryClientProvider>
      </Router>
    </HelmetProvider>
  );
}

function AppWithQuery() {
  const { data: user } = useUserData();
  const sidebarOpen = useToggleState((state) => state.sidebarOpen);
    const toggleSidebarOpen = useToggleState((state) => state.toggleSidebarOpen);

  return (
    <TooltipProvider>
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
      {user &&
      user.status === "ACTIVE" &&
      (user.role === "ADMIN" || user.role === "CONTRIBUTOR") ? (
        <AdminDashboard />
      ) : (
        <div id="main-content">
          <Routes>
            <Route path="/website-survey" element={<PrimalSurvey />} />
            <Route path="/website-benefits" element={<WebsiteBenefits />} />
            <Route path="/" element={<Home />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/blog" element={<Blogs />} />
            <Route path="/demos" element={<Demos />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/blog/:id" element={<SingleBlog />} />
            <Route path="/manage-account" element={<ManageAccount />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {sidebarOpen && (
            <SideMenu
              isOpen={sidebarOpen}
              onClose={() => toggleSidebarOpen(false)}
            />
          )}
        </div>
      )}
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
