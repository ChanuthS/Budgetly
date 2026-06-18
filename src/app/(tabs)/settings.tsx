import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";


const accountItems = [
  { icon: "person-outline", label: "Profile", value: "Sarah Chen" },
  { icon: "card-outline", label: "Connected Accounts", value: "3 linked" },
];

const preferenceItems = [
  { icon: "notifications-outline", label: "Notifications", value: "On" },
  { icon: "moon-outline", label: "Dark Mode", value: "Off", switch: true },
  { icon: "cash-outline", label: "Currency", value: "USD ($)" },
];

const dataItems = [
  { icon: "download-outline", label: "Export Data", value: "CSV / PDF" },
  { icon: "lock-closed-outline", label: "Privacy & Security", value: "" },
];

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SC</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Sarah Chen</Text>
          <Text style={styles.profileEmail}>sarah.chen@email.com</Text>
        </View>

        <View style={styles.proBadge}>
          <Text style={styles.proText}>PRO</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>248</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Months tracked</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>$4,210</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
      </View>

      <SettingsSection title="Account" items={accountItems} />
      <SettingsSection title="Preferences" items={preferenceItems} />
      <SettingsSection title="Data" items={dataItems} />

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SettingsSection({
  title,
  items,
}: {
  title: string;
  items: {
    icon: string;
    label: string;
    value: string;
    switch?: boolean;
  }[];
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.sectionCard}>
        {items.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.settingRow,
              index !== items.length - 1 && styles.rowBorder,
            ]}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
              </View>

              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>

            <View style={styles.settingRight}>
              {item.switch ? (
                <Switch value={false} trackColor={{ true: COLORS.primary }} />
              ) : (
                <Text style={styles.settingValue}>{item.value}</Text>
              )}

              {!item.switch && (
                <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
              )}
            </View>
          </View>
        ))}
      </View>
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
    paddingBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 18,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  profileEmail: {
    color: COLORS.muted,
    marginTop: 4,
  },
  proBadge: {
    backgroundColor: "#ECEBFF",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  proText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: COLORS.muted,
    fontWeight: "800",
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    overflow: "hidden",
  },
  settingRow: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F2F4F8",
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  settingValue: {
    color: COLORS.muted,
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 120,
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "800",
    fontSize: 15,
  },
});