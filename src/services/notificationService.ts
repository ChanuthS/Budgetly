import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const NOTIFICATION_PREFS_KEY = "budgetly_notification_preferences";

export type NotificationPreferences = {
  weeklyBudgetCheck: boolean;
  monthlyReportReminder: boolean;
};

const defaultPreferences: NotificationPreferences = {
  weeklyBudgetCheck: false,
  monthlyReportReminder: false,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function getNotificationPreferences() {
  const saved = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);

  if (!saved) {
    return defaultPreferences;
  }

  return {
    ...defaultPreferences,
    ...JSON.parse(saved),
  } as NotificationPreferences;
}

export async function saveNotificationPreferences(
  preferences: NotificationPreferences
) {
  await AsyncStorage.setItem(
    NOTIFICATION_PREFS_KEY,
    JSON.stringify(preferences)
  );
}

export async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  return true;
}

export async function scheduleMonthlyReportReminder() {
  await requestNotificationPermission();

  await Notifications.cancelScheduledNotificationAsync(
    "monthly-report-reminder"
  );

  await Notifications.scheduleNotificationAsync({
    identifier: "monthly-report-reminder",
    content: {
      title: "Penny has your monthly report ready 💰",
      body: "Open Budgetly to review your income, spending, and savings insights.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
      day: 1,
      hour: 9,
      minute: 0,
    },
  });
}

export async function scheduleBudgetCheckReminder() {
  await requestNotificationPermission();

  await Notifications.cancelScheduledNotificationAsync("weekly-budget-check");

  await Notifications.scheduleNotificationAsync({
    identifier: "weekly-budget-check",
    content: {
      title: "Budget check-in 📊",
      body: "Take a quick look at your spending and see if you're still on track.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1,
      hour: 9,
      minute: 0,
    },
  });
}

export async function toggleWeeklyBudgetCheck(enabled: boolean) {
  const current = await getNotificationPreferences();

  const updated = {
    ...current,
    weeklyBudgetCheck: enabled,
  };

  if (enabled) {
    await scheduleBudgetCheckReminder();
  } else {
    await Notifications.cancelScheduledNotificationAsync("weekly-budget-check");
  }

  await saveNotificationPreferences(updated);

  return updated;
}

export async function toggleMonthlyReportReminder(enabled: boolean) {
  const current = await getNotificationPreferences();

  const updated = {
    ...current,
    monthlyReportReminder: enabled,
  };

  if (enabled) {
    await scheduleMonthlyReportReminder();
  } else {
    await Notifications.cancelScheduledNotificationAsync(
      "monthly-report-reminder"
    );
  }

  await saveNotificationPreferences(updated);

  return updated;
}

export async function sendTestNotification() {
    await requestNotificationPermission();
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Budgetly notifications are working ✨",
        body: "Penny can now remind you about budgets, reports, and spending habits.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  }

export async function cancelAllBudgetlyNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await saveNotificationPreferences(defaultPreferences);
}