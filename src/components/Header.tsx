import { Link } from "react-router";
import Logo from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { useToggleState } from "@/hooks/clientState/useToggles";
import UserCard from "./UserCard";
import { cn } from "@/lib/utils";
import {
  useLogin,
  useRegister,
  useUserData,
} from "@/hooks/serverState/useUserServer";
import toast from "react-hot-toast";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

const Header = ({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const setIsUserOpen = useToggleState((state) => state.toggleUserOpen);
  const { data: user } = useUserData();
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (isSignUpDialogOpen) {
      const { confirmPassword, ...dataToSend } = formData;
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !confirmPassword
      ) {
        toast.error("Please fill all the fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      register(dataToSend, {
        onSuccess: () => {
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setIsSignUpDialogOpen(false);
          setIsLoginDialogOpen(false);
        },
      });
    } else {
      if (!formData.email || !formData.password) {
        toast.error("Please fill all the fields");
        return;
      }

      login(
        { email: formData.email, password: formData.password },
        {
          onSuccess: () => {
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
            });
            setIsLoginDialogOpen(false);
            toast.success("Logged in successfully");
          },
        },
      );
    }
  };

  return (
    <header
      className={cn(
        " sticky z-50 top-0 w-full  py-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="container flex items-center justify-between">
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
              <form className="space-y-4" onSubmit={handleSubmit}>
                {isSignUpDialogOpen && (
                  <div className="space-y-3">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
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
                        setFormData({ ...formData, lastName: e.target.value })
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
                      setFormData({ ...formData, email: e.target.value })
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
                      setFormData({ ...formData, password: e.target.value })
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
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoginPending || isRegisterPending}
                  >
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
    </header>
  );
};

export default Header;
