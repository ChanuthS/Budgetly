import DonutChart from "@/components/dashboard/DonutChart";
import { COLORS } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

export type DashboardCategory = {
  name: string;
  spent: number;
  emoji: string;
  color: string;
};

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

type SpendingAnalyticsCardProps = {
  topCategories: DashboardCategory[];
  topCategory?: DashboardCategory;
  totalExpenses: number;
  colors: any;
};

export default function SpendingAnalyticsCard({
  topCategories,
  topCategory,
  totalExpenses,
  colors,
}: SpendingAnalyticsCardProps) {
  return (
    <View style={styles.analyticsCard}>
      <View style={styles.analyticsTop}>
        <View>
          <Text style={styles.analyticsLabel}>Top Category</Text>
          <Text style={styles.analyticsTitle}>
            {topCategory
              ? `${topCategory.emoji} ${topCategory.name}`
              : "No spending yet"}
          </Text>
          <Text style={[styles.analyticsValue, { color: colors.primary }]}>
            {topCategory ? formatCurrency(topCategory.spent) : "$0.00"}
          </Text>
        </View>

        <DonutChart
          categories={topCategories}
          total={totalExpenses}
          colors={colors}
        />
      </View>

      <View style={styles.legendList}>
        {topCategories.length === 0 ? (
          <Text style={styles.emptyText}>
            Add expenses to see category analytics.
          </Text>
        ) : (
          topCategories.map((item) => {
            const percent =
              totalExpenses > 0
                ? Math.round((item.spent / totalExpenses) * 100)
                : 0;

            return (
              <View key={item.name} style={styles.legendRow}>
                <View style={styles.legendLeft}>
                  <View
                    style={[styles.legendDot, { backgroundColor: item.color }]}
                  />
                  <Text style={styles.legendName}>
                    {item.emoji} {item.name}
                  </Text>
                </View>

                <View style={styles.legendRight}>
                  <Text style={styles.legendAmount}>
                    {formatCurrency(item.spent)}
                  </Text>
                  <Text style={styles.legendPercent}>{percent}%</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 26,
    fontWeight: "900",
    marginTop: 6,
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
  emptyText: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 6,
  },
});
