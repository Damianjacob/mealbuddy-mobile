import { NewMealForm } from "@/components/new-meal-form";
import { useMeals } from "@/stores/mealStores";
import type { Meal } from "@/types/types";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function NewMealScreen() {
    const router = useRouter();
    const addMeal = useMeals((state) => state.addMeal);

    const handleSubmit = (meal: Meal) => {
        addMeal(meal);
        router.back();
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <NewMealForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
