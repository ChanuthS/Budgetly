import { COLORS } from "@/constants/colors";
import {
  deleteTransaction,
  getTransactions,
  Transaction,
} from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function formatAmount(amount: number, type: "income" | "expense") {
  return type === "income" ? `+$${amount.toFixed(2)}` : `$${amount.toFixed(2)}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTransactions() {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (error: any) {
      Alert.alert("Error loading transactions", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function confirmAndDelete(id: string) {
    try {
      await deleteTransaction(id);
      await loadTransactions();
    } catch (error: any) {
      Alert.alert("Delete failed", error.message);
    }
  }

  async function handleDeleteTransaction(id: string) {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this transaction?"
      );

      if (confirmed) {
        await confirmAndDelete(id);
      }

      return;
    }

    Alert.alert(
      "Delete transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmAndDelete(id),
        },
      ]
    );
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const incomeTotal = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenseTotal = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const netTotal = incomeTotal - expenseTotal;

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={COLORS.muted} />
          <TextInput
            placeholder="Search transactions..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filterRow}>
          <View style={[styles.filterPill, styles.activePill]}>
            <Text style={styles.activePillText}>All</Text>
          </View>
          <View style={styles.filterPill}>
            <Text style={styles.pillText}>Income</Text>
          </View>
          <View style={styles.filterPill}>
            <Text style={styles.pillText}>Expense</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>In</Text>
            <Text style={[styles.summaryValue, { color: COLORS.green }]}>
              +${incomeTotal.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Out</Text>
            <Text style={[styles.summaryValue, { color: COLORS.red }]}>
              ${expenseTotal.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Net</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: netTotal >= 0 ? COLORS.green : COLORS.red },
              ]}
            >
              {netTotal >= 0 ? "+" : "-"}${Math.abs(netTotal).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No transactions yet</Text>
          <Text style={styles.emptyText}>
            Add your first expense or income from the Add tab.
          </Text>
        </View>
      ) : (
        <View style={styles.listCard}>
          {transactions.map((item) => (
            <View key={item.id} style={styles.transactionRow}>
              <Text style={styles.date}>{formatDate(item.transaction_date)}</Text>

              <View style={styles.iconCircle}>
                <Text style={styles.emoji}>{item.emoji || "💰"}</Text>
              </View>

              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>
                  {item.description || item.category}
                </Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
              </View>

              <Text
                style={[
                  styles.amount,
                  item.type === "income" && { color: COLORS.green },
                ]}
              >
                {formatAmount(Number(item.amount), item.type)}
              </Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTransaction(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color={COLORS.red} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 18,
  },
  searchBox: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  filterPill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: COLORS.card,
    borderRadius: 999,
  },
  activePill: {
    backgroundColor: COLORS.primary,
  },
  pillText: {
    color: COLORS.muted,
    fontWeight: "700",
  },
  activePillText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    color: COLORS.muted,
    fontWeight: "700",
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  loadingContainer: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.muted,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  emptyText: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 8,
  },
  listCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 110,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  date: {
    width: 54,
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F2F4F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  emoji: {
    fontSize: 19,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  transactionCategory: {
    color: COLORS.muted,
    marginTop: 3,
  },
  amount: {
    fontWeight: "800",
    color: COLORS.text,
  },
  deleteButton: {
    marginLeft: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
});