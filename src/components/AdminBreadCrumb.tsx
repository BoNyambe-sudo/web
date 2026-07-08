import React from "react";
import { useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router";

// Map route paths to human-readable names for breadcrumb display
const routeNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/appointments": "Appointments",
  "/admin/blog": "Blog",
  "/admin/users": "Users",
  "/admin/manage": "Manage",
};

export function AdminBreadcrumb() {
  const location = useLocation();

  // Split the current pathname into segments
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const breadcrumbItems = [];

  // Add home/dashboard as first item
  breadcrumbItems.push({
    path: "/admin",
    name: routeNames["/admin"],
    isCurrent: location.pathname === "/admin",
  });

  // Add additional path segments
  let currentPath = "";
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    breadcrumbItems.push({
      path: currentPath,
      name:
        routeNames[currentPath] ||
        segment.charAt(0).toUpperCase() + segment.slice(1),
      isCurrent: currentPath === location.pathname,
    });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
