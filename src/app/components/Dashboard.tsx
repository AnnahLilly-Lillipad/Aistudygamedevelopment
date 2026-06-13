import { motion } from "motion/react";
import { ChevronRight, ArrowRight, BookOpen, Gamepad2, Swords, Flame, Layers,
  Timer, HelpCircle, Sparkles, Map, Clock, Trophy } from "lucide-react";
import { CHARACTERS, ACHIEVEMENTS } from "../data/characters";
import type { OwnedCard } from "../data/characters";
import { CardImage } from "./CardImage";

const DAILY_QUESTS = [
  { id: 1, title: "Study for 25 min",        reward: 50, Icon: Timer,      accent: "#5b9aba", bg: "#edf6fb", progress: 25, total: 25, done: true,  tag: "FOCUS"  },
  { id: 2, title: "Answer 10 quiz questions", reward: 30, Icon: HelpCircle, accent: "#4a8fa8", bg: "#e4f1f8", progress: 7,  total: 10, done: false, tag: "QUIZ"   },
  { id: 3, title: "Win a battle",             reward: 80, Icon: Swords,     accent: "#d94040", bg: "#fef2f2", progress: 1,  total: 1,  done: true,  tag: "BATTLE" },
  { id: 4, title: "Pull 3 gacha cards",       reward: 20, Icon: Sparkles,   accent: "#5b9aba", bg: "#ddeef6", progress: 1,  total: 3,  done: false, tag: "GACHA"  },
];

const QUICK_ACTIONS = [
  { label: "Study",  Icon: BookOpen, color: "#5b9aba", borderColor: "#3d7a98", tab: "study",  sub: "earn XP & coins" },
  { label: "Gacha",  Icon: Sparkles, color: "#7ab3cc", borderColor: "#5b9aba", tab: "gacha",  sub: "new cards await" },
  { label: "Games",  Icon: Gamepad2, color: "#4a8fa8", borderColor: "#3d7a98", tab: "games",  sub: "quiz & flip"     },
  { label: "Battle", Icon: Swords,   color: "#d94040", borderColor: "#b83030", tab: "battle", sub: "fight for coins" },
];

