export interface Ingredient {
    name: string;
    amount: number;
    unit?: Unit;
}

export type Unit = "gr" | "kg" | "l" | "ml" | "tbsp" | "tsp";

export interface Meal {
    id: string;
    name: string;
    type: Mealtype;
    ingredients: Ingredient[];
}

export type Mealtype = "breakfast" | "lunch" | "dinner" | "snack";
