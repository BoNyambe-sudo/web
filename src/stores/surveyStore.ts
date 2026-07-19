import { create } from "zustand";

interface SurveyState {
  currentStep: number;
  responses: Record<string, string | number>;
  setResponse: (key: string, value: string | number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const SURVEY_STORAGE_KEY = "primal-survey-state";

const loadState = (): Partial<SurveyState> => {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(SURVEY_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load survey state:", e);
  }
  return {};
};

export const useSurveyStore = create<SurveyState>((set) => {
  const initialState: SurveyState = {
    currentStep: 0,
    responses: {},
    setResponse: (key, value) =>
      set((state) => ({ responses: { ...state.responses, [key]: value } })),
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () =>
      set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
    reset: () => set({ currentStep: 0, responses: {} }),
  };

  const persisted = loadState();
  if (persisted.currentStep !== undefined) initialState.currentStep = persisted.currentStep;
  if (persisted.responses) initialState.responses = persisted.responses;

  return initialState;
});

if (typeof window !== "undefined") {
  useSurveyStore.subscribe((state) => {
    try {
      localStorage.setItem(
        SURVEY_STORAGE_KEY,
        JSON.stringify({ currentStep: state.currentStep, responses: state.responses }),
      );
    } catch (e) {
      console.error("Failed to persist survey state:", e);
    }
  });
}
