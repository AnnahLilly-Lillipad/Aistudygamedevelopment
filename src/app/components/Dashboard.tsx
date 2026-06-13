import { motion } from "motion/react";
import { ChevronRight, ArrowRight, Trophy, BookOpen, Gamepad2, Swords,
  Flame, Layers, Timer, HelpCircle, Sparkles, Map, Clock, Coins } from "lucide-react";
import { CHARACTERS, ACHIEVEMENTS } from "../data/characters";
import type { OwnedCard } from "../data/characters";
import { CardImage } from "./CardImage";

// ─── Data ────────────────────────────────────────────────────────────────────

const DAILY_QUESTS = [
  { id: 1, title: "Study for 25 minutes",     reward: 50, Icon: Timer,      accent: "#ea580c", bg: "#fff7ed", progress: 25, total: 25, done: true,  tag: "Focus"  },
  { id: 2, title: "Answer 10 quiz questions",  reward: 30, Icon: HelpCircle, accent: "#2563eb", bg: "#eff6ff", progress: 7,  total: 10, done: false, tag: "Quiz"   },
  { id: 3, title: "Win a battle",              reward: 80, Icon: Swords,     accent: "#e11d48", bg: "#fff1f2", progress: 1,  total: 1,  done: true,  tag: "Battle" },
  { id: 4, title: "Pull 3 gacha cards",        reward: 20, Icon: Sparkles,   accent: "#7c3aed", bg: "#f5f3ff", progress: 1,  total: 3,  done: false, tag: "Gacha"  },
];

const QUICK_ACTIONS = [
  { label: "Study Up",    Icon: BookOpen, gradient: "linear-gradient(135deg,#3b82f6,#4f46e5)", tab: "study",  sub: "XP + coins"      },
  { label: "Open Packs",  Icon: Sparkles, gradient: "linear-gradient(135deg,#9333ea,#db2777)", tab: "gacha",  sub: "New cards wait"   },
  { label: "Play Games",  Icon: Gamepad2, gradient: "linear-gradient(135deg,#10b981,#0d9488)", tab: "games",  sub: "Quiz & flip"      },
  { label: "Battle!",     Icon: Swords,   gradient: "linear-gradient(135deg,#dc2626,#ea580c)", tab: "battle", sub: "Win big"          },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function xpForLevel(level: number) { return level * 1000; }

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return "Burning the midnight oil?";
  if (h < 10) return "Morning, scholar!";
  if (h < 13) return "Good morning!";
  if (h < 17) return "Good afternoon!";
  if (h < 21) return "Good evening!";
  return "Studying late again?";
}

