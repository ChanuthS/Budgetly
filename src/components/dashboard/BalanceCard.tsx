import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export default function BalanceCard({
  totalBalance,
  totalIncome,
  totalExpenses,
  colors,
}: {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  colors: any;
}) {
  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>

      <Text style={styles.balanceAmount}>
        {formatCurrency(totalBalance)}
      </Text>

      <View style={styles.balanceRow}>
        <View style={styles.balanceItem}>
          <View
            style={[
              styles.smallIcon,
              { backgroundColor: "rgba(20,184,151,0.2)" },
            ]}
          >
            <Ionicons
              name="trending-up"
              size={16}
              color={colors.green}
            />
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
          <View
            style={[
              styles.smallIcon,
              { backgroundColor: "rgba(239,68,68,0.2)" },
            ]}
          >
            <Ionicons
              name="trending-down"
              size={16}
              color={colors.red}
            />
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
  );
}

const styles = StyleSheet.create({
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
});