import { useState } from "react";
import { useNavigate } from "react-router";
import { useLogin, useRegister } from "@/hooks/serverState/useUserServer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/PasswordInput";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import SEOHelmet from "@/components/SEOHelmet";
import toast from "react-hot-toast";
import { Link } from "react-router";

type AuthMode = "login" | "signup";

type LoginFormData = {
  email: string;
  password: string;
};

type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Home = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email: loginData.email, password: loginData.password },
      {
        onSuccess: () => {
          navigate("/admin");
        },
      }
    );
  };

  const handleSignup = (e: React.SubmitEvent) => {
    e.preventDefault();

    const { confirmPassword, ...dataToSend } = signupData;

    if (
      !signupData.firstName ||
      !signupData.lastName ||
      !signupData.email ||
      !signupData.password ||
      !confirmPassword
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    registerMutation.mutate(dataToSend, {
      onSuccess: () => {
        setSignupData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      },
    });
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <>
      <SEOHelmet
        title="Admin Login - Bo Nyambe"
        description="Sign in to the admin dashboard to manage content, appointments, and users."
        url="/"
      />
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-heading">
              {mode === "login" ? "Admin Login" : "Create Account"}
            </CardTitle>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`underline-offset-4 transition-colors ${
                  mode === "login"
                    ? "text-foreground underline"
                    : "hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`underline-offset-4 transition-colors ${
                  mode === "signup"
                    ? "text-foreground underline"
                    : "hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>
          </CardHeader>
          <CardContent className="max-h-[80vh] overflow-w-auto scrollbar-hide">
            {mode === "login" ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="last-name">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                    disabled={isPending}
                  />
                </div>
                <PasswordInput
                  id="login-password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                  disabled={isPending}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="first-name">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder="Enter your first name"
                    value={signupData.firstName}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        firstName: e.target.value,
                      })
                    }
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="last-name">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder="Enter your last name"
                    value={signupData.lastName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, lastName: e.target.value })
                    }
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <PasswordInput
                    id="signup-password"
                    placeholder="Enter your password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                    disabled={isPending}
                  />
                  <PasswordStrengthIndicator password={signupData.password} />
                </div>
                <div className="flex flex-col gap-2">
                  <PasswordInput
                    id="confirm-password"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    disabled={isPending}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {registerMutation.isPending
                    ? "Creating account..."
                    : "Sign Up"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  By clicking Sign up, you agree to our{" "}
                  <Link
                    className="underline hover:text-primary"
                    to="/terms-of-service"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    className="underline hover:text-primary"
                    to="/privacy-policy"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Home;
