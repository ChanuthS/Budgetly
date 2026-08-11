import { useAppTheme } from "@/context/ThemeContext";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  borderRadius?: number;
};

export default function Card({
  children,
  style,
  padding = 20,
  borderRadius = 22,
}: CardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          padding,
          borderRadius,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {},
});
