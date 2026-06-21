import toast from "react-hot-toast";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { useLogin } from "@/hooks/serverState/useUserServer";
import { useToggleState } from "@/hooks/clientState/useToggles";
import PasswordInput from "./PasswordInput";
//import Google from "./icons/google";

type FormData = {
  email: string;
  password: string;
};

//const GOOGLE_AUTH_URL = `${import.meta.env.VITE_BASE_URL}/auth/google`;

const LoginDialog = ({
  className,
  variant = "secondary",
}: {
  className?: string;
  variant?: "outline" | "default" | "secondary" | "destructive";
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const isLoginDialogOpen = useToggleState((state) => state.loginDialogOpen);
  const setIsLoginDialogOpen = useToggleState(
    (state) => state.setLoginDialogOpen,
  );
  const setIsSignUpDialogOpen = useToggleState(
    (state) => state.setSignupDialogOpen,
  );

  const { mutate: login, isPending: isLoginPending } = useLogin();

  /* const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  }; */

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }

    login(
      { email: formData.email, password: formData.password },
      {
        onSuccess: () => {
          setFormData({
            email: "",
            password: "",
          });
          setIsLoginDialogOpen(false);
          toast.success("Logged in successfully");
        },
      },
    );
  };

  const switchToSignup = () => {
    setIsLoginDialogOpen(false);
    setIsSignUpDialogOpen(true);
  };

  return (
    <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          Login
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <span className="sr-only">Fill in your credentials to login</span>
          Required fields <span className="text-destructive">*</span>
        </DialogDescription>
        <div className="space-y-4">
          {/*<Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <Google size={16} />
            Continue with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-popover px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>*/}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
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
            <PasswordInput
              required
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoginPending}
              >
                Login
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <span>Don't have an account?</span>
                <Button type="button" onClick={switchToSignup} variant={"link"}>
                  Sign up
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
