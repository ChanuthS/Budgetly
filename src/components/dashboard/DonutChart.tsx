import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

type Category = {
  name: string;
  spent: number;
  color: string;
};

export default function DonutChart({
  categories,
  total,
  colors,
}: {
  categories: Category[];
  total: number;
  colors: any;
}) {
  const size = 118;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <View style={styles.donutWrap}>
      <Svg width={size} height={size}>
        <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {categories.map((item) => {
            const percent = total > 0 ? item.spent / total : 0;
            const dash = percent * circumference;
            const currentOffset = offset;

            offset += dash;

            return (
              <Circle
                key={item.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-currentOffset}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>

      <View style={styles.donutCenter}>
        <Text style={[styles.donutValue, { color: colors.text }]}>
          {categories.length}
        </Text>

        <Text style={[styles.donutLabel, { color: colors.muted }]}>
          cats
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  donutWrap: {
    width: 118,
    height: 118,
    alignItems: "center",
    justifyContent: "center",
  },
  donutCenter: {
    position: "absolute",
    alignItems: "center",
  },
  donutValue: {
    fontSize: 22,
    fontWeight: "900",
  },
  donutLabel: {
    fontSize: 11,
    fontWeight: "800",
  },
});