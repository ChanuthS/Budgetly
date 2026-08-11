import { useAppTheme } from "@/context/ThemeContext";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({ message }: LoadingStateProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? (
        <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontWeight: "700",
    marginTop: 10,
  },
});
