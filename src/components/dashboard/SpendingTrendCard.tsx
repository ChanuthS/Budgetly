import LineTrendChart from "@/components/dashboard/LineTrendChart";
import { COLORS } from "@/constants/colors";
import { Transaction } from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

type SpendingTrendCardProps = {
  transactions: Transaction[];
  totalExpenses: number;
  colors: any;
};

export default function SpendingTrendCard({
  transactions,
  totalExpenses,
  colors,
}: SpendingTrendCardProps) {
  return (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <View>
          <Text style={styles.trendLabel}>Recent expense activity</Text>
          <Text style={styles.trendAmount}>{formatCurrency(totalExpenses)}</Text>
        </View>

        <View style={styles.trendBadge}>
          <Ionicons name="analytics-outline" size={16} color={colors.primary} />
          <Text style={[styles.trendBadgeText, { color: colors.primary }]}>
            Live
          </Text>
        </View>
      </View>

      <LineTrendChart transactions={transactions} colors={colors} />
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontWeight: "900",
    fontSize: 12,
  },
});
