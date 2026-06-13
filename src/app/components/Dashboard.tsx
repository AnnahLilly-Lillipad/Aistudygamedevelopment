import { useState } from "react";
import { Target, Trophy, ChevronRight, Zap } from "lucide-react";
import { CHARACTERS, ACHIEVEMENTS } from "../data/characters";
import type { OwnedCard } from "../data/characters";
import { CardImage } from "./CardImage";

const DAILY_QUESTS = [
  { id: 1, title: "Study for 25 minutes", reward: 50, icon: "🍅", progress: 25, total: 25, done: true },
  { id: 2, title: "Answer 10 quiz questions", reward: 30, icon: "❓", progress: 7, total: 10, done: false },
  { id: 3, title: "Win a battle", reward: 80, icon: "⚔️", progress: 1, total: 1, done: true },
  { id: 4, title: "Pull 3 gacha cards", reward: 20, icon: "✨", progress: 1, total: 3, done: false },
];

interface Props {
  coins: number;
  ownedCards: OwnedCard[];
  onNavigate: (tab: string) => void;
}

export function Dashboard({ coins, ownedCards, onNavigate }: Props) {
  const [claimedQuests, setClaimedQuests] = useState<Set<number>>(new Set([1, 3]));

  const recentChars = ownedCards
    .slice(-6).reverse()
    .map(oc => CHARACTERS.find(c => c.id === oc.characterId))
    .filter(Boolean);

  const earnedAchievements = ACHIEVEMENTS.filter(a => a.earned);
  const studyStreak = 7;
  const totalXP = 2450;

  return (
    <div className="p-4 space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Welcome back, Scholar!</p>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--foreground)" }}>StudyTales</h1>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-sm border border-border">
          <span className="text-amber-500 text-lg">🪙</span>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)", fontSize: "1.1rem" }}>{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Day Streak", value: studyStreak, icon: "🔥" },
          { label: "Cards", value: ownedCards.length, icon: "🃏" },
          { label: "XP", value: totalXP.toLocaleString(), icon: "⚡" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-border text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--foreground)" }}>{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Start Studying", icon: "📚", color: "from-blue-500 to-indigo-600", tab: "study" },
          { label: "Pull Gacha", icon: "✨", color: "from-purple-500 to-pink-500", tab: "gacha" },
          { label: "Play Games", icon: "🎮", color: "from-green-500 to-emerald-600", tab: "games" },
          { label: "Battle!", icon: "⚔️", color: "from-red-500 to-orange-500", tab: "battle" },
        ].map(action => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.tab)}
            className={`bg-gradient-to-br ${action.color} text-white rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-95 transition-transform`}
          >
            <span className="text-2xl">{action.icon}</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Daily Quests */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-primary" />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>Daily Quests</span>
          </div>
          <span className="text-xs text-muted-foreground">Resets in 14h 32m</span>
        </div>
        <div className="divide-y divide-border">
          {DAILY_QUESTS.map(quest => (
            <div key={quest.id} className="px-4 py-3 flex items-center gap-3">
              <span className="text-xl">{quest.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{quest.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(quest.progress / quest.total) * 100}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{quest.progress}/{quest.total}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 text-sm">🪙</span>
                <span className="text-sm font-semibold text-amber-600">{quest.reward}</span>
                {quest.done && !claimedQuests.has(quest.id) && (
                  <button onClick={() => setClaimedQuests(prev => new Set([...prev, quest.id]))} className="ml-1 bg-primary text-white text-xs px-2 py-1 rounded-lg font-semibold">Claim</button>
                )}
                {claimedQuests.has(quest.id) && <span className="ml-1 text-green-500 text-xs font-semibold">✓</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Cards — now with photos */}
      {recentChars.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>Recent Cards</span>
            <button onClick={() => onNavigate("collection")} className="text-primary text-sm font-semibold flex items-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recentChars.map((char, i) => char && (
              <div key={i} className="flex-shrink-0 w-16">
                <CardImage character={char} size="xs" showName />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>Achievements</span>
          </div>
          <span className="text-xs text-muted-foreground">{earnedAchievements.length}/{ACHIEVEMENTS.length}</span>
        </div>
        <div className="flex gap-3 overflow-x-auto p-4">
          {ACHIEVEMENTS.map(ach => (
            <div key={ach.id} className={`flex-shrink-0 flex flex-col items-center gap-1 w-16 ${!ach.earned ? "opacity-40 grayscale" : ""}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${ach.earned ? "bg-amber-50 border-2 border-amber-200" : "bg-muted border-2 border-border"}`}>
                {ach.icon}
              </div>
              <p className="text-center text-muted-foreground" style={{ fontSize: "0.6rem", lineHeight: 1.2 }}>{ach.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expedition */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-4 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Expedition Returns</p>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1rem" }}>3 cards on mission</p>
            <p className="text-white/70 text-xs mt-1">Ready in 2h 15m</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl">🗺️</span>
            <button
              disabled
              className="bg-white/40 text-white/60 text-xs font-bold px-3 py-1 rounded-lg cursor-not-allowed"
              title="Expedition not ready yet"
            >
              ⏰ 2h 15m
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
