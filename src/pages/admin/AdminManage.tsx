import AdminAccountForm from "@/components/AdminAccountForm";
import LoadingIndicator from "@/components/LoadingIndicator";

import { useUserData } from "@/hooks/serverState/useUserServer";

const AdminManage = () => {
  const { data: user } = useUserData();
  return user ? (
    <AdminAccountForm key={user.id} user={user} />
  ) : (
    <LoadingIndicator />
  );
};

export default AdminManage;
