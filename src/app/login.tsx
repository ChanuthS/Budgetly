import MoneyRainTransition from "@/components/MoneyRainTransition";
import { signIn, signInWithGoogle } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  background: "#F3F5FA",
  card: "#FFFFFF",
  primary: "#635BFF",
  text: "#111827",
  muted: "#8A93A6",
  border: "#EEF0F5",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showMoneyRain, setShowMoneyRain] = useState(false);

  function goToDashboardWithAnimation() {
    setShowMoneyRain(true);
  }

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
      goToDashboardWithAnimation();
    } catch (error: any) {
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      goToDashboardWithAnimation();
    } catch (error: any) {
      Alert.alert("Google sign-in failed", error.message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.logo}>💰 Budgetly</Text>
      <Text style={styles.subtitle}>Welcome back. Log in to continue.</Text>

      <View style={styles.card}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={googleLoading || loading || showMoneyRain}
        >
          {googleLoading ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color={COLORS.text} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          placeholderTextColor={COLORS.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter password"
          placeholderTextColor={COLORS.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={[
            styles.button,
            (loading || googleLoading || showMoneyRain) && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={loading || googleLoading || showMoneyRain}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <Link href="/signup" style={styles.link}>
          New to Budgetly? Create an account
        </Link>
      </View>

      {showMoneyRain && (
        <MoneyRainTransition
          onFinish={() => router.replace("/(tabs)/dashboard")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 22,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#FFFFFF",
  },
  googleButtonText: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.muted,
    fontWeight: "700",
  },
  label: {
    color: COLORS.text,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 22,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  link: {
    color: COLORS.primary,
    textAlign: "center",
    fontWeight: "700",
    marginTop: 18,
  },
});