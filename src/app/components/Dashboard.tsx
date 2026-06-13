import { motion } from "motion/react";
import { ChevronRight, ArrowRight, BookOpen, Gamepad2, Swords, Flame, Layers,
  Timer, HelpCircle, Sparkles, Map, Clock, Trophy, Coins } from "lucide-react";
import { CHARACTERS, ACHIEVEMENTS } from "../data/characters";
import type { OwnedCard } from "../data/characters";
import { CardImage } from "./CardImage";

const DAILY_QUESTS = [
  { id: 1, title: "Study for 25 minutes",    reward: 50, Icon: Timer,      accent: "#5b9aba", bg: "#edf6fb", progress: 25, total: 25, done: true,  tag: "Focus"  },
  { id: 2, title: "Answer 10 quiz questions", reward: 30, Icon: HelpCircle, accent: "#4a8fa8", bg: "#e4f1f8", progress: 7,  total: 10, done: false, tag: "Quiz"   },
  { id: 3, title: "Win a battle",             reward: 80, Icon: Swords,     accent: "#d94040", bg: "#fef2f2", progress: 1,  total: 1,  done: true,  tag: "Battle" },
  { id: 4, title: "Pull 3 gacha cards",       reward: 20, Icon: Sparkles,   accent: "#5b9aba", bg: "#ddeef6", progress: 1,  total: 3,  done: false, tag: "Gacha"  },
];

const QUICK_ACTIONS = [
  { label: "Study",  Icon: BookOpen, color: "#5b9aba", borderColor: "#4a8fa8", tab: "study",  sub: "Earn XP and coins" },
  { label: "Gacha",  Icon: Sparkles, color: "#7ab3cc", borderColor: "#5b9aba", tab: "gacha",  sub: "New cards wait"    },
  { label: "Games",  Icon: Gamepad2, color: "#4a8fa8", borderColor: "#3d7a98", tab: "games",  sub: "Quiz and flip"     },
  { label: "Battle", Icon: Swords,   color: "#d94040", borderColor: "#b83030", tab: "battle", sub: "Fight for coins"   },
];

function xpForLevel(lvl: number) { return lvl * 1000; }

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return "burning the midnight oil?";
  if (h < 10) return "morning, scholar!";
  if (h < 13) return "good morning.";
  if (h < 17) return "good afternoon.";
  if (h < 21) return "good evening.";
  return "studying late again?";
}

interface Props {
  coins: number;
  ownedCards: OwnedCard[];
  onNavigate: (tab: string) => void;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  claimedQuests: number[];
  onClaimQuest: (id: number) => void;
  onEarnCoins: (amount: number, reason: string) => void;
  totalBattleWins: number;
}

