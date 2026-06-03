import { create } from "zustand";

interface TogglesState {
  isUserOpen: boolean;
  isContactOpen: boolean;
  sidebarOpen: boolean;
  signupDialogOpen: boolean;
  loginDialogOpen: boolean;
  setSignupDialogOpen: (newState: boolean) => void;
  setLoginDialogOpen: (newState: boolean) => void;
  toggleSidebarOpen: (newState: boolean) => void;
  toggleContactOpen: (newState: boolean) => void;
  toggleUserOpen: (newState: boolean) => void;
}

export const useToggleState = create<TogglesState>((set) => ({
  isUserOpen: false,
  isContactOpen: false,
  sidebarOpen: false,
  signupDialogOpen: false,
  loginDialogOpen: false,
  setSignupDialogOpen: (newState: boolean) =>
    set({ signupDialogOpen: newState }),
  setLoginDialogOpen: (newState: boolean) => set({ loginDialogOpen: newState }),
  toggleUserOpen: (newState: boolean) => set({ isUserOpen: newState }),
  toggleContactOpen: (newState: boolean) => set({ isContactOpen: newState }),
  toggleSidebarOpen: (newState: boolean) => set({ sidebarOpen: newState }),
}));
