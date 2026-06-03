import { Link, useLocation, useNavigate } from "react-router";
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
  const navigate = useNavigate();
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
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <Logo
            size={32}
            className={cn("text-foreground font-semibold", textClassName)}
          />
        </div>

        <div className="hidden md:flex flex-1 justify-center items-center font-semibold gap-3">
          <Link
            to="/"
            className={cn(
              `ml-4 hover:text-primary transition-color ${pathname === "/" ? "text-primary" : ""}`,
              textClassName,
            )}
          >
            Home
          </Link>
          <Link
            to="/blogs"
            className={cn(
              `hover:text-primary transition-color ${pathname === "/blogs" ? "text-primary" : ""}`,
              textClassName,
            )}
          >
            Blogs
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
