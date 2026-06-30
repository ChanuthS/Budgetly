import { COLORS } from "@/constants/colors";
import { useAppTheme } from "@/context/ThemeContext";
import { calculateFinancialHealthScore } from "@/services/healthScoreService";
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
import Svg, { Circle, G, Line, Path } from "react-native-svg";

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function formatTransactionAmount(amount: number, type: "income" | "expense") {
  return type === "income" ? `+$${amount.toFixed(2)}` : `$${amount.toFixed(2)}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

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
  const { mode } = useAppTheme();
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
                <Text style={styles.balanceSubAmount}>{formatCurrency(totalIncome)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.balanceItem}>
              <View style={[styles.smallIcon, { backgroundColor: "rgba(239,68,68,0.2)" }]}>
                <Ionicons name="trending-down" size={16} color={COLORS.red} />
              </View>
              <View>
                <Text style={styles.balanceSubLabel}>Spent</Text>
                <Text style={styles.balanceSubAmount}>{formatCurrency(totalExpenses)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
      <View style={styles.healthCard}>
  <View>
    <Text style={styles.healthLabel}>Financial Health</Text>

    <Text style={styles.healthScore}>
      {healthScore.score}
      <Text style={styles.healthOutOf}> / 100</Text>
    </Text>

    <Text style={styles.healthStatus}>
      {healthScore.label}
    </Text>

    <Text style={styles.healthMessage}>
      {healthScore.message}
    </Text>
  </View>

  <View style={styles.healthRing}>
    <Text style={styles.healthRingText}>
      {healthScore.savingsRate}%
    </Text>

    <Text style={styles.healthRingLabel}>
      saved
    </Text>
  </View>
</View>
        <View style={styles.insightCard}>
          <View>
            <Text style={styles.insightLabel}>Monthly Budget</Text>
            <Text style={styles.insightAmount}>{formatCurrency(totalExpenses)}</Text>
            <Text style={styles.insightSubtext}>
              of {formatCurrency(budgetLimit)} used
            </Text>
          </View>

          <View style={styles.miniRing}>
            <Text style={styles.miniRingText}>{budgetPercent}%</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spending Insights</Text>
        </View>

        <View style={styles.analyticsCard}>
          <View style={styles.analyticsTop}>
            <View>
              <Text style={styles.analyticsLabel}>Top Category</Text>
              <Text style={styles.analyticsTitle}>
                {topCategory ? `${topCategory.emoji} ${topCategory.name}` : "No spending yet"}
              </Text>
              <Text style={styles.analyticsValue}>
                {topCategory ? formatCurrency(topCategory.spent) : "$0.00"}
              </Text>
            </View>

            <DonutChart categories={topCategories} total={totalExpenses} />
          </View>

          <View style={styles.legendList}>
            {topCategories.length === 0 ? (
              <Text style={styles.emptyText}>Add expenses to see category analytics.</Text>
            ) : (
              topCategories.map((item) => {
                const percent =
                  totalExpenses > 0 ? Math.round((item.spent / totalExpenses) * 100) : 0;

                return (
                  <View key={item.name} style={styles.legendRow}>
                    <View style={styles.legendLeft}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendName}>
                        {item.emoji} {item.name}
                      </Text>
                    </View>

                    <View style={styles.legendRight}>
                      <Text style={styles.legendAmount}>{formatCurrency(item.spent)}</Text>
                      <Text style={styles.legendPercent}>{percent}%</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spending Trend</Text>
        </View>

        <View style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <View>
              <Text style={styles.trendLabel}>Recent expense activity</Text>
              <Text style={styles.trendAmount}>{formatCurrency(totalExpenses)}</Text>
            </View>

            <View style={styles.trendBadge}>
              <Ionicons name="analytics-outline" size={16} color={COLORS.primary} />
              <Text style={styles.trendBadgeText}>Live</Text>
            </View>
          </View>

          <LineTrendChart transactions={expenseTransactions} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        <View style={styles.categoryGrid}>
          {topCategories.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No spending yet</Text>
              <Text style={styles.emptyText}>Add expenses to see category analytics.</Text>
            </View>
          ) : (
            topCategories.map((item) => {
              const percent =
                totalExpenses > 0 ? Math.round((item.spent / totalExpenses) * 100) : 0;

              return (
                <View key={item.name} style={styles.categoryCard}>
                  <View style={styles.categoryTop}>
                    <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                    <Text style={styles.categoryPercent}>{percent}%</Text>
                  </View>

                  <Text style={styles.categoryName}>{item.name}</Text>
                  <Text style={styles.categoryAmount}>{formatCurrency(item.spent)}</Text>

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
            })
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        {recentTransactions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No recent transactions</Text>
            <Text style={styles.emptyText}>Add your first transaction from the Add tab.</Text>
          </View>
        ) : (
          <View style={styles.transactionList}>
            {recentTransactions.map((item) => (
              <View key={item.id} style={styles.transactionRow}>
                <View style={styles.transactionIcon}>
                  <Text>{item.emoji || "💰"}</Text>
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{item.description || item.category}</Text>
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

function DonutChart({
  categories,
  total,
}: {
  categories: { name: string; spent: number; color: string }[];
  total: number;
}) {
  const size = 118;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <View style={styles.donutWrap}>
      <Svg width={size} height={size}>
      <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EEF0F5"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {categories.map((item) => {
            const percent = total > 0 ? item.spent / total : 0;
            const dash = percent * circumference;
            const currentOffset = offset;
            offset += dash;

            return (
              <Circle
                key={item.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-currentOffset}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>

      <View style={styles.donutCenter}>
        <Text style={styles.donutValue}>{categories.length}</Text>
        <Text style={styles.donutLabel}>cats</Text>
      </View>
    </View>
  );
}

function LineTrendChart({ transactions }: { transactions: Transaction[] }) {
  const width = 300;
  const height = 120;
  const padding = 16;

  const recent = transactions.slice(0, 7).reverse();
  const values = recent.length > 0 ? recent.map((item) => Number(item.amount)) : [0, 0, 0, 0];

  const max = Math.max(...values, 1);
  const min = 0;

  const points = values.map((value, index) => {
    const x =
      padding +
      (index * (width - padding * 2)) / Math.max(values.length - 1, 1);

    const y =
      height -
      padding -
      ((value - min) / (max - min || 1)) * (height - padding * 2);

    return { x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#EEF0F5" strokeWidth="2" />
      <Line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#F3F4F6" strokeWidth="2" />

      <Path d={path} stroke={COLORS.primary} strokeWidth="4" fill="transparent" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((point, index) => (
        <Circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="#FFFFFF"
          stroke={COLORS.primary}
          strokeWidth="3"
        />
      ))}
    </Svg>
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
  insightCard: {
    marginTop: -6,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  insightLabel: {
    color: COLORS.muted,
    fontWeight: "800",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  insightAmount: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 6,
  },
  insightSubtext: {
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: 4,
  },
  miniRing: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 9,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  miniRingText: {
    color: COLORS.primary,
    fontWeight: "900",
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  seeAll: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  analyticsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 26,
    padding: 20,
  },
  analyticsTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  analyticsLabel: {
    color: COLORS.muted,
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  analyticsTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
  },
  analyticsValue: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 6,
  },
  donutWrap: {
    width: 118,
    height: 118,
    alignItems: "center",
    justifyContent: "center",
  },
  donutCenter: {
    position: "absolute",
    alignItems: "center",
  },
  donutValue: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
  },
  donutLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "800",
  },
  legendList: {
    marginTop: 18,
    gap: 12,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendName: {
    color: COLORS.text,
    fontWeight: "800",
  },
  legendRight: {
    alignItems: "flex-end",
  },
  legendAmount: {
    color: COLORS.text,
    fontWeight: "900",
  },
  legendPercent: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  trendCard: {
    backgroundColor: COLORS.card,
    borderRadius: 26,
    padding: 20,
  },
  trendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  trendLabel: {
    color: COLORS.muted,
    fontWeight: "800",
  },
  trendAmount: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 4,
  },
  trendBadge: {
    backgroundColor: "#ECEBFF",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    height: 34,
  },
  trendBadgeText: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 12,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: 20,
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
    fontWeight: "800",
  },
  categoryName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 14,
  },
  categoryAmount: {
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: 4,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  transactionList: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
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
    fontWeight: "900",
    color: COLORS.text,
  },
  transactionSubtitle: {
    color: COLORS.muted,
    marginTop: 3,
  },
  transactionAmount: {
    fontWeight: "900",
    color: COLORS.text,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "900",
  },
  emptyText: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 6,
  },
  healthCard: {
    marginTop: -6,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  
  healthLabel: {
    color: COLORS.muted,
    fontWeight: "800",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  
  healthScore: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 6,
  },
  
  healthOutOf: {
    fontSize: 18,
    color: COLORS.muted,
  },
  
  healthStatus: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 16,
    marginTop: 4,
  },
  
  healthMessage: {
    color: COLORS.muted,
    marginTop: 6,
    maxWidth: 220,
    lineHeight: 20,
  },
  
  healthRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 10,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  
  healthRingText: {
    fontWeight: "900",
    color: COLORS.primary,
    fontSize: 16,
  },
  
  healthRingLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "700",
  },
});