import { Link, useLocation } from "react-router";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

import MobileView from "./MobileView";
import UserIcon from "./UserIcon";
import { useIsMobile } from "@/hooks/use-mobile";
import SignupDialog from "./SignupDialog";
import { useUserData } from "@/hooks/serverState/useUserServer";
import LoginDialog from "./LoginDialog";

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
  return (
    <header
      className={cn(
        " sticky z-50 top-0 w-full  py-3 backdrop-blur-xl",
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
            to="/demos"
            className={cn(
              `hover:text-primary transition-color ${pathname === "/demos" ? "text-primary" : ""}`,
              textClassName,
            )}
          >
            Demos
          </Link>
          <Link
            to="/blog"
            className={cn(
              `hover:text-primary transition-color ${pathname === "/blog" ? "text-primary" : ""}`,
              textClassName,
            )}
          >
            Blog
          </Link>
          <Link
            to="/faqs"
            className={cn(
              `hover:text-primary transition-color ${pathname === "/faqs" ? "text-primary" : ""}`,
              textClassName,
            )}
          >
            FAQS
          </Link>
          
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
