import type { UserDataResponse } from "@/hooks/serverState/useUserServer";

export const isStaffUser = (user?: UserDataResponse | null): boolean =>
  !!user &&
  user.status === "ACTIVE" &&
  (user.role === "ADMIN" || user.role === "CONTRIBUTOR");

export const isAdminUser = (user?: UserDataResponse | null): boolean =>
  !!user && user.role === "ADMIN";
