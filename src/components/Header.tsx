import { Link } from "react-router";
import Logo from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@/hooks/clientState/useUser";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { useToggleState } from "@/hooks/clientState/useToggles";
import { sampleUsers } from "@/temporalData";
import UserCard from "./UserCard";
import { cn } from "@/lib/utils";

const Header = ({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) => {
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const setIsUserOpen = useToggleState((state) => state.toggleUserOpen);

  const [formData, setFormDate] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setUser(sampleUsers[2]);
  }, [setUser]);

  return (
    <div
      className={cn(
        "container sticky z-50 top-0 w-full flex items-center justify-between py-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <Logo
          size={32}
          className={cn("text-foreground font-semibold", textClassName)}
        />

        <div className="flex items-center font-semibold text-sm gap-3">
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
      {user ? (
        <>
          {" "}
          <Avatar
            className="cursor-pointer"
            onClick={() => setIsUserOpen(true)}
          >
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback>
              {user.firstName.charAt(0) + user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>{" "}
          <UserCard />{" "}
        </>
      ) : (
        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <DialogTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {!isSignUpDialogOpen ? "Login" : "Sign Up"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              {isSignUpDialogOpen && (
                <div className="space-y-3">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormDate({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
              )}
              {isSignUpDialogOpen && (
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormDate({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormDate({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 ">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormDate({ ...formData, password: e.target.value })
                  }
                />
              </div>
              {isSignUpDialogOpen && (
                <PasswordStrengthIndicator password={formData.password} />
              )}
              {isSignUpDialogOpen && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormDate({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div>
                <Button type="submit" className="w-full">
                  {!isSignUpDialogOpen ? "Login" : "Sign Up"}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  <span>
                    {!isSignUpDialogOpen
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </span>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsSignUpDialogOpen(!isSignUpDialogOpen);
                    }}
                    variant={"link"}
                  >
                    {!isSignUpDialogOpen ? "Sign up" : "Login"}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Header;
