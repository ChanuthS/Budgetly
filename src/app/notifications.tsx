import { IconBadge, LoadingState, PrimaryButton } from "@/components/common";
import { COLORS } from "@/constants/colors";
import {
  cancelAllBudgetlyNotifications,
  getNotificationPreferences,
  sendTestNotification,
  toggleMonthlyReportReminder,
  toggleWeeklyBudgetCheck,
} from "@/services/notificationService";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationsScreen() {
  const [loading, setLoading] = useState(true);
  const [weeklyBudget, setWeeklyBudget] = useState(false);
  const [monthlyReport, setMonthlyReport] = useState(false);

  const enabledCount = [weeklyBudget, monthlyReport].filter(Boolean).length;

  async function loadPreferences() {
    try {
      setLoading(true);
      const prefs = await getNotificationPreferences();

      setWeeklyBudget(prefs.weeklyBudgetCheck);
      setMonthlyReport(prefs.monthlyReportReminder);
    } finally {
      setLoading(false);
    }
  }

  async function handleWeeklyToggle(value: boolean) {
    try {
      await toggleWeeklyBudgetCheck(value);
      setWeeklyBudget(value);
    } catch (error: any) {
      Alert.alert("Notification Error", error.message);
    }
  }

  async function handleMonthlyToggle(value: boolean) {
    try {
      await toggleMonthlyReportReminder(value);
      setMonthlyReport(value);
    } catch (error: any) {
      Alert.alert("Notification Error", error.message);
    }
  }

  async function handleTestNotification() {
    try {
      await sendTestNotification();
      Alert.alert("Success", "A test notification has been scheduled.");
    } catch (error: any) {
      Alert.alert("Notification Error", error.message);
    }
  }

  async function handleCancelAll() {
    try {
      await cancelAllBudgetlyNotifications();

      setWeeklyBudget(false);
      setMonthlyReport(false);

      Alert.alert(
        "Notifications Disabled",
        "All Budgetly reminders have been cancelled."
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, [])
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Notifications</Text>

        <View style={{ width: 40 }} />
      </View>

      <View style={styles.statusCard}>
        <IconBadge
          name="notifications-outline"
          size={50}
          iconSize={24}
          backgroundColor={COLORS.primary}
          color="#FFFFFF"
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.statusTitle}>
            {enabledCount > 0 ? "Notifications enabled" : "Notifications off"}
          </Text>

          <Text style={styles.statusSubtitle}>
            {enabledCount > 0
              ? `${enabledCount} Budgetly reminder${enabledCount === 1 ? "" : "s"} active`
              : "Turn on reminders to let Penny help you stay on track."}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <NotificationRow
          title="Weekly Budget Check"
          subtitle="Every Monday at 9:00 AM"
          value={weeklyBudget}
          onValueChange={handleWeeklyToggle}
        />

        <NotificationRow
          title="Monthly Report Reminder"
          subtitle="First day of every month"
          value={monthlyReport}
          onValueChange={handleMonthlyToggle}
          isLast
        />
      </View>

      <PrimaryButton
        title="Send Test Notification"
        icon="notifications"
        onPress={handleTestNotification}
        style={styles.testButton}
      />

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelAll}>
        <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
        <Text style={styles.cancelText}>Cancel All Notifications</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function NotificationRow({
  title,
  subtitle,
  value,
  onValueChange,
  isLast,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, isLast && styles.lastRow]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: COLORS.border,
          true: COLORS.primary,
        }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
  },
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  statusTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "900",
  },
  statusSubtitle: {
    color: COLORS.muted,
    marginTop: 4,
    lineHeight: 20,
    fontWeight: "600",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: "hidden",
  },
  row: {
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowTitle: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 15,
  },
  rowSubtitle: {
    color: COLORS.muted,
    marginTop: 4,
  },
  testButton: {
    marginTop: 26,
  },
  cancelButton: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 120,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  cancelText: {
    color: "#EF4444",
    fontWeight: "800",
    fontSize: 15,
  },
});
