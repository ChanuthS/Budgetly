import Card from "@/components/common/Card";
import { useAppTheme } from "@/context/ThemeContext";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

type EmptyStateProps = {
  title: string;
  message: string;
  emoji?: string;
  style?: StyleProp<ViewStyle>;
};

export default function EmptyState({
  title,
  message,
  emoji,
  style,
}: EmptyStateProps) {
  const { colors } = useAppTheme();

  return (
    <Card padding={20} borderRadius={22} style={[styles.container, style]}>
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  emoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
  },
  message: {
    textAlign: "center",
    marginTop: 6,
  },
});
