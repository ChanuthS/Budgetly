import { COLORS } from "@/constants/colors";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

type Bill = {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotate: string;
};

export default function MoneyRainTransition({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [showPennyMessage, setShowPennyMessage] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(0.94)).current;
  const pennyFade = useRef(new Animated.Value(0)).current;
  const pennySlide = useRef(new Animated.Value(18)).current;

  const bills = useMemo<Bill[]>(
    () =>
      Array.from({ length: 30 }).map((_, index) => ({
        id: index,
        x: Math.random() * width,
        delay: Math.random() * 700,
        duration: 1300 + Math.random() * 900,
        size: 24 + Math.random() * 16,
        rotate: `${Math.random() * 60 - 30}deg`,
      })),
    []
  );

  const animations = useRef(bills.map(() => new Animated.Value(-80))).current;

  useEffect(() => {
    const fallingAnimations = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: height + 80,
        duration: bills[index].duration,
        delay: bills[index].delay,
        useNativeDriver: true,
      })
    );

    Animated.parallel(fallingAnimations).start();

    Animated.spring(cardScale, {
      toValue: 1,
      friction: 6,
      tension: 70,
      useNativeDriver: true,
    }).start();

    const pennyTimer = setTimeout(() => {
      setShowPennyMessage(true);

      Animated.parallel([
        Animated.timing(pennyFade, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(pennySlide, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1650);

    const finishTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 550,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3600);

    return () => {
      clearTimeout(pennyTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      {bills.map((bill, index) => (
        <Animated.Text
          key={bill.id}
          style={[
            styles.bill,
            {
              left: bill.x,
              fontSize: bill.size,
              transform: [
                { translateY: animations[index] },
                { rotate: bill.rotate },
              ],
            },
          ]}
        >
          💵
        </Animated.Text>
      ))}

      <Animated.View
        style={[
          styles.centerCard,
          {
            transform: [{ scale: cardScale }],
          },
        ]}
      >
        {!showPennyMessage ? (
          <>
            <Text style={styles.logo}>💰</Text>
            <Text style={styles.title}>Welcome to Budgetly</Text>
            <Text style={styles.subtitle}>
              Preparing your financial dashboard...
            </Text>
          </>
        ) : (
          <Animated.View
            style={{
              opacity: pennyFade,
              transform: [{ translateY: pennySlide }],
              alignItems: "center",
            }}
          >
            <View style={styles.pennyBadge}>
              <Text style={styles.pennyEmoji}>✨</Text>
            </View>

            <Text style={styles.title}>Penny is ready</Text>

            <Text style={styles.pennyMessage}>
              Your money insights are waiting. Let’s make today a smarter
              financial day.
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.navy,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  bill: {
    position: "absolute",
    top: 0,
  },
  centerCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    width: "82%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  logo: {
    fontSize: 52,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "#A8AEC4",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  pennyBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  pennyEmoji: {
    fontSize: 28,
  },
  pennyMessage: {
    color: "#D7DAE8",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 21,
  },
});