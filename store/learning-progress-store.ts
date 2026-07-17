import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type LearningProgressState = {
  completedLessonIds: string[];
  currentLessonId: string | null;
  hasHydrated: boolean;
  streakDays: number;
  xp: number;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  setCurrentLesson: (lessonId: string) => void;
  setStreakDays: (days: number) => void;
};

export const useLearningProgressStore = create<LearningProgressState>()(
  persist(
    (set) => ({
      completedLessonIds: [],
      currentLessonId: null,
      hasHydrated: false,
      streakDays: 0,
      xp: 0,
      addXp: (amount) =>
        set((state) => ({ xp: Math.max(0, state.xp + amount) })),
      completeLesson: (lessonId) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.includes(lessonId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, lessonId],
        })),
      setCurrentLesson: (currentLessonId) => set({ currentLessonId }),
      setStreakDays: (streakDays) =>
        set({ streakDays: Math.max(0, streakDays) }),
    }),
    {
      name: "learning-progress-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({
        completedLessonIds,
        currentLessonId,
        streakDays,
        xp,
      }) => ({ completedLessonIds, currentLessonId, streakDays, xp }),
      onRehydrateStorage: () => () => {
        useLearningProgressStore.setState({ hasHydrated: true });
      },
      skipHydration: typeof window === "undefined",
    },
  ),
);
