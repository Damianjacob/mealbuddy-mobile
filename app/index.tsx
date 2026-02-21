import { MealList } from "@/components/meal-list";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to MealBuddy</Text>
            <Text style={styles.subtitle}>Track your meals with ease</Text>

            <Link href="/new-meal" asChild>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add Meal</Text>
                </TouchableOpacity>
            </Link>
            <MealList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#11181C",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 40,
    },
    addButton: {
        backgroundColor: "#0a7ea4",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});
