import { EmptyState } from "@/components/common";
import { COLORS } from "@/constants/colors";
import { Transaction } from "@/services/transactionService";
import { StyleSheet, Text, View } from "react-native";

function formatTransactionAmount(amount: number, type: "income" | "expense") {
  return type === "income" ? `+$${amount.toFixed(2)}` : `$${amount.toFixed(2)}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type RecentTransactionsProps = {
  transactions: Transaction[];
  colors: any;
};

export default function RecentTransactions({
  transactions,
  colors,
}: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No recent transactions"
        message="Add your first transaction from the Add tab."
      />
    );
  }

  return (
    <View style={styles.transactionList}>
      {transactions.map((item) => (
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
              item.type === "income" && { color: colors.green },
            ]}
          >
            {formatTransactionAmount(Number(item.amount), item.type)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
