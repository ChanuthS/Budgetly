import { COLORS } from "@/constants/colors";
import {
  deleteTransaction,
  getTransactions,
  Transaction,
  TransactionType,
  updateTransaction,
} from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
  { emoji: "🛒", name: "Groceries" },
  { emoji: "🍽️", name: "Dining" },
  { emoji: "🚗", name: "Transport" },
  { emoji: "🎭", name: "Entertainment" },
  { emoji: "🏥", name: "Health" },
  { emoji: "🏠", name: "Housing" },
  { emoji: "📦", name: "Shopping" },
  { emoji: "⚡", name: "Utilities" },
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(
    null
  );

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState<TransactionType>("expense");
  const [editCategory, setEditCategory] = useState(categories[0]);
  const [savingEdit, setSavingEdit] = useState(false);

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
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmAndDelete(id),
        },
      ]
    );
  }

  function openEditModal(transaction: Transaction) {
    const matchingCategory =
      categories.find((item) => item.name === transaction.category) ||
      categories[0];

    setEditingTransaction(transaction);
    setEditAmount(String(Number(transaction.amount)));
    setEditDescription(transaction.description || "");
    setEditType(transaction.type);
    setEditCategory(matchingCategory);
  }

  function closeEditModal() {
    setEditingTransaction(null);
    setEditAmount("");
    setEditDescription("");
    setEditType("expense");
    setEditCategory(categories[0]);
  }

  async function handleSaveEdit() {
    if (!editingTransaction) return;

    const numericAmount = Number(editAmount);

    if (!editAmount || numericAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter an amount greater than 0.");
      return;
    }

    if (!editDescription.trim()) {
      Alert.alert("Missing description", "Please enter a short description.");
      return;
    }

    try {
      setSavingEdit(true);

      await updateTransaction({
        id: editingTransaction.id,
        amount: numericAmount,
        type: editType,
        category: editCategory.name,
        emoji: editCategory.emoji,
        description: editDescription.trim(),
        transactionDate: editingTransaction.transaction_date,
      });

      closeEditModal();
      await loadTransactions();
    } catch (error: any) {
      Alert.alert("Update failed", error.message);
    } finally {
      setSavingEdit(false);
    }
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

  const filteredTransactions = transactions.filter((item) => {
    const search = searchQuery.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      item.category.toLowerCase().includes(search) ||
      (item.description ?? "").toLowerCase().includes(search) ||
      item.type.toLowerCase().includes(search) ||
      String(item.amount).includes(search)
    );
  });

  return (
    <>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color={COLORS.muted} />
            <TextInput
              placeholder="Search transactions..."
              placeholderTextColor={COLORS.muted}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color={COLORS.muted} />
              </TouchableOpacity>
            )}
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
        ) : filteredTransactions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptyText}>
              Try searching by category, description, type, or amount.
            </Text>
          </View>
        ) : (
          <View style={styles.listCard}>
            {filteredTransactions.map((item) => (
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

                {item.receipt_url && (
                  <TouchableOpacity
                    style={styles.receiptButton}
                    onPress={() => setSelectedReceiptUrl(item.receipt_url)}
                  >
                    <Ionicons
                      name="receipt-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openEditModal(item)}
                >
                  <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>

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

      <Modal
        visible={!!selectedReceiptUrl}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedReceiptUrl(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.receiptModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Receipt</Text>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSelectedReceiptUrl(null)}
              >
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {selectedReceiptUrl && (
              <Image
                source={{ uri: selectedReceiptUrl }}
                style={styles.receiptImage}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!editingTransaction}
        transparent
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.editModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Transaction</Text>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeEditModal}
              >
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.typeSwitch}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  editType === "expense" && styles.activeType,
                ]}
                onPress={() => setEditType("expense")}
              >
                <Text
                  style={
                    editType === "expense"
                      ? styles.activeTypeText
                      : styles.typeText
                  }
                >
                  expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  editType === "income" && styles.activeType,
                ]}
                onPress={() => setEditType("income")}
              >
                <Text
                  style={
                    editType === "income"
                      ? styles.activeTypeText
                      : styles.typeText
                  }
                >
                  income
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.editLabel}>Amount</Text>
            <TextInput
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="decimal-pad"
              style={styles.editInput}
              placeholder="0.00"
              placeholderTextColor={COLORS.muted}
            />

            <Text style={styles.editLabel}>Description</Text>
            <TextInput
              value={editDescription}
              onChangeText={setEditDescription}
              style={styles.editInput}
              placeholder="Description"
              placeholderTextColor={COLORS.muted}
            />

            <Text style={styles.editLabel}>Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((item) => {
                const selected = editCategory.name === item.name;

                return (
                  <TouchableOpacity
                    key={item.name}
                    style={[
                      styles.categoryPill,
                      selected && styles.selectedCategory,
                    ]}
                    onPress={() => setEditCategory(item)}
                  >
                    <Text style={styles.categoryText}>
                      {item.emoji} {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.saveEditButton, savingEdit && styles.disabledButton]}
              onPress={handleSaveEdit}
              disabled={savingEdit}
            >
              <Text style={styles.saveEditText}>
                {savingEdit ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  receiptButton: {
    marginLeft: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#ECEBFF",
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    marginLeft: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#ECEBFF",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    marginLeft: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  receiptModal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 16,
  },
  editModal: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F4F8",
    alignItems: "center",
    justifyContent: "center",
  },
  receiptImage: {
    width: "100%",
    height: 420,
    borderRadius: 16,
    backgroundColor: "#F2F4F8",
  },
  editLabel: {
    color: COLORS.muted,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.text,
  },
  typeSwitch: {
    backgroundColor: "#E8EBF3",
    borderRadius: 999,
    padding: 5,
    flexDirection: "row",
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 999,
    alignItems: "center",
  },
  activeType: {
    backgroundColor: COLORS.card,
  },
  activeTypeText: {
    color: COLORS.text,
    fontWeight: "800",
  },
  typeText: {
    color: COLORS.muted,
    fontWeight: "700",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryPill: {
    backgroundColor: "#F2F4F8",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  selectedCategory: {
    backgroundColor: "#ECEBFF",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontWeight: "700",
    color: COLORS.text,
  },
  saveEditButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveEditText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
});