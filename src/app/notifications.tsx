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
    ActivityIndicator,
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

      Alert.alert(
        "Success",
        "A test notification has been scheduled."
      );
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
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={COLORS.text}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Notifications</Text>

        <View style={{ width: 40 }} />
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
        />
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleTestNotification}
      >
        <Ionicons
          name="notifications"
          size={20}
          color="#FFFFFF"
        />
        <Text style={styles.actionText}>
          Send Test Notification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancelAll}
      >
        <Ionicons
          name="close-circle-outline"
          size={20}
          color="#EF4444"
        />
        <Text style={styles.cancelText}>
          Cancel All Notifications
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function NotificationRow({
  title,
  subtitle,
  value,
  onValueChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>
          {title}
        </Text>

        <Text style={styles.rowSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          true: COLORS.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

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

  rowTitle: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 15,
  },

  rowSubtitle: {
    color: COLORS.muted,
    marginTop: 4,
  },

  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 26,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },

  actionText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
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