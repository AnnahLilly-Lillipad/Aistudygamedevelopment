export type Rarity = 'R' | 'SR' | 'SSR' | 'UR';
export type Element = 'Logic' | 'Emotion' | 'Strength';
export type Faction = 'ADA' | 'Port Mafia' | 'Guild' | 'Rats' | 'Hunting Dogs' | 'Decay of Angel' | 'Independent';

export interface Character {
  id: number;
  characterName: string;       // The actual person's name
  variant: string | null;      // null = canon, else AU name e.g. "Slytherin AU"
  displayName: string;         // Short display name for cards
  ability: string;
  faction: Faction;
  element: Element;
  rarity: Rarity;
  hp: number;
  atk: number;
  def: number;
  skill: string;
  skillDescription: string;
  gradient: string;            // Tailwind gradient classes (fallback bg)
  emoji: string;               // Fallback emoji when no image
  imageUrl: string;            // Drop a photo at public/cards/{id}.jpg
  banner: string | null;       // null = in standard pool; else the banner id it belongs to
  au: string | null;           // null = canon card
}

export interface OwnedCard {
  characterId: number;
  id: string;
  level: number;
  limitBreak: number;
  obtainedAt: Date;
}

// ─── CANON CARDS (standard pool) ────────────────────────────────────────────

