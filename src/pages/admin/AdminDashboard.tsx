import { AdminSidebar } from "@/components/AdminSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import AdminHome from "./AdminHome";
import AdminBlogs from "./AdminBlogs";
import AdminAppointments from "./AdminAppointments";
import AdminUsers from "./AdminUsers";
import AdminManage from "./AdminManage";
import NoPermission from "./NoPermission";
import AdminFooter from "@/components/AdminFooter";
import { AdminBreadcrumb } from "@/components/AdminBreadCrumb";
import { useUserData } from "@/hooks/serverState/useUserServer";

const AdminDashboard = () => {
  const { data: user } = useUserData();
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 px-4">
             <SidebarTrigger className={`-ml-1${showPulse ? " animate-trigger-pulse" : ""}`} />
            <span className="text-muted-foreground">|</span>
            <AdminBreadcrumb />
          </div>
        </header>
        <Routes>
          {<Route path="/" element={<AdminHome />} />}
          <Route path="/blogs" element={<AdminBlogs />} />

          <Route
            path="/appointments"
            element={
              user && user.role === "ADMIN" ? (
                <AdminAppointments />
              ) : (
                <NoPermission />
              )
            }
          />

          <Route
            path="/users"
            element={
              user && user.role === "ADMIN" ? <AdminUsers /> : <NoPermission />
            }
          />

          <Route path="/manage" element={<AdminManage />} />
        </Routes>
        <AdminFooter />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminDashboard;
