import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const categories = [
  { emoji: "🛒", name: "Groceries" },
  { emoji: "🍽️", name: "Dining" },
  { emoji: "🚗", name: "Transport" },
  { emoji: "🎭", name: "Entertainment" },
  { emoji: "🏥", name: "Health" },
  { emoji: "🏠", name: "Housing" },
  { emoji: "📦", name: "Shopping" },
  { emoji: "⚡", name: "Utilities" },
];

export default function AddExpenseScreen() {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>New Entry</Text>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.typeSwitch}>
        <TouchableOpacity style={[styles.typeButton, styles.activeType]}>
          <Text style={styles.activeTypeText}>expense</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.typeButton}>
          <Text style={styles.typeText}>income</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.amountCard}>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.amount}>$0</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Category</Text>

        <View style={styles.categoryGrid}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.categoryPill,
                index === 0 && styles.selectedCategory,
              ]}
            >
              <Text style={styles.categoryText}>
                {item.emoji} {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Whole Foods Market"
          placeholderTextColor={COLORS.text}
          style={styles.input}
        />
      </View>

      <View style={styles.cardRow}>
        <View>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.rowValue}>Jun 16, 2026</Text>
        </View>

        <Ionicons name="calendar-outline" size={22} color={COLORS.muted} />
      </View>

      <View style={styles.cardRow}>
        <View>
          <Text style={styles.label}>Receipt</Text>
          <Text style={styles.rowValue}>Attach photo</Text>
        </View>

        <Ionicons name="camera-outline" size={22} color={COLORS.muted} />
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Save Transaction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  saveText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  typeSwitch: {
    backgroundColor: "#E8EBF3",
    borderRadius: 999,
    padding: 5,
    flexDirection: "row",
    marginBottom: 18,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  activeType: {
    backgroundColor: COLORS.card,
  },
  activeTypeText: {
    color: COLORS.text,
    fontWeight: "800",
  },
  typeText: {
    color: COLORS.muted,
    fontWeight: "700",
  },
  amountCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "700",
    marginBottom: 8,
  },
  amount: {
    fontSize: 54,
    fontWeight: "800",
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryPill: {
    backgroundColor: "#F2F4F8",
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  selectedCategory: {
    backgroundColor: "#ECEBFF",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontWeight: "700",
    color: COLORS.text,
  },
  input: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    paddingVertical: 4,
  },
  cardRow: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 120,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});