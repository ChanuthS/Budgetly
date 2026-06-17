import { StyleSheet, Text, View } from "react-native";

export default function AddExpenseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>
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