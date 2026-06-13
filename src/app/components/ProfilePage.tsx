import { useState } from "react";
import { Zap, Check } from "lucide-react";
import { ACHIEVEMENTS, CHARACTERS, type OwnedCard } from "../data/characters";
import type { DailyStats } from "../hooks/useGameState";

const HEATMAP_DATA = Array.from({ length: 91 }, (_, i) => ({
  day: i,
  value: Math.random() < 0.6 ? Math.floor(Math.random() * 5) : 0,
}));

const GLOBAL_BUFFS = [
  { id: 1, name: "Coin Boost I",       description: "+5% coin gain from all sources",     cost: 500,  coinLabel: "500 coins"  },
  { id: 2, name: "XP Amplifier",       description: "+10% XP from quiz games",             cost: 800,  coinLabel: "800 coins"  },
  { id: 3, name: "Pity Reduction",      description: "Pity triggers at 90 pulls instead of 100", cost: 1500, coinLabel: "1,500 coins" },
  { id: 4, name: "Double Study Coins", description: "+100% coins from Pomodoro sessions",  cost: 3000, coinLabel: "3,000 coins" },
];

const GLOBAL_LEADERBOARD = [
  { rank: 1, name: "Dazai_Fan99",      xp: 48200, avatar: "🏆" },
  { rank: 2, name: "PortMafiaAce",     xp: 41500, avatar: "⭐" },
  { rank: 3, name: "BSDScholar",       xp: 38900, avatar: "📚" },
  { rank: 4, name: "ChuuyaSimp",       xp: 2100,  avatar: "🌹" },
  { rank: 5, name: "RanpoDetective",   xp: 1800,  avatar: "🔍" },
];

const FRIENDS_LEADERBOARD = [
  { rank: 1, name: "AkikoHealer",    xp: 12400, avatar: "💊" },
  { rank: 2, name: "SilverWolfFan", xp: 9800,  avatar: "🐺" },
  { rank: 3, name: "FyodorSimp",    xp: 6200,  avatar: "☦️" },
  { rank: 4, name: "TanizakiMain",  xp: 4100,  avatar: "🌸" },
];

const BUFF_COLORS = ["#ddeef6", "#d1fae5", "#fef3c7", "#ede9fe"];
const BUFF_BORDERS = ["#7ab2c8", "#34d399", "#fbbf24", "#a78bfa"];

interface Props {
  coins: number; ownedCards: OwnedCard[]; username: string; avatar: string;
  xp: number; level: number; streak: number; totalBattleWins: number; totalPulls: number;
  onLogout: () => void; xpToNextLevel: (level: number) => number;
  onEarnCoins: (amount: number, reason: string) => void;
  unlockedBuffIds: number[];
  onUnlockBuff: (buffId: number, cost: number) => boolean;
  dailyStats: DailyStats;
}

