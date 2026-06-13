import { useState } from "react";
import { Zap } from "lucide-react";
import { ACHIEVEMENTS, CHARACTERS, type OwnedCard } from "../data/characters";

const HEATMAP_DATA = Array.from({ length: 91 }, (_, i) => ({
  day: i,
  value: Math.random() < 0.6 ? Math.floor(Math.random() * 5) : 0,
}));

const GLOBAL_BUFFS = [
  { id: 1, name: "Coin Boost I",        description: "+5% coin gain from all sources",     cost: "50 Rare Drops",  unlocked: true  },
  { id: 2, name: "XP Amplifier",        description: "+10% XP from quiz games",             cost: "100 Rare Drops", unlocked: true  },
  { id: 3, name: "Pity Reduction",       description: "Pity triggers at 90 pulls",           cost: "200 Rare Drops", unlocked: false },
  { id: 4, name: "Double Study Coins",   description: "+100% coins from Pomodoro",           cost: "500 Rare Drops", unlocked: false },
];

const LEADERBOARD = [
  { rank: 1, name: "Dazai_Fan99",      xp: 48200, avatar: "🏆" },
  { rank: 2, name: "PortMafiaAce",     xp: 41500, avatar: "⭐" },
  { rank: 3, name: "BSDScholar",       xp: 38900, avatar: "📚" },
  { rank: 4, name: "ChuuyaSimp",       xp: 2100,  avatar: "🌹" },
  { rank: 5, name: "RanpoDetective",   xp: 1800,  avatar: "🔍" },
];

const BUFF_COLORS = ["#ddeef6", "#d1fae5", "#fef3c7", "#ede9fe"];
const BUFF_BORDERS = ["#7ab2c8", "#34d399", "#fbbf24", "#a78bfa"];

interface Props {
  coins: number; ownedCards: OwnedCard[]; username: string; avatar: string;
  xp: number; level: number; streak: number; totalBattleWins: number; totalPulls: number;
  onLogout: () => void; xpToNextLevel: (level: number) => number;
}

