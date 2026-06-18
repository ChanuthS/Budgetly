import { COLORS } from "@/constants/colors";
import { budgets } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";



export default function BudgetsScreen() {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Budgets</Text>

        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.newButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>June 2026 Overview</Text>

        <View style={styles.overviewRow}>
          <View>
            <Text style={styles.label}>Total Spent</Text>
            <Text style={styles.totalSpent}>
              $1294 <Text style={styles.totalBudget}>/ 1720</Text>
            </Text>
            <Text style={styles.remaining}>$426 remaining this month</Text>
          </View>

          <View style={styles.circle}>
            <Text style={styles.circleText}>75%</Text>
          </View>
        </View>
      </View>

      <View style={styles.categoryTabs}>
        {["Groceries", "Dining Out", "Transport", "Entertainment"].map((item, index) => (
          <View key={item} style={[styles.tabPill, index === 0 && styles.activeTab]}>
            <Text style={[styles.tabText, index === 0 && styles.activeTabText]}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.budgetList}>
        {budgets.map((item) => {
          const percent = Math.min(Math.round((item.spent / item.budget) * 100), 100);
          const overBudget = item.spent > item.budget;
          const remaining = item.budget - item.spent;

          return (
            <View key={item.name} style={styles.budgetCard}>
              <View style={styles.budgetTop}>
                <View style={styles.budgetTitleRow}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                  <Text style={styles.budgetName}>{item.name}</Text>
                </View>

                <Text style={[styles.statusText, overBudget && { color: COLORS.red }]}>
                  {overBudget ? `$${Math.abs(remaining)} over budget` : `${Math.round((remaining / item.budget) * 100)}% remaining`}
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${percent}%`,
                      backgroundColor: overBudget ? COLORS.red : COLORS.primary,
                    },
                  ]}
                />
              </View>

              <View style={styles.budgetBottom}>
                <Text style={styles.amountText}>${item.spent} / ${item.budget}</Text>

                <Ionicons
                  name={overBudget ? "warning-outline" : "checkmark-circle-outline"}
                  size={20}
                  color={overBudget ? COLORS.red : COLORS.green}
                />
              </View>
            </View>
          );
        })}
      </View>
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
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
  },
  newButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  newButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  overviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 18,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: COLORS.muted,
    fontWeight: "700",
    marginBottom: 4,
  },
  totalSpent: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
  },
  totalBudget: {
    fontSize: 18,
    color: COLORS.muted,
  },
  remaining: {
    color: COLORS.green,
    fontWeight: "700",
    marginTop: 6,
  },
  circle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 9,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  categoryTabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  tabPill: {
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.muted,
    fontWeight: "700",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  budgetList: {
    gap: 12,
    marginBottom: 120,
  },
  budgetCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
  },
  budgetTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emoji: {
    fontSize: 22,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  statusText: {
    color: COLORS.green,
    fontWeight: "700",
    fontSize: 12,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    marginTop: 14,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  budgetBottom: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountText: {
    color: COLORS.muted,
    fontWeight: "700",
  },
});