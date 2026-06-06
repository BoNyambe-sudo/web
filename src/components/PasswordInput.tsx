import * as React from "react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  label = "Password",
  ...props
}: React.ComponentProps<"input"> & { label?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      {label && (
        <Label htmlFor={props.id} className="block text-sm font-medium mb-2">
          {" "}
          {label} *
        </Label>
      )}
      <Input
        type={show ? "text" : "password"}
        {...props}
        className="w-full pr-8"
      />
      <Button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-1 top-7"
        size="icon"
        variant={"ghost"}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </Button>
    </div>
  );
};

export default PasswordInput;
