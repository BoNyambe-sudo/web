import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Settings, Power } from "lucide-react";
import { Button } from "./ui/button";
import { useOutsideClick } from "@/hooks/clickAway";
import { useNavigate } from "react-router";
import { useToggleState } from "@/hooks/clientState/useToggles";
import { useLogout, useUserData } from "@/hooks/serverState/useUserServer";

const UserCard = () => {
  const { data: user } = useUserData();
  const isUserOpen = useToggleState((state) => state.isUserOpen);
  const setIsUserOpen = useToggleState((state) => state.toggleUserOpen);
  const logout = useLogout();
  const navigate = useNavigate();

  const userCardRef = useOutsideClick<HTMLDivElement>(() =>
    setIsUserOpen(false),
  );

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return isUserOpen ? (
    <Card
      size="sm"
      className={`absolute right-6 top-3 gap-0 !p-0`}
      ref={userCardRef}
    >
      <div className="flex flex-col gap-0">
        <div className="p-2 flex items-center gap-2 ">
          <Avatar>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              {getInitials(user?.firstName, user?.lastName)}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-medium">
              {user?.firstName as string} {user?.lastName as string}
            </p>
            <p className="text-muted-foreground text-xs">
              {user?.email as string}
            </p>
          </div>
        </div>
        <Separator className="my-0" />
        <Button
          variant="ghost"
          className="w-full justify-start"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => {
            navigate("/manage-account");
            setIsUserOpen(false);
          }}
        >
          <Settings />
          <p>Manage Account</p>
        </Button>
        <Separator className="my-0" />
        <Button
          className="w-full justify-start"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => {
            logout();
            setIsUserOpen(false);
            navigate("/");
          }}
          variant={"ghost"}
        >
          <Power />
          Logout
        </Button>
      </div>
    </Card>
  ) : null;
};

export default UserCard;
