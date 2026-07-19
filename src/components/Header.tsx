import { Link, useLocation, useNavigate } from "react-router";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

import MobileView from "./MobileView";
import UserIcon from "./UserIcon";
import { useIsMobile } from "@/hooks/use-mobile";
import SignupDialog from "./SignupDialog";
import { useUserData } from "@/hooks/serverState/useUserServer";
import LoginDialog from "./LoginDialog";
import { Button } from "./ui/button";
import { isStaffUser } from "@/lib/permissions";

const Header = ({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) => {
  const isMobile = useIsMobile();
  const { data: user } = useUserData();
  const pathname = useLocation().pathname;
  const isStaff = isStaffUser(user);
  const onAdmin = pathname.startsWith("/admin");

  const navigate = useNavigate();
  return (
    <header
      className={cn(
        "sticky z-50 top-0 w-full py-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="cursor-pointer">
          <Logo
            size={32}
            className={cn("text-foreground font-semibold", textClassName)}
          />
        </Link>

        <div className="hidden md:flex flex-1 justify-center items-center font-semibold gap-3">
          <Link
            to="/services/"
            className={cn(
              `relative group hover:text-primary transition-color ${pathname === "/services/" ? "text-primary" : ""}`,
              textClassName,
            )}
          >
            Services
            <span
              className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === "/services/" ? "w-1/2" : ""}`}
            ></span>
            <span
              className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === "/services/" ? "w-1/2" : ""}`}
            ></span>
          </Link>
          <Link
            to="/blog/"
            className={cn(
              `relative group hover:text-primary transition-color ${pathname === "/blog/" ? "text-primary" : ""}`,
              textClassName,
            )}
          >
            Blog
            <span
              className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === "/blog/" ? "w-1/2" : ""}`}
            ></span>
            <span
              className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === "/blog/" ? "w-1/2" : ""}`}
            ></span>
          </Link>
          <Link
            to="/faqs/"
            className={cn(
              `relative group hover:text-primary transition-color ${pathname === "/faqs/" ? "text-primary" : ""}`,
              textClassName,
            )}
          >
            FAQS
            <span
              className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === "/faqs/" ? "w-1/2" : ""}`}
            ></span>
            <span
              className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === "/faqs/" ? "w-1/2" : ""}`}
            ></span>
          </Link>
          <Link
            to="/contact/"
            className={cn(
              `relative group hover:text-primary transition-color ${pathname === "/contact" ? "text-primary" : ""}`,
              textClassName,
            )}
          >
            Contact
            <span
              className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === "/contact/" ? "w-1/2" : ""}`}
            ></span>
            <span
              className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-primary/80 group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === "/contact/" ? "w-1/2" : ""}`}
            ></span>
          </Link>
          {isStaff && !onAdmin && (
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => navigate("/admin")}
            >
              Admin Dashboard
            </Button>
          )}
        </div>

        <MobileView textClassName={textClassName} />
        {!isMobile &&
          (user ? (
            <UserIcon />
          ) : (
            <div className="flex items-center gap-2">
              <LoginDialog />
              <SignupDialog />
            </div>
          ))}
      </div>
    </header>
  );
};

export default Header;
