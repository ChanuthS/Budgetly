import { EmptyState } from "@/components/common";
import { COLORS } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

type DashboardCategory = {
  name: string;
  spent: number;
  emoji: string;
  color: string;
};

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

type TopCategoriesProps = {
  categories: DashboardCategory[];
  totalExpenses: number;
  colors: any;
};

export default function TopCategories({
  categories,
  totalExpenses,
  colors: _colors,
}: TopCategoriesProps) {
  return (
    <View style={styles.categoryGrid}>
      {categories.length === 0 ? (
        <EmptyState
          title="No spending yet"
          message="Add expenses to see category analytics."
        />
      ) : (
        categories.map((item) => {
          const percent =
            totalExpenses > 0
              ? Math.round((item.spent / totalExpenses) * 100)
              : 0;

          return (
            <View key={item.name} style={styles.categoryCard}>
              <View style={styles.categoryTop}>
                <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                <Text style={styles.categoryPercent}>{percent}%</Text>
              </View>

              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.categoryAmount}>
                {formatCurrency(item.spent)}
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
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
