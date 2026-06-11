import { useState } from "react";
import { Trophy, Flame, BookOpen, Star, Zap, ChevronRight, TrendingUp } from "lucide-react";
import { ACHIEVEMENTS, CHARACTERS, type OwnedCard } from "../data/characters";

const HEATMAP_DATA = Array.from({ length: 91 }, (_, i) => ({
  day: i,
  value: Math.random() < 0.6 ? Math.floor(Math.random() * 5) : 0,
}));

const TITLES = [
  { id: 1, name: "Aspiring Detective", earned: true, equipped: true },
  { id: 2, name: "Gacha Enjoyer", earned: true, equipped: false },
  { id: 3, name: "Quiz Champion", earned: true, equipped: false },
  { id: 4, name: "UR Chaser", earned: false, equipped: false },
  { id: 5, name: "Dazai Stan", earned: false, equipped: false },
];

const GLOBAL_BUFFS = [
  { id: 1, name: "Coin Boost I", description: "+5% coin gain from all sources", cost: "50 Rare Drops", unlocked: true },
  { id: 2, name: "XP Amplifier", description: "+10% XP from quiz games", cost: "100 Rare Drops", unlocked: true },
  { id: 3, name: "Pity Reduction", description: "Pity triggers at 90 pulls", cost: "200 Rare Drops", unlocked: false },
  { id: 4, name: "Double Study Coins", description: "+100% coins from Pomodoro", cost: "500 Rare Drops", unlocked: false },
];

const LEADERBOARD = [
  { rank: 1, name: "Dazai_Fan99", xp: 48200, avatar: "🏆" },
  { rank: 2, name: "PortMafiaAce", xp: 41500, avatar: "⭐" },
  { rank: 3, name: "BSDScholar", xp: 38900, avatar: "📚" },
  { rank: 4, name: "You", xp: 2450, avatar: "👤", isUser: true },
  { rank: 5, name: "ChuuyaSimp", xp: 2100, avatar: "🌹" },
  { rank: 6, name: "RanpoDetective", xp: 1800, avatar: "🔍" },
];

interface Props {
  coins: number;
  ownedCards: OwnedCard[];
}

