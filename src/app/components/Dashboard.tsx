import { motion } from "motion/react";
import { ChevronRight, ArrowRight, BookOpen, Gamepad2, Swords, Flame, Layers,
  Timer, HelpCircle, Sparkles, Map, Clock, Trophy } from "lucide-react";
import { CHARACTERS, ACHIEVEMENTS } from "../data/characters";
import type { OwnedCard } from "../data/characters";
import { CardImage } from "./CardImage";

const DAILY_QUESTS = [
  { id: 1, title: "Study for 25 min",        reward: 50, Icon: Timer,      accent: "#5b9aba", bg: "#ddeef6", border: "#5b9aba", progress: 25, total: 25, done: true,  tag: "📚 FOCUS"  },
  { id: 2, title: "Answer 10 quiz questions", reward: 30, Icon: HelpCircle, accent: "#7c3aed", bg: "#ede9fe", border: "#a78bfa", progress: 7,  total: 10, done: false, tag: "🧠 QUIZ"   },
  { id: 3, title: "Win a battle",             reward: 80, Icon: Swords,     accent: "#dc2626", bg: "#fee2e2", border: "#f87171", progress: 1,  total: 1,  done: true,  tag: "⚔️ BATTLE" },
  { id: 4, title: "Pull 3 gacha cards",       reward: 20, Icon: Sparkles,   accent: "#b45309", bg: "#fef3c7", border: "#fbbf24", progress: 1,  total: 3,  done: false, tag: "✨ GACHA"  },
];

const QUICK_ACTIONS = [
  { label: "📚 Study",  color: "#5b9aba", shadow: "#3d7a98", bg: "#ddeef6", textColor: "#1a3d52", tab: "study",  sub: "earn XP & coins" },
  { label: "✨ Gacha",  color: "#7c3aed", shadow: "#5b21b6", bg: "#ede9fe", textColor: "#2e1065", tab: "gacha",  sub: "new cards await" },
  { label: "🎮 Games",  color: "#059669", shadow: "#064e3b", bg: "#d1fae5", textColor: "#064e3b", tab: "games",  sub: "quiz & flip"     },
  { label: "⚔️ Battle", color: "#dc2626", shadow: "#991b1b", bg: "#fee2e2", textColor: "#7f1d1d", tab: "battle", sub: "fight for coins" },
];

function xpForLevel(lvl: number) { return lvl * 1000; }

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return "🌙 burning midnight oil~";
  if (h < 10) return "🌅 morning, scholar! ☀️";
  if (h < 13) return "🌤️ good morning! (｡•̀ᴗ-)✧";
  if (h < 17) return "☀️ good afternoon! (＾▽＾)";
  if (h < 21) return "🌆 good evening! (・∀・)";
  return "🌙 studying late again? (≖_≖)";
}

interface Props {
  coins: number; ownedCards: OwnedCard[]; onNavigate: (tab: string) => void;
  username: string; avatar: string; xp: number; level: number; streak: number;
  claimedQuests: number[]; onClaimQuest: (id: number) => void;
  onEarnCoins: (amount: number, reason: string) => void; totalBattleWins: number;
}

