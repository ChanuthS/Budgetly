import { COLORS } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

type HealthScore = {
  score: number;
  label: string;
  message: string;
  savingsRate: number;
};

type FinancialHealthCardProps = {
  healthScore: HealthScore;
  colors: any;
};

export default function FinancialHealthCard({
  healthScore,
  colors,
}: FinancialHealthCardProps) {
  return (
    <View style={styles.healthCard}>
      <View>
        <Text style={styles.healthLabel}>Financial Health</Text>

        <Text style={styles.healthScore}>
          {healthScore.score}
          <Text style={styles.healthOutOf}> / 100</Text>
        </Text>

        <Text style={[styles.healthStatus, { color: colors.primary }]}>
          {healthScore.label}
        </Text>

        <Text style={styles.healthMessage}>{healthScore.message}</Text>
      </View>

      <View style={[styles.healthRing, { borderColor: colors.primary }]}>
        <Text style={[styles.healthRingText, { color: colors.primary }]}>
          {healthScore.savingsRate}%
        </Text>

        <Text style={styles.healthRingLabel}>saved</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  healthCard: {
    marginTop: -6,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  healthLabel: {
    color: COLORS.muted,
    fontWeight: "800",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  healthScore: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 6,
  },

  healthOutOf: {
    fontSize: 18,
    color: COLORS.muted,
  },

  healthStatus: {
    fontWeight: "900",
    fontSize: 16,
    marginTop: 4,
  },

  healthMessage: {
    color: COLORS.muted,
    marginTop: 6,
    maxWidth: 220,
    lineHeight: 20,
  },

  healthRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  healthRingText: {
    fontWeight: "900",
    fontSize: 16,
  },

  healthRingLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "700",
  },
});
