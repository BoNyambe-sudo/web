import { Link, useLocation } from "react-router";
import { X } from "lucide-react";
import SocialMedia from "./SocialLinks";
import UserIcon from "./UserIcon";
import Logo from "./Logo";
import { useUserData } from "@/hooks/serverState/useUserServer";
import LoginDialog from "./LoginDialog";
import SignupDialog from "./SignupDialog";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SideMenu = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = useLocation().pathname;
  const { data: user } = useUserData();

  return (
    <aside role="dialog" aria-modal="true" aria-hidden={!isOpen} className="fixed inset-0 z-50 md:hidden">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-sidebar text-sidebar-foreground border-l border-sidebar-border shadow-xl flex flex-col">
        <div className="flex items-center justify-between gap-5 p-4">
          {user ? <UserIcon /> : <Logo size={32} />}
          <button
            onClick={onClose}
            className="hover:text-primary/80 hovorEffect"
          >
            <X />
            <span className="sr-only">Close Menu</span>
          </button>
        </div>

        <nav className="flex flex-col space-y-2 font-medium tracking-wide p-4">
          <Link
            to="/"
            onClick={onClose}
            className={`hover:primary border-b hoverEffect ${pathname === "/" ? "text-primary" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/demos"
            onClick={onClose}
            className={`hover:primary border-b hoverEffect ${pathname === "/demos" ? "text-primary" : ""}`}
          >
            Demos
          </Link>
          <Link
            to="/blog"
            onClick={onClose}
            className={`hover:primary border-b hoverEffect ${pathname === "/blogs" ? "text-primary" : ""}`}
          >
            Blog
          </Link>
          <Link
            to="/faqs"
            onClick={onClose}
            className={`hover:primary border-b hoverEffect ${pathname === "/faqs" ? "text-primary" : ""}`}
          >
            FAQs
          </Link>
          <Link
            to="/privacy-policy"
            onClick={onClose}
            className={`hover:primary border-b hoverEffect ${pathname === "/privacy-policy" ? "text-primary" : ""}`}
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            onClick={onClose}
            className={`hover:primary border-b hoverEffect ${pathname === "/terms-of-service" ? "text-primary" : ""}`}
          >
            Terms of Service
          </Link>
        </nav>

        {!user && (
          <div className="flex flex-col gap-2 p-4">
            <LoginDialog variant="default" className="w-full" />
            <SignupDialog variant="secondary" className="w-full" />
          </div>
        )}
        <SocialMedia />
      </div>
    </aside>
  );
};

export default SideMenu;
