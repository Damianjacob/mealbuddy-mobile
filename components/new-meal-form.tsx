import type { Ingredient, Meal, Mealtype, Unit } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { z } from "zod";

const UNITS: Unit[] = ["gr", "kg", "ml", "l", "tbsp", "tsp"];
const MEAL_TYPES: Mealtype[] = ["breakfast", "lunch", "dinner", "snack"];

const mealSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
    ingredients: z
        .array(
            z.object({
                name: z.string().min(1, "Ingredient name is required"),
                amount: z.number().positive("Amount must be positive"),
                unit: z.enum(["gr", "kg", "ml", "l", "tbsp", "tsp"]).optional(),
            }),
        )
        .min(1, "Add at least one ingredient"),
}) satisfies z.ZodType<Omit<Meal, "id">>;

export type MealFormData = Omit<Meal, "id">;

interface NewMealFormProps {
    onSubmit: (meal: Meal) => void;
    onCancel: () => void;
}

export function NewMealForm({ onSubmit, onCancel }: NewMealFormProps) {
    const [newIngredientName, setNewIngredientName] = useState("");
    const [newIngredientAmount, setNewIngredientAmount] = useState("");
    const [newIngredientUnit, setNewIngredientUnit] = useState<
        Unit | undefined
    >(undefined);
    const [showUnitPicker, setShowUnitPicker] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<MealFormData>({
        resolver: zodResolver(mealSchema),
        defaultValues: {
            name: "",
            type: "breakfast",
            ingredients: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "ingredients",
    });

    const handleAddIngredient = () => {
        const amount = parseFloat(newIngredientAmount);
        if (newIngredientName.trim() && !isNaN(amount) && amount > 0) {
            append({
                name: newIngredientName.trim(),
                amount,
                unit: newIngredientUnit,
            });
            setNewIngredientName("");
            setNewIngredientAmount("");
            setNewIngredientUnit(undefined);
        }
    };

    const formatIngredient = (ingredient: Ingredient): string => {
        if (ingredient.unit) {
            return `${ingredient.amount}${ingredient.unit} ${ingredient.name}`;
        }
        return `${ingredient.amount}x ${ingredient.name}`;
    };

    const getUnitLabel = (unit: Unit | undefined): string => {
        if (!unit) return "count";
        return unit;
    };

    return (
        <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.field}>
                <Text style={styles.label}>Meal Name</Text>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[
                                styles.input,
                                errors.name && styles.inputError,
                            ]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Enter meal name"
                            placeholderTextColor="#999"
                        />
                    )}
                />
                {errors.name && (
                    <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Meal Type</Text>
                <Controller
                    control={control}
                    name="type"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.mealTypeContainer}>
                            {MEAL_TYPES.map((type) => (
                                <Pressable
                                    key={type}
                                    style={[
                                        styles.mealTypeButton,
                                        value === type &&
                                            styles.mealTypeButtonActive,
                                    ]}
                                    onPress={() => onChange(type)}
                                >
                                    <Text
                                        style={[
                                            styles.mealTypeText,
                                            value === type &&
                                                styles.mealTypeTextActive,
                                        ]}
                                    >
                                        {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Ingredients</Text>

                <View style={styles.addIngredientContainer}>
                    <TextInput
                        style={[styles.input, styles.ingredientNameInput]}
                        value={newIngredientName}
                        onChangeText={setNewIngredientName}
                        placeholder="Ingredient"
                        placeholderTextColor="#999"
                    />
                    <View style={styles.quantityRow}>
                        <TextInput
                            style={[styles.input, styles.amountInput]}
                            value={newIngredientAmount}
                            onChangeText={setNewIngredientAmount}
                            placeholder="Qty"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                        />
                        <Pressable
                            style={styles.unitSelector}
                            onPress={() => setShowUnitPicker(true)}
                        >
                            <Text style={styles.unitSelectorText}>
                                {getUnitLabel(newIngredientUnit)}
                            </Text>
                            <Text style={styles.unitSelectorArrow}>▼</Text>
                        </Pressable>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddIngredient}
                        >
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {errors.ingredients && (
                    <Text style={styles.errorText}>
                        {errors.ingredients.message}
                    </Text>
                )}

                <View style={styles.ingredientsList}>
                    {fields.map((field, index) => (
                        <View key={field.id} style={styles.ingredientChip}>
                            <Text style={styles.ingredientChipText}>
                                {formatIngredient(field)}
                            </Text>
                            <Pressable
                                onPress={() => remove(index)}
                                style={styles.removeButton}
                            >
                                <Text style={styles.removeButtonText}>×</Text>
                            </Pressable>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit((data) =>
                        onSubmit({ ...data, id: Date.now().toString() }),
                    )}
                >
                    <Text style={styles.submitButtonText}>Add Meal</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showUnitPicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowUnitPicker(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowUnitPicker(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Unit</Text>
                        <Pressable
                            style={[
                                styles.unitOption,
                                newIngredientUnit === undefined &&
                                    styles.unitOptionActive,
                            ]}
                            onPress={() => {
                                setNewIngredientUnit(undefined);
                                setShowUnitPicker(false);
                            }}
                        >
                            <Text
                                style={[
                                    styles.unitOptionText,
                                    newIngredientUnit === undefined &&
                                        styles.unitOptionTextActive,
                                ]}
                            >
                                count (no unit)
                            </Text>
                        </Pressable>
                        {UNITS.map((unit) => (
                            <Pressable
                                key={unit}
                                style={[
                                    styles.unitOption,
                                    newIngredientUnit === unit &&
                                        styles.unitOptionActive,
                                ]}
                                onPress={() => {
                                    setNewIngredientUnit(unit);
                                    setShowUnitPicker(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.unitOptionText,
                                        newIngredientUnit === unit &&
                                            styles.unitOptionTextActive,
                                    ]}
                                >
                                    {unit}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    field: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#11181C",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    inputError: {
        borderColor: "#dc3545",
    },
    errorText: {
        color: "#dc3545",
        fontSize: 14,
        marginTop: 4,
    },
    mealTypeContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    mealTypeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
    },
    mealTypeButtonActive: {
        backgroundColor: "#0a7ea4",
        borderColor: "#0a7ea4",
    },
    mealTypeText: {
        fontSize: 14,
        color: "#666",
    },
    mealTypeTextActive: {
        color: "#fff",
        fontWeight: "600",
    },
    addIngredientContainer: {
        gap: 8,
    },
    ingredientNameInput: {
        flex: 1,
    },
    quantityRow: {
        flexDirection: "row",
        gap: 8,
    },
    amountInput: {
        width: 70,
        textAlign: "center",
    },
    unitSelector: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: "#fff",
    },
    unitSelectorText: {
        fontSize: 16,
        color: "#333",
    },
    unitSelectorArrow: {
        fontSize: 10,
        color: "#666",
    },
    addButton: {
        width: 48,
        height: 48,
        backgroundColor: "#0a7ea4",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    ingredientsList: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 12,
    },
    ingredientChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e9ecef",
        paddingVertical: 6,
        paddingLeft: 12,
        paddingRight: 4,
        borderRadius: 16,
    },
    ingredientChipText: {
        fontSize: 14,
        color: "#333",
    },
    removeButton: {
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    removeButtonText: {
        fontSize: 18,
        color: "#666",
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
        marginBottom: 40,
    },
    cancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: 16,
        color: "#666",
    },
    submitButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#0a7ea4",
        alignItems: "center",
    },
    submitButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        width: "80%",
        maxWidth: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
        textAlign: "center",
        color: "#11181C",
    },
    unitOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    unitOptionActive: {
        backgroundColor: "#e3f2fd",
    },
    unitOptionText: {
        fontSize: 16,
        color: "#333",
    },
    unitOptionTextActive: {
        color: "#0a7ea4",
        fontWeight: "600",
    },
});
