import {create} from "zustand";
import { getLocalStorageItem } from "@/lib/getLocalStorage";

type TokenStore = {
  token: string;
  setToken: (newToken: string) => void;
  clearToken: () => void;
};

const getStoredToken = (): string => {
  if (typeof window !== "undefined") {
    return getLocalStorageItem("token");
  }
  return "";
};


export const useToken = create<TokenStore>((set) => ({
  token: getStoredToken(),
  setToken: (newToken: string) => {
    set({ token: newToken });
    localStorage.setItem("token", newToken);
  },
  clearToken: () => {
    localStorage.removeItem("token");
    set({ token: "" });
  }
}));

