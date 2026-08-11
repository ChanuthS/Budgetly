import {
  LoadingState,
  SectionHeader,
} from "@/components/common";
import BalanceCard from "@/components/dashboard/BalanceCard";
import FinancialHealthCard from "@/components/dashboard/FinancialHealthCard";
import MonthlyBudgetCard from "@/components/dashboard/MonthlyBudgetCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import SpendingAnalyticsCard from "@/components/dashboard/SpendingAnalyticsCard";
import SpendingTrendCard from "@/components/dashboard/SpendingTrendCard";
import TopCategories from "@/components/dashboard/TopCategories";
import { COLORS } from "@/constants/colors";
import { calculateFinancialHealthScore } from "@/services/healthScoreService";
import { getProfile } from "@/services/profileService";
import { getTransactions, Transaction } from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

function getCategoryEmoji(category: string) {
  const emojis: Record<string, string> = {
    Groceries: "🛒",
    Dining: "🍽️",
    Transport: "🚗",
    Entertainment: "🎭",
    Health: "🏥",
    Housing: "🏠",
    Shopping: "📦",
    Utilities: "⚡",
  };

  return emojis[category] || "💰";
}

const chartColors = ["#6C63FF", "#F59E0B", "#14B897", "#EF4444"];

export default function DashboardScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profileName, setProfileName] = useState("Budgetly User");
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [transactionData, profileData] = await Promise.all([
        getTransactions(),
        getProfile(),
      ]);

      setTransactions(transactionData);

      if (profileData?.full_name) {
        setProfileName(profileData.full_name);
      }
    } catch (error) {
      console.log("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalBalance = totalIncome - totalExpenses;
  const healthScore = calculateFinancialHealthScore(transactions);
  const recentTransactions = transactions.slice(0, 4);

  const expenseTransactions = transactions.filter((item) => item.type === "expense");

  const spendingByCategory = expenseTransactions.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
      return acc;
    },
    {}
  );

  const topCategories = Object.entries(spendingByCategory)
    .map(([name, spent], index) => ({
      name,
      spent,
      emoji: getCategoryEmoji(name),
      color: chartColors[index % chartColors.length],
    }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 4);

  const topCategory = topCategories[0];

  const budgetLimit = 2700;
  const budgetPercent = Math.min(Math.round((totalExpenses / budgetLimit) * 100), 100);

  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{profileName}</Text>
        </View>

        <View style={styles.bellButton}>
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          <View style={styles.notificationDot} />
        </View>

        <BalanceCard
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          colors={COLORS}
        />
      </View>

      <View style={styles.content}>
        <FinancialHealthCard healthScore={healthScore} colors={COLORS} />

        <MonthlyBudgetCard
          totalExpenses={totalExpenses}
          budgetLimit={budgetLimit}
          budgetPercent={budgetPercent}
          colors={COLORS}
        />

        <SectionHeader title="Spending Insights" />

        <SpendingAnalyticsCard
          topCategories={topCategories}
          topCategory={topCategory}
          totalExpenses={totalExpenses}
          colors={COLORS}
        />

        <SectionHeader title="Spending Trend" />

        <SpendingTrendCard
          transactions={expenseTransactions}
          totalExpenses={totalExpenses}
          colors={COLORS}
        />

        <SectionHeader title="Top Categories" actionText="See all" />

        <TopCategories
          categories={topCategories}
          totalExpenses={totalExpenses}
          colors={COLORS}
        />

        <SectionHeader title="Recent Transactions" actionText="See all" />

        <RecentTransactions transactions={recentTransactions} colors={COLORS} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 34,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  greeting: {
    color: "#A8AEC4",
    fontSize: 15,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },
  bellButton: {
    position: "absolute",
    top: 54,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.red,
  },
  content: {
    padding: 20,
    paddingBottom: 110,
  },
});
