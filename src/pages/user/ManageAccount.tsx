import LoadingIndicator from "@/components/LoadingIndicator";

import UserAccountForm from "@/components/UserAccountForm";
import { useUserData } from "@/hooks/serverState/useUserServer";

const ManageAccount = () => {
  const { data: user } = useUserData();

  return user ? (
    <UserAccountForm key={user.id } user={user} />
  ) : (
    <LoadingIndicator />
  );
};

export default ManageAccount;