const CANON: Character[] = [
  { id: 1, characterName: "Dazai Osamu", variant: null, displayName: "Dazai", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "SSR", hp: 8200, atk: 3400, def: 2100, skill: "Ability Nullification", skillDescription: "Nullifies all enemy abilities for 2 turns. Coins +15%.", gradient: "from-blue-500 to-indigo-400", emoji: "🪄", imageUrl: "/cards/1.jpg", banner: null, au: null },
  { id: 2, characterName: "Atsushi Nakajima", variant: null, displayName: "Atsushi", ability: "Beast Beneath the Moonlight", faction: "ADA", element: "Strength", rarity: "SR", hp: 9500, atk: 3800, def: 2400, skill: "White Tiger Transform", skillDescription: "ATK +40% for 2 turns.", gradient: "from-orange-400 to-amber-300", emoji: "🐯", imageUrl: "/cards/2.jpg", banner: null, au: null },
  { id: 3, characterName: "Ranpo Edogawa", variant: null, displayName: "Ranpo", ability: "Ultra Deduction", faction: "ADA", element: "Logic", rarity: "SSR", hp: 6800, atk: 2900, def: 1800, skill: "Deduction Masterclass", skillDescription: "Reveals all hints. +1 free hint token.", gradient: "from-cyan-500 to-blue-400", emoji: "🔍", imageUrl: "/cards/3.jpg", banner: null, au: null },
  { id: 4, characterName: "Kunikida Doppo", variant: null, displayName: "Kunikida", ability: "Doppo Poet", faction: "ADA", element: "Logic", rarity: "SR", hp: 7200, atk: 3100, def: 2600, skill: "Ideal Materialization", skillDescription: "Timer +2 minutes.", gradient: "from-green-500 to-emerald-400", emoji: "📔", imageUrl: "/cards/4.jpg", banner: null, au: null },
  { id: 5, characterName: "Yosano Akiko", variant: null, displayName: "Yosano", ability: "Thou Shalt Not Die", faction: "ADA", element: "Emotion", rarity: "SR", hp: 10200, atk: 2600, def: 3200, skill: "Healing Butterflies", skillDescription: "Restore 40% HP to all allies.", gradient: "from-pink-500 to-rose-400", emoji: "🦋", imageUrl: "/cards/5.jpg", banner: null, au: null },
  { id: 6, characterName: "Tanizaki Junichiro", variant: null, displayName: "Tanizaki", ability: "Light Snow", faction: "ADA", element: "Logic", rarity: "R", hp: 5800, atk: 2200, def: 1900, skill: "Snow Camouflage", skillDescription: "Evade next attack 70% chance.", gradient: "from-sky-400 to-blue-300", emoji: "❄️", imageUrl: "/cards/6.jpg", banner: null, au: null },
  { id: 7, characterName: "Kyoka Izumi", variant: null, displayName: "Kyoka", ability: "Demon Snow", faction: "ADA", element: "Emotion", rarity: "SR", hp: 7600, atk: 3600, def: 2000, skill: "Blade of Snow", skillDescription: "High-speed blade attack hitting 3 times.", gradient: "from-red-400 to-pink-300", emoji: "⚔️", imageUrl: "/cards/7.jpg", banner: null, au: null },
  { id: 8, characterName: "Kenji Miyazawa", variant: null, displayName: "Kenji", ability: "undefeated by the rain,", faction: "ADA", element: "Strength", rarity: "R", hp: 11000, atk: 4200, def: 3800, skill: "Famine Power", skillDescription: "ATK +80% when HP < 30%.", gradient: "from-yellow-400 to-lime-300", emoji: "🌾", imageUrl: "/cards/8.jpg", banner: null, au: null },
  { id: 9, characterName: "Fukuzawa Yukichi", variant: null, displayName: "Fukuzawa", ability: "All Men Are Equal", faction: "ADA", element: "Logic", rarity: "UR", hp: 12000, atk: 4500, def: 4000, skill: "Ability Amplification", skillDescription: "Amplify all ally abilities 50%.", gradient: "from-indigo-600 to-blue-500", emoji: "⚖️", imageUrl: "/cards/9.jpg", banner: null, au: null },
  { id: 10, characterName: "Akutagawa Ryunosuke", variant: null, displayName: "Akutagawa", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 8800, atk: 4600, def: 2500, skill: "Rashomon Devour", skillDescription: "DEF Pierce +60%.", gradient: "from-slate-700 to-red-900", emoji: "🖤", imageUrl: "/cards/10.jpg", banner: null, au: null },
  { id: 11, characterName: "Chuuya Nakahara", variant: null, displayName: "Chuuya", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9200, atk: 5200, def: 3100, skill: "Corruption", skillDescription: "ATK +200% but lose 10% HP/turn.", gradient: "from-red-700 to-orange-600", emoji: "🎩", imageUrl: "/cards/11.jpg", banner: null, au: null },
  { id: 12, characterName: "Mori Ougai", variant: null, displayName: "Mori", ability: "Vita Sexualis", faction: "Port Mafia", element: "Logic", rarity: "UR", hp: 9800, atk: 3900, def: 3500, skill: "Elise Command", skillDescription: "Control enemy for 1 turn.", gradient: "from-purple-900 to-red-800", emoji: "👑", imageUrl: "/cards/12.jpg", banner: null, au: null },
  { id: 13, characterName: "Higuchi Ichiyou", variant: null, displayName: "Higuchi", ability: "Unknown", faction: "Port Mafia", element: "Emotion", rarity: "R", hp: 5200, atk: 2100, def: 1700, skill: "Reckless Charge", skillDescription: "ATK +30% but take 15% more damage.", gradient: "from-slate-600 to-slate-400", emoji: "🔫", imageUrl: "/cards/13.jpg", banner: null, au: null },
  { id: 14, characterName: "Gin Akutagawa", variant: null, displayName: "Gin", ability: "none", faction: "Port Mafia", element: "Strength", rarity: "SR", hp: 7400, atk: 3900, def: 2200, skill: "Invisible Cut", skillDescription: "30% chance instant-kill low HP enemies.", gradient: "from-gray-700 to-gray-500", emoji: "🗡️", imageUrl: "/cards/14.jpg", banner: null, au: null },
  { id: 15, characterName: "Francis Fitzgerald", variant: null, displayName: "Fitzgerald", ability: "The Great Fitzgerald", faction: "Guild", element: "Strength", rarity: "SSR", hp: 10500, atk: 4800, def: 3600, skill: "Dollar Armor", skillDescription: "DEF +100% proportional to coins spent.", gradient: "from-yellow-500 to-amber-400", emoji: "💰", imageUrl: "/cards/15.jpg", banner: null, au: null },
  { id: 16, characterName: "Edgar Allan Poe", variant: null, displayName: "Poe", ability: "The Black Cat in the rue morge", faction: "Guild", element: "Logic", rarity: "SR", hp: 6400, atk: 2800, def: 2000, skill: "Mystery Trap", skillDescription: "Enemy skips next turn.", gradient: "from-gray-700 to-purple-900", emoji: "🐈‍⬛", imageUrl: "/cards/16.jpg", banner: null, au: null },
  { id: 17, characterName: "Lucy Montgomery", variant: null, displayName: "Lucy", ability: "Anne of Abyssal Red", faction: "Guild", element: "Emotion", rarity: "SR", hp: 6900, atk: 2600, def: 2300, skill: "Pocket Dimension", skillDescription: "Protect allies for 1 turn.", gradient: "from-red-400 to-amber-300", emoji: "🌹", imageUrl: "/cards/17.jpg", banner: null, au: null },
  { id: 18, characterName: "John Steinbeck", variant: null, displayName: "Steinbeck", ability: "Of Mice and Men", faction: "Guild", element: "Strength", rarity: "SR", hp: 8800, atk: 3400, def: 2900, skill: "Nature's Grasp", skillDescription: "Slow enemy action 50% for 2 turns.", gradient: "from-green-700 to-lime-600", emoji: "🌿", imageUrl: "/cards/18.jpg", banner: null, au: null },
  { id: 19, characterName: "Louisa May Alcott", variant: null, displayName: "Alcott", ability: "Little Women", faction: "Guild", element: "Logic", rarity: "R", hp: 5500, atk: 2000, def: 2200, skill: "Invisibility", skillDescription: "Make ally invisible for 1 turn.", gradient: "from-violet-400 to-purple-300", emoji: "📖", imageUrl: "/cards/19.jpg", banner: null, au: null },
  { id: 20, characterName: "Fyodor Dostoevsky", variant: null, displayName: "Fyodor", ability: "Crime and Punishment", faction: "Rats", element: "Logic", rarity: "UR", hp: 9500, atk: 4200, def: 3400, skill: "Death God Touch", skillDescription: "Kill enemy with specific weakness.", gradient: "from-purple-950 to-indigo-900", emoji: "☠️", imageUrl: "/cards/20.jpg", banner: null, au: null },
  { id: 21, characterName: "Nikolai Gogol", variant: null, displayName: "Nikolai", ability: "The Overcoat", faction: "Rats", element: "Emotion", rarity: "SSR", hp: 8200, atk: 3800, def: 2700, skill: "Spatial Distortion", skillDescription: "Teleport any card on field.", gradient: "from-violet-700 to-purple-500", emoji: "🎭", imageUrl: "/cards/21.jpg", banner: null, au: null },
  { id: 22, characterName: "Sigma", variant: null, displayName: "Sigma", ability: "unknown", faction: "Rats", element: "Logic", rarity: "SR", hp: 6800, atk: 2500, def: 2100, skill: "Memory Reading", skillDescription: "Remove 1 positive effect from enemy.", gradient: "from-slate-500 to-blue-400", emoji: "🗼", imageUrl: "/cards/22.jpg", banner: null, au: null },
  { id: 23, characterName: "Fukuchi Ouchi", variant: null, displayName: "Fukuchi", ability: "One Thousand Leagues Beneath", faction: "Hunting Dogs", element: "Strength", rarity: "UR", hp: 13000, atk: 5800, def: 4500, skill: "Zanki Zero", skillDescription: "Revive from death. Counter 3x.", gradient: "from-teal-700 to-slate-600", emoji: "🐉", imageUrl: "/cards/23.jpg", banner: null, au: null },
  { id: 24, characterName: "Jouno Saigiku", variant: null, displayName: "Jouno", ability: "Flagellant", faction: "Hunting Dogs", element: "Logic", rarity: "SR", hp: 7100, atk: 3300, def: 2400, skill: "Pain Sense", skillDescription: "Detect all enemy weaknesses.", gradient: "from-teal-600 to-cyan-500", emoji: "👁️", imageUrl: "/cards/24.jpg", banner: null, au: null },
  { id: 25, characterName: "Teruko Okura", variant: null, displayName: "Teruko", ability: "Always the Lesser Work", faction: "Hunting Dogs", element: "Emotion", rarity: "SR", hp: 6700, atk: 3000, def: 2100, skill: "De-age", skillDescription: "Reset one enemy card to base stats.", gradient: "from-pink-700 to-rose-600", emoji: "🌸", imageUrl: "/cards/25.jpg", banner: null, au: null },
  { id: 26, characterName: "Agatha Christie", variant: null, displayName: "Christie", ability: "And Then There Were None", faction: "Decay of Angel", element: "Logic", rarity: "SSR", hp: 7800, atk: 3600, def: 2900, skill: "Murder Mystery", skillDescription: "Massive damage once per target.", gradient: "from-rose-800 to-orange-700", emoji: "🔎", imageUrl: "/cards/26.jpg", banner: null, au: null },
  { id: 27, characterName: "Natsume Soseki", variant: null, displayName: "Natsume", ability: "I Am a Cat", faction: "Independent", element: "Logic", rarity: "UR", hp: 11000, atk: 3500, def: 3800, skill: "Nine Lives", skillDescription: "Resurrect once. Grant copy to ally.", gradient: "from-amber-500 to-yellow-400", emoji: "🐱", imageUrl: "/cards/27.jpg", banner: null, au: null },
  { id: 28, characterName: "Bram Stoker", variant: null, displayName: "Stoker", ability: "Demian", faction: "Decay of Angel", element: "Emotion", rarity: "SR", hp: 7200, atk: 3100, def: 2800, skill: "Blood Drain", skillDescription: "Drain HP from all enemies each turn.", gradient: "from-red-900 to-purple-900", emoji: "🧛", imageUrl: "/cards/28.jpg", banner: null, au: null },
  { id: 29, characterName: "Nathaniel Hawthorne", variant: null, displayName: "Hawthorne", ability: "The Scarlet Letter", faction: "Guild", element: "Emotion", rarity: "SR", hp: 6600, atk: 2900, def: 2200, skill: "Curse Brand", skillDescription: "Damage to marked enemy +50%.", gradient: "from-red-600 to-rose-500", emoji: "🔴", imageUrl: "/cards/29.jpg", banner: null, au: null },
  { id: 30, characterName: "Herman Melville", variant: null, displayName: "Melville", ability: "Moby Dick", faction: "Guild", element: "Strength", rarity: "SSR", hp: 14000, atk: 5500, def: 4200, skill: "White Whale", skillDescription: "Summon Moby Dick for massive AOE.", gradient: "from-blue-800 to-slate-700", emoji: "🐋", imageUrl: "/cards/30.jpg", banner: null, au: null },
];