export function ProfilePage({ coins, ownedCards, username, avatar, xp, level, streak,
  totalBattleWins, totalPulls, onLogout, xpToNextLevel }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "buffs" | "leaderboard" | "legal">("overview");
  const [leaderboardFilter, setLeaderboardFilter] = useState<"Global" | "Friends" | "Weekly">("Global");
  const [collectedExpeditions, setCollectedExpeditions] = useState<Set<number>>(new Set());
  const [buffFeedback, setBuffFeedback] = useState<number | null>(null);
  const [expeditionMsg, setExpeditionMsg] = useState<string | null>(null);
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
    { id: "overview",      label: "OVERVIEW"    },
    { id: "achievements",  label: "BADGES"      },
    { id: "buffs",         label: "BUFFS"       },
    { id: "leaderboard",   label: "RANKING"     },
    { id: "legal",         label: "LEGAL"       },
  ] as const;

  const userLeaderboardEntry = { rank: 4, name: username, xp, avatar, isUser: true };
  const fullLeaderboard = [...LEADERBOARD.filter(e => e.xp > xp), userLeaderboardEntry, ...LEADERBOARD.filter(e => e.xp <= xp)]
    .sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 }));

  const STAT_CARDS = [
    { label: "Cards Owned",   value: ownedCount,                         icon: "🃏",  sub: `${CHARACTERS.length} total`,  accent: "#5b9aba", bg: "#ddeef6",  border: "#7ab2c8" },
    { label: "UR Cards",      value: urCount,                            icon: "💎",  sub: `${ssrCount} SSR`,             accent: "#dc2626", bg: "#fee2e2",  border: "#f87171" },
    { label: "Battle Wins",   value: totalBattleWins,                    icon: "⚔️",  sub: "all time",                    accent: "#059669", bg: "#d1fae5",  border: "#34d399" },
    { label: "Total Pulls",   value: totalPulls,                         icon: "✨",  sub: "all banners",                 accent: "#7c3aed", bg: "#ede9fe",  border: "#a78bfa" },
    { label: "Achievements",  value: `${earnedAchievements}/${ACHIEVEMENTS.length}`, icon: "🏆", sub: "unlocked", accent: "#d97706", bg: "#fef3c7", border: "#fbbf24" },
    { label: "Study Streak",  value: `${streak}d`,                       icon: "🔥",  sub: `Level ${level} Scholar`,      accent: "#e11d48", bg: "#ffe4e6",  border: "#fca5a5" },
  ];

  return (
    <div className="h-full flex flex-col">

      {/* ── Profile header — passport/journal style ───────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1a3d52 0%, #2a5a70 100%)",
        borderBottom: "3px solid #5b9aba",
        padding: "12px 14px",
        flexShrink: 0,
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
              fontFamily: "'VT323', monospace", fontSize: "0.75rem",
              padding: "1px 5px", borderRadius: 3,
              border: "1.5px solid #e0b050",
            }}>LV.{level}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", color: "#7ab2c8", letterSpacing: "0.08em" }}>
              SCHOLAR PROFILE
            </p>
            <h2 style={{ fontFamily: "'VT323', monospace", fontSize: "1.6rem", color: "#cde5f0", letterSpacing: "0.04em", lineHeight: 1, marginBottom: 2 }}>
              {username} ✦
            </h2>
            <span style={{
              fontFamily: "'VT323', monospace", fontSize: "0.7rem", letterSpacing: "0.04em",
              background: "#ffd166", color: "#78350f",
              padding: "1px 8px", borderRadius: 3, border: "1.5px solid #e0b050",
            }}>
              Aspiring Detective
            </span>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.15rem", color: "#fbbf24" }}>🪙 {coins.toLocaleString()}</div>
            <button onClick={() => setShowLogoutConfirm(true)}
              style={{
                marginTop: 4,
                fontFamily: "'VT323', monospace", fontSize: "0.65rem", letterSpacing: "0.05em",
                background: "rgba(255,255,255,0.1)", color: "#cde5f0",
                border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 4,
                padding: "2px 8px", cursor: "pointer",
              }}>LOG OUT</button>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", color: "#7ab2c8", letterSpacing: "0.06em" }}>⚡ XP {xp.toLocaleString()}</span>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", color: "#7ab2c8", letterSpacing: "0.06em" }}>NEXT {xpNeeded.toLocaleString()}</span>
          </div>
          <div style={{ height: 10, background: "rgba(255,255,255,0.1)", border: "1.5px solid #3d7a98", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${xpProgress}%`, background: "linear-gradient(90deg, #fbbf24, #fde68a)", borderRadius: 2, transition: "width 0.5s ease" }} />
          </div>
        </div>
      </div>

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div className="mx-3 mt-2 mb-0 os-window flex-shrink-0">
          <div className="os-titlebar" style={{ background: "linear-gradient(180deg,#ffeaea,#ffd0d0)", borderColor: "#e05555" }}>
            <div className="os-btn-red" /><div className="os-btn-yellow" /><div className="os-btn-green" />
            <span className="os-titlebar-title" style={{ color: "#b03a3a" }}>CONFIRM LOGOUT</span>
          </div>
          <div className="flex items-center justify-between gap-3 px-3 py-2" style={{ background: "#fff" }}>
            <p className="text-sm" style={{ color: "#b03a3a" }}>Log out of <strong>{username}</strong>?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowLogoutConfirm(false)} className="retro-btn text-xs py-1 px-2">CANCEL</button>
              <button onClick={onLogout} className="retro-btn text-xs py-1 px-2" style={{ background: "#d64f4f", color: "#fff", borderColor: "#b03a3a" }}>LOG OUT</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs — pill style ─────────────────────────────────── */}
      <div style={{ display: "flex", gap: 5, padding: "8px 12px", overflowX: "auto", flexShrink: 0 }} className="no-scrollbar">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              flexShrink: 0,
              fontFamily: "'VT323', monospace", fontSize: "0.72rem", letterSpacing: "0.05em",
              padding: "4px 12px", borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap",
              background: activeTab === tab.id ? "#5b9aba" : "#ddeef6",
              color: activeTab === tab.id ? "white" : "#1a3d52",
              border: `2px solid ${activeTab === tab.id ? "#3d7a98" : "#9dc4d8"}`,
              boxShadow: activeTab === tab.id ? "2px 2px 0 #3d7a98" : "2px 2px 0 #9dc4d8",
              transition: "all 0.08s",
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">

        {/* ── Overview ─────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Stats — colorful cards, 2-column */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {STAT_CARDS.map(s => (
                <div key={s.label} style={{
                  background: s.bg,
                  border: `3px solid ${s.accent}`,
                  borderRadius: 6,
                  padding: "10px 12px",
                  boxShadow: `3px 3px 0 ${s.border}`,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.3rem", color: "#1a3d52", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.6rem", color: "#5a7d8a", letterSpacing: "0.06em" }}>{s.label}</div>
                  </div>
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

            {/* Expeditions — ticket stub style */}
            <div>
              <div style={{
                background: "#fbbf24", padding: "4px 10px", borderRadius: "6px 6px 0 0",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#78350f", letterSpacing: "0.08em" }}>
                  🗺️ EXPEDITIONS
                </span>
                <button onClick={() => setExpeditionMsg(expeditionMsg ? null : "Expedition management coming soon!")}
                  style={{
                    fontFamily: "'VT323', monospace", fontSize: "0.65rem", letterSpacing: "0.04em",
                    background: "rgba(255,255,255,0.3)", color: "#78350f",
                    border: "1.5px solid #e0b050", borderRadius: 3, padding: "1px 6px", cursor: "pointer",
                  }}>MANAGE</button>
              </div>
              <div style={{
                background: "#fff8f0", border: "2px solid #fbbf24", borderTop: "none",
                borderRadius: "0 0 6px 6px", padding: "10px", boxShadow: "3px 3px 0 #e0b050",
              }}>
                {expeditionMsg && (
                  <div style={{ background: "#fef3c7", border: "2px solid #fbbf24", borderRadius: 4, padding: "6px 10px", marginBottom: 8 }}>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#78350f" }}>{expeditionMsg}</p>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { name: "Yokohama Night Patrol",    chars: ["🪄", "⚔️"], duration: "2h 15m", ready: false },
                    { name: "Port Mafia Intel Gather",  chars: ["🎩", "🖤"], duration: "6h 00m", ready: true  },
                  ].map((exp, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "2px solid #e8d5a0", borderRadius: 4, padding: "8px 10px" }}>
                      <div>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#1a3d52" }}>{exp.name}</p>
                        <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
                          {exp.chars.map((e, j) => <span key={j} style={{ fontSize: "0.9rem" }}>{e}</span>)}
                        </div>
                      </div>
                      <div>
                        {exp.ready && !collectedExpeditions.has(i) ? (
                          <button onClick={() => setCollectedExpeditions(prev => new Set([...prev, i]))}
                            style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", background: "#4ade80", color: "#fff", border: "2px solid #22c55e", borderRadius: 4, padding: "3px 8px", cursor: "pointer", boxShadow: "2px 2px 0 #22c55e" }}>
                            ✓ COLLECT
                          </button>
                        ) : exp.ready && collectedExpeditions.has(i) ? (
                          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#22c55e" }}>✓ COLLECTED</span>
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

        {/* ── Achievements ─────────────────────────────────────── */}
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

        {/* ── Buffs ────────────────────────────────────────────── */}
        {activeTab === "buffs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: "#ddeef6", border: "2px solid #7ab2c8", borderRadius: 6, padding: "8px 10px", marginBottom: 4 }}>
              <p style={{ fontSize: "0.72rem", color: "#2a5a70" }}>⚡ Spend Rare Drops to permanently boost your account. Earn them from SSR+ pulls and events.</p>
            </div>
            {GLOBAL_BUFFS.map((buff, i) => (
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
                      {buff.unlocked && (
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.6rem", letterSpacing: "0.05em", background: "#4ade80", color: "#fff", border: "1.5px solid #22c55e", borderRadius: 3, padding: "1px 5px" }}>ACTIVE</span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "#5a7d8a", marginBottom: 4 }}>{buff.description}</p>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", color: "#dc2626" }}>💎 {buff.cost}</span>
                    {buffFeedback === buff.id && (
                      <p style={{ fontSize: "0.7rem", color: "#d97706", marginTop: 4, fontWeight: 600 }}>Not enough Rare Drops. Pull SSR+ cards!</p>
                    )}
                  </div>
                  {!buff.unlocked && (
                    <button onClick={() => setBuffFeedback(buffFeedback === buff.id ? null : buff.id)}
                      style={{
                        marginLeft: 10, fontFamily: "'VT323', monospace", fontSize: "0.8rem", letterSpacing: "0.06em",
                        background: "#5b9aba", color: "white", border: "2px solid #3d7a98",
                        borderRadius: 4, padding: "4px 10px", cursor: "pointer", boxShadow: "2px 2px 0 #3d7a98",
                      }}>UNLOCK</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Leaderboard ──────────────────────────────────────── */}
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
            {leaderboardFilter !== "Global" && (
              <div style={{ background: "#ddeef6", border: "2px solid #7ab2c8", borderRadius: 6, padding: "8px 12px", marginBottom: 4 }}>
                <p style={{ fontSize: "0.75rem", color: "#5a7d8a" }}>
                  {leaderboardFilter === "Friends" ? "Add friends to see rankings!" : "Weekly rankings reset every Monday."}
                </p>
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
                    {entry.name}{"isUser" in entry && entry.isUser ? " (You)" : ""}
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

        {/* ── Legal ────────────────────────────────────────────── */}
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
