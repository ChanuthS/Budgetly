import { COLORS } from "@/constants/colors";
import { transactions } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";



export default function TransactionsScreen() {
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
            <Text style={[styles.summaryValue, { color: COLORS.green }]}>+$3,650</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Out</Text>
            <Text style={[styles.summaryValue, { color: COLORS.red }]}>$1,847</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Net</Text>
            <Text style={[styles.summaryValue, { color: COLORS.green }]}>+$1,803</Text>
          </View>
        </View>
      </View>

      <View style={styles.listCard}>
        {transactions.map((item, index) => (
          <View key={`${item.title}-${index}`} style={styles.transactionRow}>
            <Text style={styles.date}>{item.date}</Text>

            <View style={styles.iconCircle}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>

            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionCategory}>{item.category}</Text>
            </View>

            <Text
              style={[
                styles.amount,
                item.type === "income" && { color: COLORS.green },
              ]}
            >
              {item.amount}
            </Text>
          </View>
        ))}
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
    fontSize: 18,
    fontWeight: "800",
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
    width: 48,
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
});