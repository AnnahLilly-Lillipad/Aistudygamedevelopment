export interface CardFrame {
  id: string;
  name: string;
  price: number;
  description: string;
  borderColor: string;
  borderWidth: number;
  shadow?: string;
  accentColor: string;
}

export const FRAMES: CardFrame[] = [
  {
    id: "standard",
    name: "Standard",
    price: 0,
    description: "Default frame — rarity color",
    borderColor: "#7ab2c8",
    borderWidth: 2,
    accentColor: "#7ab2c8",
  },
  {
    id: "gold",
    name: "Gold Trim",
    price: 200,
    description: "Gleaming gold border",
    borderColor: "#fbbf24",
    borderWidth: 3,
    shadow: "inset 0 0 0 1px #e0b050",
    accentColor: "#fbbf24",
  },
  {
    id: "crimson",
    name: "Crimson",
    price: 350,
    description: "Bold red edge",
    borderColor: "#dc2626",
    borderWidth: 3,
    shadow: "inset 0 0 0 1px #b91c1c",
    accentColor: "#dc2626",
  },
  {
    id: "midnight",
    name: "Midnight",
    price: 350,
    description: "Deep dark frame",
    borderColor: "#1e293b",
    borderWidth: 3,
    shadow: "0 0 10px rgba(0,0,0,0.55)",
    accentColor: "#1e293b",
  },
  {
    id: "sakura",
    name: "Sakura",
    price: 500,
    description: "Soft pink blossom border",
    borderColor: "#f9a8d4",
    borderWidth: 3,
    shadow: "inset 0 0 0 1px #db2777",
    accentColor: "#db2777",
  },
  {
    id: "violet",
    name: "Violet",
    price: 500,
    description: "Rich purple border",
    borderColor: "#7c3aed",
    borderWidth: 3,
    shadow: "inset 0 0 0 1px #5b21b6",
    accentColor: "#7c3aed",
  },
  {
    id: "jade",
    name: "Jade",
    price: 650,
    description: "Emerald green frame",
    borderColor: "#059669",
    borderWidth: 3,
    shadow: "inset 0 0 0 1px #047857",
    accentColor: "#059669",
  },
  {
    id: "prismatic",
    name: "Prismatic",
    price: 1200,
    description: "Rare rainbow shimmer border",
    borderColor: "#f87171",
    borderWidth: 3,
    shadow: "0 0 0 3px #fbbf24, 0 0 0 5px #4ade80, 0 0 0 7px #60a5fa",
    accentColor: "#f87171",
  },
];

export const FRAMES_MAP: Record<string, CardFrame> = Object.fromEntries(
  FRAMES.map(f => [f.id, f])
);

export const RARITY_BORDER_COLORS: Record<string, string> = {
  UR:  "#f87171",
  SSR: "#fbbf24",
  SR:  "#a78bfa",
  R:   "#7ab2c8",
};
