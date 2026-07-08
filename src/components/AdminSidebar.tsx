import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BookOpen, Calendar, Globe, LayoutDashboard, Users } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import Logo from "./Logo";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Blog",
      url: "/admin/blog",
      icon: BookOpen,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },

    {
      title: "Appointments",
      url: "/admin/appointments",
      icon: Calendar,
    },
    {
      title: "View Site",
      url: "/",
      icon: Globe,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="flex">
        <Logo className="self-center" size={30} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