export function ProfilePage({
  coins, ownedCards, username, avatar, xp, level, streak,
  totalBattleWins, totalPulls, onLogout, xpToNextLevel,
  onEarnCoins, unlockedBuffIds, onUnlockBuff,
}: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "buffs" | "leaderboard" | "legal">("overview");
  const [leaderboardFilter, setLeaderboardFilter] = useState<"Global" | "Friends" | "Weekly">("Global");
  const [collectedExpeditions, setCollectedExpeditions] = useState<Set<number>>(new Set());
  const [buffFeedback, setBuffFeedback] = useState<{ id: number; msg: string } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const ownedCount = new Set(ownedCards.map(c => c.characterId)).size;
  const urCount = ownedCards.filter(oc => CHARACTERS.find(c => c.id === oc.characterId)?.rarity === "UR").length;
  const ssrCount = ownedCards.filter(oc => CHARACTERS.find(c => c.id === oc.characterId)?.rarity === "SSR").length;
  const earnedAchievements = ACHIEVEMENTS.filter(a => a.earned).length;
  const xpNeeded = xpToNextLevel(level);
  const xpProgress = Math.min(100, Math.round((xp / xpNeeded) * 100));

  const heatmapIntensity = (val: number) => {
    if (val === 0) return "#ddeef6";
    if (val === 1) return "#b0d0e2";
    if (val === 2) return "#7ab2c8";
    if (val === 3) return "#5b9aba";
    return "#2a5a70";
  };

  const TABS = [
    { id: "overview",     label: "OVERVIEW"  },
    { id: "achievements", label: "BADGES"    },
    { id: "buffs",        label: "BUFFS"     },
    { id: "leaderboard",  label: "RANKING"   },
    { id: "legal",        label: "LEGAL"     },
  ] as const;

  // Build leaderboard for each filter
  const userEntry = { rank: 0, name: username, xp, avatar, isUser: true };

  function buildLeaderboard(base: { rank: number; name: string; xp: number; avatar: string }[]) {
    const combined = [...base.filter(e => e.xp > xp), userEntry, ...base.filter(e => e.xp <= xp)]
      .sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 }));
    return combined;
  }

  const weeklyXp = Math.round(xp * 0.18); // simulate weekly contribution
  const weeklyBoard = [
    { rank: 1, name: "Dazai_Fan99",   xp: 8400, avatar: "🏆" },
    { rank: 2, name: "BSDScholar",    xp: 6100, avatar: "📚" },
    { rank: 3, name: "PortMafiaAce",  xp: 4900, avatar: "⭐" },
  ];
  const weeklyUserEntry = { rank: 0, name: username + " (you)", xp: weeklyXp, avatar, isUser: true };
  const fullWeeklyBoard = [...weeklyBoard.filter(e => e.xp > weeklyXp), weeklyUserEntry, ...weeklyBoard.filter(e => e.xp <= weeklyXp)]
    .sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 }));

  const fullLeaderboard =
    leaderboardFilter === "Global"  ? buildLeaderboard(GLOBAL_LEADERBOARD) :
    leaderboardFilter === "Friends" ? buildLeaderboard(FRIENDS_LEADERBOARD) :
    fullWeeklyBoard;

  const STAT_CARDS = [
    { label: "Cards Owned",  value: ownedCount,                          icon: "🃏", sub: `${CHARACTERS.length} total`, accent: "#5b9aba", bg: "#ddeef6", border: "#7ab2c8" },
    { label: "UR Cards",     value: urCount,                             icon: "💎", sub: `${ssrCount} SSR`,           accent: "#dc2626", bg: "#fee2e2", border: "#f87171" },
    { label: "Battle Wins",  value: totalBattleWins,                     icon: "⚔️", sub: "all time",                 accent: "#059669", bg: "#d1fae5", border: "#34d399" },
    { label: "Total Pulls",  value: totalPulls,                          icon: "✨", sub: "all banners",              accent: "#7c3aed", bg: "#ede9fe", border: "#a78bfa" },
    { label: "Achievements", value: `${earnedAchievements}/${ACHIEVEMENTS.length}`, icon: "🏆", sub: "unlocked", accent: "#d97706", bg: "#fef3c7", border: "#fbbf24" },
    { label: "Study Streak", value: `${streak}d`,                        icon: "🔥", sub: `Level ${level} Scholar`,  accent: "#e11d48", bg: "#ffe4e6", border: "#fca5a5" },
  ];

  const EXPEDITIONS = [
    { name: "Yokohama Night Patrol",   chars: ["🪄", "⚔️"], duration: "2h 15m", ready: false, reward: 200 },
    { name: "Port Mafia Intel Gather", chars: ["🎩", "🖤"], duration: "6h 00m", ready: true,  reward: 500 },
  ];

  function handleUnlockBuff(buff: typeof GLOBAL_BUFFS[0]) {
    if (unlockedBuffIds.includes(buff.id)) return;
    const success = onUnlockBuff(buff.id, buff.cost);
    if (success) {
      setBuffFeedback({ id: buff.id, msg: "Buff activated!" });
    } else {
      setBuffFeedback({ id: buff.id, msg: `Need ${buff.coinLabel} — keep studying!` });
    }
    setTimeout(() => setBuffFeedback(null), 2500);
  }

  return (
    <div className="h-full flex flex-col">

      {/* ── Profile header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a3d52 0%, #2a5a70 100%)",
        borderBottom: "3px solid #5b9aba", padding: "12px 14px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 58, height: 58, borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.2rem", background: "#ddeef6",
            border: "3px solid #5b9aba", boxShadow: "3px 3px 0 #3d7a98",
            flexShrink: 0, position: "relative",
          }}>
            {avatar}
            <div style={{
              position: "absolute", bottom: -8, right: -8,
              background: "#fbbf24", color: "#78350f",
              fontFamily: "'VT323', monospace", fontSize: "0.8rem",
              letterSpacing: "0.04em", padding: "1px 6px",
              border: "2px solid #e0b050", borderRadius: 3,
            }}>
              LV.{level}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'VT323', monospace", fontSize: "1.6rem", color: "#cde5f0", letterSpacing: "0.06em", lineHeight: 1, marginBottom: 4 }}>
              {username}
            </h1>
            <div style={{ height: 8, background: "rgba(255,255,255,0.15)", border: "1.5px solid #5b9aba", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${xpProgress}%`, background: "linear-gradient(90deg, #5b9aba, #7fd3f0)", borderRadius: 2, transition: "width 0.6s ease" }} />
            </div>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#9dc4d8", letterSpacing: "0.04em" }}>
              {xp.toLocaleString()} / {xpNeeded.toLocaleString()} XP &nbsp;·&nbsp; 🪙 {coins.toLocaleString()}
            </span>
          </div>
          <button onClick={() => setShowLogoutConfirm(true)}
            style={{
              fontFamily: "'VT323', monospace", fontSize: "0.7rem", letterSpacing: "0.05em",
              background: "rgba(220,38,38,0.2)", color: "#fca5a5",
              border: "1.5px solid #f87171", borderRadius: 4, padding: "4px 8px", cursor: "pointer",
              alignSelf: "flex-start",
            }}>LOGOUT</button>
        </div>

        {showLogoutConfirm && (
          <div style={{ marginTop: 10, background: "rgba(0,0,0,0.3)", borderRadius: 6, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#fca5a5" }}>Log out of {username}?</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setShowLogoutConfirm(false)}
                style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", background: "rgba(255,255,255,0.1)", color: "#cde5f0", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 3, padding: "2px 8px", cursor: "pointer" }}>CANCEL</button>
              <button onClick={onLogout}
                style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", background: "#dc2626", color: "white", border: "1.5px solid #b91c1c", borderRadius: 3, padding: "2px 8px", cursor: "pointer" }}>CONFIRM</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: "flex", background: "#ddeef6", borderBottom: "2px solid #7ab2c8",
        flexShrink: 0, overflowX: "auto",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{
              flex: "0 0 auto", padding: "7px 12px",
              fontFamily: "'VT323', monospace", fontSize: "0.7rem", letterSpacing: "0.07em",
              background: activeTab === t.id ? "#fff" : "transparent",
              color: activeTab === t.id ? "#1a3d52" : "#5a7d8a",
              borderRight: "1px solid #b0d0e2", borderBottom: activeTab === t.id ? "2px solid #fff" : "2px solid transparent",
              cursor: "pointer", marginBottom: -2, transition: "background 0.1s",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 60px" }}>

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Stat grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {STAT_CARDS.map(card => (
                <div key={card.label} style={{
                  background: card.bg, border: `2px solid ${card.border}`,
                  borderRadius: 6, padding: "8px 10px",
                  boxShadow: `2px 2px 0 ${card.border}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                    <span style={{ fontSize: "1rem" }}>{card.icon}</span>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.65rem", color: card.accent, letterSpacing: "0.07em" }}>{card.label}</span>
                  </div>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem", color: "#1a3d52", lineHeight: 1, marginBottom: 2 }}>{card.value}</p>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.6rem", color: "#5a7d8a" }}>{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div>
              <div style={{
                background: "#ddeef6", borderBottom: "2px solid #7ab2c8",
                padding: "5px 10px", borderRadius: "6px 6px 0 0",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <div style={{ width: 4, height: 14, background: "#5b9aba", borderRadius: 2 }} />
                <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#1a3d52", letterSpacing: "0.08em" }}>
                  STUDY HEATMAP (13 WEEKS)
                </span>
              </div>
              <div style={{ background: "white", border: "2px solid #7ab2c8", borderTop: "none", borderRadius: "0 0 6px 6px", padding: "10px", boxShadow: "3px 3px 0 #9dc4d8" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {HEATMAP_DATA.slice(-91).map((d, i) => (
                    <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: heatmapIntensity(d.value) }}
                      title={`Day ${i}: ${d.value} sessions`} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.6rem", color: "#8aaab8" }}>13 WEEKS AGO</span>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.6rem", color: "#8aaab8" }}>TODAY</span>
                </div>
              </div>
            </div>

            {/* Expeditions */}
            <div>
              <div style={{
                background: "#fbbf24", padding: "4px 10px", borderRadius: "6px 6px 0 0",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#78350f", letterSpacing: "0.08em" }}>
                  🗺️ EXPEDITIONS
                </span>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.65rem", color: "#78350f" }}>
                  {EXPEDITIONS.filter(e => e.ready).length} ready
                </span>
              </div>
              <div style={{ background: "#fff8f0", border: "2px solid #fbbf24", borderTop: "none", borderRadius: "0 0 6px 6px", padding: "10px", boxShadow: "3px 3px 0 #e0b050" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {EXPEDITIONS.map((exp, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "2px solid #e8d5a0", borderRadius: 4, padding: "8px 10px" }}>
                      <div>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#1a3d52" }}>{exp.name}</p>
                        <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
                          {exp.chars.map((e, j) => <span key={j} style={{ fontSize: "0.9rem" }}>{e}</span>)}
                          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.65rem", color: "#d97706", marginLeft: 4 }}>+{exp.reward} coins</span>
                        </div>
                      </div>
                      <div>
                        {exp.ready && !collectedExpeditions.has(i) ? (
                          <button onClick={() => {
                            setCollectedExpeditions(prev => new Set([...prev, i]));
                            onEarnCoins(exp.reward, `Expedition: ${exp.name}!`);
                          }}
                            style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", background: "#4ade80", color: "#fff", border: "2px solid #22c55e", borderRadius: 4, padding: "3px 8px", cursor: "pointer", boxShadow: "2px 2px 0 #22c55e" }}>
                            COLLECT
                          </button>
                        ) : exp.ready && collectedExpeditions.has(i) ? (
                          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#22c55e" }}>
                            <Check size={12} style={{ display: "inline", marginRight: 2 }} />DONE
                          </span>
                        ) : (
                          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#8aaab8" }}>⏰ {exp.duration}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Achievements ── */}
        {activeTab === "achievements" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {ACHIEVEMENTS.map(ach => (
              <div key={ach.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: ach.earned ? "#fefce8" : "#f8fafc",
                border: `2px solid ${ach.earned ? "#fbbf24" : "#b0d0e2"}`,
                borderRadius: 6, padding: "10px 12px",
                boxShadow: ach.earned ? "2px 2px 0 #fbbf24" : "2px 2px 0 #b0d0e2",
                opacity: ach.earned ? 1 : 0.55,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 4, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
                  background: ach.earned ? "#fef9c3" : "#f0f8fc",
                  border: `2px solid ${ach.earned ? "#fbbf24" : "#b0d0e2"}`,
                  boxShadow: ach.earned ? "2px 2px 0 #fbbf24" : "none",
                }}>
                  {ach.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#1a3d52" }}>{ach.title}</p>
                    {ach.earned && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", border: "1.5px solid #22c55e" }} />}
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "#5a7d8a" }}>{ach.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}>
                    <Zap size={10} style={{ color: "#d97706" }} />
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#d97706" }}>+{ach.xp} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Buffs ── */}
        {activeTab === "buffs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: "#ddeef6", border: "2px solid #7ab2c8", borderRadius: 6, padding: "8px 10px", marginBottom: 4 }}>
              <p style={{ fontSize: "0.72rem", color: "#2a5a70" }}>⚡ Spend coins to permanently boost your account. You have <strong>{coins.toLocaleString()}</strong> coins.</p>
            </div>
            {GLOBAL_BUFFS.map((buff, i) => {
              const isUnlocked = unlockedBuffIds.includes(buff.id);
              const canAfford = coins >= buff.cost;
              return (
                <div key={buff.id} style={{
                  background: BUFF_COLORS[i % 4],
                  border: `3px solid ${BUFF_BORDERS[i % 4]}`,
                  borderRadius: 6, padding: "10px 12px",
                  boxShadow: `3px 3px 0 ${BUFF_BORDERS[i % 4]}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#1a3d52" }}>{buff.name}</span>
                        {isUnlocked && (
                          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.6rem", letterSpacing: "0.05em", background: "#4ade80", color: "#fff", border: "1.5px solid #22c55e", borderRadius: 3, padding: "1px 5px" }}>ACTIVE</span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "#5a7d8a", marginBottom: 4 }}>{buff.description}</p>
                      {!isUnlocked && (
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", color: canAfford ? "#059669" : "#dc2626" }}>
                          🪙 {buff.coinLabel}
                        </span>
                      )}
                      {buffFeedback?.id === buff.id && (
                        <p style={{ fontSize: "0.7rem", color: buffFeedback.msg === "Buff activated!" ? "#059669" : "#d97706", marginTop: 4, fontWeight: 600 }}>
                          {buffFeedback.msg}
                        </p>
                      )}
                    </div>
                    {!isUnlocked && (
                      <button onClick={() => handleUnlockBuff(buff)}
                        style={{
                          marginLeft: 10, fontFamily: "'VT323', monospace", fontSize: "0.8rem", letterSpacing: "0.06em",
                          background: canAfford ? "#5b9aba" : "#94a3b8", color: "white",
                          border: `2px solid ${canAfford ? "#3d7a98" : "#64748b"}`,
                          borderRadius: 4, padding: "4px 10px", cursor: "pointer",
                          boxShadow: canAfford ? "2px 2px 0 #3d7a98" : "none",
                          opacity: canAfford ? 1 : 0.7,
                        }}>UNLOCK</button>
                    )}
                    {isUnlocked && (
                      <div style={{
                        marginLeft: 10, width: 32, height: 32, borderRadius: "50%",
                        background: "#4ade80", border: "2px solid #22c55e",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Check size={16} color="#fff" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Leaderboard ── */}
        {activeTab === "leaderboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 4 }}>
              {(["Global", "Friends", "Weekly"] as const).map(t => (
                <button key={t} onClick={() => setLeaderboardFilter(t)}
                  style={{
                    flex: 1, fontFamily: "'VT323', monospace", fontSize: "0.75rem", letterSpacing: "0.06em",
                    padding: "5px 8px", borderRadius: 4, cursor: "pointer",
                    background: leaderboardFilter === t ? "#5b9aba" : "#ddeef6",
                    color: leaderboardFilter === t ? "white" : "#1a3d52",
                    border: `2px solid ${leaderboardFilter === t ? "#3d7a98" : "#9dc4d8"}`,
                    boxShadow: `2px 2px 0 ${leaderboardFilter === t ? "#3d7a98" : "#9dc4d8"}`,
                  }}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            {leaderboardFilter === "Weekly" && (
              <div style={{ background: "#ddeef6", border: "2px solid #7ab2c8", borderRadius: 6, padding: "8px 12px", marginBottom: 4 }}>
                <p style={{ fontSize: "0.75rem", color: "#5a7d8a" }}>Weekly XP resets every Monday. Your this-week XP: <strong>{Math.round(xp * 0.18).toLocaleString()}</strong></p>
              </div>
            )}
            {leaderboardFilter === "Friends" && (
              <div style={{ background: "#ddeef6", border: "2px solid #7ab2c8", borderRadius: 6, padding: "8px 12px", marginBottom: 4 }}>
                <p style={{ fontSize: "0.75rem", color: "#5a7d8a" }}>Showing your study group — keep up with your friends!</p>
              </div>
            )}

            {fullLeaderboard.map(entry => (
              <div key={entry.rank} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "isUser" in entry && entry.isUser ? "#ddeef6" : "#fff",
                border: `2px solid ${"isUser" in entry && entry.isUser ? "#5b9aba" : "#b0d0e2"}`,
                borderRadius: 6, padding: "8px 12px",
                boxShadow: "isUser" in entry && entry.isUser ? "2px 2px 0 #5b9aba" : "2px 2px 0 #b0d0e2",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'VT323', monospace", fontSize: "1rem",
                  background: entry.rank <= 3 ? "#fbbf24" : "#ddeef6",
                  color: entry.rank <= 3 ? "#fff" : "#5a7d8a",
                  border: `2px solid ${entry.rank <= 3 ? "#e0b050" : "#b0d0e2"}`,
                }}>
                  {entry.rank <= 3 ? ["🥇","🥈","🥉"][entry.rank-1] : entry.rank}
                </div>
                <span style={{ fontSize: "1.2rem" }}>{entry.avatar}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#1a3d52" }}>
                    {entry.name}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Zap size={12} style={{ color: "#d97706" }} />
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#1a3d52" }}>{entry.xp.toLocaleString()}</span>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.6rem", color: "#8aaab8" }}>XP</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Legal ── */}
        {activeTab === "legal" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: "#f0f8fc", border: "2px solid #7ab2c8", borderRadius: 6, padding: "12px 14px", boxShadow: "3px 3px 0 #9dc4d8" }}>
              <p style={{ fontSize: "0.8rem", color: "#2a5a70", marginBottom: 10 }}>
                <span style={{ fontWeight: 700, color: "#1a3d52" }}>StudyTales</span> is an independent, fan-made study application created for educational and entertainment purposes.
              </p>
              {[
                { title: "🎌 Bungou Stray Dogs", bg: "#fffbeb", border: "#fbbf24", content: "I do not own Bungou Stray Dogs, its characters, story, or any related content. All rights belong to Kafka Asagiri and Sango Harukawa, published by KADOKAWA Corporation. Anime produced by Bones Inc." },
                { title: "📚 Other Fandoms & Crossovers", bg: "#f0f8fc", border: "#7ab2c8", content: "This app references characters from other works strictly as fan-made AU content. All respective properties belong to their original creators." },
                { title: "🖼️ Artwork", bg: "#f0f8fc", border: "#b0d0e2", content: "All character images belong to their respective creators. No copyright infringement is intended." },
                { title: "💼 No Commercial Use", bg: "#f0f8fc", border: "#b0d0e2", content: "Non-commercial fan project. Not affiliated with or endorsed by any rights holders." },
              ].map(section => (
                <div key={section.title} style={{ background: section.bg, border: `2px solid ${section.border}`, borderRadius: 4, padding: "8px 10px", marginBottom: 6 }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1a3d52", marginBottom: 3 }}>{section.title}</p>
                  <p style={{ fontSize: "0.72rem", color: "#5a7d8a" }}>{section.content}</p>
                </div>
              ))}
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#8aaab8", textAlign: "center", borderTop: "1px dashed #b0d0e2", paddingTop: 8, marginTop: 4 }}>
                Made with ❤️ by a fan, for fans.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
