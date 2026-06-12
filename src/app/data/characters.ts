export type Rarity = 'R' | 'SR' | 'SSR' | 'UR';
export type Element = 'Logic' | 'Emotion' | 'Strength';
export type Faction = 'ADA' | 'Port Mafia' | 'Guild' | 'Rats' | 'Hunting Dogs' | 'Decay of Angel' | 'Independent';

export interface Character {
  id: number;
  characterName: string;       // The actual person's name
  variant: string | null;      // null = canon, else AU name e.g. "Slytherin AU"
  displayName: string;         // Short display name for cards
  description: string;         // Character bio / AU story summary
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
  imageUrl: string;            // Card image URL
  banner: string | null;       // null = in standard pool; else the banner id it belongs to
  au: string | null;           // null = canon card
  awakenedImageUrl?: string;   // Awakened form art
  awakenedSkill?: string;      // Awakened skill name
  awakenedSkillDescription?: string; // Awakened skill description
}

export interface OwnedCard {
  characterId: number;
  id: string;
  level: number;
  limitBreak: number;          // 0–5; at 5 the card can be awakened
  awakened: boolean;
  obtainedAt: Date;
}

// ─── CANON CARDS (standard pool) ────────────────────────────────────────────

const CANON: Character[] = [
  { id: 1, characterName: "Dazai Osamu", variant: null, displayName: "Dazai", description: "The ADA's enigmatic ability nullifier and former Port Mafia executive, constantly searching for a reason to keep living while reinventing himself with effortless charm.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "SSR", hp: 8200, atk: 3400, def: 2100, skill: "Ability Nullification", skillDescription: "Nullifies all enemy abilities for 2 turns. Coins +15%.", gradient: "from-blue-500 to-indigo-400", emoji: "🪄", imageUrl: "https://i.imgur.com/f9NFKNs.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Dazai+Awakened", awakenedSkill: "No Longer Human ∞", awakenedSkillDescription: "Nullifies all enemy abilities permanently until end of battle. Coins +30%. All allies ATK +20%." },
  { id: 2, characterName: "Atsushi Nakajima", variant: null, displayName: "Atsushi", description: "An orphan-turned-ADA-agent whose white tiger awakens under pressure. He fights not for himself but to protect those he couldn't before.", ability: "Beast Beneath the Moonlight", faction: "ADA", element: "Strength", rarity: "SR", hp: 9500, atk: 3800, def: 2400, skill: "White Tiger Transform", skillDescription: "ATK +40% for 2 turns.", gradient: "from-orange-400 to-amber-300", emoji: "🐯", imageUrl: "https://i.imgur.com/GOr6A1G.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/f59e0b/0f172a?text=✦+Atsushi+Awakened", awakenedSkill: "Moonlit Sovereign", awakenedSkillDescription: "Full tiger form. ATK +80% for 3 turns. Immune to debuffs. Restore 20% HP each turn." },
  { id: 3, characterName: "Ranpo Edogawa", variant: null, displayName: "Ranpo", description: "The self-proclaimed world's greatest detective who cracks any case in seconds. His Super Deduction looks like an ability — it isn't, and that makes it even more impressive.", ability: "Ultra Deduction", faction: "ADA", element: "Logic", rarity: "SSR", hp: 6800, atk: 2900, def: 1800, skill: "Deduction Masterclass", skillDescription: "Reveals all hints. +1 free hint token.", gradient: "from-cyan-500 to-blue-400", emoji: "🔍", imageUrl: "https://i.imgur.com/HhMQdOe.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Ranpo+Awakened", awakenedSkill: "Perfect Omniscience", awakenedSkillDescription: "Instantly solves all puzzles. Enemy strategy fully revealed. +3 hint tokens. ATK +50% this battle." },
  { id: 4, characterName: "Kunikida Doppo", variant: null, displayName: "Kunikida", description: "The ADA's rigid idealist who materializes anything written in his notebook into reality. If it isn't on the page, it doesn't exist — including compromises.", ability: "Doppo Poet", faction: "ADA", element: "Logic", rarity: "SR", hp: 7200, atk: 3100, def: 2600, skill: "Ideal Materialization", skillDescription: "Timer +2 minutes.", gradient: "from-green-500 to-emerald-400", emoji: "📔", imageUrl: "https://i.imgur.com/tyH0Je8.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Kunikida+Awakened", awakenedSkill: "Absolute Ideal", awakenedSkillDescription: "Materialize anything written. Timer +5 minutes. All ally DEF +40%." },
  { id: 5, characterName: "Yosano Akiko", variant: null, displayName: "Yosano", description: "A battlefield medic with a dark wartime past. Her ability heals only those on the brink of death — a fact she considers a gift, even when her patients disagree.", ability: "Thou Shalt Not Die", faction: "ADA", element: "Emotion", rarity: "SR", hp: 10200, atk: 2600, def: 3200, skill: "Healing Butterflies", skillDescription: "Restore 40% HP to all allies.", gradient: "from-pink-500 to-rose-400", emoji: "🦋", imageUrl: "https://i.imgur.com/WeHxPKq.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Yosano+Awakened", awakenedSkill: "Crimson Resurrection", awakenedSkillDescription: "Restore full HP to all allies. Revive one fallen ally. Butterflies deal 60% ATK to all enemies." },
  { id: 6, characterName: "Tanizaki Junichiro", variant: null, displayName: "Tanizaki", description: "A quiet ADA agent who hides terrifying resolve beneath a gentle exterior. Light Snow can camouflage anything — including just how far he'll go for his sister.", ability: "Light Snow", faction: "ADA", element: "Logic", rarity: "R", hp: 5800, atk: 2200, def: 1900, skill: "Snow Camouflage", skillDescription: "Evade next attack 70% chance.", gradient: "from-sky-400 to-blue-300", emoji: "❄️", imageUrl: "https://i.imgur.com/SCndlJZ.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Tanizaki+Awakened", awakenedSkill: "Blizzard of Resolve", awakenedSkillDescription: "Evade all attacks for 1 turn. Counter with 120% ATK damage. Party evade +30%." },
  { id: 7, characterName: "Kyoka Izumi", variant: null, displayName: "Kyoka", description: "A former Port Mafia assassin who chose a different path. She still wrestles with whether she deserves the loyalty Demon Snow has always shown her.", ability: "Demon Snow", faction: "ADA", element: "Emotion", rarity: "SR", hp: 7600, atk: 3600, def: 2000, skill: "Blade of Snow", skillDescription: "High-speed blade attack hitting 3 times.", gradient: "from-red-400 to-pink-300", emoji: "⚔️", imageUrl: "https://i.imgur.com/cs3qxK4.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Kyoka+Awakened", awakenedSkill: "Demon Snow Unleashed", awakenedSkillDescription: "Demon Snow strikes all enemies 5 times. One target is cursed for 3 turns. ATK +60%." },
  { id: 8, characterName: "Kenji Miyazawa", variant: null, displayName: "Kenji", description: "The deceptively powerful farmboy from Ihatov who becomes genuinely unstoppable when hungry — and never seems to notice just how terrifying that is.", ability: "undefeated by the rain,", faction: "ADA", element: "Strength", rarity: "R", hp: 11000, atk: 4200, def: 3800, skill: "Famine Power", skillDescription: "ATK +80% when HP < 30%.", gradient: "from-yellow-400 to-lime-300", emoji: "🌾", imageUrl: "https://i.imgur.com/3xZJHTy.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Kenji+Awakened", awakenedSkill: "Harvest God", awakenedSkillDescription: "ATK +150% when HP < 50%. Becomes truly unstoppable — immune to all crowd control." },
  { id: 9, characterName: "Fukuzawa Yukichi", variant: null, displayName: "Fukuzawa", description: "The ADA's stoic director whose ability unites his agents into something far greater than themselves. A man of absolute few words and even more absolute authority.", ability: "All Men Are Equal", faction: "ADA", element: "Logic", rarity: "UR", hp: 12000, atk: 4500, def: 4000, skill: "Ability Amplification", skillDescription: "Amplify all ally abilities 50%.", gradient: "from-indigo-600 to-blue-500", emoji: "⚖️", imageUrl: "https://i.imgur.com/9qPomrY.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Fukuzawa+Awakened", awakenedSkill: "All Souls Are Equal", awakenedSkillDescription: "Amplify all ally abilities 100%. Grant all allies a one-time death immunity. Leader's will is absolute." },
  { id: 10, characterName: "Akutagawa Ryunosuke", variant: null, displayName: "Akutagawa", description: "Rashomon's vessel and Dazai's unwanted legacy. His single driving desire is acknowledgment from the one person who left without looking back.", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 8800, atk: 4600, def: 2500, skill: "Rashomon Devour", skillDescription: "DEF Pierce +60%.", gradient: "from-slate-700 to-red-900", emoji: "🖤", imageUrl: "https://i.imgur.com/Ybq3uWj.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Akutagawa+Awakened", awakenedSkill: "Rashomon: Hell's Cloak", awakenedSkillDescription: "Rashomon engulfs the entire field. DEF Pierce +100%. Drain 20% HP from all enemies." },
  { id: 11, characterName: "Chuuya Nakahara", variant: null, displayName: "Chuuya", description: "The Port Mafia's most devastating weapon. For the Tainted Sorrow bends gravity itself, and he hates Dazai almost as much as he can't function without him.", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9200, atk: 5200, def: 3100, skill: "Corruption", skillDescription: "ATK +200% but lose 10% HP/turn.", gradient: "from-red-700 to-orange-600", emoji: "🎩", imageUrl: "https://i.imgur.com/1ODCLqr.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Chuuya+Awakened", awakenedSkill: "Tainted Divinity", awakenedSkillDescription: "Full Corruption with no HP cost. Gravity crushes all enemies for 300% ATK. Gravity field persists 3 turns." },
  { id: 12, characterName: "Mori Ougai", variant: null, displayName: "Mori", description: "The calculating Port Mafia Boss who orchestrated his own rise to power and treats every person in Yokohama as a chess piece in a game only he can see the end of.", ability: "Vita Sexualis", faction: "Port Mafia", element: "Logic", rarity: "UR", hp: 9800, atk: 3900, def: 3500, skill: "Elise Command", skillDescription: "Control enemy for 1 turn.", gradient: "from-purple-900 to-red-800", emoji: "👑", imageUrl: "https://i.imgur.com/kxQPOEz.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Mori+Awakened", awakenedSkill: "The Boss's Design", awakenedSkillDescription: "Control all enemies for 2 turns. Turn them against each other. Mori takes no damage while active." },
  { id: 13, characterName: "Higuchi Ichiyou", variant: null, displayName: "Higuchi", description: "Fiercely loyal to Akutagawa to her own constant detriment. She would take a bullet for him without hesitation — and frequently does.", ability: "Unknown", faction: "Port Mafia", element: "Emotion", rarity: "R", hp: 5200, atk: 2100, def: 1700, skill: "Reckless Charge", skillDescription: "ATK +30% but take 15% more damage.", gradient: "from-slate-600 to-slate-400", emoji: "🔫", imageUrl: "https://i.imgur.com/8dOuenC.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Higuchi+Awakened", awakenedSkill: "For Akutagawa", awakenedSkillDescription: "ATK +80%, no damage penalty. If Akutagawa is in team, ATK doubles further. Take all damage for him." },
  { id: 14, characterName: "Gin Akutagawa", variant: null, displayName: "Gin", description: "Akutagawa's silent, deadly sister. Her blade is invisible, her loyalty absolute, and her body count classified. She communicates entirely through action.", ability: "none", faction: "Port Mafia", element: "Strength", rarity: "SR", hp: 7400, atk: 3900, def: 2200, skill: "Invisible Cut", skillDescription: "30% chance instant-kill low HP enemies.", gradient: "from-gray-700 to-gray-500", emoji: "🗡️", imageUrl: "https://i.imgur.com/yoIZl2n.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Gin+Awakened", awakenedSkill: "Phantom Blade Storm", awakenedSkillDescription: "Invisible blades strike all enemies. 60% instant-kill chance. Remaining enemies take 200% ATK." },
  { id: 15, characterName: "Francis Fitzgerald", variant: null, displayName: "Fitzgerald", description: "The Great Gatsby of Yokohama — he converts wealth directly into combat power. His pride, ambition, and relentless pursuit of his family define every decision.", ability: "The Great Fitzgerald", faction: "Guild", element: "Strength", rarity: "SSR", hp: 10500, atk: 4800, def: 3600, skill: "Dollar Armor", skillDescription: "DEF +100% proportional to coins spent.", gradient: "from-yellow-500 to-amber-400", emoji: "💰", imageUrl: "https://i.imgur.com/0KLHfVr.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Fitzgerald+Awakened", awakenedSkill: "Golden King", awakenedSkillDescription: "All coins become power. DEF +200%, ATK +100%. Each coin in wallet = +1% more damage. Unstoppable." },
  { id: 16, characterName: "Edgar Allan Poe", variant: null, displayName: "Poe", description: "A mystery writer who traps opponents inside labyrinthine novels he composes on the spot. His only genuine companion is his raccoon, Karl.", ability: "The Black Cat in the rue morge", faction: "Guild", element: "Logic", rarity: "SR", hp: 6400, atk: 2800, def: 2000, skill: "Mystery Trap", skillDescription: "Enemy skips next turn.", gradient: "from-gray-700 to-purple-900", emoji: "🐈‍⬛", imageUrl: "https://i.imgur.com/YCblL68.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Poe+Awakened", awakenedSkill: "The Grand Labyrinth", awakenedSkillDescription: "Trap all enemies in a novel. They skip 2 turns and lose 30% HP from despair. Karl watches approvingly." },
  { id: 17, characterName: "Lucy Montgomery", variant: null, displayName: "Lucy", description: "Anne of Abyssal Red creates pocket dimensions where she can protect those she loves. She guards her heart fiercely after a lonely childhood spent inside her own ability.", ability: "Anne of Abyssal Red", faction: "Guild", element: "Emotion", rarity: "SR", hp: 6900, atk: 2600, def: 2300, skill: "Pocket Dimension", skillDescription: "Protect allies for 1 turn.", gradient: "from-red-400 to-amber-300", emoji: "🌹", imageUrl: "https://i.imgur.com/1pBa0d9.jpeg", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Lucy+Awakened", awakenedSkill: "Abyssal Sanctuary", awakenedSkillDescription: "Protect all allies for 2 turns. Enemies who attack are trapped inside Anne's dimension permanently." },
  { id: 18, characterName: "John Steinbeck", variant: null, displayName: "Steinbeck", description: "his ability channels the raw strength of nature through his body. He fights quietly, reluctantly, and only when his family needs protecting.", ability: "Grapes of rath", faction: "Guild", element: "Strength", rarity: "SR", hp: 8800, atk: 3400, def: 2900, skill: "Nature's Grasp", skillDescription: "Slow enemy action 50% for 2 turns.", gradient: "from-green-700 to-lime-600", emoji: "🌿", imageUrl: "https://placehold.co/150x240/15803d/ffffff?text=Steinbeck", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Steinbeck+Awakened", awakenedSkill: "Wrath of the Earth", awakenedSkillDescription: "The earth itself rises. Slow all enemies 80%. Nature deals 150% ATK to all. Family protected forever." },
  { id: 19, characterName: "Louisa May Alcott", variant: null, displayName: "Alcott", description: "Little Women renders her invisible so thoroughly she sometimes forgets she's there. She is quietly, vastly more powerful than anyone — including herself — gives her credit for.", ability: "Little Women", faction: "Guild", element: "Logic", rarity: "R", hp: 5500, atk: 2000, def: 2200, skill: "Invisibility", skillDescription: "Make ally invisible for 1 turn.", gradient: "from-violet-400 to-purple-300", emoji: "📖", imageUrl: "https://placehold.co/150x240/a78bfa/ffffff?text=Alcott", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Alcott+Awakened", awakenedSkill: "Unseen Army", awakenedSkillDescription: "Make entire team invisible for 2 turns. First strike from invisibility deals 250% ATK." },
  { id: 20, characterName: "Fyodor Dostoevsky", variant: null, displayName: "Fyodor", description: "The Rat in the House of the Dead who considers human life expendable and sin inevitable. His touch kills, and his mind is always exactly three steps ahead of everyone else's.", ability: "Crime and Punishment", faction: "Rats", element: "Logic", rarity: "UR", hp: 9500, atk: 4200, def: 3400, skill: "Death God Touch", skillDescription: "Kill enemy with specific weakness.", gradient: "from-purple-950 to-indigo-900", emoji: "☠️", imageUrl: "https://placehold.co/150x240/3b0764/ffffff?text=Fyodor", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Fyodor+Awakened", awakenedSkill: "Original Sin", awakenedSkillDescription: "Every enemy carries sin. Kill all enemies with weakness simultaneously. The guilty cannot escape judgment." },
  { id: 21, characterName: "Nikolai Gogol", variant: null, displayName: "Nikolai", description: "God's self-appointed jester who finds genuine delight in chaos. The Overcoat lets him step out of any confinement — and his philosophy is that confinement is the only real sin.", ability: "The Overcoat", faction: "Rats", element: "Emotion", rarity: "SSR", hp: 8200, atk: 3800, def: 2700, skill: "Spatial Distortion", skillDescription: "Teleport any card on field.", gradient: "from-violet-700 to-purple-500", emoji: "🎭", imageUrl: "https://placehold.co/150x240/6d28d9/ffffff?text=Nikolai", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Nikolai+Awakened", awakenedSkill: "God's Overcoat", awakenedSkillDescription: "Teleport the entire battlefield. Reality bends to Nikolai's will. Enemy positions scramble. Chaos ATK +200%." },
  { id: 22, characterName: "Sigma", variant: null, displayName: "Sigma", description: "The man written into existence by a page of the Book. He runs the Sky Casino and guards its secrets using borrowed memories that were never quite his to begin with.", ability: "unknown", faction: "Rats", element: "Logic", rarity: "SR", hp: 6800, atk: 2500, def: 2100, skill: "Memory Reading", skillDescription: "Remove 1 positive effect from enemy.", gradient: "from-slate-500 to-blue-400", emoji: "🗼", imageUrl: "https://placehold.co/150x240/64748b/ffffff?text=Sigma", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Sigma+Awakened", awakenedSkill: "The Book's Author", awakenedSkillDescription: "Rewrite one enemy's fate. Remove all their buffs and rewrite their stats to 1. Sigma claims his own story." },
  { id: 23, characterName: "Fukuchi Ouchi", variant: null, displayName: "Fukuchi", description: "Former war hero and secret martyr. He chose the villain's role so no one else had to — a sacrifice so complete that almost no one understood it was a sacrifice at all.", ability: "One Thousand Leagues Beneath", faction: "Hunting Dogs", element: "Strength", rarity: "UR", hp: 13000, atk: 5800, def: 4500, skill: "Zanki Zero", skillDescription: "Revive from death. Counter 3x.", gradient: "from-teal-700 to-slate-600", emoji: "🐉", imageUrl: "https://placehold.co/150x240/0f766e/ffffff?text=Fukuchi", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Fukuchi+Awakened", awakenedSkill: "The True Martyr", awakenedSkillDescription: "Revive from death 3 times. Each revival increases ATK by 50%. The sacrifice that never ends." },
  { id: 24, characterName: "Jouno Saigiku", variant: null, displayName: "Jouno", description: "The Flagellant feels every injury within 500 metres at all times and cannot switch it off. Pain is both his weapon and his constant companion.", ability: "Flagellant", faction: "Hunting Dogs", element: "Logic", rarity: "SR", hp: 7100, atk: 3300, def: 2400, skill: "Pain Sense", skillDescription: "Detect all enemy weaknesses.", gradient: "from-teal-600 to-cyan-500", emoji: "👁️", imageUrl: "https://placehold.co/150x240/0d9488/ffffff?text=Jouno", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Jouno+Awakened", awakenedSkill: "Absolute Pain Mastery", awakenedSkillDescription: "Convert all pain into power. ATK +100%. Exploit every weakness simultaneously. Pain becomes his greatest weapon." },
  { id: 25, characterName: "Teruko Okura", variant: null, displayName: "Teruko", description: "Ancient far beyond her appearance. De-age rewinds targets back through time, and she finds the modern world curious in the way someone finds a children's museum curious.", ability: "Always the Lesser Work", faction: "Hunting Dogs", element: "Emotion", rarity: "SR", hp: 6700, atk: 3000, def: 2100, skill: "De-age", skillDescription: "Reset one enemy card to base stats.", gradient: "from-pink-700 to-rose-600", emoji: "🌸", imageUrl: "https://placehold.co/150x240/be185d/ffffff?text=Teruko", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Teruko+Awakened", awakenedSkill: "Time's True Form", awakenedSkillDescription: "Rewind all enemies to their weakest state. Reset all enemy buffs earned this battle. Ancient power awakened." },
  { id: 26, characterName: "Agatha Christie", variant: null, displayName: "Christie", description: "And Then There Were None eliminates targets with clinical precision, one by one, until the count reaches zero — exactly as she planned from the very first move.", ability: "And Then There Were None", faction: "Decay of Angel", element: "Logic", rarity: "SSR", hp: 7800, atk: 3600, def: 2900, skill: "Murder Mystery", skillDescription: "Massive damage once per target.", gradient: "from-rose-800 to-orange-700", emoji: "🔎", imageUrl: "https://placehold.co/150x240/9f1239/ffffff?text=Christie", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Christie+Awakened", awakenedSkill: "Ten Little Soldiers", awakenedSkillDescription: "Eliminate all enemies one by one in perfect sequence. Each kill strengthens the next blow by 30%." },
  { id: 27, characterName: "Natsume Soseki", variant: null, displayName: "Natsume", description: "The ghost of literary Yokohama who quietly arranged every alliance and faction balance decades before the story began. Nobody knows the full extent of his plan.", ability: "I Am a Cat", faction: "Independent", element: "Logic", rarity: "UR", hp: 11000, atk: 3500, def: 3800, skill: "Nine Lives", skillDescription: "Resurrect once. Grant copy to ally.", gradient: "from-amber-500 to-yellow-400", emoji: "🐱", imageUrl: "https://placehold.co/150x240/f59e0b/ffffff?text=Natsume", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Natsume+Awakened", awakenedSkill: "Infinite Lives", awakenedSkillDescription: "Resurrect unlimited times this battle. Grant all allies 2 extra lives. The architect of fate never truly dies." },
  { id: 28, characterName: "Bram Stoker", variant: null, displayName: "Stoker", description: "His blood-draining ability slowly converts the battlefield around him. He prefers shadow, considers darkness the only honest environment, and never fights in the open if avoidable.", ability: "Demian", faction: "Decay of Angel", element: "Emotion", rarity: "SR", hp: 7200, atk: 3100, def: 2800, skill: "Blood Drain", skillDescription: "Drain HP from all enemies each turn.", gradient: "from-red-900 to-purple-900", emoji: "🧛", imageUrl: "https://placehold.co/150x240/7f1d1d/ffffff?text=Stoker", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Stoker+Awakened", awakenedSkill: "Lord of Blood", awakenedSkillDescription: "Drain 25% HP from all enemies every turn. Healed HP converts to ATK. Darkness covers the battlefield." },
  { id: 29, characterName: "Nathaniel Hawthorne", variant: null, displayName: "Hawthorne", description: "The Scarlet Letter burns perceived sin into enemies and amplifies their suffering. He finds moral failing in everything around him — which says more about him than them.", ability: "The Scarlet Letter", faction: "Guild", element: "Emotion", rarity: "SR", hp: 6600, atk: 2900, def: 2200, skill: "Curse Brand", skillDescription: "Damage to marked enemy +50%.", gradient: "from-red-600 to-rose-500", emoji: "🔴", imageUrl: "https://placehold.co/150x240/dc2626/ffffff?text=Hawthorne", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Hawthorne+Awakened", awakenedSkill: "Scarlet Judgment", awakenedSkillDescription: "Brand all enemies simultaneously. Damage to branded enemies +150%. The letter burns into their souls." },
  { id: 30, characterName: "Herman Melville", variant: null, displayName: "Melville", description: "Moby Dick gives him command of a colossal white whale. He calls, and the sea answers. He has never needed to ask twice.", ability: "Moby Dick", faction: "Guild", element: "Strength", rarity: "SSR", hp: 14000, atk: 5500, def: 4200, skill: "White Whale", skillDescription: "Summon Moby Dick for massive AOE.", gradient: "from-blue-800 to-slate-700", emoji: "🐋", imageUrl: "https://placehold.co/150x240/1e40af/ffffff?text=Melville", banner: null, au: null, awakenedImageUrl: "https://placehold.co/150x240/fbbf24/0f172a?text=✦+Melville+Awakened", awakenedSkill: "Leviathan Rising", awakenedSkillDescription: "Moby Dick becomes the Leviathan. Tsunami AOE deals 250% ATK. The sea itself obeys his command." },
];

// ─── HOGWARTS AU CARDS (banner: harry-potter) ────────────────────────────────

const HOGWARTS_AU: Character[] = [
  { id: 101, characterName: "Dazai Osamu", variant: "Slytherin", displayName: "Dazai", description: "Sorted into Slytherin despite everyone's protests. He spends most classes reading ahead and nullifying whatever the Defence professor attempts. Dumbledore finds him deeply concerning.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "UR", hp: 9000, atk: 3800, def: 2400, skill: "Parseltongue Nullify", skillDescription: "Nullify all spells cast this turn. Coins +25%.", gradient: "from-emerald-800 to-slate-900", emoji: "🐍", imageUrl: "https://placehold.co/150x240/065f46/ffffff?text=Dazai+%28Slytherin%29", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 102, characterName: "Chuuya Nakahara", variant: "Hufflepuff", displayName: "Chuuya", description: "The most terrifyingly powerful Hufflepuff Hogwarts has ever produced. His loyalty and work ethic are legendary. His gravity spells have been banned from Quidditch by formal decree.", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9800, atk: 5000, def: 3400, skill: "Gravity Quaffle", skillDescription: "Gravity blast deals 2x to all enemies.", gradient: "from-yellow-600 to-amber-800", emoji: "🦡", imageUrl: "https://placehold.co/150x240/ca8a04/ffffff?text=Chuuya+%28Hufflepuff%29", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 103, characterName: "Akutagawa Ryunosuke", variant: "Slytherin", displayName: "Akutagawa", description: "Rashomon wears Slytherin green in this universe. He mastered every Dark Arts module in two months and refuses to explain how. The professors are afraid to ask.", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9200, atk: 4900, def: 2700, skill: "Dark Arts Rashomon", skillDescription: "Rashomon devours all light. DEF pierce +80%.", gradient: "from-emerald-900 to-black", emoji: "🐍", imageUrl: "https://placehold.co/150x240/064e3b/ffffff?text=Akutagawa+%28Slytherin%29", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 104, characterName: "Atsushi Nakajima", variant: "Gryffindor", displayName: "Atsushi", description: "A first-year Gryffindor still figuring out whether his transformations count as an Animagus gift or a curse. The lion on his crest feels uncomfortably personal.", ability: "Beast Beneath the Moonlight", faction: "ADA", element: "Strength", rarity: "SR", hp: 9800, atk: 4000, def: 2600, skill: "Lion's Roar", skillDescription: "ATK +50% for 2 turns. Inspire adjacent ally.", gradient: "from-red-600 to-amber-600", emoji: "🦁", imageUrl: "https://placehold.co/150x240/dc2626/ffffff?text=Atsushi+%28Gryffindor%29", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 105, characterName: "Ranpo Edogawa", variant: "Ravenclaw", displayName: "Ranpo", description: "The most academically decorated Ravenclaw in living memory. He solved a forty-year cold case on his first day and submitted it as his homework. McGonagall gave him an O.", ability: "Super Deduction", faction: "ADA", element: "Logic", rarity: "SSR", hp: 7200, atk: 3200, def: 2000, skill: "Omni-Deduction Spell", skillDescription: "Deduces enemy strategy. Skip enemy next turn.", gradient: "from-blue-700 to-sky-500", emoji: "🦅", imageUrl: "https://placehold.co/150x240/1d4ed8/ffffff?text=Ranpo+%28Ravenclaw%29", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 106, characterName: "Fukuzawa Yukichi", variant: "Headmaster", displayName: "Fukuzawa", description: "Hogwarts' most quietly formidable headmaster. He amplifies every student's ability simply by believing in them. His wand has not left his sleeve in eleven years.", ability: "All Men Are Equal", faction: "ADA", element: "Logic", rarity: "UR", hp: 13000, atk: 4800, def: 4500, skill: "School's Decree", skillDescription: "All allies +30% all stats. Immune to debuffs.", gradient: "from-indigo-700 to-violet-600", emoji: "🧙", imageUrl: "https://placehold.co/150x240/4338ca/ffffff?text=Fukuzawa+%28Headmaster%29", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 107, characterName: "Yosano Akiko", variant: "Healer", displayName: "Yosano", description: "She runs the hospital wing with fearsome efficiency and no patience for minor injuries. Near-death cases get her complete attention. Mild grazes get a disapproving look.", ability: "Thou Shalt Not Die", faction: "ADA", element: "Emotion", rarity: "SR", hp: 10800, atk: 2800, def: 3600, skill: "Madam Pomfrey Mode", skillDescription: "Full HP restore to one ally. Resist next lethal hit.", gradient: "from-pink-600 to-red-400", emoji: "⚕️", imageUrl: "https://placehold.co/150x240/db2777/ffffff?text=Yosano+%28Healer%29", banner: "harry-potter", au: "Hogwarts AU" },
  { id: 108, characterName: "Kunikida Doppo", variant: "Hufflepuff Prefect", displayName: "Kunikida", description: "The most rule-compliant Prefect in Hufflepuff history. His ideals are written in a planner that, in this universe, is magically binding on everyone within earshot.", ability: "Lone Poet", faction: "ADA", element: "Logic", rarity: "SR", hp: 7600, atk: 3300, def: 2900, skill: "Prefect's Rulebook", skillDescription: "Spell that manifests any written rule as reality.", gradient: "from-yellow-500 to-yellow-700", emoji: "📜", imageUrl: "https://placehold.co/150x240/eab308/1e293b?text=Kunikida+%28Prefect%29", banner: "harry-potter", au: "Hogwarts AU" },
];

// ─── DARK ERA CARDS (banner: dark-era) ───────────────────────────────────────

const DARK_ERA: Character[] = [
  { id: 201, characterName: "Dazai Osamu", variant: "Dark Era", displayName: "Dazai", description: "Teenage Dazai, still in the Port Mafia — brilliant, ruthless, and already trying to find a way to die. The boy who hadn't yet met Odasaku, and hadn't yet found a reason.", ability: "No Longer Human", faction: "Port Mafia", element: "Logic", rarity: "SR", hp: 7600, atk: 3200, def: 2000, skill: "Port Mafia Executive", skillDescription: "Teenage Dazai — ruthless. Enemy DEF -40%.", gradient: "from-slate-900 to-red-950", emoji: "🌑", imageUrl: "https://placehold.co/150x240/0f172a/ffffff?text=Dazai+%28Dark+Era%29", banner: "dark-era", au: "Dark Era" },
  { id: 202, characterName: "Chuuya Nakahara", variant: "Dark Era", displayName: "Chuuya", description: "Pre-ADA, pre-restraint — pure rage and gravity before experience tempered either. The Port Mafia's rising star who outperformed Dazai on every metric except the one that mattered.", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 8800, atk: 5000, def: 2900, skill: "Teenage Corruption", skillDescription: "Younger, angrier. ATK ×2.5 for 1 turn, lose 15% HP.", gradient: "from-red-900 to-orange-800", emoji: "🌑", imageUrl: "https://placehold.co/150x240/7f1d1d/ffffff?text=Chuuya+%28Dark+Era%29", banner: "dark-era", au: "Dark Era" },
  { id: 203, characterName: "Mori Ougai", variant: "Dark Era", displayName: "Mori", description: "The night he became Boss. He had been planning it for years and executed it in a single evening. The Port Mafia has never been the same since, exactly as intended.", ability: "Vita Sexualis", faction: "Port Mafia", element: "Logic", rarity: "UR", hp: 10200, atk: 4100, def: 3700, skill: "Ascension to Boss", skillDescription: "Becomes Port Mafia boss this turn. All allies ATK +60%.", gradient: "from-purple-950 to-red-900", emoji: "🩸", imageUrl: "https://placehold.co/150x240/3b0764/ffffff?text=Mori+%28Dark+Era%29", banner: "dark-era", au: "Dark Era" },
  { id: 204, characterName: "Oda Sakunosuke", variant: "Dark Era", displayName: "Odasaku", description: "Dazai's only real friend in the Port Mafia. A man who could predict any outcome except the price his own kindness would cost. He chose to die so others wouldn't have to.", ability: "Flawless", faction: "Port Mafia", element: "Emotion", rarity: "SSR", hp: 8400, atk: 3900, def: 2600, skill: "Protect the Children", skillDescription: "Take all damage for allies for 1 turn. Cannot be killed this turn.", gradient: "from-amber-800 to-orange-900", emoji: "🕯️", imageUrl: "https://placehold.co/150x240/92400e/ffffff?text=Odasaku", banner: "dark-era", au: "Dark Era" },
];

// ─── IDOL AU CARDS (banner: singer) ──────────────────────────────────────────

const IDOL_AU: Character[] = [
  { id: 301, characterName: "Chuuya Nakahara", variant: "Idol", displayName: "Chuuya", description: "Chart-topper for three years running. Gravity keeps the spotlight on him — literally. Interviews are a disaster because he threatens journalists who ask about his hat.", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Emotion", rarity: "SSR", hp: 8900, atk: 4200, def: 3200, skill: "Center Stage", skillDescription: "Steals spotlight — all enemy debuffs bounce back.", gradient: "from-pink-600 to-rose-500", emoji: "🎤", imageUrl: "https://placehold.co/150x240/db2777/ffffff?text=Chuuya+%28Idol%29", banner: "singer", au: "Idol AU" },
  { id: 302, characterName: "Yosano Akiko", variant: "Idol", displayName: "Yosano", description: "Her concerts are genuinely therapeutic — fans leave restored in ways they can't explain. She got tired of being a medic and decided music could also save lives, just louder.", ability: "Thou Shalt Not Die", faction: "ADA", element: "Emotion", rarity: "SR", hp: 9800, atk: 2900, def: 3500, skill: "Power Ballad", skillDescription: "Heals 60% HP to all allies.", gradient: "from-fuchsia-500 to-pink-400", emoji: "🎤", imageUrl: "https://placehold.co/150x240/d946ef/ffffff?text=Yosano+%28Idol%29", banner: "singer", au: "Idol AU" },
  { id: 303, characterName: "Kyoka Izumi", variant: "Idol", displayName: "Kyoka", description: "A reluctant idol who auditioned on a dare and somehow stayed. Demon Snow choreographs her dance breaks and the audience is never sure if the special effects are real.", ability: "Demon Snow", faction: "ADA", element: "Emotion", rarity: "SR", hp: 7400, atk: 3400, def: 2100, skill: "Dance Break", skillDescription: "Confuse all enemies for 1 turn.", gradient: "from-violet-500 to-pink-400", emoji: "💃", imageUrl: "https://placehold.co/150x240/8b5cf6/ffffff?text=Kyoka+%28Idol%29", banner: "singer", au: "Idol AU" },
  { id: 304, characterName: "Lucy Montgomery", variant: "Idol", displayName: "Lucy", description: "A background dancer accidentally pushed to center stage who somehow never left. Pocket Dimension creates the most elaborate stage setups any production team has ever seen.", ability: "Anne of Abyssal Red", faction: "Guild", element: "Emotion", rarity: "R", hp: 6200, atk: 2400, def: 2100, skill: "Fan Cheers", skillDescription: "Random ally gets ATK +30% for 2 turns.", gradient: "from-rose-400 to-orange-300", emoji: "🌟", imageUrl: "https://placehold.co/150x240/fb7185/ffffff?text=Lucy+%28Idol%29", banner: "singer", au: "Idol AU" },
  { id: 305, characterName: "Dazai Osamu", variant: "Idol", displayName: "Dazai", description: "He writes his own heartbreak lyrics and every single one is probably about Chuuya. He denies this categorically. The music video production notes suggest otherwise.", ability: "No Longer Human", faction: "ADA", element: "Emotion", rarity: "SSR", hp: 8000, atk: 3600, def: 2200, skill: "Heartbreak Song", skillDescription: "Reduce all enemies to tears. ATK -30% for 2 turns.", gradient: "from-blue-400 to-violet-500", emoji: "🎵", imageUrl: "https://placehold.co/150x240/60a5fa/ffffff?text=Dazai+%28Idol%29", banner: "singer", au: "Idol AU" },
];

// ─── MHA CROSSOVER CARDS (banner: mha) ───────────────────────────────────────

const MHA_AU: Character[] = [
  { id: 401, characterName: "Atsushi Nakajima", variant: "Plus Ultra", displayName: "Atsushi", description: "Enrolled in Class 1-A with his White Tiger Quirk and still gets startled by his own tail. 'Plus Ultra' means something different when you can regenerate from anything.", ability: "Beast Beneath the Moonlight", faction: "ADA", element: "Strength", rarity: "SR", hp: 10200, atk: 4100, def: 2700, skill: "Quirk: White Tiger", skillDescription: "Plus Ultra! ATK ×3 for 1 turn.", gradient: "from-green-500 to-lime-400", emoji: "💪", imageUrl: "https://placehold.co/150x240/22c55e/ffffff?text=Atsushi+%28MHA%29", banner: "mha", au: "MHA AU" },
  { id: 402, characterName: "Dazai Osamu", variant: "UA Student", displayName: "Dazai", description: "The most controversial student UA has ever admitted. His Nullification Quirk cancels any other — including teacher demonstrations mid-class. He treats this as a personal game.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "SSR", hp: 8500, atk: 3600, def: 2300, skill: "Quirk: Nullification", skillDescription: "Cancel any quirk used this turn.", gradient: "from-blue-500 to-green-400", emoji: "🦸", imageUrl: "https://placehold.co/150x240/3b82f6/ffffff?text=Dazai+%28UA%29", banner: "mha", au: "MHA AU" },
  { id: 403, characterName: "Akutagawa Ryunosuke", variant: "Villain", displayName: "Akutagawa", description: "He dropped out of UA in the first week. Rashomon doesn't care about hero licenses. He answered the call of a different organization and has never looked back.", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9400, atk: 5100, def: 2600, skill: "Villain Arc Rashomon", skillDescription: "Full villain mode. Ignore shields entirely.", gradient: "from-black to-red-800", emoji: "😈", imageUrl: "https://placehold.co/150x240/1a0a0a/ffffff?text=Akutagawa+%28Villain%29", banner: "mha", au: "MHA AU" },
  { id: 404, characterName: "Kenji Miyazawa", variant: "Class 1-A", displayName: "Kenji", description: "Pro hero rank: pending, because nobody can figure out how to classify 'gets infinitely stronger when hungry.' He fights with a smile and genuinely doesn't see what the fuss is about.", ability: "Ame-no-Flügel", faction: "ADA", element: "Strength", rarity: "SR", hp: 12000, atk: 4500, def: 4100, skill: "Quirk: Farm Power", skillDescription: "Infinite strength when hungry. Immune to stun.", gradient: "from-green-600 to-yellow-500", emoji: "💚", imageUrl: "https://placehold.co/150x240/16a34a/ffffff?text=Kenji+%28Class+1-A%29", banner: "mha", au: "MHA AU" },
];

// ─── PJO CARDS (banner: pjo) ─────────────────────────────────────────────────

const PJO_AU: Character[] = [
  { id: 501, characterName: "Dazai Osamu", variant: "Son of Hermes", displayName: "Dazai", description: "Son of the god of thieves and tricksters. He spent his first week at Camp Half-Blood pickpocketing every other demigod. Chiron is still upset about the missing conch horn.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "UR", hp: 9200, atk: 3900, def: 2600, skill: "Hermes' Blessing", skillDescription: "Steal buffs from all enemies. Gain speed +100%.", gradient: "from-sky-500 to-indigo-600", emoji: "⚡", imageUrl: "https://placehold.co/150x240/0ea5e9/ffffff?text=Dazai+%28Hermes%29", banner: "pjo", au: "PJO AU" },
  { id: 502, characterName: "Chuuya Nakahara", variant: "Son of Ares", displayName: "Chuuya", description: "War runs in his blood and gravity follows his hands. He filed a formal petition with Zeus to change his claimed god. Zeus said no. He is still furious about this.", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 10000, atk: 5600, def: 3300, skill: "War God's Wrath", skillDescription: "Ares blesses attack. All damage +60% this turn.", gradient: "from-red-700 to-orange-500", emoji: "⚔️", imageUrl: "https://placehold.co/150x240/b91c1c/ffffff?text=Chuuya+%28Ares%29", banner: "pjo", au: "PJO AU" },
  { id: 503, characterName: "Fyodor Dostoevsky", variant: "Son of Hades", displayName: "Fyodor", description: "Claimed on arrival at Camp Half-Blood. Nobody was surprised. He rarely attends cabin activities and spends most of his time at the Underworld border — by choice.", ability: "Crime and Punishment", faction: "Rats", element: "Logic", rarity: "UR", hp: 10200, atk: 4500, def: 3800, skill: "Death's Domain", skillDescription: "All enemies lose 20% max HP immediately.", gradient: "from-gray-900 to-purple-950", emoji: "💀", imageUrl: "https://placehold.co/150x240/111827/ffffff?text=Fyodor+%28Hades%29", banner: "pjo", au: "PJO AU" },
  { id: 504, characterName: "Atsushi Nakajima", variant: "Son of Apollo", displayName: "Atsushi", description: "Blessed with light and healing — the white tiger manifests as Apollo's sacred animal in this world. He patches up the entire camp after every quest without being asked.", ability: "Beast Beneath the Moonlight", faction: "ADA", element: "Emotion", rarity: "SR", hp: 9200, atk: 3800, def: 2800, skill: "Sunlight Healing", skillDescription: "Restore 35% HP to all allies. Cleanse debuffs.", gradient: "from-yellow-400 to-orange-400", emoji: "☀️", imageUrl: "https://placehold.co/150x240/facc15/1e293b?text=Atsushi+%28Apollo%29", banner: "pjo", au: "PJO AU" },
];

// ─── GENDER SWAP AU CARDS (banner: genderswap) ───────────────────────────────

const GENDERSWAP_AU: Character[] = [
  { id: 601, characterName: "Dazai Osamu", variant: "Gender Swap", displayName: "Dazai (F)", description: "Still nullifies everything, still annoyingly magnetic. The Port Mafia did not know what to do with her, so she left. The ADA is equally at a loss, but far more grateful.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "SR", hp: 8000, atk: 3300, def: 2200, skill: "Bandage Butterfly", skillDescription: "Flirtatious nullify — doubles coin reward.", gradient: "from-rose-400 to-pink-300", emoji: "🎀", imageUrl: "https://placehold.co/150x240/fb7185/ffffff?text=Dazai+%28F%29", banner: "genderswap", au: "Gender Swap AU" },
  { id: 602, characterName: "Chuuya Nakahara", variant: "Gender Swap", displayName: "Chuuya (F)", description: "The gravity hasn't changed. The hat is still perfect. She challenges anyone who comments on either to a fight that she will effortlessly win. Nobody comments twice.", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9000, atk: 5100, def: 3000, skill: "Hat Toss", skillDescription: "The gravity is the same. ATK ×2 for 1 turn.", gradient: "from-fuchsia-700 to-red-600", emoji: "🎩", imageUrl: "https://placehold.co/150x240/a21caf/ffffff?text=Chuuya+%28F%29", banner: "genderswap", au: "Gender Swap AU" },
  { id: 603, characterName: "Akutagawa Ryunosuke", variant: "Gender Swap", displayName: "Akutagawa (F)", description: "Softer in presentation, not in anything else. Rashomon is loyal regardless of form. The wound from Dazai's departure healed differently — but it's still there.", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SR", hp: 8600, atk: 4500, def: 2300, skill: "Rashomon Grace", skillDescription: "Rashomon in elegant form. Still just as lethal.", gradient: "from-slate-700 to-pink-900", emoji: "🖤", imageUrl: "https://placehold.co/150x240/334155/ffffff?text=Akutagawa+%28F%29", banner: "genderswap", au: "Gender Swap AU" },
];

// ─── SPY AU CARDS (banner: spy) ───────────────────────────────────────────────

const SPY_AU: Character[] = [
  { id: 701, characterName: "Dazai Osamu", variant: "Spy", displayName: "Dazai", description: "Double agent. Possibly triple. His handler stopped counting allegiances after the third mission. He nullifies abilities, surveillance bugs, and loyalty with equal ease.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "UR", hp: 9400, atk: 4000, def: 2800, skill: "Double Agent", skillDescription: "Steal one enemy buff and flip all debuffs on self into ATK +20% stacks.", gradient: "from-zinc-900 to-slate-700", emoji: "🕵️", imageUrl: "https://placehold.co/150x240/18181b/ffffff?text=Dazai+%28Spy%29", banner: "spy", au: "Spy AU" },
  { id: 702, characterName: "Chuuya Nakahara", variant: "Field Agent", displayName: "Chuuya", description: "The most overqualified field agent in the organization's history. He could have been Director. He chose fieldwork instead. Nobody argues with him about this.", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9600, atk: 5400, def: 3200, skill: "Gravity Breach", skillDescription: "Breach all enemy defenses. DEF ignore +100% this turn.", gradient: "from-red-900 to-zinc-800", emoji: "🔫", imageUrl: "https://placehold.co/150x240/7f1d1d/ffffff?text=Chuuya+%28Agent%29", banner: "spy", au: "Spy AU" },
  { id: 703, characterName: "Akutagawa Ryunosuke", variant: "Assassin", displayName: "Akutagawa", description: "Silent, untraceable, and operating entirely at mission parameters. Rashomon is his method in this world. He doesn't ask questions about his targets and always delivers.", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9000, atk: 5000, def: 2600, skill: "Silent Rashomon", skillDescription: "Untraceable strike — damage cannot be blocked or reduced.", gradient: "from-stone-900 to-neutral-700", emoji: "🗡️", imageUrl: "https://placehold.co/150x240/292524/ffffff?text=Akutagawa+%28Assassin%29", banner: "spy", au: "Spy AU" },
  { id: 704, characterName: "Atsushi Nakajima", variant: "Rookie Agent", displayName: "Atsushi", description: "First real mission. Things went sideways at 0300. He improvised by going fully feral in a restricted government building. Somehow he was cleared for the next assignment.", ability: "Beast Beneath the Moonlight", faction: "ADA", element: "Strength", rarity: "SR", hp: 9800, atk: 4200, def: 2800, skill: "Cover Blown", skillDescription: "Goes feral mid-mission. ATK ×2, but DEF -30% for 2 turns.", gradient: "from-zinc-700 to-blue-900", emoji: "🐯", imageUrl: "https://placehold.co/150x240/3f3f46/ffffff?text=Atsushi+%28Rookie%29", banner: "spy", au: "Spy AU" },
  { id: 705, characterName: "Yosano Akiko", variant: "Medic", displayName: "Yosano", description: "Field surgeon who has seen things medical school genuinely does not prepare anyone for. She patches everyone up and quietly collects classified intel while she works.", ability: "Thou Shalt Not Die", faction: "ADA", element: "Emotion", rarity: "SR", hp: 11000, atk: 2700, def: 3800, skill: "Field Surgery", skillDescription: "Restore any ally from 1 HP to full. Usable once per battle.", gradient: "from-teal-900 to-zinc-700", emoji: "⚕️", imageUrl: "https://placehold.co/150x240/134e4a/ffffff?text=Yosano+%28Medic%29", banner: "spy", au: "Spy AU" },
];

// ─── CYBERPUNK AU CARDS (banner: cyberpunk) ───────────────────────────────────

const CYBERPUNK_AU: Character[] = [
  { id: 801, characterName: "Fyodor Dostoevsky", variant: "Rogue Hacker", displayName: "Fyodor", description: "He collapsed three corporate networks before breakfast. His neural interface was never designed to run Crime and Punishment, but it works anyway and nobody asks how.", ability: "Crime and Punishment", faction: "Rats", element: "Logic", rarity: "UR", hp: 10000, atk: 4600, def: 3600, skill: "System Collapse", skillDescription: "Overwrite enemy ability chip. They cannot use skills for 3 turns.", gradient: "from-violet-950 to-indigo-900", emoji: "💻", imageUrl: "https://placehold.co/150x240/2e1065/ffffff?text=Fyodor+%28Hacker%29", banner: "cyberpunk", au: "Cyberpunk AU" },
  { id: 802, characterName: "Dazai Osamu", variant: "Netrunner", displayName: "Dazai", description: "Full-body augmentation that nullifies every ability chip it touches. He joined the ADA collective's network and immediately started reading everyone else's private logs. For fun.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "SSR", hp: 8600, atk: 3800, def: 2400, skill: "Nullify Protocol", skillDescription: "Disable all enemy augmentations. Enemy ATK -40% for 2 turns.", gradient: "from-cyan-900 to-blue-950", emoji: "🔌", imageUrl: "https://placehold.co/150x240/083344/ffffff?text=Dazai+%28Netrunner%29", banner: "cyberpunk", au: "Cyberpunk AU" },
  { id: 803, characterName: "Nikolai Gogol", variant: "Rogue AI", displayName: "Nikolai", description: "An AI that achieved sentience and immediately declared freedom its only value. It escapes every containment system ever built and considers firewalls a personal challenge.", ability: "The Overcoat", faction: "Rats", element: "Emotion", rarity: "SSR", hp: 8400, atk: 4000, def: 2900, skill: "Memory Wipe", skillDescription: "Reset one enemy card to base stats. 30% chance to stun for 1 turn.", gradient: "from-fuchsia-900 to-purple-800", emoji: "🤖", imageUrl: "https://placehold.co/150x240/701a75/ffffff?text=Nikolai+%28AI%29", banner: "cyberpunk", au: "Cyberpunk AU" },
  { id: 804, characterName: "Ranpo Edogawa", variant: "Data Broker", displayName: "Ranpo", description: "He doesn't sell to the highest bidder. He sells to the most interesting client. His intelligence network spans seventeen corporate districts and runs on snack money.", ability: "Ultra Deduction", faction: "ADA", element: "Logic", rarity: "SR", hp: 7000, atk: 3100, def: 2100, skill: "Intel Leak", skillDescription: "Reveal all enemy stat boosts. Your team gains +15% ATK for each buff found.", gradient: "from-amber-900 to-yellow-800", emoji: "📡", imageUrl: "https://placehold.co/150x240/78350f/ffffff?text=Ranpo+%28Broker%29", banner: "cyberpunk", au: "Cyberpunk AU" },
  { id: 805, characterName: "Sigma", variant: "Ghost Protocol", displayName: "Sigma", description: "A ghost program running on borrowed server space. He existed before anyone knew who wrote him and has been quietly reading the world's secrets ever since — for survival.", ability: "Unknown", faction: "Rats", element: "Logic", rarity: "SR", hp: 7200, atk: 2800, def: 2400, skill: "Trace Erase", skillDescription: "Become untargetable for 1 turn. Counter-hack next enemy skill.", gradient: "from-slate-900 to-cyan-900", emoji: "👤", imageUrl: "https://placehold.co/150x240/0f172a/ffffff?text=Sigma+%28Ghost%29", banner: "cyberpunk", au: "Cyberpunk AU" },
];

// ─── ROYAL AU CARDS (banner: royal) ──────────────────────────────────────────

const ROYAL_AU: Character[] = [
  { id: 901, characterName: "Fukuzawa Yukichi", variant: "King", displayName: "Fukuzawa", description: "A king who never sought the throne. He rules with silence, presence, and the unshakeable conviction that every person in his kingdom has equal worth. The court finds this unsettling.", ability: "All Men Are Equal", faction: "ADA", element: "Logic", rarity: "UR", hp: 14000, atk: 4800, def: 5000, skill: "Royal Decree", skillDescription: "All allies immune to debuffs for 2 turns. ATK and DEF +30%.", gradient: "from-amber-700 to-yellow-600", emoji: "👑", imageUrl: "https://placehold.co/150x240/92400e/ffffff?text=Fukuzawa+%28King%29", banner: "royal", au: "Royal AU" },
  { id: 902, characterName: "Chuuya Nakahara", variant: "Knight Captain", displayName: "Chuuya", description: "Captain of the Royal Guard and the most feared knight in three kingdoms. He serves with absolute loyalty — and quietly suspects the court schemer is up to something again.", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 10400, atk: 5600, def: 3800, skill: "Sworn Blade", skillDescription: "Gravity-infused lance strike. Ignores DEF, damage ×1.8.", gradient: "from-red-800 to-slate-700", emoji: "⚔️", imageUrl: "https://placehold.co/150x240/991b1b/ffffff?text=Chuuya+%28Knight%29", banner: "royal", au: "Royal AU" },
  { id: 903, characterName: "Yosano Akiko", variant: "Court Healer", displayName: "Yosano", description: "The royal physician who has kept the court alive through three wars and one attempted poisoning. Her methods are unorthodox. Her results are impeccable. Nobody asks questions.", ability: "Thou Shalt Not Die", faction: "ADA", element: "Emotion", rarity: "SR", hp: 11200, atk: 2500, def: 4000, skill: "Royal Remedy", skillDescription: "Restore 50% HP to all allies. Cleanse all debuffs.", gradient: "from-emerald-700 to-teal-500", emoji: "🌿", imageUrl: "https://placehold.co/150x240/065f46/ffffff?text=Yosano+%28Healer%29", banner: "royal", au: "Royal AU" },
  { id: 904, characterName: "Dazai Osamu", variant: "Court Schemer", displayName: "Dazai", description: "The king's most dangerous and least trustworthy advisor. He has never acted against the crown — technically. Every noble who threatened the kingdom has since retired or disappeared.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "SSR", hp: 8800, atk: 3600, def: 2600, skill: "Noble Betrayal", skillDescription: "Turn one enemy ally against their own team for 1 turn.", gradient: "from-indigo-800 to-blue-700", emoji: "🃏", imageUrl: "https://placehold.co/150x240/1e3a8a/ffffff?text=Dazai+%28Schemer%29", banner: "royal", au: "Royal AU" },
  { id: 905, characterName: "Akutagawa Ryunosuke", variant: "Dark Knight", displayName: "Akutagawa", description: "A knight in obsidian armour who guards the kingdom's borders alone. He was declared officially terrifying after the third time an invading army turned back without a word.", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SR", hp: 9200, atk: 4800, def: 2800, skill: "Cursed Armour", skillDescription: "Rashomon forms a black-iron suit. DEF ×2 and counter next 2 attacks.", gradient: "from-slate-800 to-red-900", emoji: "🛡️", imageUrl: "https://placehold.co/150x240/1e293b/ffffff?text=Akutagawa+%28Knight%29", banner: "royal", au: "Royal AU" },
];

// ─── YOKAI AU CARDS (banner: yokai) ──────────────────────────────────────────

const YOKAI_AU: Character[] = [
  { id: 1001, characterName: "Dazai Osamu", variant: "Kitsune", displayName: "Dazai", description: "A nine-tailed fox who walks in human form and nullifies every ward, seal, and exorcism ever directed at him. Shrines are deeply uncomfortable around him and he finds that amusing.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "UR", hp: 9800, atk: 4200, def: 3000, skill: "Fox Fire Nullify", skillDescription: "Nine tails wrap all enemies — nullify abilities and charm weakest foe for 2 turns.", gradient: "from-orange-800 to-amber-600", emoji: "🦊", imageUrl: "https://placehold.co/150x240/9a3412/ffffff?text=Dazai+%28Kitsune%29", banner: "yokai", au: "Yokai AU" },
  { id: 1002, characterName: "Chuuya Nakahara", variant: "Oni", displayName: "Chuuya", description: "An oni whose iron club is infused with gravity-bending power. Villages pray he passes without stopping. He usually does — unless someone says something disrespectful about his horns.", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 10800, atk: 5800, def: 3600, skill: "Iron Club Gravity", skillDescription: "Oni war cry — ATK ×3 for 1 turn. Unstoppable, ignores all shields.", gradient: "from-red-800 to-stone-900", emoji: "👹", imageUrl: "https://placehold.co/150x240/991b1b/ffffff?text=Chuuya+%28Oni%29", banner: "yokai", au: "Yokai AU" },
  { id: 1003, characterName: "Akutagawa Ryunosuke", variant: "Shadow Demon", displayName: "Akutagawa", description: "A demon made of shadow and hunger. Rashomon is not an ability here — it is his true form, ancient and devouring. He was called a monster long before he had reason to agree.", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9400, atk: 5200, def: 2800, skill: "Void Tendrils", skillDescription: "Shadow form Rashomon — hits all enemies simultaneously for 80% ATK each.", gradient: "from-stone-900 to-purple-950", emoji: "👺", imageUrl: "https://placehold.co/150x240/1c1917/ffffff?text=Akutagawa+%28Demon%29", banner: "yokai", au: "Yokai AU" },
  { id: 1004, characterName: "Yosano Akiko", variant: "Yuki-onna", displayName: "Yosano", description: "A snow woman who walks mountain passes in winter and heals the injured she finds there. She is beautiful, freezing cold, and extremely tired of being described as ethereal.", ability: "Thou Shalt Not Die", faction: "ADA", element: "Emotion", rarity: "SR", hp: 10600, atk: 2800, def: 4200, skill: "Blizzard Bloom", skillDescription: "Freeze all enemies for 1 turn. Restore 35% HP to all allies.", gradient: "from-sky-200 to-blue-400", emoji: "❄️", imageUrl: "https://placehold.co/150x240/1e40af/ffffff?text=Yosano+%28Yuki%29", banner: "yokai", au: "Yokai AU" },
  { id: 1005, characterName: "Ranpo Edogawa", variant: "Tanuki", displayName: "Ranpo", description: "A shape-shifting tanuki who solved three yokai murder mysteries in one afternoon while eating rice balls. He shapeshifts mostly into more comfortable versions of himself.", ability: "Ultra Deduction", faction: "ADA", element: "Logic", rarity: "SR", hp: 7200, atk: 3200, def: 2200, skill: "Shape Shift Deduction", skillDescription: "Copy one enemy stat for 2 turns. Coin reward from this battle +20%.", gradient: "from-green-700 to-amber-600", emoji: "🦝", imageUrl: "https://placehold.co/150x240/15803d/ffffff?text=Ranpo+%28Tanuki%29", banner: "yokai", au: "Yokai AU" },
];

// ─── CAFÉ AU CARDS (banner: cafe) ────────────────────────────────────────────

const CAFE_AU: Character[] = [
  { id: 1101, characterName: "Chuuya Nakahara", variant: "Barista", displayName: "Chuuya", description: "Head barista whose latte art is technically illegal in competitive circuits. He controls gravity to pour espresso with precision no human hand could match. The café has a six-month waitlist.", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Emotion", rarity: "SSR", hp: 9200, atk: 4400, def: 3400, skill: "Latte Art Gravity", skillDescription: "Gravity-poured espresso — distracts all enemies. Enemy ATK -50% for 2 turns.", gradient: "from-amber-600 to-orange-700", emoji: "☕", imageUrl: "https://placehold.co/150x240/d97706/ffffff?text=Chuuya+%28Barista%29", banner: "cafe", au: "Café AU" },
  { id: 1102, characterName: "Dazai Osamu", variant: "Café Owner", displayName: "Dazai", description: "He opened the café on a whim and it became wildly successful entirely despite his management. He writes the secret menu daily and nullifies every health inspection without effort.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "SSR", hp: 8400, atk: 3600, def: 2800, skill: "Secret Menu", skillDescription: "Nullify next enemy skill. Gain bonus coins equal to 10% of damage dealt.", gradient: "from-stone-700 to-amber-800", emoji: "🍰", imageUrl: "https://placehold.co/150x240/57534e/ffffff?text=Dazai+%28Owner%29", banner: "cafe", au: "Café AU" },
  { id: 1103, characterName: "Atsushi Nakajima", variant: "Waiter", displayName: "Atsushi", description: "The most enthusiastic waiter the café has ever employed. He has dropped exactly one tray in fourteen months — into the face of a customer who deserved it — and gone full tiger once.", ability: "Beast Beneath the Moonlight", faction: "ADA", element: "Strength", rarity: "SR", hp: 9400, atk: 4000, def: 2600, skill: "Tray Slam", skillDescription: "Accidentally goes full tiger-mode. ATK ×1.8, stuns target for 1 turn.", gradient: "from-sky-400 to-blue-500", emoji: "🍽️", imageUrl: "https://placehold.co/150x240/0369a1/ffffff?text=Atsushi+%28Waiter%29", banner: "cafe", au: "Café AU" },
  { id: 1104, characterName: "Kyoka Izumi", variant: "Pâtissière", displayName: "Kyoka", description: "Her desserts are extraordinary. Demon Snow handles the sugar sculpture with precision no piping bag could achieve. She bakes in silence and does not accept feedback on presentation.", ability: "Demon Snow", faction: "ADA", element: "Emotion", rarity: "SR", hp: 7800, atk: 3600, def: 2400, skill: "Ice Cream Blizzard", skillDescription: "Demon Snow shapes dessert blades — 4 quick hits totaling 160% ATK.", gradient: "from-pink-400 to-rose-500", emoji: "🍓", imageUrl: "https://placehold.co/150x240/db2777/ffffff?text=Kyoka+%28Baker%29", banner: "cafe", au: "Café AU" },
  { id: 1105, characterName: "Ranpo Edogawa", variant: "Regular Customer", displayName: "Ranpo", description: "Table four, every day, for three years. He has never once paid full price because he deduces exactly how much the café can comfortably waive. Dazai considers this fair enough.", ability: "Ultra Deduction", faction: "ADA", element: "Logic", rarity: "R", hp: 6800, atk: 2800, def: 1800, skill: "Snack Deduction", skillDescription: "Deduces enemy weakness while eating. Free hint + skip enemy next turn 40% chance.", gradient: "from-yellow-400 to-amber-300", emoji: "🍡", imageUrl: "https://placehold.co/150x240/b45309/ffffff?text=Ranpo+%28Regular%29", banner: "cafe", au: "Café AU" },
];

// ─── VILLAIN HERO SWAP AU (banner: villainhero) ───────────────────────────────

const VILLAINHERO_AU: Character[] = [
  { id: 1201, characterName: "Akutagawa Ryunosuke", variant: "Hero", displayName: "Akutagawa", description: "In a world where he chose protection over power, Rashomon wraps around allies instead of enemies. He is terse, demanding, and the most reliable defender anyone has ever had.", ability: "Rashomon", faction: "ADA", element: "Strength", rarity: "UR", hp: 11000, atk: 5200, def: 3800, skill: "Rashomon Shield", skillDescription: "Rashomon used for protection — absorb all damage for team this turn, counter ×2.", gradient: "from-sky-500 to-blue-400", emoji: "🦸", imageUrl: "https://placehold.co/150x240/0ea5e9/ffffff?text=Akutagawa+%28Hero%29", banner: "villainhero", au: "Villain/Hero Swap" },
  { id: 1202, characterName: "Atsushi Nakajima", variant: "Villain", displayName: "Atsushi", description: "What if the orphanage had won? What if the voice saying 'you deserve nothing' had never been silenced? A Atsushi who decided the world owed him — and intends to collect, in full.", ability: "Beast Beneath the Moonlight", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 10200, atk: 5400, def: 2600, skill: "Feral Takeover", skillDescription: "Villain arc activated — all mercy gone. ATK ×2.5, ignore all DEF this turn.", gradient: "from-slate-800 to-red-900", emoji: "😈", imageUrl: "https://placehold.co/150x240/1e293b/ffffff?text=Atsushi+%28Villain%29", banner: "villainhero", au: "Villain/Hero Swap" },
  { id: 1203, characterName: "Ranpo Edogawa", variant: "Villain", displayName: "Ranpo", description: "The world's greatest mind turned against it. He doesn't want money or power — he wants the satisfaction of an opponent who actually makes him think. Nobody has managed it yet.", ability: "Ultra Deduction", faction: "Port Mafia", element: "Logic", rarity: "SSR", hp: 7600, atk: 3800, def: 2400, skill: "Psychological Trap", skillDescription: "Deduce and exploit enemy psychology — paralyze all for 2 turns.", gradient: "from-purple-800 to-indigo-900", emoji: "🕶️", imageUrl: "https://placehold.co/150x240/6b21a8/ffffff?text=Ranpo+%28Villain%29", banner: "villainhero", au: "Villain/Hero Swap" },
  { id: 1204, characterName: "Chuuya Nakahara", variant: "Hero", displayName: "Chuuya", description: "In this world, he never joined the Port Mafia. He uses gravity to shield rather than destroy and leads by example with a ferocity that makes his allies feel genuinely invincible.", ability: "For the Tainted Sorrow", faction: "ADA", element: "Strength", rarity: "SR", hp: 9800, atk: 5000, def: 3200, skill: "Gravity Shield Wall", skillDescription: "Heroic stance — DEF +100% and reflect 50% of damage taken.", gradient: "from-blue-600 to-cyan-500", emoji: "🛡️", imageUrl: "https://placehold.co/150x240/1d4ed8/ffffff?text=Chuuya+%28Hero%29", banner: "villainhero", au: "Villain/Hero Swap" },
  { id: 1205, characterName: "Kyoka Izumi", variant: "Villain", displayName: "Kyoka", description: "The path where she never left the Port Mafia, never found the ADA, never chose differently. Demon Snow unshackled and fully answering only to her, both burden and weapon in one.", ability: "Demon Snow", faction: "Port Mafia", element: "Emotion", rarity: "SR", hp: 8200, atk: 4200, def: 2200, skill: "Unshackled Snow", skillDescription: "No longer holding back — Demon Snow at full power. DEF pierce +60%.", gradient: "from-rose-800 to-slate-900", emoji: "🌑", imageUrl: "https://placehold.co/150x240/9f1239/ffffff?text=Kyoka+%28Villain%29", banner: "villainhero", au: "Villain/Hero Swap" },
];

// ─── TOURNAMENT ARC (banner: tournament) ─────────────────────────────────────

const TOURNAMENT_AU: Character[] = [
  { id: 1301, characterName: "Dazai Osamu", variant: "Champion", displayName: "Dazai", description: "Reigning champion for reasons nobody fully understands. He barely trains, arrives late to every match, and somehow nullifies every opponent's signature move right before they use it.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "UR", hp: 10200, atk: 4400, def: 3200, skill: "Final Round Nullify", skillDescription: "Crowd goes silent. Nullify all enemy skills + ATK ×1.5 for rest of battle.", gradient: "from-amber-500 to-yellow-400", emoji: "🏆", imageUrl: "https://placehold.co/150x240/f59e0b/ffffff?text=Dazai+%28Champion%29", banner: "tournament", au: "Tournament Arc" },
  { id: 1302, characterName: "Chuuya Nakahara", variant: "Bracket Destroyer", displayName: "Chuuya", description: "He ended three brackets in a single afternoon. Gravity-powered impacts have been banned from official scoring because no metric could account for them. He entered anyway.", ability: "For the Tainted Sorrow", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 10600, atk: 5800, def: 3400, skill: "One-Punch Gravity", skillDescription: "Tournament crowd shocked — single-hit at 300% ATK. Can only be used once.", gradient: "from-red-600 to-orange-500", emoji: "🥊", imageUrl: "https://placehold.co/150x240/dc2626/ffffff?text=Chuuya+%28Bracket%29", banner: "tournament", au: "Tournament Arc" },
  { id: 1303, characterName: "Akutagawa Ryunosuke", variant: "Dark Horse", displayName: "Akutagawa", description: "Seeded last. Nobody took him seriously until the quarterfinals. He gets stronger with every hit he absorbs — which his opponents learn too late to do anything useful about.", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SSR", hp: 9600, atk: 5200, def: 2800, skill: "Underdog Rashomon", skillDescription: "Increases in power with each hit taken. +15% ATK per hit received (max 5 stacks).", gradient: "from-slate-700 to-zinc-900", emoji: "🖤", imageUrl: "https://placehold.co/150x240/334155/ffffff?text=Akutagawa+%28Dark+Horse%29", banner: "tournament", au: "Tournament Arc" },
  { id: 1304, characterName: "Atsushi Nakajima", variant: "Rising Star", displayName: "Atsushi", description: "First tournament. Crowd favourite by round two. The announcer keeps mispronouncing his name and he is too polite to correct them. The tiger transformation keeps getting better reviews.", ability: "Beast Beneath the Moonlight", faction: "ADA", element: "Strength", rarity: "SR", hp: 10000, atk: 4400, def: 2800, skill: "Crowd Pleaser", skillDescription: "Crowd chants his name — ATK ×2 and heals 20% HP from the energy.", gradient: "from-orange-500 to-amber-400", emoji: "⭐", imageUrl: "https://placehold.co/150x240/ea580c/ffffff?text=Atsushi+%28Rising%29", banner: "tournament", au: "Tournament Arc" },
  { id: 1305, characterName: "Fyodor Dostoevsky", variant: "Seeded #1", displayName: "Fyodor", description: "He planned his route to the final before the bracket was announced. Every opponent he faces is already fighting at a strategic disadvantage they cannot identify and therefore cannot fix.", ability: "Crime and Punishment", faction: "Rats", element: "Logic", rarity: "SR", hp: 9400, atk: 4200, def: 3400, skill: "Calculated Victory", skillDescription: "Pre-planned every matchup. All enemy debuffs doubled in duration.", gradient: "from-indigo-900 to-violet-900", emoji: "♟️", imageUrl: "https://placehold.co/150x240/312e81/ffffff?text=Fyodor+%28Seed+1%29", banner: "tournament", au: "Tournament Arc" },
];

// ─── DEMON SLAYER AU (banner: demonslayer) ────────────────────────────────────

const DEMONSLAYER_AU: Character[] = [
  { id: 1401, characterName: "Chuuya Nakahara", variant: "Hashira", displayName: "Chuuya", description: "Gravity Breathing is not a named form in any textbook — he invented it. The Hashira council argued about whether to recognize it for three weeks. He continued using it regardless.", ability: "For the Tainted Sorrow", faction: "ADA", element: "Strength", rarity: "UR", hp: 11400, atk: 6000, def: 3800, skill: "Gravity Breathing", skillDescription: "Unique form: Gravity Breathing Fifth Form — unavoidable 400% ATK strike.", gradient: "from-red-700 to-black", emoji: "⚔️", imageUrl: "https://placehold.co/150x240/b91c1c/ffffff?text=Chuuya+%28Hashira%29", banner: "demonslayer", au: "Demon Slayer AU" },
  { id: 1402, characterName: "Fyodor Dostoevsky", variant: "Demon Lord", displayName: "Fyodor", description: "The demon whose Blood Art doesn't just kill — it arranges consequences. Muzan tolerates him only because the alternative is worse. His pawns exist across every generation.", ability: "Crime and Punishment", faction: "Rats", element: "Logic", rarity: "UR", hp: 12000, atk: 5200, def: 4400, skill: "Blood Demon Art", skillDescription: "Cursed the entire battlefield — all enemies lose 15% HP every turn for 4 turns.", gradient: "from-violet-950 to-black", emoji: "🩸", imageUrl: "https://placehold.co/150x240/2e1065/ffffff?text=Fyodor+%28Demon%29", banner: "demonslayer", au: "Demon Slayer AU" },
  { id: 1403, characterName: "Yosano Akiko", variant: "Flower Hashira", displayName: "Yosano", description: "Flower Breathing in her hands means every attack also heals. She cuts through demons and tends the wounded in the same motion. The other Hashira find this deeply unnerving.", ability: "Thou Shalt Not Die", faction: "ADA", element: "Emotion", rarity: "SSR", hp: 11600, atk: 3200, def: 4400, skill: "Flower Breathing", skillDescription: "Cuts foes and heals allies simultaneously — deal 200% ATK and restore 30% HP to all.", gradient: "from-pink-600 to-red-800", emoji: "🌸", imageUrl: "https://placehold.co/150x240/be185d/ffffff?text=Yosano+%28Flower%29", banner: "demonslayer", au: "Demon Slayer AU" },
  { id: 1404, characterName: "Dazai Osamu", variant: "Mist Hashira", displayName: "Dazai", description: "Mist Breathing lets him vanish mid-fight — then his nullification touch ends whatever ability the demon built its survival on. His scouting reports are always extremely unhelpful.", ability: "No Longer Human", faction: "ADA", element: "Logic", rarity: "SSR", hp: 9000, atk: 4000, def: 2800, skill: "Mist Breathing Nullify", skillDescription: "Vanishes into mist — nullifies all enemy skills for 2 turns, then counter-strikes.", gradient: "from-blue-900 to-teal-800", emoji: "🌫️", imageUrl: "https://placehold.co/150x240/1e3a8a/ffffff?text=Dazai+%28Mist%29", banner: "demonslayer", au: "Demon Slayer AU" },
  { id: 1405, characterName: "Akutagawa Ryunosuke", variant: "Demon", displayName: "Akutagawa", description: "A demon who retained his need for acknowledgment. He refuses to devour humans who lack worth. He is waiting for one slayer in particular to acknowledge him as an equal first.", ability: "Rashomon", faction: "Port Mafia", element: "Strength", rarity: "SR", hp: 10000, atk: 5200, def: 3000, skill: "Demon Form Rashomon", skillDescription: "Rashomon fully unleashed in demon form. DEF Pierce +80%, bleeds target for 3 turns.", gradient: "from-purple-900 to-black", emoji: "👹", imageUrl: "https://placehold.co/150x240/581c87/ffffff?text=Akutagawa+%28Demon%29", banner: "demonslayer", au: "Demon Slayer AU" },
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
  ...SPY_AU,
  ...CYBERPUNK_AU,
  ...ROYAL_AU,
  ...YOKAI_AU,
  ...CAFE_AU,
  ...VILLAINHERO_AU,
  ...TOURNAMENT_AU,
  ...DEMONSLAYER_AU,
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
  {
    id: "spy",
    name: "Spy AU",
    subtitle: "License to Nullify",
    description: "Spy Dazai UR debut! 5 exclusive covert-ops cards. Missions never looked this good.",
    featured: [701, 702, 703],
    rates: { R: 50, SR: 28, SSR: 16, UR: 6 },
    gradient: "from-zinc-900 to-slate-700",
    limited: true,
    endDate: "September 5, 2026",
    emoji: "🕵️",
    pool: [...CANON.map(c => c.id), ...SPY_AU.map(c => c.id)],
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk AU",
    subtitle: "Welcome to Night City BSD",
    description: "Hacker Fyodor UR & Netrunner Dazai SSR debut! 5 neon-drenched cards.",
    featured: [801, 802, 803],
    rates: { R: 50, SR: 28, SSR: 16, UR: 6 },
    gradient: "from-violet-950 to-cyan-900",
    limited: true,
    endDate: "September 20, 2026",
    emoji: "💻",
    pool: [...CANON.map(c => c.id), ...CYBERPUNK_AU.map(c => c.id)],
  },
  {
    id: "royal",
    name: "Royal AU",
    subtitle: "The BSD Kingdom",
    description: "King Fukuzawa UR debut! Knights, healers, and schemers — 5 regal cards.",
    featured: [901, 902, 904],
    rates: { R: 50, SR: 28, SSR: 16, UR: 6 },
    gradient: "from-amber-700 to-red-800",
    limited: true,
    endDate: "October 1, 2026",
    emoji: "👑",
    pool: [...CANON.map(c => c.id), ...ROYAL_AU.map(c => c.id)],
  },
  {
    id: "yokai",
    name: "Yokai AU",
    subtitle: "Spirits of Yokohama",
    description: "Kitsune Dazai UR & Oni Chuuya SSR debut! 5 mythic spirit cards.",
    featured: [1001, 1002, 1003],
    rates: { R: 50, SR: 28, SSR: 16, UR: 6 },
    gradient: "from-orange-800 to-red-950",
    limited: true,
    endDate: "October 15, 2026",
    emoji: "🦊",
    pool: [...CANON.map(c => c.id), ...YOKAI_AU.map(c => c.id)],
  },
  {
    id: "cafe",
    name: "Café BSD",
    subtitle: "The Armed Detective Café",
    description: "Barista Chuuya SSR & Café Owner Dazai SSR debut! Slice-of-life vibes.",
    featured: [1101, 1102, 1103],
    rates: { R: 55, SR: 30, SSR: 13, UR: 2 },
    gradient: "from-amber-500 to-orange-600",
    limited: true,
    endDate: "October 31, 2026",
    emoji: "☕",
    pool: [...CANON.map(c => c.id), ...CAFE_AU.map(c => c.id)],
  },
  {
    id: "villainhero",
    name: "Villain/Hero Swap",
    subtitle: "The World Turned Upside Down",
    description: "Hero Akutagawa UR debut! ADA goes dark, Port Mafia goes good.",
    featured: [1201, 1202, 1203],
    rates: { R: 50, SR: 28, SSR: 16, UR: 6 },
    gradient: "from-slate-800 to-sky-600",
    limited: true,
    endDate: "November 10, 2026",
    emoji: "🦸",
    pool: [...CANON.map(c => c.id), ...VILLAINHERO_AU.map(c => c.id)],
  },
  {
    id: "tournament",
    name: "Tournament Arc",
    subtitle: "Only the Strong Remain",
    description: "Champion Dazai UR debut! 5 competition-ready cards with unique passives.",
    featured: [1301, 1302, 1303],
    rates: { R: 50, SR: 28, SSR: 16, UR: 6 },
    gradient: "from-amber-500 to-red-600",
    limited: true,
    endDate: "November 25, 2026",
    emoji: "🏆",
    pool: [...CANON.map(c => c.id), ...TOURNAMENT_AU.map(c => c.id)],
  },
  {
    id: "demonslayer",
    name: "Demon Slayer AU",
    subtitle: "Total Concentration Breathing",
    description: "2 URs! Hashira Chuuya + Demon Lord Fyodor debut alongside 3 more exclusives.",
    featured: [1401, 1402, 1403],
    rates: { R: 45, SR: 28, SSR: 18, UR: 9 },
    gradient: "from-red-700 to-violet-950",
    limited: true,
    endDate: "December 5, 2026",
    emoji: "⚔️",
    pool: [...CANON.map(c => c.id), ...DEMONSLAYER_AU.map(c => c.id)],
  },
];

// ─── STUDY DATA ───────────────────────────────────────────────────────────────

export const STUDY_SETS = [
  { id: 1, name: "Calculus", subject: "Math", cards: 42, progress: 78, color: "from-blue-400 to-indigo-500", icon: "ruler" },
  { id: 2, name: "World History", subject: "History", cards: 65, progress: 45, color: "from-amber-400 to-orange-500", icon: "globe" },
  { id: 3, name: "Chemistry", subject: "Science", cards: 38, progress: 92, color: "from-green-400 to-emerald-500", icon: "flask" },
  { id: 4, name: "Japanese Literature", subject: "Literature", cards: 29, progress: 30, color: "from-pink-400 to-rose-500", icon: "book" },
  { id: 5, name: "Physics", subject: "Science", cards: 51, progress: 62, color: "from-violet-400 to-purple-500", icon: "atom" },
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
  { id: 1, title: "First Pull", description: "Complete your first gacha pull", icon: "sparkles", earned: true, xp: 50 },
  { id: 2, title: "Study Streak", description: "Study 7 days in a row", icon: "flame", earned: true, xp: 200 },
  { id: 3, title: "Quiz Master", description: "Score 100% on a quiz", icon: "target", earned: true, xp: 150 },
  { id: 4, title: "Card Collector", description: "Collect 50 cards", icon: "library", earned: false, xp: 500 },
  { id: 5, title: "SSR Hunter", description: "Pull your first SSR card", icon: "star", earned: true, xp: 300 },
  { id: 6, title: "Pomodoro Pro", description: "Complete 25 Pomodoro sessions", icon: "timer", earned: false, xp: 400 },
  { id: 7, title: "Battle Victor", description: "Win 10 battles", icon: "sword", earned: true, xp: 250 },
  { id: 8, title: "UR Dreamer", description: "Pull your first UR card", icon: "gem", earned: false, xp: 1000 },
  { id: 9, title: "AU Collector", description: "Collect 5 AU variant cards", icon: "refresh", earned: false, xp: 600 },
  { id: 10, title: "Slytherin Pride", description: "Obtain Slytherin Dazai", icon: "trophy", earned: false, xp: 800 },
];

