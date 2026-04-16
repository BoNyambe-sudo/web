import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { LogOut, Settings } from "lucide-react";
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

  return (
    <Card
      className={`absolute right-4 top-8 ${isUserOpen ? "flex" : "hidden"} flex-col gap-4 p-4`}
      ref={userCardRef}
    >
      <div className="flex items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>
            {
              ((user?.firstName.charAt(0) as string) +
                user?.lastName.charAt(0)) as string
            }
          </AvatarFallback>
        </Avatar>

        <div>
          <p>
            {user?.firstName as string} {user?.lastName as string}
          </p>
          <p className="text-muted-foreground text-sm">
            {user?.email as string}
          </p>
        </div>
      </div>
      <Separator />
      <div
        role="button"
        className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:text-primary transition-colors"
        onClick={() => {
          navigate("/manage-account");
          setIsUserOpen(false);
        }}
      >
        <Settings />
        <p>Manage Account</p>
      </div>
      <Separator />
      <Button
        onClick={() => {
          logout();
          setIsUserOpen(false);
        }}
        variant={"secondary"}
      >
        <LogOut />
        Logout
      </Button>
    </Card>
  );
};

export default UserCard;
