import { COLORS } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

type MonthlyBudgetCardProps = {
  totalExpenses: number;
  budgetLimit: number;
  budgetPercent: number;
  colors: any;
};

export default function MonthlyBudgetCard({
  totalExpenses,
  budgetLimit,
  budgetPercent,
  colors,
}: MonthlyBudgetCardProps) {
  return (
    <View style={styles.insightCard}>
      <View>
        <Text style={styles.insightLabel}>Monthly Budget</Text>
        <Text style={styles.insightAmount}>{formatCurrency(totalExpenses)}</Text>
        <Text style={styles.insightSubtext}>
          of {formatCurrency(budgetLimit)} used
        </Text>
      </View>

      <View style={[styles.miniRing, { borderColor: colors.primary }]}>
        <Text style={[styles.miniRingText, { color: colors.primary }]}>
          {budgetPercent}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    alignItems: "center",
    justifyContent: "center",
  },
  miniRingText: {
    fontWeight: "900",
  },
});
