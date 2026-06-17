import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budgetly</Text>
      <Text style={styles.subtitle}>Login screen coming soon</Text>

      <Link href="/(tabs)/dashboard" style={styles.link}>
        Continue to Dashboard
      </Link>

      <Link href="/signup" style={styles.link}>
        Create an account
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F3F5FA",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
  },
  link: {
    color: "#635BFF",
    fontWeight: "700",
    marginTop: 8,
  },
});