export function ProfilePage({ coins, ownedCards }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "buffs" | "leaderboard">("overview");

  const ownedCount = new Set(ownedCards.map(c => c.characterId)).size;
  const urCount = ownedCards.filter(oc => CHARACTERS.find(c => c.id === oc.characterId)?.rarity === "UR").length;
  const ssrCount = ownedCards.filter(oc => CHARACTERS.find(c => c.id === oc.characterId)?.rarity === "SSR").length;
  const earnedAchievements = ACHIEVEMENTS.filter(a => a.earned).length;

  const heatmapIntensity = (val: number) => {
    if (val === 0) return "bg-muted";
    if (val === 1) return "bg-blue-200";
    if (val === 2) return "bg-blue-400";
    if (val === 3) return "bg-primary";
    return "bg-indigo-700";
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "achievements", label: "Badges" },
    { id: "buffs", label: "Buffs" },
    { id: "leaderboard", label: "Ranking" },
  ] as const;

  return (
    <div className="h-full flex flex-col">
      {/* Profile header */}
      <div className="bg-gradient-to-br from-primary to-indigo-700 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
            👤
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-sm">Scholar Level 12</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.4rem" }}>Dev Scholar</h2>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs bg-amber-400 text-amber-900 font-bold px-2 py-0.5 rounded-full">Aspiring Detective</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>🪙 {coins.toLocaleString()}</div>
            <div className="text-white/70 text-xs">coins</div>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
            <span>XP 2,450</span>
            <span>Next: 5,000</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: "49%" }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-3 bg-white border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${activeTab === tab.id ? "bg-primary text-white" : "text-muted-foreground"}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="p-4 space-y-4">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Cards Owned", value: ownedCount, icon: "🃏", sub: `${CHARACTERS.length} total` },
                { label: "UR Cards", value: urCount, icon: "💎", sub: `${ssrCount} SSR` },
                { label: "Achievements", value: `${earnedAchievements}/${ACHIEVEMENTS.length}`, icon: "🏆", sub: "unlocked" },
                { label: "Study Streak", value: "7 days", icon: "🔥", sub: "best: 14" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--foreground)" }}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
              <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.75rem" }}>Study Heatmap</p>
              <div className="flex flex-wrap gap-0.5">
                {HEATMAP_DATA.slice(-91).map((d, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${heatmapIntensity(d.value)}`}
                    title={`Day ${i}: ${d.value} sessions`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>13 weeks ago</span>
                <span>Today</span>
              </div>
            </div>

            {/* Expedition */}
            <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>🗺️ Expeditions</p>
                <button className="text-xs text-primary font-semibold">Manage</button>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Yokohama Night Patrol", chars: ["🪄", "⚔️"], duration: "2h 15m", ready: false },
                  { name: "Port Mafia Intel Gather", chars: ["🎩", "🖤"], duration: "6h 00m", ready: true },
                ].map((exp, i) => (
                  <div key={i} className="flex items-center justify-between bg-secondary rounded-xl p-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{exp.name}</p>
                      <div className="flex gap-1 mt-0.5">
                        {exp.chars.map((e, j) => <span key={j} className="text-sm">{e}</span>)}
                      </div>
                    </div>
                    <div className="text-right">
                      {exp.ready ? (
                        <button className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">Collect</button>
                      ) : (
                        <span className="text-xs text-muted-foreground">⏰ {exp.duration}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements */}
        {activeTab === "achievements" && (
          <div className="p-4 space-y-3">
            {ACHIEVEMENTS.map(ach => (
              <div key={ach.id} className={`bg-white rounded-2xl border border-border p-4 shadow-sm flex items-center gap-4 ${!ach.earned ? "opacity-50" : ""}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${ach.earned ? "bg-amber-50 border-2 border-amber-200" : "bg-muted border-2 border-border"}`}>
                  {ach.icon}
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>{ach.title}</p>
                  <p className="text-xs text-muted-foreground">{ach.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Zap size={12} className="text-amber-500" />
                    <span className="text-xs font-semibold text-amber-500">+{ach.xp} XP</span>
                  </div>
                </div>
                {ach.earned && <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>}
              </div>
            ))}
          </div>
        )}

        {/* Global Buffs */}
        {activeTab === "buffs" && (
          <div className="p-4 space-y-3">
            <div className="bg-secondary rounded-2xl p-4 text-sm text-muted-foreground">
              Spend Rare Drops to permanently boost your account. Rare Drops are obtained from SSR+ pulls and event rewards.
            </div>
            {GLOBAL_BUFFS.map(buff => (
              <div key={buff.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>{buff.name}</p>
                      {buff.unlocked && <span className="text-xs bg-green-100 text-green-600 font-semibold px-2 py-0.5 rounded-full">Active</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{buff.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-rose-500 font-semibold">💎 {buff.cost}</span>
                    </div>
                  </div>
                  {!buff.unlocked && (
                    <button className="ml-3 bg-primary text-white text-xs font-bold px-3 py-2 rounded-xl">
                      Unlock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === "leaderboard" && (
          <div className="p-4 space-y-2">
            <div className="flex gap-2 mb-4">
              {["Global", "Friends", "Weekly"].map(t => (
                <button key={t} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${t === "Global" ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground"}`}>
                  {t}
                </button>
              ))}
            </div>
            {LEADERBOARD.map(entry => (
              <div key={entry.rank} className={`rounded-2xl p-4 flex items-center gap-3 ${entry.isUser ? "bg-primary/10 border-2 border-primary" : "bg-white border border-border"} shadow-sm`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${entry.rank <= 3 ? "bg-amber-400 text-white" : "bg-muted text-muted-foreground"}`}>
                  {entry.rank}
                </div>
                <div className="text-xl">{entry.avatar}</div>
                <div className="flex-1">
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>{entry.name}{entry.isUser ? " (You)" : ""}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Zap size={14} className="text-amber-500" />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>{entry.xp.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
