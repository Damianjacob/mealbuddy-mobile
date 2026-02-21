import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "MealBuddy" }} />
      <Stack.Screen
        name="new-meal"
        options={{
          presentation: "modal",
          title: "Add New Meal",
        }}
      />
    </Stack>
  );
}
