import { cn } from "@/lib/utils";

export type PasswordStrength = "weak" | "medium" | "strong" | "very-strong";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const getPasswordStrength = (password: string): PasswordStrength => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength < 3) return "weak";
  if (strength === 3) return "medium";
  if (strength === 4) return "strong";
  return "very-strong";
};

const getStrengthLabel = (strength: PasswordStrength): string => {
  switch (strength) {
    case "weak":
      return "Weak";
    case "medium":
      return "Medium";
    case "strong":
      return "Strong";
    case "very-strong":
      return "Very Strong";
  }
};

const getStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case "weak":
      return `bg-destructive`;
    case "medium":
      return `bg-yellow-500`;
    case "strong":
      return `bg-primary`;
    case "very-strong":
      return `bg-green-500`;
  }
};

const getStrengthLabelColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case "weak":
      return `text-destructive`;
    case "medium":
      return `text-yellow-500`;
    case "strong":
      return `text-primary`;
    case "very-strong":
      return `text-green-500`;
  }
};

export function PasswordStrengthIndicator({
  password,
  className,
}: PasswordStrengthIndicatorProps) {
  const strength = getPasswordStrength(password);

  if (password.length < 8) {
    return (
      <div className={cn("text-sm text-destructive mt-1", className)}>
        Password must be at least 8 characters long
      </div>
    );
  }

  return (
    <div className={cn("mt-1", className)}>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 ease-in-out",
              getStrengthColor(strength),
            )}
            style={{
              width:
                strength === "weak"
                  ? "33%"
                  : strength === "medium"
                    ? "66%"
                    : strength === "strong"
                      ? "85%"
                      : "100%",
            }}
          />
        </div>
        <span
          className={cn("text-sm font-medium", getStrengthLabelColor(strength))}
        >
          {getStrengthLabel(strength)}
        </span>
      </div>
    </div>
  );
}