// ─── HOGWARTS AU CARDS (banner: harry-potter) ────────────────────────────────

const HOGWARTS_AU: Character[] = [
  { id: 101, characterName: "Dazai Osamu", variant: "Slytherin", displayName: "Dazai", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "UR", hp: 9000, atk: 3800, def: 2400, skill: "Parseltongue Nullify", skillDescription: "Nullify all spells cast this turn. Coins +25%.", gradient: "from-emerald-800 to-slate-900", emoji: "🐍", imageUrl: "/cards/101.jpg", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 102, characterName: "Chuuya Nakahara", variant: "Hufflepuff", displayName: "Chuuya", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9800, atk: 5000, def: 3400, skill: "Gravity Quaffle", skillDescription: "Gravity blast deals 2x to all enemies.", gradient: "from-yellow-600 to-amber-800", emoji: "🦡", imageUrl: "/cards/102.jpg", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 103, characterName: "Akutagawa Ryunosuke", variant: "Slytherin", displayName: "Akutagawa", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9200, atk: 4900, def: 2700, skill: "Dark Arts Rashomon", skillDescription: "Rashomon devours all light. DEF pierce +80%.", gradient: "from-emerald-900 to-black", emoji: "🐍", imageUrl: "/cards/103.jpg", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 104, characterName: "Atsushi Nakajima", variant: "Gryffindor", displayName: "Atsushi", ability: "Beast Beneath the Moonlight", faction: "ADA", element: "Strength", rarity: "SR", hp: 9800, atk: 4000, def: 2600, skill: "Lion's Roar", skillDescription: "ATK +50% for 2 turns. Inspire adjacent ally.", gradient: "from-red-600 to-amber-600", emoji: "🦁", imageUrl: "/cards/104.jpg", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 105, characterName: "Ranpo Edogawa", variant: "Ravenclaw", displayName: "Ranpo", ability: "Super Deduction", faction: "ADA", element: "Logic", rarity: "SSR", hp: 7200, atk: 3200, def: 2000, skill: "Omni-Deduction Spell", skillDescription: "Deduces enemy strategy. Skip enemy next turn.", gradient: "from-blue-700 to-sky-500", emoji: "🦅", imageUrl: "/cards/105.jpg", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 106, characterName: "Fukuzawa Yukichi", variant: "Headmaster", displayName: "Fukuzawa", ability: "All Men Are Equal", faction: "ADA", element: "Logic", rarity: "UR", hp: 13000, atk: 4800, def: 4500, skill: "School's Decree", skillDescription: "All allies +30% all stats. Immune to debuffs.", gradient: "from-indigo-700 to-violet-600", emoji: "🧙", imageUrl: "/cards/106.jpg", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 107, characterName: "Yosano Akiko", variant: "Healer", displayName: "Yosano", ability: "Thou Shalt Not Die", faction: "ADA", element: "Emotion", rarity: "SR", hp: 10800, atk: 2800, def: 3600, skill: "Madam Pomfrey Mode", skillDescription: "Full HP restore to one ally. Resist next lethal hit.", gradient: "from-pink-600 to-red-400", emoji: "⚕️", imageUrl: "/cards/107.jpg", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 108, characterName: "Kunikida Doppo", variant: "Hufflepuff Prefect", displayName: "Kunikida", ability: "Lone Poet", faction: "ADA", element: "Logic", rarity: "SR", hp: 7600, atk: 3300, def: 2900, skill: "Prefect's Rulebook", skillDescription: "Spell that manifests any written rule as reality.", gradient: "from-yellow-500 to-yellow-700", emoji: "📜", imageUrl: "/cards/108.jpg", banner: "harry-potter", au: "Hogwarts AU" },
];

