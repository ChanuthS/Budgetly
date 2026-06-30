import { COLORS } from "@/constants/colors";
import { extractReceiptText, parseReceiptText } from "@/services/ocrService";
import { uploadReceipt } from "@/services/receiptService";
import { createTransaction, TransactionType } from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
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

export default function AddExpenseScreen() {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanningReceipt, setScanningReceipt] = useState(false);

  function formatDate(date: Date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  async function pickReceipt() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo library access to attach a receipt."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setReceiptUri(uri);

      try {
        setScanningReceipt(true);

        const rawText = await extractReceiptText(uri);
        const parsed = parseReceiptText(rawText);

        if (parsed.amount) {
          setAmount(parsed.amount);
        }

        if (parsed.merchant) {
          setDescription(parsed.merchant);
        }

        Alert.alert("Receipt scanned", "Budgetly filled in what it could.");
      } catch (error: any) {
        console.log("OCR ERROR:", error);

        Alert.alert(
          "Receipt attached",
          "The receipt was attached, but OCR could not read it. You can still enter the details manually."
        );
      } finally {
        setScanningReceipt(false);
      }
    }
  }

  async function handleSave() {
    const numericAmount = Number(amount);

    if (!amount || numericAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter an amount greater than 0.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Missing description", "Please enter a short description.");
      return;
    }

    try {
      setLoading(true);

      let receiptUrl: string | null = null;

      if (receiptUri) {
        receiptUrl = await uploadReceipt(receiptUri);
      }

      await createTransaction({
        amount: numericAmount,
        type,
        category: selectedCategory.name,
        emoji: selectedCategory.emoji,
        description: description.trim(),
        transactionDate: selectedDate.toISOString().split("T")[0],
        receiptUrl,
      });

      setAmount("");
      setDescription("");
      setType("expense");
      setSelectedCategory(categories[0]);
      setSelectedDate(new Date());
      setReceiptUri(null);

      Alert.alert("Success", "Transaction saved.");
      router.push("/(tabs)/transactions");
    } catch (error: any) {
      console.log("Save Error:", error);
      Alert.alert("Save failed", error?.message || JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }

  const isBusy = loading || scanningReceipt;

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>New Entry</Text>

          <TouchableOpacity
            style={[styles.saveButton, isBusy && styles.disabledButton]}
            onPress={handleSave}
            disabled={isBusy}
          >
            <Text style={styles.saveText}>
              {loading ? "Saving..." : scanningReceipt ? "Scanning..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.typeSwitch}>
          <TouchableOpacity
            style={[styles.typeButton, type === "expense" && styles.activeType]}
            onPress={() => setType("expense")}
            disabled={isBusy}
          >
            <Text style={type === "expense" ? styles.activeTypeText : styles.typeText}>
              expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, type === "income" && styles.activeType]}
            onPress={() => setType("income")}
            disabled={isBusy}
          >
            <Text style={type === "income" ? styles.activeTypeText : styles.typeText}>
              income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.label}>Amount</Text>

          <View style={styles.amountInputRow}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={COLORS.muted}
              keyboardType="decimal-pad"
              style={styles.amountInput}
              editable={!isBusy}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>

          <View style={styles.categoryGrid}>
            {categories.map((item) => {
              const selected = selectedCategory.name === item.name;

              return (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.categoryPill, selected && styles.selectedCategory]}
                  onPress={() => setSelectedCategory(item)}
                  disabled={isBusy}
                >
                  <Text style={styles.categoryText}>
                    {item.emoji} {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Whole Foods Market"
            placeholderTextColor={COLORS.muted}
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            editable={!isBusy}
          />
        </View>

        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => setShowDatePicker(true)}
          disabled={isBusy}
        >
          <View>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.rowValue}>{formatDate(selectedDate)}</Text>
          </View>

          <Ionicons name="calendar-outline" size={22} color={COLORS.muted} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              setShowDatePicker(false);

              if (date) {
                setSelectedDate(date);
              }
            }}
          />
        )}

        <TouchableOpacity
          style={styles.cardRow}
          onPress={pickReceipt}
          disabled={isBusy}
        >
          <View>
            <Text style={styles.label}>Receipt</Text>
            <Text style={styles.rowValue}>
              {scanningReceipt
                ? "Scanning receipt..."
                : receiptUri
                  ? "Receipt attached"
                  : "Attach photo"}
            </Text>
          </View>

          <Ionicons name="camera-outline" size={22} color={COLORS.muted} />
        </TouchableOpacity>

        {receiptUri && (
          <View style={styles.previewCard}>
            <Image source={{ uri: receiptUri }} style={styles.receiptPreview} />

            <TouchableOpacity
              style={styles.removeReceiptButton}
              onPress={() => setReceiptUri(null)}
              disabled={isBusy}
            >
              <Ionicons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.primaryButton, isBusy && styles.disabledButton]}
          onPress={handleSave}
          disabled={isBusy}
        >
          <Text style={styles.primaryButtonText}>
            {loading
              ? "Saving..."
              : scanningReceipt
                ? "Scanning receipt..."
                : "Save Transaction"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  saveText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  typeSwitch: {
    backgroundColor: "#E8EBF3",
    borderRadius: 999,
    padding: 5,
    flexDirection: "row",
    marginBottom: 18,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
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
  amountCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "700",
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dollarSign: {
    fontSize: 52,
    fontWeight: "800",
    color: COLORS.text,
    marginRight: 4,
  },
  amountInput: {
    fontSize: 52,
    fontWeight: "800",
    color: COLORS.text,
    minWidth: 140,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryPill: {
    backgroundColor: "#F2F4F8",
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 14,
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
  input: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    paddingVertical: 4,
  },
  cardRow: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  previewCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 12,
    marginBottom: 16,
    position: "relative",
  },
  receiptPreview: {
    width: "100%",
    height: 180,
    borderRadius: 16,
  },
  removeReceiptButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 120,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});