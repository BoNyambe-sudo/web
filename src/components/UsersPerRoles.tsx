import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useFetchUserAnalytics } from "@/hooks/serverState/useUserServer";


const UsersPerRoles = () => {
  const {data: usersMetrics} = useFetchUserAnalytics()
  const usersPerRole = usersMetrics?.usersPerRole || []
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {usersPerRole?.map((userPerRole) => (
        <Card key={userPerRole.role}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {userPerRole.role}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPerRole.count}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UsersPerRoles;
