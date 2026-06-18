import { COLORS, RADIUS } from "@/constants/theme";
import { StyleSheet, View, ViewProps } from "react-native";

export default function Card({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
  },
});