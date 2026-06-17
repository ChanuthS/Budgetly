import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Signup screen coming soon</Text>

      <Link href="/login" style={styles.link}>
        Already have an account? Login
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
    fontSize: 32,
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