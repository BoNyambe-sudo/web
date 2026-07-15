import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { request } from "@/config/axios_config";
import { useToken } from "../clientState/useToken";
import toast from "react-hot-toast";

interface AuthResponse {
  access_token: string;
}

export interface UserDataResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "CONTRIBUTOR" | "ADMIN";
  profilePicture?: string;
  status: "ACTIVE" | "BLOCKED";
  createdAt: Date;
  updatedAt: Date;
}

type CreateUserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: "USER" | "CONTRIBUTOR" | "ADMIN";
  image?: File;
};

const login = async (user: { email: string; password: string }) => {
  return await request<AuthResponse>({
    url: "/users/login",
    method: "POST",
    data: user,
  });
};

const register = async (user: CreateUserType) => {
  if (user.role) {
    delete user.role;
  }
  return await request<UserDataResponse>({
    url: "/users/register",
    method: "POST",
    data: user,
  });
};

const adminRegister = async (user: CreateUserType) => {
  return await request<UserDataResponse>({
    url: "/users/register-admin",
    method: "POST",
    data: user,
  });
};

const fetchUsers = async () => {
  return await request<UserDataResponse[]>({
    url: "/users",
    method: "GET",
  });
};

const fetchUserData = async (): Promise<UserDataResponse> => {
  return await request<UserDataResponse>({
    url: `/users/me`,
    method: "GET",
  });
};
const blockUser = async (id: string) => {
  return await request<UserDataResponse>({
    url: `/users/block/${id}`,
    method: "PATCH",
  });
};

const unblockUser = async (id: string) => {
  return await request<UserDataResponse>({
    url: `/users/unblock/${id}`,
    method: "PATCH",
  });
};

const fetchUserAnalytics = async () => {
  return await request<{
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    usersPerRole: { role: string; count: number }[];
  }>({
    url: "/users/analytics",
    method: "GET",
  });
};

const deleteUser = async (id: string) => {
  return await request<{ deleted: boolean; id: string }>({
    url: `/users/${id}`,
    method: "DELETE",
  });
};

const updateUser = async ({
  id,
  user,
}: {
  id: string;
  user: Partial<CreateUserType>;
}): Promise<UserDataResponse> => {
  const formData = new FormData();

  Object.entries(user).forEach(([key, value]) => {
    if (value !== undefined && value !== null && !(value instanceof File)) {
      if (typeof value === "string") {
        formData.append(key, value as string);
      } else {
        formData.append(key, JSON.stringify(value));
      }
    }
  });

  if (user.image && user.image instanceof File) {
    formData.append("image", user.image);
  }

  return await request<UserDataResponse>({
    url: `/users/${id}`,
    method: "PATCH",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const useLogin = () => {
  const setToken = useToken((state) => state.setToken);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login({ email, password }),
    onSuccess: (data) => {
      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success("User registered successfully. Go ahead and login");
    },
  });
};

export const useAdminRegister = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: adminRegister,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-analytics"] });
    },
  });
};

export const useFetchUsers = () => {
  return useQuery<UserDataResponse[]>({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchUserAnalytics = () => {
  return useQuery<{
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    usersPerRole: { role: string; count: number }[];
  }>({
    queryKey: ["user-analytics"],
    queryFn: () => fetchUserAnalytics(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-analytics"] });

    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-analytics"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-analytics"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserDataResponse,
    Error,
    { id: string; user: Partial<CreateUserType> }
  >({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-analytics"] });
    },
  });
};

export const useUserData = () => {
  const token = localStorage.getItem("token")
  return useQuery<UserDataResponse>({
    queryKey: ["user"],
    queryFn: fetchUserData,
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  });
};

export const useLogout = () => {
  const clearToken = useToken((state) => state.clearToken);
  const queryClient = useQueryClient();

  const logout = () => {
    clearToken();
    // 2. Wipe the React Query cache
    queryClient.removeQueries({ queryKey: ["user"], exact: false });
    toast.success("Logged out successfully");
  };

  return logout;
};
