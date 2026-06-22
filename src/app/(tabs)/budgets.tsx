import { COLORS } from "@/constants/colors";
import { getCurrentMonthTransactions } from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const budgetLimits = [
  { emoji: "🛒", name: "Groceries", budget: 400 },
  { emoji: "🍽️", name: "Dining", budget: 250 },
  { emoji: "🚗", name: "Transport", budget: 150 },
  { emoji: "🎭", name: "Entertainment", budget: 200 },
  { emoji: "🏥", name: "Health", budget: 200 },
  { emoji: "🏠", name: "Housing", budget: 1200 },
  { emoji: "📦", name: "Shopping", budget: 300 },
  { emoji: "⚡", name: "Utilities", budget: 220 },
];

export default function BudgetsScreen() {
  const [spentByCategory, setSpentByCategory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  async function loadBudgets() {
    try {
      setLoading(true);
      const transactions = await getCurrentMonthTransactions();

      const totals: Record<string, number> = {};

      transactions.forEach((transaction) => {
        const category = transaction.category;
        totals[category] = (totals[category] || 0) + Number(transaction.amount);
      });

      setSpentByCategory(totals);
    } catch (error) {
      console.log("Budget load error:", error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadBudgets();
    }, [])
  );

  const totalSpent = budgetLimits.reduce((sum, item) => {
    return sum + (spentByCategory[item.name] || 0);
  }, 0);

  const totalBudget = budgetLimits.reduce((sum, item) => sum + item.budget, 0);
  const remainingTotal = totalBudget - totalSpent;
  const totalPercent = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);

  const monthLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading budgets...</Text>
      </View>
    );
  }

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
        <Text style={styles.overviewTitle}>{monthLabel} Overview</Text>

        <View style={styles.overviewRow}>
          <View>
            <Text style={styles.label}>Total Spent</Text>
            <Text style={styles.totalSpent}>
              ${totalSpent.toFixed(0)}{" "}
              <Text style={styles.totalBudget}>/ {totalBudget.toFixed(0)}</Text>
            </Text>
            <Text
              style={[
                styles.remaining,
                remainingTotal < 0 && { color: COLORS.red },
              ]}
            >
              {remainingTotal >= 0
                ? `$${remainingTotal.toFixed(0)} remaining this month`
                : `$${Math.abs(remainingTotal).toFixed(0)} over budget`}
            </Text>
          </View>

          <View
            style={[
              styles.circle,
              totalSpent > totalBudget && { borderColor: COLORS.red },
            ]}
          >
            <Text
              style={[
                styles.circleText,
                totalSpent > totalBudget && { color: COLORS.red },
              ]}
            >
              {totalPercent}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.categoryTabs}>
        {budgetLimits.slice(0, 4).map((item, index) => (
          <View
            key={item.name}
            style={[styles.tabPill, index === 0 && styles.activeTab]}
          >
            <Text style={[styles.tabText, index === 0 && styles.activeTabText]}>
              {item.name}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.budgetList}>
        {budgetLimits.map((item) => {
          const spent = spentByCategory[item.name] || 0;
          const percent = Math.min(Math.round((spent / item.budget) * 100), 100);
          const overBudget = spent > item.budget;
          const remaining = item.budget - spent;

          return (
            <View key={item.name} style={styles.budgetCard}>
              <View style={styles.budgetTop}>
                <View style={styles.budgetTitleRow}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                  <Text style={styles.budgetName}>{item.name}</Text>
                </View>

                <Text style={[styles.statusText, overBudget && { color: COLORS.red }]}>
                  {overBudget
                    ? `$${Math.abs(remaining).toFixed(0)} over budget`
                    : `${Math.round((remaining / item.budget) * 100)}% remaining`}
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
                <Text style={styles.amountText}>
                  ${spent.toFixed(0)} / ${item.budget}
                </Text>

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
  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: 10,
  },
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