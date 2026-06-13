import { motion } from "motion/react";
import { ChevronRight, ArrowRight, BookOpen, Gamepad2, Swords, Flame, Layers,
  Timer, HelpCircle, Sparkles, Map, Clock, Trophy, Coins } from "lucide-react";
import { CHARACTERS, ACHIEVEMENTS } from "../data/characters";
import type { OwnedCard } from "../data/characters";
import { CardImage } from "./CardImage";

const DAILY_QUESTS = [
  { id: 1, title: "Study for 25 minutes",    reward: 50, Icon: Timer,      accent: "#ea580c", bg: "#fff7ed", progress: 25, total: 25, done: true,  tag: "Focus"  },
  { id: 2, title: "Answer 10 quiz questions", reward: 30, Icon: HelpCircle, accent: "#2563eb", bg: "#eff6ff", progress: 7,  total: 10, done: false, tag: "Quiz"   },
  { id: 3, title: "Win a battle",             reward: 80, Icon: Swords,     accent: "#e11d48", bg: "#fff1f2", progress: 1,  total: 1,  done: true,  tag: "Battle" },
  { id: 4, title: "Pull 3 gacha cards",       reward: 20, Icon: Sparkles,   accent: "#7c3aed", bg: "#f5f3ff", progress: 1,  total: 3,  done: false, tag: "Gacha"  },
];

const QUICK_ACTIONS = [
  { label: "Study",   Icon: BookOpen, gradient: "linear-gradient(135deg,#3b82f6,#4f46e5)", tab: "study",  sub: "Earn XP and coins" },
  { label: "Gacha",   Icon: Sparkles, gradient: "linear-gradient(135deg,#9333ea,#db2777)", tab: "gacha",  sub: "New cards wait"    },
  { label: "Games",   Icon: Gamepad2, gradient: "linear-gradient(135deg,#10b981,#0d9488)", tab: "games",  sub: "Quiz and flip"     },
  { label: "Battle",  Icon: Swords,   gradient: "linear-gradient(135deg,#dc2626,#ea580c)", tab: "battle", sub: "Fight for coins"   },
];

