import toast from "react-hot-toast";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { useLogin } from "@/hooks/serverState/useUserServer";
import { useToggleState } from "@/hooks/clientState/useToggles";

type FormData = {
  email: string;
  password: string;
};

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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
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
            <Label htmlFor="password">Password *</Label>
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

          <div>
            <Button type="submit" className="w-full" disabled={isLoginPending}>
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
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
