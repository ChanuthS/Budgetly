import BudgetlyAI from "@/components/BudgetlyAI";
import { ThemeProvider } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#635BFF",
            tabBarInactiveTintColor: "#9CA3AF",
            tabBarStyle: {
              height: 75,
              paddingBottom: 10,
              paddingTop: 10,
            },
          }}
        >
          <Tabs.Screen
            name="dashboard"
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="transactions"
            options={{
              title: "Activity",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list-outline" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="add-expense"
            options={{
              title: "Add",
              tabBarIcon: () => (
                <Ionicons name="add-circle" size={40} color="#635BFF" />
              ),
            }}
          />

          <Tabs.Screen
            name="budgets"
            options={{
              title: "Budgets",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="pie-chart-outline" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>

        <BudgetlyAI />
      </View>
    </ThemeProvider>
  );
}