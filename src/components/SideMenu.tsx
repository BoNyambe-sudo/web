import { Link, useLocation, useNavigate } from "react-router";
import { X } from "lucide-react";
import SocialMedia from "./SocialLinks";
import UserIcon from "./UserIcon";
import Logo from "./Logo";
import { useUserData } from "@/hooks/serverState/useUserServer";
import LoginDialog from "./LoginDialog";
import SignupDialog from "./SignupDialog";
import { isStaffUser } from "@/lib/permissions";
import { Button } from "./ui/button";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SideMenu = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = useLocation().pathname;
  const { data: user } = useUserData();
  const isStaff = isStaffUser(user);

  const navigate = useNavigate();

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className="fixed inset-0 z-50 md:hidden"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-sidebar text-sidebar-foreground border-l border-sidebar-border shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {user ? <UserIcon /> : <Logo size={32} />}
          <button
            onClick={onClose}
            className="hover:text-primary/80 hovorEffect"
          >
            <X />
            <span className="sr-only">Close Menu</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={onClose}
              className={`relative group hover:primary  hoverEffect ${pathname === "/" ? "text-primary" : ""}`}
            >
              Home
              <span
                className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === "/" ? "w-1/2" : ""}`}
              ></span>
              <span
                className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === "/" ? "w-1/2" : ""}`}
              ></span>
            </Link>
            <Link
              to="/demos"
              onClick={onClose}
              className={`relative group hover:primary  hoverEffect ${pathname === "/demos" ? "text-primary" : ""}`}
            >
              Demos
              <span
                className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === "/demos" ? "w-1/2" : ""}`}
              ></span>
              <span
                className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === "/demos" ? "w-1/2" : ""}`}
              ></span>
            </Link>
            <Link
              to="/blog"
              onClick={onClose}
              className={`relative group hover:primary  hoverEffect ${pathname === "/blog" ? "text-primary" : ""}`}
            >
              Blog
              <span
                className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === "/blog" ? "w-1/2" : ""}`}
              ></span>
              <span
                className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === "/blog" ? "w-1/2" : ""}`}
              ></span>
            </Link>
            <Link
              to="/faqs"
              onClick={onClose}
              className={`relative group hover:primary  hoverEffect ${pathname === "/faqs" ? "text-primary" : ""}`}
            >
              FAQs
              <span
                className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === "/faqs" ? "w-1/2" : ""}`}
              ></span>
              <span
                className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === "/faqs" ? "w-1/2" : ""}`}
              ></span>
            </Link>
            <Link
              to="/privacy-policy"
              onClick={onClose}
              className={`relative group hover:primary  hoverEffect ${pathname === "/privacy-policy" ? "text-primary" : ""}`}
            >
              Privacy Policy
              <span
                className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === "/privacy-policy" ? "w-1/2" : ""}`}
              ></span>
              <span
                className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === "/privacy-policy" ? "w-1/2" : ""}`}
              ></span>
            </Link>
            <Link
              to="/terms-of-service"
              onClick={onClose}
              className={`relative group hover:primary  hoverEffect ${pathname === "/terms-of-service" ? "text-primary" : ""}`}
            >
              Terms of Service
              <span
                className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === "/terms-of-service" ? "w-1/2" : ""}`}
              ></span>
              <span
                className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === "/terms-of-service" ? "w-1/2" : ""}`}
              ></span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          {!user && (
            <>
              <LoginDialog variant="default" className="w-full" />
              <SignupDialog variant="secondary" className="w-full" />
            </>
          )}
          {isStaff && (
            <Button
              variant="outline"
              onClick={() => {
                navigate("/admin");
                onClose();
              }}
            >
              Admin Dashboard
            </Button>
          )}
          <SocialMedia />
        </div>
      </div>
    </aside>
  );
};

export default SideMenu;
