import { Navigate, Outlet } from "react-router";

import { useUserData } from "@/hooks/serverState/useUserServer";
import { isAdminUser, isStaffUser } from "@/lib/permissions";
import NoPermission from "@/pages/admin/NoPermission";

export function AdminRoute() {
  const { data: user, isLoading } = useUserData();

  if (isLoading) return null;
  if (!isStaffUser(user)) return <Navigate to="/" replace />;

  return <Outlet />;
}

export function AdminOnlyRoute() {
  const { data: user } = useUserData();

  if (!isAdminUser(user)) return <NoPermission />;

  return <Outlet />;
}
