import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageCode } from "@/types/learning";

type LanguageState = {
  hasHydrated: boolean;
  selectedLanguageId: LanguageCode | null;
  clearSelectedLanguage: () => void;
  setSelectedLanguage: (languageId: LanguageCode) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      selectedLanguageId: null,
      clearSelectedLanguage: () => set({ selectedLanguageId: null }),
      setSelectedLanguage: (selectedLanguageId) =>
        set({ selectedLanguageId }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ selectedLanguageId }) => ({ selectedLanguageId }),
      onRehydrateStorage: () => () => {
        useLanguageStore.setState({ hasHydrated: true });
      },
    },
  ),
);
