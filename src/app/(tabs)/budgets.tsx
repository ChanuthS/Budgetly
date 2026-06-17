import { StyleSheet, Text, View } from "react-native";

export default function BudgetsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budgets</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F5FA",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
});