import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";


const categories = [
  { emoji: "🛒", name: "Groceries", spent: 320, budget: 400, color: COLORS.primary },
  { emoji: "🍽️", name: "Dining", spent: 210, budget: 250, color: COLORS.orange },
  { emoji: "🚗", name: "Transport", spent: 95, budget: 150, color: COLORS.green },
  { emoji: "🎭", name: "Entertainment", spent: 145, budget: 200, color: COLORS.primary },
];

const transactions = [
  { emoji: "🛒", title: "Whole Foods", subtitle: "Groceries · Today", amount: "$84.32" },
  { emoji: "☕", title: "Blue Bottle Coffee", subtitle: "Dining · Today", amount: "$6.50" },
  { emoji: "💼", title: "Salary Deposit", subtitle: "Income · Jun 15", amount: "+$3200.00", income: true },
  { emoji: "🎬", title: "Netflix", subtitle: "Subscriptions · Jun 14", amount: "$15.99" },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>Sarah Chen</Text>
        </View>

        <View style={styles.bellButton}>
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          <View style={styles.notificationDot} />
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
          <Text style={styles.balanceAmount}>$8,432.50</Text>

          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <View style={[styles.smallIcon, { backgroundColor: "rgba(20,184,151,0.2)" }]}>
                <Ionicons name="trending-up" size={16} color={COLORS.green} />
              </View>
              <View>
                <Text style={styles.balanceSubLabel}>Income</Text>
                <Text style={styles.balanceSubAmount}>$3,200</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.balanceItem}>
              <View style={[styles.smallIcon, { backgroundColor: "rgba(239,68,68,0.2)" }]}>
                <Ionicons name="trending-down" size={16} color={COLORS.red} />
              </View>
              <View>
                <Text style={styles.balanceSubLabel}>Spent</Text>
                <Text style={styles.balanceSubAmount}>$1,847</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.budgetCard}>
          <View style={styles.ring}>
            <Text style={styles.ringText}>68%</Text>
          </View>

          <View>
            <Text style={styles.cardLabel}>Monthly Budget</Text>
            <Text style={styles.budgetAmount}>
              $1,847 <Text style={styles.budgetTotal}>/ $2,700</Text>
            </Text>
            <Text style={styles.onTrack}>● 68% used — on track</Text>
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

        <View style={styles.transactionList}>
          {transactions.map((item) => (
            <View key={item.title} style={styles.transactionRow}>
              <View style={styles.transactionIcon}>
                <Text>{item.emoji}</Text>
              </View>

              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionSubtitle}>{item.subtitle}</Text>
              </View>

              <Text
                style={[
                  styles.transactionAmount,
                  item.income && { color: COLORS.green },
                ]}
              >
                {item.amount}
              </Text>
            </View>
          ))}
        </View>
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
});