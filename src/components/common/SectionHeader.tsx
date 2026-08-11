import { useAppTheme } from "@/context/ThemeContext";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type SectionHeaderProps = {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SectionHeader({
  title,
  actionText,
  onActionPress,
  style,
}: SectionHeaderProps) {
  const { colors } = useAppTheme();

  const action = actionText ? (
    onActionPress ? (
      <TouchableOpacity onPress={onActionPress}>
        <Text style={[styles.actionText, { color: colors.primary }]}>
          {actionText}
        </Text>
      </TouchableOpacity>
    ) : (
      <Text style={[styles.actionText, { color: colors.primary }]}>
        {actionText}
      </Text>
    )
  ) : null;

  return (
    <View style={[styles.header, style]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  actionText: {
    fontWeight: "800",
  },
});
