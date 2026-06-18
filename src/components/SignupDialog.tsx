import { useState } from "react";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
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
import { useRegister } from "@/hooks/serverState/useUserServer";
import toast from "react-hot-toast";
import { useToggleState } from "@/hooks/clientState/useToggles";
import PasswordInput from "./PasswordInput";
//import Google from "./icons/google";
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

//const GOOGLE_AUTH_URL = `${import.meta.env.VITE_BASE_URL}/auth/google`;

const SignupDialog = ({
  className,
  variant = "outline",
}: {
  className?: string;
  variant?: "outline" | "default" | "secondary" | "destructive";
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const isSignUpDialogOpen = useToggleState((state) => state.signupDialogOpen);
  const setIsSignUpDialogOpen = useToggleState(
    (state) => state.setSignupDialogOpen,
  );
  const setIsLoginDialogOpen = useToggleState(
    (state) => state.setLoginDialogOpen,
  );

  const { mutate: register, isPending: isRegisterPending } = useRegister();
  /* const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  }; */

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

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
      },
    });
  };

  const switchToLogin = () => {
    setIsSignUpDialogOpen(false);
    setIsLoginDialogOpen(true);
  };
  const handleDialogOpenChange = (open: boolean) => {
    setIsSignUpDialogOpen(open);
  };

  return (
    <Dialog open={isSignUpDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto scrollbar-hide max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <span className="sr-only">Sign up for an account</span>Required fields{" "}
          <span className="text-destructive">*</span>
        </DialogDescription>
        <div className="space-y-4">
          {/* <Button
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
          </div> */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Label htmlFor="first-name">
                First Name <span className="text-destructive">*</span>
              </Label>
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

            <div className="space-y-2">
              <Label htmlFor="last-name">
                Last Name <span className="text-destructive">*</span>
              </Label>
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

            <PasswordStrengthIndicator password={formData.password} />
            <PasswordInput
              required
              label="Confirm Password"
              id="confrim-password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isRegisterPending}
              >
                Sign Up
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <span>Already have an account?</span>
                <Button type="button" onClick={switchToLogin} variant={"link"}>
                  Login
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;