export function Dashboard({
  coins, ownedCards, onNavigate,
  username, avatar, xp, level, streak,
  claimedQuests, onClaimQuest, onEarnCoins, totalBattleWins,
}: Props) {
  const recentChars = ownedCards.slice(-6).reverse()
    .map(oc => CHARACTERS.find(c => c.id === oc.characterId)).filter(Boolean);
  const xpNeeded = xpForLevel(level);
  const xpProgress = Math.min(100, Math.round((xp / xpNeeded) * 100));

  function handleClaimQuest(quest: typeof DAILY_QUESTS[0]) {
    onClaimQuest(quest.id);
    onEarnCoins(quest.reward, "mission complete! ✦");
  }

  return (
    <div style={{ padding: "10px 10px 60px", display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ── PROFILE CARD ─────────────────────────────────────── */}
      {/* Inspired by retro OS window but with a player-card interior */}
      <div className="os-window">
        <div className="os-titlebar">
          <span className="os-btn-red" /><span className="os-btn-yellow" /><span className="os-btn-green" />
          <span className="os-titlebar-title">⊹ profile.exe ⊹ — {username}</span>
          <button
            onClick={() => onNavigate("gacha")}
            style={{
              fontFamily: "'VT323', monospace", fontSize: "0.85rem", letterSpacing: "0.04em",
              background: "#fef3c7", color: "#92400e",
              border: "2px solid #fbbf24", borderRadius: 3, padding: "1px 8px",
              cursor: "pointer", flexShrink: 0, boxShadow: "2px 2px 0 #fbbf24",
            }}
          >
            🪙 {coins.toLocaleString()}
          </button>
        </div>

        <div style={{ padding: "12px 14px", background: "#f8fcfe" }}>
          {/* greeting */}
          <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#5a7d8a", letterSpacing: "0.06em", marginBottom: 10 }}>
            {getGreeting()}
          </p>

          {/* Avatar + name row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 56, height: 56,
                border: "3px solid #5b9aba", borderRadius: 6,
                background: "#ddeef6",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem",
                boxShadow: "3px 3px 0 #3d7a98",
              }}>
                {avatar}
              </div>
              <div style={{
                position: "absolute", bottom: -8, right: -8,
                background: "#5b9aba", color: "white",
                fontFamily: "'VT323', monospace", fontSize: "0.8rem",
                letterSpacing: "0.04em", padding: "1px 6px",
                border: "2px solid #3d7a98", borderRadius: 3,
                boxShadow: "1px 1px 0 #3d7a98",
              }}>
                LV.{level}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'VT323', monospace", fontSize: "1.6rem", color: "#1a3d52", letterSpacing: "0.04em", lineHeight: 1, marginBottom: 2 }}>
                {username} ✦
              </h2>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.82rem", color: "#5a7d8a", letterSpacing: "0.04em" }}>
                🃏 {ownedCards.length} cards &nbsp;·&nbsp; 🔥 {streak} day streak
              </p>
            </div>
          </div>

          {/* XP bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.06em" }}>⚡ XP — LVL {level}</span>
              <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a" }}>
                {xpNeeded - xp > 0 ? `${(xpNeeded - xp).toLocaleString()} xp to go` : "✅ ready!"}
              </span>
            </div>
            <div style={{ height: 11, background: "#ddeef6", border: "2px solid #7ab2c8", borderRadius: 3, overflow: "hidden" }}>
              <motion.div
                style={{ height: "100%", background: "linear-gradient(90deg, #5b9aba, #7fd3f0)", borderRadius: 1 }}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>

          {/* Stats row — horizontal tags, no box */}
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {[
              { value: streak,               label: "day streak",  emoji: "🔥" },
              { value: ownedCards.length,     label: "cards",       emoji: "🃏" },
              { value: totalBattleWins,       label: "battle wins", emoji: "🏆" },
            ].map(({ value, label, emoji }) => (
              <div key={label} style={{
                background: "#ddeef6", border: "2px solid #7ab2c8", borderRadius: 20,
                padding: "3px 10px", display: "flex", alignItems: "center", gap: 4,
                fontFamily: "'VT323', monospace", boxShadow: "2px 2px 0 #7ab2c8",
              }}>
                <span style={{ fontSize: "0.85rem" }}>{emoji}</span>
                <span style={{ fontSize: "1rem", color: "#1a3d52", lineHeight: 1 }}>{value}</span>
                <span style={{ fontSize: "0.7rem", color: "#5a7d8a", letterSpacing: "0.06em" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS — big chunky colored buttons, no wrapper box ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, paddingLeft: 2 }}>
          <div style={{ width: 4, height: 16, background: "#5b9aba", borderRadius: 2 }} />
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.1em" }}>QUICK ACTIONS ✦</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.label}
              onClick={() => onNavigate(action.tab)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: i * 0.04 }}
              style={{
                background: action.bg,
                border: `3px solid ${action.color}`,
                borderRadius: 6,
                padding: "12px 10px",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: `3px 3px 0 ${action.shadow}`,
                transition: "all 0.08s",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `1px 1px 0 ${action.shadow}`; e.currentTarget.style.transform = "translate(2px,2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = `3px 3px 0 ${action.shadow}`; e.currentTarget.style.transform = "none"; }}
            >
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "1.15rem", color: action.textColor, letterSpacing: "0.04em", lineHeight: 1, marginBottom: 3 }}>
                {action.label}
              </p>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.72rem", color: action.color, letterSpacing: "0.03em", opacity: 0.85 }}>
                {action.sub} →
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── DAILY MISSIONS — sticky-note pastel cards ────────── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, paddingLeft: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 4, height: 16, background: "#fbbf24", borderRadius: 2 }} />
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.1em" }}>
              📋 DAILY MISSIONS [{DAILY_QUESTS.filter(q => claimedQuests.includes(q.id)).length}/{DAILY_QUESTS.length}]
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {DAILY_QUESTS.map(quest => {
            const claimed = claimedQuests.includes(quest.id);
            const claimable = quest.done && !claimed;
            return (
              <div
                key={quest.id}
                style={{
                  background: claimed ? "#f0fdf4" : quest.bg,
                  border: `2px solid ${claimed ? "#86efac" : quest.border}`,
                  borderRadius: 6,
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 10px",
                  boxShadow: claimed ? "2px 2px 0 #86efac" : `2px 2px 0 ${quest.border}`,
                  position: "relative",
                }}
              >
                {/* tag pill */}
                <div style={{
                  position: "absolute", top: -8, left: 8,
                  background: claimed ? "#4ade80" : quest.accent, color: "white",
                  fontFamily: "'VT323', monospace", fontSize: "0.6rem", letterSpacing: "0.05em",
                  padding: "1px 7px", borderRadius: 10,
                  border: `1.5px solid ${claimed ? "#22c55e" : quest.border}`,
                }}>
                  {claimed ? "✅ DONE" : quest.tag}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#1a3d52", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {quest.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.6)", border: `1.5px solid ${quest.border}`, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(quest.progress / quest.total) * 100}%`, background: claimed ? "#4ade80" : quest.accent, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", color: "#5a7d8a", flexShrink: 0 }}>{quest.progress}/{quest.total}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#92400e" }}>🪙 {quest.reward}</span>
                  {claimable ? (
                    <button onClick={() => handleClaimQuest(quest)}
                      style={{
                        fontFamily: "'VT323', monospace", fontSize: "0.75rem", letterSpacing: "0.05em",
                        background: quest.accent, color: "white", border: `2px solid ${quest.border}`,
                        borderRadius: 4, padding: "2px 8px", cursor: "pointer",
                        boxShadow: `2px 2px 0 ${quest.border}`,
                      }}>
                      CLAIM ✦
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ROSTER — horizontal scroll with polaroid vibe ────── */}
      {recentChars.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, paddingLeft: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 4, height: 16, background: "#c084fc", borderRadius: 2 }} />
              <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.1em" }}>🃏 YOUR ROSTER</span>
            </div>
            <button onClick={() => onNavigate("collection")} style={{
              fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#5b9aba",
              background: "transparent", border: "none", cursor: "pointer", letterSpacing: "0.05em",
            }}>
              VIEW ALL →
            </button>
          </div>
          <div style={{ background: "#f0f8fc", border: "2px solid #9dc4d8", borderRadius: 6, padding: "8px 10px", boxShadow: "3px 3px 0 #9dc4d8" }}>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {recentChars.map((char, i) => char && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, delay: i * 0.04 }}
                  style={{
                    flexShrink: 0, width: 66,
                    background: "#fff",
                    border: "2px solid #e8e0d4",
                    padding: "3px 3px 12px",
                    boxShadow: "2px 2px 0 #c8c0b4",
                    borderRadius: 3,
                  }}>
                  <CardImage character={char} size="xs" showName />
                </motion.div>
              ))}
              <button onClick={() => onNavigate("collection")} style={{
                flexShrink: 0, width: 56, minHeight: 80,
                border: "2px dashed #9dc4d8", borderRadius: 4,
                background: "transparent", display: "flex",
                flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, cursor: "pointer",
              }}>
                <ArrowRight size={12} style={{ color: "#5b9aba" }} />
                <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.55rem", color: "#5b9aba", letterSpacing: "0.06em" }}>ALL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HALL OF FAME — ribbon / badge banner style ────────── */}
      <div>
        <div style={{
          background: "linear-gradient(135deg, #1a3d52 0%, #2a5a70 100%)",
          borderRadius: "6px 6px 0 0",
          padding: "6px 12px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#cde5f0", letterSpacing: "0.12em" }}>
            🏅 HALL OF FAME
          </span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#7ab2c8" }}>
            {ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length} earned
          </span>
        </div>
        <div style={{ background: "#fefce8", border: "2px solid #fbbf24", borderTop: "none", borderRadius: "0 0 6px 6px", padding: "10px", boxShadow: "3px 3px 0 #e0b050" }}>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
            {ACHIEVEMENTS.map(ach => (
              <div key={ach.id} style={{ flexShrink: 0, width: 46, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, opacity: ach.earned ? 1 : 0.28 }}>
                <div style={{
                  width: 40, height: 40,
                  border: ach.earned ? "2px solid #fbbf24" : "2px solid #d8c870",
                  borderRadius: 4, background: ach.earned ? "#fef9c3" : "#fafaf0",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem",
                  boxShadow: ach.earned ? "2px 2px 0 #fbbf24" : "none",
                }}>
                  {ach.earned ? ach.icon : "?"}
                </div>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.52rem", color: "#5a7d8a", textAlign: "center", letterSpacing: "0.02em", lineHeight: 1.3 }}>
                  {ach.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXPEDITION — ticket stub style ───────────────────── */}
      <div style={{ position: "relative" }}>
        <div style={{
          background: "#fff8f0",
          border: "2px solid #e8a262",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "3px 3px 0 #c9823e",
        }}>
          {/* ticket top bar */}
          <div style={{
            background: "#e8a262",
            padding: "4px 12px",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#fff", letterSpacing: "0.1em" }}>🗺️ EXPEDITION.EXE</span>
          </div>
          {/* dashed divider line (perforation effect) */}
          <div style={{ height: 0, borderTop: "2px dashed #e8a262", margin: "0" }} />
          <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", border: "1.5px solid #059669", boxShadow: "0 0 5px #10b981" }} />
                <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#78350f", letterSpacing: "0.06em" }}>✦ 3 cards away from finish</span>
              </div>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#92400e", letterSpacing: "0.04em", marginBottom: 4 }}>
                Expedition Active ⚡
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Clock size={11} style={{ color: "#c9823e" }} />
                <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#78350f", letterSpacing: "0.04em" }}>returns in 2h 15m</span>
              </div>
            </div>
            <Map size={36} style={{ color: "#e8a262", flexShrink: 0 }} />
          </div>
        </div>
      </div>

    </div>
  );
}