// ─── DARK ERA CARDS (banner: dark-era) ───────────────────────────────────────

const DARK_ERA: Character[] = [
  { id: 201, characterName: "Dazai Osamu", variant: "Dark Era", displayName: "Dazai", ability: "No Longer Human", faction: "Port Mafia", element: "Logic", rarity: "SR", hp: 7600, atk: 3200, def: 2000, skill: "Port Mafia Executive", skillDescription: "Teenage Dazai — ruthless. Enemy DEF -40%.", gradient: "from-slate-900 to-red-950", emoji: "🌑", imageUrl: "/cards/201.jpg", banner: "dark-era", au: "Dark Era" },
  { id: 202, characterName: "Chuuya Nakahara", variant: "Dark Era", displayName: "Chuuya", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 8800, atk: 5000, def: 2900, skill: "Teenage Corruption", skillDescription: "Younger, angrier. ATK ×2.5 for 1 turn, lose 15% HP.", gradient: "from-red-900 to-orange-800", emoji: "🌑", imageUrl: "/cards/202.jpg", banner: "dark-era", au: "Dark Era" },
  { id: 203, characterName: "Mori Ougai", variant: "Dark Era", displayName: "Mori", ability: "Vita Sexualis", faction: "Port Mafia", element: "Logic", rarity: "UR", hp: 10200, atk: 4100, def: 3700, skill: "Ascension to Boss", skillDescription: "Becomes Port Mafia boss this turn. All allies ATK +60%.", gradient: "from-purple-950 to-red-900", emoji: "🩸", imageUrl: "/cards/203.jpg", banner: "dark-era", au: "Dark Era" },
  { id: 204, characterName: "Oda Sakunosuke", variant: "Dark Era", displayName: "Odasaku", ability: "Flawless", faction: "Port Mafia", element: "Emotion", rarity: "SSR", hp: 8400, atk: 3900, def: 2600, skill: "Protect the Children", skillDescription: "Take all damage for allies for 1 turn. Cannot be killed this turn.", gradient: "from-amber-800 to-orange-900", emoji: "🕯️", imageUrl: "/cards/204.jpg", banner: "dark-era", au: "Dark Era" },
];

