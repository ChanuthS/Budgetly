import { Transaction } from "@/services/transactionService";
import Svg, { Circle, Line, Path } from "react-native-svg";

export default function LineTrendChart({
  transactions,
  colors,
}: {
  transactions: Transaction[];
  colors: any;
}) {
  const width = 300;
  const height = 120;
  const padding = 16;

  const recent = transactions.slice(0, 7).reverse();

  const values =
    recent.length > 0
      ? recent.map((item) => Number(item.amount))
      : [0, 0, 0, 0];

  const max = Math.max(...values, 1);
  const min = 0;

  const points = values.map((value, index) => {
    const x =
      padding +
      (index * (width - padding * 2)) /
        Math.max(values.length - 1, 1);

    const y =
      height -
      padding -
      ((value - min) / (max - min || 1)) *
        (height - padding * 2);

    return { x, y };
  });

  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  return (
    <Svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <Line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke={colors.border}
        strokeWidth="2"
      />

      <Line
        x1={padding}
        y1={height / 2}
        x2={width - padding}
        y2={height / 2}
        stroke={colors.border}
        strokeWidth="2"
        opacity={0.5}
      />

      <Path
        d={path}
        stroke={colors.primary}
        strokeWidth="4"
        fill="transparent"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((point, index) => (
        <Circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="4"
          fill={colors.card}
          stroke={colors.primary}
          strokeWidth="3"
        />
      ))}
    </Svg>
  );
}
