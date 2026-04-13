import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BookOpen, Calendar, LayoutDashboard, Users } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import Logo from "./Logo";
import { useUser } from "@/hooks/clientState/useUser";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: BookOpen,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },

    {
      title: "Appointments",
      url: "/appointments",
      icon: Calendar,
    },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser((state) => state.user);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="flex">
        <Logo className="self-center" size={30} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email: user?.email || "user@example.com",
            firstName: user?.firstName || "Admin",
            lastName: user?.lastName || "Admin",
            avatar: user?.profilePicture,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}