export function Dashboard({
  coins, ownedCards, onNavigate,
  username, avatar, xp, level, streak,
  claimedQuests, onClaimQuest, onEarnCoins,
  totalBattleWins,
}: Props) {
  const recentChars = ownedCards.slice(-6).reverse()
    .map(oc => CHARACTERS.find(c => c.id === oc.characterId))
    .filter(Boolean);

  const xpNeeded = xpForLevel(level);
  const xpProgress = Math.min(100, Math.round((xp / xpNeeded) * 100));

  function handleClaimQuest(quest: typeof DAILY_QUESTS[0]) {
    onClaimQuest(quest.id);
    onEarnCoins(quest.reward, "Mission complete!");
  }

  return (
    <div className="pb-8 px-3 pt-3 space-y-3">

      {/* ── Profile window ─────────────────────────────────────── */}
      <div className="os-window" style={{ boxShadow: "0 2px 8px rgba(26,61,82,0.1)" }}>
        <div className="os-titlebar">
          <div className="os-btn" />
          <div className="os-btn" />
          <span className="os-titlebar-title">profile.exe — {username}</span>
          <button
            onClick={() => onNavigate("gacha")}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.65rem",
              fontWeight: 700,
              background: "#fef3c7",
              color: "#92400e",
              border: "1px solid #fbbf24",
              borderRadius: 3,
              padding: "1px 6px",
              cursor: "pointer",
              letterSpacing: "0.03em",
              flexShrink: 0,
            }}
          >
            🪙 {coins.toLocaleString()}
          </button>
        </div>

        <div className="p-4">
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.6rem", color: "#5a7d8a", letterSpacing: "0.06em", marginBottom: 10 }}>
            {getGreeting()}
          </p>

          {/* Avatar + name */}
          <div className="flex items-center gap-3 mb-4">
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  border: "2px solid #9dc4d8",
                  borderRadius: 8,
                  background: "#edf6fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                {avatar}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -6,
                  right: -6,
                  background: "#5b9aba",
                  color: "white",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  padding: "1px 5px",
                  borderRadius: 3,
                  border: "1.5px solid #3d7a98",
                  letterSpacing: "0.03em",
                }}
              >
                Lv.{level}
              </div>
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  color: "#1a3d52",
                  letterSpacing: "0.02em",
                  marginBottom: 2,
                }}
              >
                {username}
              </h2>
              <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.6rem", color: "#5a7d8a", letterSpacing: "0.04em" }}>
                {ownedCards.length} cards · {streak} day streak
              </p>
            </div>
          </div>

          {/* XP bar */}
          <div>
            <div className="flex justify-between" style={{ marginBottom: 4 }}>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.6rem", color: "#5a7d8a", fontWeight: 700 }}>
                XP / LVL {level}
              </span>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.6rem", color: "#5a7d8a" }}>
                {xpNeeded - xp > 0 ? `${(xpNeeded - xp).toLocaleString()} to go` : "ready to level up!"}
              </span>
            </div>
            <div style={{ height: 8, background: "#ddeef6", border: "1px solid #9dc4d8", borderRadius: 3, overflow: "hidden" }}>
              <motion.div
                style={{ height: "100%", background: "#5b9aba", borderRadius: 2 }}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 6,
              marginTop: 12,
            }}
          >
            {[
              { value: streak,            label: "streak",    Icon: Flame,  color: "#d97706" },
              { value: ownedCards.length, label: "cards",     Icon: Layers, color: "#5b9aba" },
              { value: totalBattleWins,   label: "victories", Icon: Trophy, color: "#4a8fa8" },
            ].map(({ value, label, Icon, color }) => (
              <div
                key={label}
                style={{
                  background: "#f0f8fc",
                  border: "1.5px solid #9dc4d8",
                  borderRadius: 5,
                  padding: "8px 4px",
                  textAlign: "center",
                }}
              >
                <Icon size={13} style={{ color, margin: "0 auto 3px" }} />
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: "1rem", fontWeight: 900, color, lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: "0.5rem", color: "#5a7d8a", letterSpacing: "0.06em", marginTop: 2 }}>
                  {label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick actions window ──────────────────────────────── */}
      <div className="os-window" style={{ boxShadow: "0 2px 8px rgba(26,61,82,0.1)" }}>
        <div className="os-titlebar">
          <div className="os-btn" />
          <div className="os-btn" />
          <span className="os-titlebar-title">quick_actions.exe</span>
        </div>
        <div className="p-3 grid grid-cols-2 gap-2">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.label}
              onClick={() => onNavigate(action.tab)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              style={{
                background: "#f0f8fc",
                border: `2px solid ${action.borderColor}`,
                borderRadius: 5,
                padding: "10px 8px",
                textAlign: "left",
                cursor: "pointer",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#ddeef6")}
              onMouseLeave={e => (e.currentTarget.style.background = "#f0f8fc")}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: action.color,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 6,
                }}
              >
                <action.Icon size={14} color="white" />
              </div>
              <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.75rem", fontWeight: 900, color: "#1a3d52", letterSpacing: "0.02em" }}>
                {action.label}
              </p>
              <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.55rem", color: "#5a7d8a", letterSpacing: "0.03em", marginTop: 1 }}>
                {action.sub}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Missions window ───────────────────────────────────── */}
      <div className="os-window" style={{ boxShadow: "0 2px 8px rgba(26,61,82,0.1)" }}>
        <div className="os-titlebar">
          <div className="os-btn" />
          <div className="os-btn" />
          <span className="os-titlebar-title">
            daily_missions.exe — {DAILY_QUESTS.filter(q => claimedQuests.includes(q.id)).length}/{DAILY_QUESTS.length} done
          </span>
        </div>
        <div className="p-3 space-y-2">
          {DAILY_QUESTS.map(quest => {
            const claimed = claimedQuests.includes(quest.id);
            const claimable = quest.done && !claimed;
            return (
              <div
                key={quest.id}
                style={{
                  background: claimed ? "#f0f9f4" : "#f8fcfe",
                  border: `1.5px solid ${claimed ? "#86efac" : "#9dc4d8"}`,
                  borderRadius: 5,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    background: quest.bg,
                    border: `1.5px solid ${quest.accent}`,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <quest.Icon size={13} style={{ color: quest.accent }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                    <span
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: "0.5rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        background: quest.bg,
                        color: quest.accent,
                        border: `1px solid ${quest.accent}`,
                        padding: "1px 4px",
                        borderRadius: 2,
                      }}
                    >
                      {quest.tag.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.68rem", fontWeight: 700, color: "#1a3d52", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {quest.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 4, background: "#ddeef6", border: "1px solid #9dc4d8", borderRadius: 2, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${(quest.progress / quest.total) * 100}%`,
                          background: claimed ? "#10b981" : quest.accent,
                          borderRadius: 1,
                        }}
                      />
                    </div>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.5rem", color: "#5a7d8a", flexShrink: 0 }}>
                      {quest.progress}/{quest.total}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.6rem", fontWeight: 700, color: "#92400e" }}>
                    🪙{quest.reward}
                  </span>
                  {claimable ? (
                    <button
                      onClick={() => handleClaimQuest(quest)}
                      className="retro-btn retro-btn-primary"
                      style={{ padding: "2px 8px", fontSize: "0.55rem", borderRadius: 3 }}
                    >
                      CLAIM
                    </button>
                  ) : claimed ? (
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.65rem", color: "#10b981", fontWeight: 900 }}>✓ done</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Roster window ─────────────────────────────────────── */}
      {recentChars.length > 0 && (
        <div className="os-window" style={{ boxShadow: "0 2px 8px rgba(26,61,82,0.1)" }}>
          <div className="os-titlebar">
            <div className="os-btn" />
            <div className="os-btn" />
            <span className="os-titlebar-title">your_roster.exe</span>
            <button
              onClick={() => onNavigate("collection")}
              className="retro-btn"
              style={{ padding: "1px 8px", fontSize: "0.55rem", borderRadius: 3 }}
            >
              VIEW ALL
            </button>
          </div>
          <div className="p-3">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {recentChars.map((char, i) => char && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  style={{ flexShrink: 0, width: 68 }}
                >
                  <CardImage character={char} size="xs" showName />
                </motion.div>
              ))}
              <button
                onClick={() => onNavigate("collection")}
                style={{
                  flexShrink: 0,
                  width: 68,
                  minHeight: 80,
                  border: "2px dashed #9dc4d8",
                  borderRadius: 6,
                  background: "#f0f8fc",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  cursor: "pointer",
                }}
              >
                <ArrowRight size={12} style={{ color: "#5b9aba" }} />
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.45rem", color: "#5b9aba", fontWeight: 700, letterSpacing: "0.06em" }}>
                  SEE ALL
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Achievements window ───────────────────────────────── */}
      <div className="os-window" style={{ boxShadow: "0 2px 8px rgba(26,61,82,0.1)" }}>
        <div className="os-titlebar">
          <div className="os-btn" />
          <div className="os-btn" />
          <span className="os-titlebar-title">
            hall_of_fame.exe — {ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length} earned
          </span>
        </div>
        <div className="p-3">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
            {ACHIEVEMENTS.map(ach => (
              <div
                key={ach.id}
                style={{
                  flexShrink: 0,
                  width: 50,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  opacity: ach.earned ? 1 : 0.3,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    border: ach.earned ? "2px solid #fbbf24" : "2px solid #9dc4d8",
                    borderRadius: 6,
                    background: ach.earned ? "#fef9c3" : "#f0f8fc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                  }}
                >
                  {ach.icon}
                </div>
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.45rem", color: "#5a7d8a", fontWeight: 700, textAlign: "center", letterSpacing: "0.03em", lineHeight: 1.3 }}>
                  {ach.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Expedition window ─────────────────────────────────── */}
      <div className="os-window" style={{ boxShadow: "0 2px 8px rgba(26,61,82,0.1)" }}>
        <div className="os-titlebar">
          <div className="os-btn" />
          <div className="os-btn" />
          <span className="os-titlebar-title">expedition.exe</span>
        </div>
        <div
          className="p-4"
          style={{ background: "#edf6fb" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", border: "1px solid #059669" }} />
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.6rem", color: "#5a7d8a", fontWeight: 700, letterSpacing: "0.04em" }}>
                  3 cards away
                </span>
              </div>
              <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.9rem", fontWeight: 900, color: "#1a3d52", letterSpacing: "0.02em", marginBottom: 6 }}>
                Expedition Active
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Clock size={11} style={{ color: "#5b9aba" }} />
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.6rem", color: "#5a7d8a", fontWeight: 700 }}>
                  returns in 2h 15m
                </span>
              </div>
            </div>
            <Map size={36} style={{ color: "#9dc4d8", flexShrink: 0 }} />
          </div>
        </div>
      </div>

    </div>
  );
}
