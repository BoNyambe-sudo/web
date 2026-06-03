import { useOutsideClick } from "@/hooks/clickAway";
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
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose, isOpen);
  const { data: user } = useUserData();

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 overflow-hidden h-screen  ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        className={`absolute inset-0 bg-black/30 h-screen transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <div
        ref={sidebarRef}
        className={`absolute inset-y-0 right-0 z-10 h-full w-full max-w-[24rem] bg-popover text-popover-foreground shadow-xl border-l border-l-primary/60 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full p-10 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-5">
            {user ? <UserIcon /> : <Logo size={32} />}
            <button
              onClick={onClose}
              className="hover:text-primary/80 hovorEffect"
            >
              <X />
            </button>
          </div>

          <div className="flex flex-col space-y-2 font-medium tracking-wide">
            <Link
              to="/"
              onClick={onClose}
              className={`hover:primary border-b hoverEffect ${pathname === "/" ? "text-primary" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/blogs"
              onClick={onClose}
              className={`hover:primary border-b hoverEffect ${pathname === "/blogs" ? "text-primary" : ""}`}
            >
              Blogs
            </Link>
            <Link
              to="/faqs"
              onClick={onClose}
              className={`hover:primary border-b hoverEffect ${pathname === "/faqs" ? "text-primary" : ""}`}
            >
              FAQs
            </Link>
          </div>

          {!user && (
            <div className="flex flex-col gap-2">
              <LoginDialog variant="default" className="w-full" />
              <SignupDialog variant="secondary" className="w-full" />
            </div>
          )}
          <SocialMedia />
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