function xpForLevel(lvl: number) { return lvl * 1000; }

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return "Burning the midnight oil?";
  if (h < 10) return "Morning, scholar!";
  if (h < 13) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  if (h < 21) return "Good evening.";
  return "Studying late again?";
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
    <div className="pb-8" style={{ background: "var(--background)" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div
        className="px-5 pt-10 pb-8"
        style={{ background: "linear-gradient(160deg, #2e1065 0%, #5b21b6 50%, #7c3aed 100%)" }}
      >
        {/* Greeting + coins */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-violet-300/75 text-xs font-medium tracking-wide">{getGreeting()}</p>
          <button
            onClick={() => onNavigate("gacha")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <Coins size={13} className="text-amber-300" />
            <span className="text-white font-bold text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {coins.toLocaleString()}
            </span>
          </button>
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-shrink-0">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl select-none"
              style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(251,191,36,0.5)" }}
            >
              {avatar}
            </div>
            <div
              className="absolute -bottom-1.5 -right-1.5 rounded-full px-1.5 text-white font-black"
              style={{ background: "#f59e0b", fontSize: "0.58rem", lineHeight: "1.6", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
            >
              Lv.{level}
            </div>
          </div>
          <div>
            <h2
              className="text-white font-black leading-none mb-1"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.5rem" }}
            >
              {username}
            </h2>
            <p className="text-violet-200/60 text-xs">
              {ownedCards.length} cards · {streak} day streak
            </p>
          </div>
        </div>

        {/* XP bar — simple, no shimmer */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-violet-200/70 font-semibold">Level {level}</span>
            <span className="text-violet-200/70">
              {xpNeeded - xp > 0 ? `${(xpNeeded - xp).toLocaleString()} XP to go` : "Ready to level up!"}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #fbbf24, #f59e0b)" }}
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        </div>
      </div>

      {/* ── Stat strip ───────────────────────────────────────────────── */}
      {/* Sits BELOW hero (no negative margin) so it's never hidden */}
      <div
        className="grid grid-cols-3 divide-x"
        style={{ background: "white", borderBottom: "1px solid rgba(0,0,0,0.06)", divideColor: "rgba(0,0,0,0.06)" }}
      >
        {[
          { value: streak,            label: "Day Streak",  Icon: Flame,  color: "#ea580c" },
          { value: ownedCards.length, label: "Cards",       Icon: Layers, color: "#7c3aed" },
          { value: totalBattleWins,   label: "Victories",   Icon: Trophy, color: "#d97706" },
        ].map(({ value, label, Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="flex flex-col items-center py-4 gap-1"
            style={{ borderRight: i < 2 ? "1px solid rgba(0,0,0,0.07)" : "none" }}
          >
            <Icon size={15} style={{ color }} />
            <span
              className="font-black text-2xl leading-none"
              style={{ fontFamily: "'Outfit', sans-serif", color }}
            >
              {value}
            </span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
          </motion.div>
        ))}
      </div>

      <div className="px-4 pt-6 space-y-7">

        {/* ── Quick actions ────────────────────────────────────────────── */}
        <section>
          <h3
            className="font-black text-lg mb-0.5"
            style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}
          >
            What's the plan?
          </h3>
          <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>Pick something and get started</p>

          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.button
                key={action.label}
                onClick={() => onNavigate(action.tab)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="rounded-2xl p-4 text-left active:scale-[0.97] transition-transform"
                style={{ background: action.gradient, boxShadow: "0 4px 14px rgba(0,0,0,0.16)" }}
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <action.Icon size={17} className="text-white" />
                </div>
                <p
                  className="text-white font-black text-base leading-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {action.label}
                </p>
                <p className="text-white/60 text-xs mt-0.5">{action.sub}</p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── Today's missions ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h3
                className="font-black text-lg mb-0.5"
                style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}
              >
                Today's Missions
              </h3>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {DAILY_QUESTS.filter(q => claimedQuests.includes(q.id)).length} of {DAILY_QUESTS.length} done today
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {DAILY_QUESTS.map(quest => {
              const claimed = claimedQuests.includes(quest.id);
              const claimable = quest.done && !claimed;
              return (
                <div
                  key={quest.id}
                  className="bg-white rounded-2xl overflow-hidden flex"
                  style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}
                >
                  {/* Left accent stripe */}
                  <div
                    className="w-1 flex-shrink-0"
                    style={{ background: claimed ? "#d1fae5" : quest.accent }}
                  />

                  <div className="flex-1 flex items-center gap-3 px-3 py-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: quest.bg }}
                    >
                      <quest.Icon size={16} style={{ color: quest.accent }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="font-black rounded px-1.5 py-0.5"
                          style={{ fontSize: "0.55rem", background: quest.bg, color: quest.accent, letterSpacing: "0.05em" }}
                        >
                          {quest.tag.toUpperCase()}
                        </span>
                      </div>
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "var(--foreground)" }}
                      >
                        {quest.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div
                          className="flex-1 rounded-full overflow-hidden"
                          style={{ height: 3, background: "var(--muted)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(quest.progress / quest.total) * 100}%`,
                              background: claimed ? "#10b981" : quest.accent,
                            }}
                          />
                        </div>
                        <span className="text-xs shrink-0" style={{ color: "var(--muted-foreground)", fontSize: "0.65rem" }}>
                          {quest.progress}/{quest.total}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">🪙</span>
                        <span className="font-black text-sm" style={{ color: "#d97706", fontFamily: "'Outfit', sans-serif" }}>
                          {quest.reward}
                        </span>
                      </div>
                      {claimable ? (
                        <button
                          onClick={() => handleClaimQuest(quest)}
                          className="text-white rounded-xl px-3 py-1 font-black active:scale-95 transition-transform"
                          style={{ background: quest.accent, fontSize: "0.7rem" }}
                        >
                          Claim
                        </button>
                      ) : claimed ? (
                        <span className="text-emerald-500 font-black" style={{ fontSize: "0.7rem" }}>✓</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Your roster ─────────────────────────────────────────────── */}
        {recentChars.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h3
                  className="font-black text-lg mb-0.5"
                  style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}
                >
                  Your Roster
                </h3>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {ownedCards.length} card{ownedCards.length !== 1 ? "s" : ""} collected
                </p>
              </div>
              <button
                onClick={() => onNavigate("collection")}
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: "var(--primary)" }}
              >
                View all <ChevronRight size={12} />
              </button>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {recentChars.map((char, i) => char && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="flex-shrink-0 w-[72px]"
                >
                  <CardImage character={char} size="xs" showName />
                </motion.div>
              ))}
              <button
                onClick={() => onNavigate("collection")}
                className="flex-shrink-0 w-[72px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5"
                style={{
                  borderColor: "rgba(124,58,237,0.2)",
                  minHeight: 80,
                  background: "rgba(124,58,237,0.03)",
                }}
              >
                <ArrowRight size={13} style={{ color: "var(--primary)" }} />
                <span className="font-bold" style={{ color: "var(--primary)", fontSize: "0.5rem", letterSpacing: "0.05em" }}>
                  SEE ALL
                </span>
              </button>
            </div>
          </section>
        )}

        {/* ── Achievements ────────────────────────────────────────────── */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h3
                className="font-black text-lg mb-0.5"
                style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}
              >
                Hall of Fame
              </h3>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {ACHIEVEMENTS.filter(a => a.earned).length} of {ACHIEVEMENTS.length} earned
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {ACHIEVEMENTS.map(ach => (
                <div
                  key={ach.id}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5"
                  style={{ width: 52, opacity: ach.earned ? 1 : 0.3 }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{
                      background: ach.earned ? "#fef3c7" : "var(--muted)",
                      border: ach.earned ? "2px solid #fbbf24" : "2px solid transparent",
                    }}
                  >
                    {ach.icon}
                  </div>
                  <p
                    className="text-center leading-tight"
                    style={{ fontSize: "0.52rem", color: "var(--muted-foreground)", fontWeight: 600 }}
                  >
                    {ach.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Expedition ──────────────────────────────────────────────── */}
        <section>
          <div className="mb-4">
            <h3
              className="font-black text-lg mb-0.5"
              style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}
            >
              Expeditions
            </h3>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Cards out earning while you study</p>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ background: "linear-gradient(135deg, #312e81, #4c1d95)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: "pulse 2s infinite" }} />
                  <span className="text-white/70 text-xs font-semibold">3 cards away</span>
                </div>
                <p
                  className="text-white font-black text-xl mb-2"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Expedition Active
                </p>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-300" />
                  <span className="text-white/70 text-xs font-medium">Returns in 2h 15m</span>
                </div>
              </div>
              <Map size={40} className="text-white/15 flex-shrink-0" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
