import { useToggleState } from "@/hooks/clientState/useToggles";
import { Button } from "./ui/button";
import { AlignRight, Menu } from "lucide-react";
import SideMenu from "./SideMenu";
import { cn } from "@/lib/utils";

const MobileView = ({ textClassName }: { textClassName?: string }) => {
  const sidebarOpen = useToggleState((state) => state.sidebarOpen);
  const toggleSidebarOpen = useToggleState((state) => state.toggleSidebarOpen);
  return (
    <div>
      <Button
        className={cn("text-foreground font-semibold", textClassName)}
        variant={"ghost"}
        onClick={() => toggleSidebarOpen(!sidebarOpen)}
      >
        <Menu className="md:hidden hover:text-muted-foreground" />
        {/* <AlignRight /> */}
      </Button>
      <div className="md:hidden">
        <SideMenu
          isOpen={sidebarOpen}
          onClose={() => toggleSidebarOpen(false)}
        />
      </div>
    </div>
  );
};

export default MobileView;
