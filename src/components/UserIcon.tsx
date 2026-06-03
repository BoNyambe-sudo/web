import { useUserData } from "@/hooks/serverState/useUserServer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserCard from "./UserCard";

import { useToggleState } from "@/hooks/clientState/useToggles";

const UserIcon = () => {
  const setIsUserOpen = useToggleState((state) => state.toggleUserOpen);
  const { data: user } = useUserData();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };
  return (
    user && (
      <>
        {" "}
        <Avatar className="cursor-pointer" onClick={() => setIsUserOpen(true)}>
          <AvatarImage src={user.profilePicture} />
          <AvatarFallback>
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>{" "}
        <UserCard />{" "}
      </>
    )
  );
};

export default UserIcon;
