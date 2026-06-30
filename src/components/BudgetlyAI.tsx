import { COLORS } from "@/constants/colors";
import { askBudgetlyAI } from "@/services/aiService";
import { generateMonthlyPDFReport } from "@/services/reportService";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function BudgetlyAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi, I’m Penny 👋. Ask me how to save money, reduce spending, or generate your monthly report.",
    },
  ]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((current) => [
      ...current,
      { role: "user", text: userMessage },
    ]);

    setInput("");
    setLoading(true);

    try {
      const result = await askBudgetlyAI(userMessage);

      setMessages((current) => [
        ...current,
        { role: "assistant", text: result.response },
      ]);
    } catch (error: any) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            error?.message ||
            "Sorry, Penny had trouble responding. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleGeneratePDF() {
    try {
      setLoading(true);

      setMessages((current) => [
        ...current,
        {
          role: "user",
          text: "Generate my monthly PDF report",
        },
      ]);

      await generateMonthlyPDFReport();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Your monthly report is ready. I opened the share/download menu for you.",
        },
      ]);
    } catch (error: any) {
      console.log("PDF REPORT ERROR:", error);

      Alert.alert(
        "Report failed",
        error?.message || "Could not generate PDF report."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TouchableOpacity style={styles.floatingButton} onPress={() => setOpen(true)}>
        <Ionicons name="sparkles" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Penny</Text>
                <Text style={styles.subtitle}>Your personal finance coach</Text>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={() => setOpen(false)}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.reportButton, loading && styles.disabledButton]}
              onPress={handleGeneratePDF}
              disabled={loading}
            >
              <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
              <Text style={styles.reportButtonText}>Generate Monthly PDF Report</Text>
            </TouchableOpacity>

            <ScrollView style={styles.messages}>
              {messages.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    message.role === "user" ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.role === "user" && styles.userText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              ))}

              {loading && (
                <View style={[styles.messageBubble, styles.aiBubble, styles.loadingBubble]}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.thinkingText}>Thinking...</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask Penny..."
                placeholderTextColor={COLORS.muted}
                style={styles.input}
                editable={!loading}
                onSubmitEditing={handleSend}
              />

              <TouchableOpacity
                style={[styles.sendButton, loading && styles.disabledButton]}
                onPress={handleSend}
                disabled={loading}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    right: 22,
    bottom: 96,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    zIndex: 999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: "78%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },
  reportButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 14,
  },
  reportButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  messages: {
    flex: 1,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: "85%",
  },
  aiBubble: {
    backgroundColor: COLORS.card,
    alignSelf: "flex-start",
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: "flex-end",
  },
  messageText: {
    color: COLORS.text,
    fontWeight: "700",
    lineHeight: 20,
  },
  userText: {
    color: "#FFFFFF",
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  thinkingText: {
    color: COLORS.muted,
    fontWeight: "700",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 999,
    padding: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    color: COLORS.text,
    fontWeight: "700",
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
});