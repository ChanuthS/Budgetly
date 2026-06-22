import { COLORS } from "@/constants/colors";
import { getProfile } from "@/services/profileService";
import { getTransactions, Transaction } from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const categories = [
  { emoji: "🛒", name: "Groceries", spent: 320, budget: 400, color: COLORS.primary },
  { emoji: "🍽️", name: "Dining", spent: 210, budget: 250, color: COLORS.orange },
  { emoji: "🚗", name: "Transport", spent: 95, budget: 150, color: COLORS.green },
  { emoji: "🎭", name: "Entertainment", spent: 145, budget: 200, color: COLORS.primary },
];

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function formatTransactionAmount(amount: number, type: "income" | "expense") {
  return type === "income" ? `+$${amount.toFixed(2)}` : `$${amount.toFixed(2)}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

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
  const recentTransactions = transactions.slice(0, 4);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
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

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>

          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <View style={[styles.smallIcon, { backgroundColor: "rgba(20,184,151,0.2)" }]}>
                <Ionicons name="trending-up" size={16} color={COLORS.green} />
              </View>
              <View>
                <Text style={styles.balanceSubLabel}>Income</Text>
                <Text style={styles.balanceSubAmount}>
                  {formatCurrency(totalIncome)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.balanceItem}>
              <View style={[styles.smallIcon, { backgroundColor: "rgba(239,68,68,0.2)" }]}>
                <Ionicons name="trending-down" size={16} color={COLORS.red} />
              </View>
              <View>
                <Text style={styles.balanceSubLabel}>Spent</Text>
                <Text style={styles.balanceSubAmount}>
                  {formatCurrency(totalExpenses)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.budgetCard}>
          <View style={styles.ring}>
            <Text style={styles.ringText}>
              {totalExpenses > 0 ? "68%" : "0%"}
            </Text>
          </View>

          <View>
            <Text style={styles.cardLabel}>Monthly Budget</Text>
            <Text style={styles.budgetAmount}>
              {formatCurrency(totalExpenses)}{" "}
              <Text style={styles.budgetTotal}>/ $2,700</Text>
            </Text>
            <Text style={styles.onTrack}>
              ● {totalExpenses > 0 ? "Budget tracking active" : "No spending yet"}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((item) => {
            const percent = Math.round((item.spent / item.budget) * 100);

            return (
              <View key={item.name} style={styles.categoryCard}>
                <View style={styles.categoryTop}>
                  <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                  <Text style={styles.categoryPercent}>{percent}%</Text>
                </View>

                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryAmount}>
                  ${item.spent} / ${item.budget}
                </Text>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${percent}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        {recentTransactions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No recent transactions</Text>
            <Text style={styles.emptyText}>
              Add your first transaction from the Add tab.
            </Text>
          </View>
        ) : (
          <View style={styles.transactionList}>
            {recentTransactions.map((item) => (
              <View key={item.id} style={styles.transactionRow}>
                <View style={styles.transactionIcon}>
                  <Text>{item.emoji || "💰"}</Text>
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>
                    {item.description || item.category}
                  </Text>
                  <Text style={styles.transactionSubtitle}>
                    {item.category} · {formatDate(item.transaction_date)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.transactionAmount,
                    item.type === "income" && { color: COLORS.green },
                  ]}
                >
                  {formatTransactionAmount(Number(item.amount), item.type)}
                </Text>
              </View>
            ))}
          </View>
        )}
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
  balanceCard: {
    marginTop: 28,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 24,
    padding: 22,
  },
  balanceLabel: {
    color: "#A8AEC4",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
    marginTop: 10,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  balanceItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  smallIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceSubLabel: {
    color: "#A8AEC4",
    fontSize: 12,
  },
  balanceSubAmount: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 38,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 12,
  },
  content: {
    padding: 20,
    paddingBottom: 110,
  },
  budgetCard: {
    marginTop: -6,
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  ring: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 9,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
  },
  cardLabel: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: "600",
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 4,
  },
  budgetTotal: {
    fontSize: 16,
    color: COLORS.muted,
  },
  onTrack: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  seeAll: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
  },
  categoryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryPercent: {
    color: COLORS.muted,
    fontWeight: "700",
  },
  categoryName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 14,
  },
  categoryAmount: {
    color: COLORS.muted,
    marginTop: 4,
  },
  progressTrack: {
    height: 5,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  transactionList: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: "hidden",
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F5",
  },
  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F2F4F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  transactionSubtitle: {
    color: COLORS.muted,
    marginTop: 3,
  },
  transactionAmount: {
    fontWeight: "800",
    color: COLORS.text,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
  },
  emptyText: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 6,
  },
});