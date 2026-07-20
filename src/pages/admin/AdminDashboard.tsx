import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { AdminSidebar } from "@/components/AdminSidebar";
import AdminFooter from "@/components/AdminFooter";
import { AdminBreadcrumb } from "@/components/AdminBreadCrumb";
import { Button } from "@/components/ui/button";
import { isStaffUser } from "@/lib/permissions";
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
          {isStaffUser(user) && (
            <Button asChild variant="outline" className="ml-auto mr-2 hidden md:inline-flex">
              <Link to="https://bonyambe-sudo.github.io/web/" target="_blank">View Site</Link>
            </Button>
          )}
        </header>
        <Outlet />
        <AdminFooter />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminDashboard;
