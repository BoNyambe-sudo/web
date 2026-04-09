import { create } from "zustand";

interface TogglesState {
  isUserOpen: boolean;
  toggleUserOpen: (newState: boolean) => void;
}

export const useToggleState = create<TogglesState>((set) => ({
  isUserOpen: false,
  toggleUserOpen: (newState: boolean) => set({ isUserOpen: newState }),
}));
