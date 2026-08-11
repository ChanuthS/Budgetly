import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type IconBadgeProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  iconSize?: number;
  backgroundColor?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export default function IconBadge({
  name,
  size = 38,
  iconSize = 20,
  backgroundColor,
  color,
  style,
}: IconBadgeProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor ?? colors.background,
        },
        style,
      ]}
    >
      <Ionicons name={name} size={iconSize} color={color ?? colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
  },
});
