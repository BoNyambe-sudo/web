import { create } from "zustand";

export interface UserType {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "CONTRIBUTOR" | "ADMIN";
  profilePicture?: string;
  status: "ACTIVE" | "BLOCKED";
  createdAt?: Date;
  updatedAt?: Date;
}

type UserStore = {
  user: UserType | null;
  users: UserType[];
  setUsers: (newUsers: UserType[]) => void;
  setUser: (newUser: UserType) => void;
  clearUser: () => void;
};

export const useUser = create<UserStore>((set) => ({
  user: null,
  users: [],

  setUsers: (newUsers: UserType[]) => set({ users: newUsers }),
  setUser: (newUser: UserType) => set({ user: newUser }),
  clearUser: () => set({ user: null }),
}));
