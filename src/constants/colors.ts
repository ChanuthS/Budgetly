export type ThemeMode = "light" | "dark";

export const LIGHT_COLORS = {
  background: "#F3F5FA",
  card: "#FFFFFF",
  primary: "#635BFF",

  text: "#111827",
  muted: "#8A93A6",

  green: "#14B897",
  red: "#EF4444",
  orange: "#F59E0B",

  border: "#EEF0F5",

  navy: "#171B35",
};

export const DARK_COLORS = {
  background: "#0F1220",
  card: "#171B35",
  primary: "#8B85FF",

  text: "#F9FAFB",
  muted: "#A8AEC4",

  green: "#2DD4BF",
  red: "#F87171",
  orange: "#FBBF24",

  border: "#252A3D",

  navy: "#090B14",
};

let currentTheme: ThemeMode = "light";

export const COLORS = {
  get background() {
    return currentTheme === "dark" ? DARK_COLORS.background : LIGHT_COLORS.background;
  },
  get card() {
    return currentTheme === "dark" ? DARK_COLORS.card : LIGHT_COLORS.card;
  },
  get primary() {
    return currentTheme === "dark" ? DARK_COLORS.primary : LIGHT_COLORS.primary;
  },
  get text() {
    return currentTheme === "dark" ? DARK_COLORS.text : LIGHT_COLORS.text;
  },
  get muted() {
    return currentTheme === "dark" ? DARK_COLORS.muted : LIGHT_COLORS.muted;
  },
  get green() {
    return currentTheme === "dark" ? DARK_COLORS.green : LIGHT_COLORS.green;
  },
  get red() {
    return currentTheme === "dark" ? DARK_COLORS.red : LIGHT_COLORS.red;
  },
  get orange() {
    return currentTheme === "dark" ? DARK_COLORS.orange : LIGHT_COLORS.orange;
  },
  get border() {
    return currentTheme === "dark" ? DARK_COLORS.border : LIGHT_COLORS.border;
  },
  get navy() {
    return currentTheme === "dark" ? DARK_COLORS.navy : LIGHT_COLORS.navy;
  },
};

export function setAppTheme(theme: ThemeMode) {
  currentTheme = theme;
}

export function getAppTheme() {
  return currentTheme;
}