function xpForLevel(lvl: number) { return lvl * 1000; }

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return "burning the midnight oil?";
  if (h < 10) return "morning, scholar! ☀";
  if (h < 13) return "good morning! (｡•̀ᴗ-)✧";
  if (h < 17) return "good afternoon! (＾▽＾)";
  if (h < 21) return "good evening! (・∀・)";
  return "studying late again? (≖_≖)";
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
    <div style={{ padding: "10px 10px 60px", display: "flex", flexDirection: "column", gap: 10 }}>

      {/* ── PROFILE WINDOW ────────────────────────────────── */}
      <div className="os-window">
        <div className="os-titlebar">
          <span className="os-btn-red" /><span className="os-btn-yellow" /><span className="os-btn-green" />
          <span className="os-titlebar-title">profile.exe — {username}</span>
          <button
            onClick={() => onNavigate("gacha")}
            style={{
              fontFamily: "'VT323', monospace", fontSize: "0.85rem", letterSpacing: "0.04em",
              background: "#fef3c7", color: "#92400e",
              border: "1.5px solid #fbbf24", borderRadius: 3, padding: "1px 7px",
              cursor: "pointer", flexShrink: 0, boxShadow: "1px 1px 0 #fbbf24",
            }}
          >
            🪙 {coins.toLocaleString()}
          </button>
        </div>

        <div style={{ padding: "12px 14px" }}>
          {/* greeting */}
          <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#5a7d8a", letterSpacing: "0.06em", marginBottom: 10 }}>
            {getGreeting()}
          </p>

          {/* Avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 54, height: 54, border: "2px solid #7ab2c8", borderRadius: 6,
                background: "#edf6fb", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "1.6rem",
                boxShadow: "2px 2px 0 #9dc4d8",
              }}>
                {avatar}
              </div>
              <div style={{
                position: "absolute", bottom: -7, right: -7,
                background: "#5b9aba", color: "white",
                fontFamily: "'VT323', monospace", fontSize: "0.75rem",
                letterSpacing: "0.04em", padding: "0 5px",
                border: "1.5px solid #3d7a98", borderRadius: 3,
                boxShadow: "1px 1px 0 #3d7a98",
              }}>
                LV.{level}
              </div>
            </div>
            <div>
              <h2 style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem", color: "#1a3d52", letterSpacing: "0.04em", lineHeight: 1, marginBottom: 3 }}>
                {username}
              </h2>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.04em" }}>
                {ownedCards.length} cards · {streak} day streak
              </p>
            </div>
          </div>

          {/* XP bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.06em" }}>XP / LVL {level}</span>
              <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a" }}>
                {xpNeeded - xp > 0 ? `${(xpNeeded - xp).toLocaleString()} to go` : "ready!"}
              </span>
            </div>
            <div style={{ height: 10, background: "#ddeef6", border: "2px solid #9dc4d8", borderRadius: 3, overflow: "hidden", boxShadow: "inset 1px 1px 0 rgba(0,0,0,0.06)" }}>
              <motion.div
                style={{ height: "100%", background: "linear-gradient(90deg, #5b9aba, #7ab3cc)", borderRadius: 1 }}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>

          <div className="pixel-divider" />

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[
              { value: streak, label: "STREAK", Icon: Flame, color: "#d97706" },
              { value: ownedCards.length, label: "CARDS", Icon: Layers, color: "#5b9aba" },
              { value: totalBattleWins, label: "WINS", Icon: Trophy, color: "#4a8fa8" },
            ].map(({ value, label, Icon, color }) => (
              <div key={label} style={{
                background: "#f0f8fc", border: "2px solid #9dc4d8", borderRadius: 4,
                padding: "8px 4px", textAlign: "center", boxShadow: "2px 2px 0 #9dc4d8",
              }}>
                <Icon size={12} style={{ color, margin: "0 auto 2px" }} />
                <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.4rem", color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.6rem", color: "#5a7d8a", letterSpacing: "0.06em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS WINDOW ──────────────────────────── */}
      <div className="os-window">
        <div className="os-titlebar">
          <span className="os-btn-red" /><span className="os-btn-yellow" /><span className="os-btn-green" />
          <span className="os-titlebar-title">quick_actions.exe</span>
        </div>
        <div style={{ padding: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.label}
              onClick={() => onNavigate(action.tab)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: i * 0.04 }}
              style={{
                background: "#f0f8fc", border: `2px solid ${action.borderColor}`,
                borderRadius: 5, padding: "10px 10px", textAlign: "left",
                cursor: "pointer", boxShadow: `2px 2px 0 ${action.borderColor}`,
                transition: "all 0.08s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#ddeef6"; e.currentTarget.style.boxShadow = `1px 1px 0 ${action.borderColor}`; e.currentTarget.style.transform = "translate(1px,1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f0f8fc"; e.currentTarget.style.boxShadow = `2px 2px 0 ${action.borderColor}`; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ width: 30, height: 30, background: action.color, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, boxShadow: "1px 1px 0 rgba(0,0,0,0.2)" }}>
                <action.Icon size={14} color="white" />
              </div>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#1a3d52", letterSpacing: "0.04em", lineHeight: 1 }}>{action.label}</p>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", color: "#5a7d8a", letterSpacing: "0.03em", marginTop: 2 }}>{action.sub}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── MISSIONS WINDOW ───────────────────────────────── */}
      <div className="os-window">
        <div className="os-titlebar">
          <span className="os-btn-red" /><span className="os-btn-yellow" /><span className="os-btn-green" />
          <span className="os-titlebar-title">
            daily_missions.exe [{DAILY_QUESTS.filter(q => claimedQuests.includes(q.id)).length}/{DAILY_QUESTS.length}]
          </span>
        </div>
        <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
          {DAILY_QUESTS.map(quest => {
            const claimed = claimedQuests.includes(quest.id);
            const claimable = quest.done && !claimed;
            return (
              <div
                key={quest.id}
                style={{
                  background: claimed ? "#f0f9f4" : "#f8fcfe",
                  border: `2px solid ${claimed ? "#86efac" : "#9dc4d8"}`,
                  borderRadius: 4,
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 8px",
                  boxShadow: claimed ? "2px 2px 0 #86efac" : "2px 2px 0 #9dc4d8",
                }}
              >
                <div style={{
                  width: 28, height: 28, background: quest.bg,
                  border: `2px solid ${quest.accent}`, borderRadius: 4,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  boxShadow: `1px 1px 0 ${quest.accent}`,
                }}>
                  <quest.Icon size={12} style={{ color: quest.accent }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                    <span style={{
                      fontFamily: "'VT323', monospace", fontSize: "0.6rem", letterSpacing: "0.06em",
                      background: quest.bg, color: quest.accent,
                      border: `1px solid ${quest.accent}`, padding: "0 4px", borderRadius: 2,
                    }}>{quest.tag}</span>
                  </div>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#1a3d52", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {quest.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 5, background: "#ddeef6", border: "1.5px solid #9dc4d8", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(quest.progress / quest.total) * 100}%`, background: claimed ? "#10b981" : quest.accent }} />
                    </div>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.65rem", color: "#5a7d8a", flexShrink: 0 }}>{quest.progress}/{quest.total}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#92400e" }}>🪙{quest.reward}</span>
                  {claimable ? (
                    <button onClick={() => handleClaimQuest(quest)} className="retro-btn retro-btn-primary" style={{ padding: "1px 8px", fontSize: "0.75rem", borderRadius: 3 }}>
                      CLAIM
                    </button>
                  ) : claimed ? (
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#10b981" }}>✓ done</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ROSTER WINDOW ─────────────────────────────────── */}
      {recentChars.length > 0 && (
        <div className="os-window">
          <div className="os-titlebar">
            <span className="os-btn-red" /><span className="os-btn-yellow" /><span className="os-btn-green" />
            <span className="os-titlebar-title">your_roster.exe</span>
            <button onClick={() => onNavigate("collection")} className="retro-btn" style={{ padding: "1px 8px", fontSize: "0.75rem", borderRadius: 3 }}>
              VIEW ALL
            </button>
          </div>
          <div style={{ padding: "8px 10px" }}>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {recentChars.map((char, i) => char && (
                <motion.div key={i} initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18, delay: i * 0.04 }} style={{ flexShrink: 0, width: 66 }}>
                  <CardImage character={char} size="xs" showName />
                </motion.div>
              ))}
              <button onClick={() => onNavigate("collection")} style={{
                flexShrink: 0, width: 66, minHeight: 80,
                border: "2px dashed #9dc4d8", borderRadius: 5,
                background: "#f0f8fc", display: "flex",
                flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer",
              }}>
                <ArrowRight size={11} style={{ color: "#5b9aba" }} />
                <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.55rem", color: "#5b9aba", letterSpacing: "0.06em" }}>SEE ALL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HALL OF FAME WINDOW ───────────────────────────── */}
      <div className="os-window">
        <div className="os-titlebar">
          <span className="os-btn-red" /><span className="os-btn-yellow" /><span className="os-btn-green" />
          <span className="os-titlebar-title">hall_of_fame.exe [{ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length}]</span>
        </div>
        <div style={{ padding: "8px 10px" }}>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
            {ACHIEVEMENTS.map(ach => (
              <div key={ach.id} style={{ flexShrink: 0, width: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: ach.earned ? 1 : 0.3 }}>
                <div style={{
                  width: 42, height: 42, border: ach.earned ? "2px solid #fbbf24" : "2px solid #9dc4d8",
                  borderRadius: 5, background: ach.earned ? "#fef9c3" : "#f0f8fc",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem",
                  boxShadow: ach.earned ? "2px 2px 0 #fbbf24" : "2px 2px 0 #9dc4d8",
                }}>{ach.icon}</div>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.55rem", color: "#5a7d8a", textAlign: "center", letterSpacing: "0.03em", lineHeight: 1.3 }}>{ach.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXPEDITION WINDOW ─────────────────────────────── */}
      <div className="os-window">
        <div className="os-titlebar">
          <span className="os-btn-red" /><span className="os-btn-yellow" /><span className="os-btn-green" />
          <span className="os-titlebar-title">expedition.exe</span>
        </div>
        <div style={{ padding: "12px 14px", background: "#edf6fb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", border: "1.5px solid #059669", boxShadow: "0 0 4px #10b981" }} />
              <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.06em" }}>3 cards away</span>
            </div>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#1a3d52", letterSpacing: "0.04em", marginBottom: 5 }}>Expedition Active</p>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={11} style={{ color: "#5b9aba" }} />
              <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.04em" }}>returns in 2h 15m</span>
            </div>
          </div>
          <Map size={34} style={{ color: "#9dc4d8", flexShrink: 0 }} />
        </div>
      </div>

    </div>
  );
}
