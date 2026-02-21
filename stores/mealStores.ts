import { Meal } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MealStore {
    meals: Meal[];
    addMeal: (meal: Meal) => void;
}

export const useMeals = create<MealStore>()(
    persist(
        (set) => ({
            meals: [],
            addMeal: (meal) => set((state) => ({ meals: [...state.meals, meal] })),
        }),
        {
            name: "meal-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