// ─── IDOL AU CARDS (banner: singer) ──────────────────────────────────────────

const IDOL_AU: Character[] = [
  { id: 301, characterName: "Chuuya Nakahara", variant: "Idol", displayName: "Chuuya", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Emotion", rarity: "SSR", hp: 8900, atk: 4200, def: 3200, skill: "Center Stage", skillDescription: "Steals spotlight — all enemy debuffs bounce back.", gradient: "from-pink-600 to-rose-500", emoji: "🎤", imageUrl: "/cards/301.jpg", banner: "singer", au: "Idol AU" },
  { id: 302, characterName: "Yosano Akiko", variant: "Idol", displayName: "Yosano", ability: "Thou Shalt Not Die", faction: "ADA", element: "Emotion", rarity: "SR", hp: 9800, atk: 2900, def: 3500, skill: "Power Ballad", skillDescription: "Heals 60% HP to all allies.", gradient: "from-fuchsia-500 to-pink-400", emoji: "🎤", imageUrl: "/cards/302.jpg", banner: "singer", au: "Idol AU" },
  { id: 303, characterName: "Kyoka Izumi", variant: "Idol", displayName: "Kyoka", ability: "Demon Snow", faction: "ADA", element: "Emotion", rarity: "SR", hp: 7400, atk: 3400, def: 2100, skill: "Dance Break", skillDescription: "Confuse all enemies for 1 turn.", gradient: "from-violet-500 to-pink-400", emoji: "💃", imageUrl: "/cards/303.jpg", banner: "singer", au: "Idol AU" },
  { id: 304, characterName: "Lucy Montgomery", variant: "Idol", displayName: "Lucy", ability: "Anne of Abyssal Red", faction: "Guild", element: "Emotion", rarity: "R", hp: 6200, atk: 2400, def: 2100, skill: "Fan Cheers", skillDescription: "Random ally gets ATK +30% for 2 turns.", gradient: "from-rose-400 to-orange-300", emoji: "🌟", imageUrl: "/cards/304.jpg", banner: "singer", au: "Idol AU" },
  { id: 305, characterName: "Dazai Osamu", variant: "Idol", displayName: "Dazai", ability: "No Longer Human", faction: "ADA", element: "Emotion", rarity: "SSR", hp: 8000, atk: 3600, def: 2200, skill: "Heartbreak Song", skillDescription: "Reduce all enemies to tears. ATK -30% for 2 turns.", gradient: "from-blue-400 to-violet-500", emoji: "🎵", imageUrl: "/cards/305.jpg", banner: "singer", au: "Idol AU" },
];

// ─── MHA CROSSOVER CARDS (banner: mha) ───────────────────────────────────────

const MHA_AU: Character[] = [
  { id: 401, characterName: "Atsushi Nakajima", variant: "Plus Ultra", displayName: "Atsushi", ability: "Beast Beneath the Moonlight", faction: "ADA", element: "Strength", rarity: "SR", hp: 10200, atk: 4100, def: 2700, skill: "Quirk: White Tiger", skillDescription: "Plus Ultra! ATK ×3 for 1 turn.", gradient: "from-green-500 to-lime-400", emoji: "💪", imageUrl: "/cards/401.jpg", banner: "mha", au: "MHA AU" },
  { id: 402, characterName: "Dazai Osamu", variant: "UA Student", displayName: "Dazai", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "SSR", hp: 8500, atk: 3600, def: 2300, skill: "Quirk: Nullification", skillDescription: "Cancel any quirk used this turn.", gradient: "from-blue-500 to-green-400", emoji: "🦸", imageUrl: "/cards/402.jpg", banner: "mha", au: "MHA AU" },
  { id: 403, characterName: "Akutagawa Ryunosuke", variant: "Villain", displayName: "Akutagawa", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9400, atk: 5100, def: 2600, skill: "Villain Arc Rashomon", skillDescription: "Full villain mode. Ignore shields entirely.", gradient: "from-black to-red-800", emoji: "😈", imageUrl: "/cards/403.jpg", banner: "mha", au: "MHA AU" },
  { id: 404, characterName: "Kenji Miyazawa", variant: "Class 1-A", displayName: "Kenji", ability: "Ame-no-Flügel", faction: "ADA", element: "Strength", rarity: "SR", hp: 12000, atk: 4500, def: 4100, skill: "Quirk: Farm Power", skillDescription: "Infinite strength when hungry. Immune to stun.", gradient: "from-green-600 to-yellow-500", emoji: "💚", imageUrl: "/cards/404.jpg", banner: "mha", au: "MHA AU" },
];

// ─── PJO CARDS (banner: pjo) ─────────────────────────────────────────────────

const PJO_AU: Character[] = [
  { id: 501, characterName: "Dazai Osamu", variant: "Son of Hermes", displayName: "Dazai", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "UR", hp: 9200, atk: 3900, def: 2600, skill: "Hermes' Blessing", skillDescription: "Steal buffs from all enemies. Gain speed +100%.", gradient: "from-sky-500 to-indigo-600", emoji: "⚡", imageUrl: "/cards/501.jpg", banner: "pjo", au: "PJO AU" },
  { id: 502, characterName: "Chuuya Nakahara", variant: "Son of Ares", displayName: "Chuuya", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 10000, atk: 5600, def: 3300, skill: "War God's Wrath", skillDescription: "Ares blesses attack. All damage +60% this turn.", gradient: "from-red-700 to-orange-500", emoji: "⚔️", imageUrl: "/cards/502.jpg", banner: "pjo", au: "PJO AU" },
  { id: 503, characterName: "Fyodor Dostoevsky", variant: "Son of Hades", displayName: "Fyodor", ability: "Crime and Punishment", faction: "Rats", element: "Logic", rarity: "UR", hp: 10200, atk: 4500, def: 3800, skill: "Death's Domain", skillDescription: "All enemies lose 20% max HP immediately.", gradient: "from-gray-900 to-purple-950", emoji: "💀", imageUrl: "/cards/503.jpg", banner: "pjo", au: "PJO AU" },
  { id: 504, characterName: "Atsushi Nakajima", variant: "Son of Apollo", displayName: "Atsushi", ability: "Beast Beneath the Moonlight", faction: "ADA", element: "Emotion", rarity: "SR", hp: 9200, atk: 3800, def: 2800, skill: "Sunlight Healing", skillDescription: "Restore 35% HP to all allies. Cleanse debuffs.", gradient: "from-yellow-400 to-orange-400", emoji: "☀️", imageUrl: "/cards/504.jpg", banner: "pjo", au: "PJO AU" },
];

// ─── GENDER SWAP AU CARDS (banner: genderswap) ───────────────────────────────

const GENDERSWAP_AU: Character[] = [
  { id: 601, characterName: "Dazai Osamu", variant: "Gender Swap", displayName: "Dazai (F)", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "SR", hp: 8000, atk: 3300, def: 2200, skill: "Bandage Butterfly", skillDescription: "Flirtatious nullify — doubles coin reward.", gradient: "from-rose-400 to-pink-300", emoji: "🎀", imageUrl: "/cards/601.jpg", banner: "genderswap", au: "Gender Swap AU" },
  { id: 602, characterName: "Chuuya Nakahara", variant: "Gender Swap", displayName: "Chuuya (F)", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9000, atk: 5100, def: 3000, skill: "Hat Toss", skillDescription: "The gravity is the same. ATK ×2 for 1 turn.", gradient: "from-fuchsia-700 to-red-600", emoji: "🎩", imageUrl: "/cards/602.jpg", banner: "genderswap", au: "Gender Swap AU" },
  { id: 603, characterName: "Akutagawa Ryunosuke", variant: "Gender Swap", displayName: "Akutagawa (F)", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SR", hp: 8600, atk: 4500, def: 2300, skill: "Rashomon Grace", skillDescription: "Rashomon in elegant form. Still just as lethal.", gradient: "from-slate-700 to-pink-900", emoji: "🖤", imageUrl: "/cards/603.jpg", banner: "genderswap", au: "Gender Swap AU" },
];

// ─── FULL CARD POOL ──────────────────────────────────────────────────────────

export const CHARACTERS: Character[] = [
  ...CANON,
  ...HOGWARTS_AU,
  ...DARK_ERA,
  ...IDOL_AU,
  ...MHA_AU,
  ...PJO_AU,
  ...GENDERSWAP_AU,
];

// ─── BANNERS ─────────────────────────────────────────────────────────────────

export interface Banner {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  featured: number[];   // card ids
  rates: Record<Rarity, number>;
  gradient: string;
  limited: boolean;
  endDate: string | null;
  emoji: string;
  pool: number[] | null; // null = all cards in standard pool; else specific card ids
}

export const BANNERS: Banner[] = [
  {
    id: "standard",
    name: "Standard Banner",
    subtitle: "A Dance of Words",
    description: "Pull from the full BSD roster. No expiration.",
    featured: [1, 10, 11],
    rates: { R: 60, SR: 30, SSR: 9, UR: 1 },
    gradient: "from-blue-600 to-indigo-700",
    limited: false,
    endDate: null,
    emoji: "📜",
    pool: null,
  },
  {
    id: "dark-era",
    name: "Dark Era Banner",
    subtitle: "Fifteen Years Ago",
    description: "Young Dazai & Chuuya rate-up! Oda Sakunosuke SSR debut.",
    featured: [201, 202, 204],
    rates: { R: 50, SR: 30, SSR: 15, UR: 5 },
    gradient: "from-red-800 to-slate-900",
    limited: true,
    endDate: "June 30, 2026",
    emoji: "🌑",
    pool: [...CANON.map(c => c.id), ...DARK_ERA.map(c => c.id)],
  },
  {
    id: "harry-potter",
    name: "Hogwarts AU",
    subtitle: "The BSD Wizarding World",
    description: "Slytherin Dazai UR debut! 8 exclusive Hogwarts cards.",
    featured: [101, 106, 102],
    rates: { R: 50, SR: 30, SSR: 15, UR: 5 },
    gradient: "from-purple-800 to-amber-700",
    limited: true,
    endDate: "June 25, 2026",
    emoji: "⚡",
    pool: [...CANON.map(c => c.id), ...HOGWARTS_AU.map(c => c.id)],
  },
  {
    id: "singer",
    name: "BSD Idol AU",
    subtitle: "Port Mafia Goes Pop",
    description: "Idol Chuuya SSR & Idol Dazai SSR debut! 5 exclusive cards.",
    featured: [301, 305, 302],
    rates: { R: 50, SR: 33, SSR: 15, UR: 2 },
    gradient: "from-pink-600 to-rose-500",
    limited: true,
    endDate: "July 10, 2026",
    emoji: "🎤",
    pool: [...CANON.map(c => c.id), ...IDOL_AU.map(c => c.id)],
  },
  {
    id: "mha",
    name: "MHA Crossover",
    subtitle: "Plus Ultra BSD",
    description: "Villain Akutagawa SSR & UA Dazai SSR! 4 exclusive cards.",
    featured: [402, 403, 401],
    rates: { R: 50, SR: 30, SSR: 15, UR: 5 },
    gradient: "from-green-700 to-emerald-600",
    limited: true,
    endDate: "July 20, 2026",
    emoji: "💪",
    pool: [...CANON.map(c => c.id), ...MHA_AU.map(c => c.id)],
  },
  {
    id: "pjo",
    name: "Camp Half-Blood AU",
    subtitle: "Children of Olympus",
    description: "Son of Hermes Dazai UR & Son of Hades Fyodor UR! 4 cards.",
    featured: [501, 503, 502],
    rates: { R: 50, SR: 30, SSR: 15, UR: 5 },
    gradient: "from-sky-700 to-blue-600",
    limited: true,
    endDate: "August 1, 2026",
    emoji: "🏛️",
    pool: [...CANON.map(c => c.id), ...PJO_AU.map(c => c.id)],
  },
  {
    id: "genderswap",
    name: "Gender Swap AU",
    subtitle: "Same Power, Different Vibe",
    description: "F!Chuuya SSR debut! The gravity is still the same.",
    featured: [602, 601, 603],
    rates: { R: 50, SR: 33, SSR: 15, UR: 2 },
    gradient: "from-fuchsia-600 to-rose-500",
    limited: true,
    endDate: "August 15, 2026",
    emoji: "✨",
    pool: [...CANON.map(c => c.id), ...GENDERSWAP_AU.map(c => c.id)],
  },
];

// ─── STUDY DATA ───────────────────────────────────────────────────────────────

export const STUDY_SETS = [
  { id: 1, name: "Calculus", subject: "Math", cards: 42, progress: 78, color: "from-blue-400 to-indigo-500", icon: "📐" },
  { id: 2, name: "World History", subject: "History", cards: 65, progress: 45, color: "from-amber-400 to-orange-500", icon: "🌍" },
  { id: 3, name: "Chemistry", subject: "Science", cards: 38, progress: 92, color: "from-green-400 to-emerald-500", icon: "⚗️" },
  { id: 4, name: "Japanese Literature", subject: "Literature", cards: 29, progress: 30, color: "from-pink-400 to-rose-500", icon: "📚" },
  { id: 5, name: "Physics", subject: "Science", cards: 51, progress: 62, color: "from-violet-400 to-purple-500", icon: "⚛️" },
];

export const QUIZ_QUESTIONS = [
  { question: "What is Dazai Osamu's ability called?", options: ["No Longer Human", "Rashomon", "Crime and Punishment", "Super Deduction"], answer: 0, coins: 15 },
  { question: "Which faction does Chuuya Nakahara belong to?", options: ["ADA", "Guild", "Port Mafia", "Rats"], answer: 2, coins: 10 },
  { question: "What is Atsushi's ability?", options: ["White Tiger Strike", "Beast Beneath the Moonlight", "Tiger's Claw", "Moonlight Fang"], answer: 1, coins: 10 },
  { question: "Who leads the Guild?", options: ["Edgar Poe", "John Steinbeck", "Francis Fitzgerald", "Lucy Montgomery"], answer: 2, coins: 15 },
  { question: "What is Ranpo's ability?", options: ["Logic Bomb", "Super Deduction", "Deduction Mastery", "Crime Solver"], answer: 1, coins: 10 },
  { question: "Fyodor's ability is named after which novel?", options: ["The Brothers Karamazov", "Crime and Punishment", "The Idiot", "The Underground"], answer: 1, coins: 20 },
  { question: "What element is Chuuya?", options: ["Logic", "Emotion", "Strength", "Nature"], answer: 2, coins: 10 },
  { question: "Who has the ability 'Thou Shalt Not Die'?", options: ["Kyoka Izumi", "Lucy Montgomery", "Yosano Akiko", "Higuchi Ichiyou"], answer: 2, coins: 15 },
  { question: "What special combo do Dazai and Chuuya share?", options: ["Soukoku only", "Double Black only", "Tainted Sorrow", "Both A and B"], answer: 3, coins: 25 },
  { question: "Which organization does Fukuchi Ouchi lead?", options: ["ADA", "Port Mafia", "Hunting Dogs", "Rats"], answer: 2, coins: 15 },
];

export const AI_RESPONSES: Record<number, string[]> = {
  1: ["Ah, so you wish to speak with me? How troublesome… I was in the middle of researching a new suicide method.", "You remind me of someone I once knew. Don't worry, that's not necessarily a compliment.", "For the mission, I'll go along with this. But don't expect me to be happy about it."],
  2: ["I'll protect everyone! No matter what it takes!", "I'm not sure I deserve to be here. But I'll keep trying.", "Being human means choosing how to live. I choose to fight for others."],
  10: ["Rashomon shall devour everything in its path.", "Weakness is disgusting. Only power defines a person's worth.", "Dazai… one day I will surpass him. That is my sole purpose."],
  11: ["Oi, don't waste my time. I've got places to be and people to beat up.", "Gravity obeys my whims. Everything else can go to hell.", "Dazai's an idiot, but… we make a good team. Don't tell him I said that."],
  20: ["Sin is not inherent in action, but in the intention behind it. Have you sinned today?", "Every move in this game was calculated long before you arrived.", "Your existence is merely a variable in my equation."],
  3: ["Elementary! I've already deduced everything you were going to say.", "My brain works differently from others. That's not arrogance — it's fact.", "A sweet? Don't mind if I do. Now, where were we?"],
};

export const ACHIEVEMENTS = [
  { id: 1, title: "First Pull", description: "Complete your first gacha pull", icon: "✨", earned: true, xp: 50 },
  { id: 2, title: "Study Streak", description: "Study 7 days in a row", icon: "🔥", earned: true, xp: 200 },
  { id: 3, title: "Quiz Master", description: "Score 100% on a quiz", icon: "🎯", earned: true, xp: 150 },
  { id: 4, title: "Card Collector", description: "Collect 50 cards", icon: "🃏", earned: false, xp: 500 },
  { id: 5, title: "SSR Hunter", description: "Pull your first SSR card", icon: "⭐", earned: true, xp: 300 },
  { id: 6, title: "Pomodoro Pro", description: "Complete 25 Pomodoro sessions", icon: "🍅", earned: false, xp: 400 },
  { id: 7, title: "Battle Victor", description: "Win 10 battles", icon: "⚔️", earned: true, xp: 250 },
  { id: 8, title: "UR Dreamer", description: "Pull your first UR card", icon: "💎", earned: false, xp: 1000 },
  { id: 9, title: "AU Collector", description: "Collect 5 AU variant cards", icon: "🌀", earned: false, xp: 600 },
  { id: 10, title: "Slytherin Pride", description: "Obtain Slytherin Dazai", icon: "🐍", earned: false, xp: 800 },
];
