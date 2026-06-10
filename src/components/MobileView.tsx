import { useToggleState } from "@/hooks/clientState/useToggles";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileView = ({ textClassName }: { textClassName?: string }) => {
  const sidebarOpen = useToggleState((state) => state.sidebarOpen);
  const toggleSidebarOpen = useToggleState((state) => state.toggleSidebarOpen);

  return (
    <div>
      <Button
        className={cn("md:hidden text-foreground font-semibold", textClassName)}
        variant={"ghost"}
        onClick={() => toggleSidebarOpen(!sidebarOpen)}
      >
        <Menu />
        <span className="sr-only">Open Menu</span>
      </Button>
    </div>
  );
};

export default MobileView;
