import { useMeals } from "@/stores/mealStores";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface MealListProps {}

export function MealList({}: MealListProps) {
    const meals = useMeals((state) => state.meals);
    return (
        <FlatList
            data={meals}
            renderItem={({ index, item }) => {
                return (
                    <View>
                        <Text>{item.name}</Text>
                        <Text>{item.type}</Text>
                    </View>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {},
});
