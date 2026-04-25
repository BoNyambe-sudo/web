import { create } from "zustand";

interface TogglesState {
  isUserOpen: boolean;
  isContactOpen: boolean;
  toggleContactOpen: (newState: boolean) => void;
  toggleUserOpen: (newState: boolean) => void;
}

export const useToggleState = create<TogglesState>((set) => ({
  isUserOpen: false,
  isContactOpen: false,
  toggleUserOpen: (newState: boolean) => set({ isUserOpen: newState }),
  toggleContactOpen: (newState: boolean) => set({isContactOpen: newState})
}));