// ─── Props ────────────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

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
    onEarnCoins(quest.reward, `Mission complete!`);
  }

  return (
    <div className="pb-8" style={{ background: "var(--background)" }}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <div
        className="relative px-5 pt-11 pb-14 overflow-hidden"
        style={{ background: "linear-gradient(150deg, #2e1065 0%, #5b21b6 40%, #7c3aed 75%, #6d28d9 100%)" }}
      >
        {/* Dot-grid texture overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.35,
        }} />
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute -left-8 bottom-0 w-36 h-36 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />

        {/* Top row: greeting + coins */}
        <div className="relative flex items-start justify-between mb-4">
          <p className="text-violet-300/80 text-xs font-semibold tracking-wide">{getGreeting()}</p>
          <button
            onClick={() => onNavigate("gacha")}
            className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5"
            style={{ background: "rgba(255,255,255,0.13)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <span className="text-sm">🪙</span>
            <span className="text-white font-black text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {coins.toLocaleString()}
            </span>
          </button>
        </div>

        {/* Avatar row */}
        <div className="relative flex items-center gap-3.5 mb-5">
          <div className="relative">
            {/* Glowing ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ boxShadow: "0 0 0 3px rgba(251,191,36,0.6), 0 0 16px rgba(251,191,36,0.3)" }}
            />
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl select-none relative z-10"
              style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
            >
              {avatar}
            </div>
            {/* Level badge */}
            <div
              className="absolute -bottom-1.5 -right-1.5 z-20 rounded-full px-1.5 py-0.5 text-white font-black"
              style={{
                fontSize: "0.6rem",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                boxShadow: "0 2px 6px rgba(245,158,11,0.6)",
                lineHeight: 1.4,
              }}
            >
              Lv.{level}
            </div>
          </div>
          <div>
            <h2 className="text-white font-black leading-tight" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.45rem" }}>
              {username}
            </h2>
            <p className="text-violet-300/70 text-xs font-medium">
              Scholar · {ownedCards.length} cards collected
            </p>
          </div>
        </div>

        {/* XP bar — game-style */}
        <div className="relative rounded-2xl p-3.5" style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-white/90 font-black text-xs" style={{ fontFamily: "'Outfit', sans-serif" }}>
                EXP
              </span>
              <span className="text-violet-300/70 text-xs">{xp.toLocaleString()} / {xpNeeded.toLocaleString()}</span>
            </div>
            <span className="text-amber-300 text-xs font-bold">
              {xpNeeded - xp > 0 ? `→ Lv.${level + 1} in ${(xpNeeded - xp).toLocaleString()} XP` : "✨ Level up!"}
            </span>
          </div>
          {/* Segmented bar track */}
          <div className="h-3 rounded-full overflow-hidden relative" style={{ background: "rgba(255,255,255,0.1)" }}>
            <motion.div
              className="h-full rounded-full relative"
              style={{ background: "linear-gradient(90deg, #fbbf24, #f59e0b, #fde68a)" }}
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-full" style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s infinite",
              }} />
            </motion.div>
            {/* Segment marks */}
            {[25, 50, 75].map(pct => (
              <div key={pct} className="absolute top-0 bottom-0 w-px" style={{ left: `${pct}%`, background: "rgba(255,255,255,0.15)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat cards (float over hero) ─────────────────── */}
      <div className="px-4 -mt-6 grid grid-cols-3 gap-2.5 mb-6">
        {/* Streak — warm orange */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
          className="rounded-2xl p-3 text-center"
          style={{
            background: streak > 0 ? "linear-gradient(145deg,#fff7ed,#ffedd5)" : "white",
            border: "1.5px solid rgba(234,88,12,0.15)",
            boxShadow: "0 4px 16px rgba(234,88,12,0.12), 0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex justify-center mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(234,88,12,0.12)" }}>
              <Flame size={18} style={{ color: "#ea580c" }} />
            </div>
          </div>
          <div className="font-black text-xl" style={{ fontFamily: "'Outfit', sans-serif", color: "#c2410c" }}>{streak}</div>
          <div className="text-xs font-semibold mt-0.5" style={{ color: "#9a3412" }}>Day Streak</div>
        </motion.div>

        {/* Cards — violet */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.07 }}
          className="rounded-2xl p-3 text-center"
          style={{
            background: "linear-gradient(145deg,#f5f3ff,#ede9fe)",
            border: "1.5px solid rgba(124,58,237,0.15)",
            boxShadow: "0 4px 16px rgba(124,58,237,0.12), 0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex justify-center mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.12)" }}>
              <Layers size={18} style={{ color: "#7c3aed" }} />
            </div>
          </div>
          <div className="font-black text-xl" style={{ fontFamily: "'Outfit', sans-serif", color: "#6d28d9" }}>{ownedCards.length}</div>
          <div className="text-xs font-semibold mt-0.5" style={{ color: "#5b21b6" }}>Cards</div>
        </motion.div>

        {/* Wins — gold */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
          className="rounded-2xl p-3 text-center"
          style={{
            background: totalBattleWins > 0 ? "linear-gradient(145deg,#fffbeb,#fef3c7)" : "white",
            border: "1.5px solid rgba(217,119,6,0.15)",
            boxShadow: "0 4px 16px rgba(217,119,6,0.1), 0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex justify-center mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(217,119,6,0.1)" }}>
              <Trophy size={18} style={{ color: "#d97706" }} />
            </div>
          </div>
          <div className="font-black text-xl" style={{ fontFamily: "'Outfit', sans-serif", color: "#b45309" }}>{totalBattleWins}</div>
          <div className="text-xs font-semibold mt-0.5" style={{ color: "#92400e" }}>Victories</div>
        </motion.div>
      </div>

      <div className="px-4 space-y-7">

        {/* ── What's the plan? ──────────────────────────── */}
        <section>
          <div className="flex items-baseline gap-2 mb-3">
            <h3 className="font-black text-lg" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
              What's the plan?
            </h3>
            <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>pick an activity</span>
          </div>

          {/* Asymmetric 2+2 grid — study/gacha taller, games/battle side by side */}
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.button
                key={action.label}
                onClick={() => onNavigate(action.tab)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="relative overflow-hidden rounded-2xl text-left active:scale-[0.97] transition-transform"
                style={{
                  background: action.gradient,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                  padding: i < 2 ? "18px 16px 20px" : "14px 16px 16px",
                }}
              >
                {/* Big faded background icon */}
                <div className="absolute -right-3 -bottom-3 opacity-[0.13] pointer-events-none">
                  <action.Icon size={72} className="text-white" />
                </div>
                {/* Icon pill */}
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2.5">
                  <action.Icon size={18} className="text-white" />
                </div>
                <p className="text-white font-black leading-tight" style={{ fontFamily: "'Outfit', sans-serif", fontSize: i < 2 ? "1.05rem" : "0.9rem" }}>
                  {action.label}
                </p>
                <p className="text-white/65 text-xs mt-0.5 font-medium">{action.sub}</p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── Today's Missions ─────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-black text-base" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                Today's Missions
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {DAILY_QUESTS.filter(q => claimedQuests.includes(q.id) || q.done).length}/{DAILY_QUESTS.length} complete
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.08)", color: "var(--primary)" }}>
              Resets midnight
            </span>
          </div>

          <div className="space-y-2.5">
            {DAILY_QUESTS.map(quest => {
              const claimed = claimedQuests.includes(quest.id);
              const complete = quest.done && !claimed;
              return (
                <div
                  key={quest.id}
                  className="relative bg-white rounded-2xl overflow-hidden flex items-stretch gap-0"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}
                >
                  {/* Left accent stripe */}
                  <div className="w-1 flex-shrink-0 rounded-l-2xl" style={{ background: claimed ? "#d1fae5" : quest.accent }} />

                  <div className="flex-1 flex items-center gap-3 px-3 py-3">
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: quest.bg }}>
                      <quest.Icon size={16} style={{ color: quest.accent }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-bold rounded-md px-1.5 py-0.5" style={{ background: quest.bg, color: quest.accent, fontSize: "0.6rem", letterSpacing: "0.03em" }}>
                          {quest.tag}
                        </span>
                        {claimed && <span className="text-xs font-bold text-emerald-600" style={{ fontSize: "0.6rem" }}>✓ DONE</span>}
                      </div>
                      <p className="text-sm font-semibold leading-tight truncate" style={{ color: "var(--foreground)" }}>{quest.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, background: "var(--muted)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(quest.progress / quest.total) * 100}%`,
                              background: claimed ? "#10b981" : quest.accent,
                            }}
                          />
                        </div>
                        <span className="text-xs shrink-0 font-medium" style={{ color: "var(--muted-foreground)", fontSize: "0.65rem" }}>
                          {quest.progress}/{quest.total}
                        </span>
                      </div>
                    </div>

                    {/* Reward + Claim */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">🪙</span>
                        <span className="font-black text-sm" style={{ color: "#d97706", fontFamily: "'Outfit', sans-serif" }}>{quest.reward}</span>
                      </div>
                      {complete ? (
                        <button
                          onClick={() => handleClaimQuest(quest)}
                          className="text-xs font-black text-white rounded-xl px-3 py-1.5 active:scale-95 transition-transform"
                          style={{ background: quest.accent, boxShadow: `0 3px 10px ${quest.accent}55`, fontSize: "0.7rem" }}
                        >
                          Claim
                        </button>
                      ) : claimed ? (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#d1fae5" }}>
                          <span className="text-emerald-600 font-black" style={{ fontSize: "0.7rem" }}>✓</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Your Roster ──────────────────────────────── */}
        {recentChars.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-black text-base" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                  Your Roster
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {ownedCards.length} card{ownedCards.length !== 1 ? "s" : ""} collected
                </p>
              </div>
              <button
                onClick={() => onNavigate("collection")}
                className="flex items-center gap-1 text-xs font-semibold active:opacity-70"
                style={{ color: "var(--primary)" }}
              >
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {recentChars.map((char, i) => char && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="flex-shrink-0 w-[72px]"
                >
                  <CardImage character={char} size="xs" showName />
                </motion.div>
              ))}
              <button
                onClick={() => onNavigate("collection")}
                className="flex-shrink-0 w-[72px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1"
                style={{ borderColor: "rgba(124,58,237,0.2)", minHeight: 72, background: "rgba(124,58,237,0.03)" }}
              >
                <ArrowRight size={14} style={{ color: "var(--primary)" }} />
                <span className="font-bold" style={{ color: "var(--primary)", fontSize: "0.5rem" }}>SEE ALL</span>
              </button>
            </div>
          </section>
        )}

        {/* ── Hall of Fame ─────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-black text-base" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
                Hall of Fame
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {ACHIEVEMENTS.filter(a => a.earned).length} of {ACHIEVEMENTS.length} earned
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
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
                      background: ach.earned
                        ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                        : "var(--muted)",
                      border: ach.earned ? "2px solid #fbbf24" : "2px solid transparent",
                      boxShadow: ach.earned ? "0 4px 12px rgba(251,191,36,0.35)" : "none",
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

        {/* ── Expedition ───────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Map size={14} style={{ color: "var(--primary)" }} />
            <h3 className="font-black text-base" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
              Active Expeditions
            </h3>
          </div>
          <div
            className="relative overflow-hidden rounded-2xl p-5 text-white"
            style={{
              background: "linear-gradient(135deg, #312e81 0%, #4c1d95 40%, #6d28d9 100%)",
              boxShadow: "0 8px 28px rgba(109,40,217,0.28)",
            }}
          >
            {/* Dot texture */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
              opacity: 0.3,
            }} />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 mb-2" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse 2s infinite" }} />
                  <span className="text-white text-xs font-bold">3 cards out</span>
                </div>
                <p className="text-white font-black text-xl leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Expedition Active
                </p>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <Clock size={13} className="text-amber-300" />
                  <span className="text-white/80 text-xs font-semibold">Returns in 2h 15m</span>
                </div>
              </div>
              <Map size={48} className="text-white/20 flex-shrink-0" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
