import { Link, useNavigate } from "react-router";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

import MobileView from "./MobileView";
import UserIcon from "./UserIcon";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = ({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  return (
    <header
      className={cn(
        " sticky z-50 top-0 w-full  py-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center justify-between gap-4">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <Logo
              size={32}
              className={cn("text-foreground font-semibold", textClassName)}
            />
          </div>

          <div className="hidden md:flex items-center font-semibold text-sm gap-3">
            <Link
              to="/"
              className={cn(
                "ml-4 text-foreground hover:text-primary font-semibold transition-colors",
                textClassName,
              )}
            >
              Home
            </Link>
            <Link
              to="/blogs"
              className={cn(
                "text-foreground font-semibold hover:text-primary transition-colors",
                textClassName,
              )}
            >
              Blogs
            </Link>
          </div>
        </div>
        <MobileView textClassName={textClassName} />
        {!isMobile && <UserIcon />}
      </div>
    </header>
  );
};

export default Header;
