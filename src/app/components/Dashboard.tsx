import { motion } from "motion/react";
import {
  ChevronRight, ArrowRight, Target, Trophy, Zap, BookOpen,
  Gamepad2, Swords, Flame, Layers, Timer, HelpCircle, Sparkles,
  Map, Clock, Coins
} from "lucide-react";
import { CHARACTERS, ACHIEVEMENTS } from "../data/characters";
import type { OwnedCard } from "../data/characters";
import { CardImage } from "./CardImage";

const DAILY_QUESTS = [
  { id: 1, title: "Study for 25 minutes", reward: 50, Icon: Timer,      iconBg: "#fef2f2", iconColor: "#ef4444", progress: 25, total: 25, done: true  },
  { id: 2, title: "Answer 10 quiz questions", reward: 30, Icon: HelpCircle, iconBg: "#eff6ff", iconColor: "#3b82f6", progress: 7,  total: 10, done: false },
  { id: 3, title: "Win a battle",          reward: 80, Icon: Swords,     iconBg: "#fff1f2", iconColor: "#f43f5e", progress: 1,  total: 1,  done: true  },
  { id: 4, title: "Pull 3 gacha cards",    reward: 20, Icon: Sparkles,   iconBg: "#f5f3ff", iconColor: "#8b5cf6", progress: 1,  total: 3,  done: false },
];

const QUICK_ACTIONS = [
  { label: "Study",      Icon: BookOpen,  gradient: "linear-gradient(135deg,#3b82f6,#4f46e5)", tab: "study",      sub: "Earn coins & XP"  },
  { label: "Pull Gacha", Icon: Sparkles,  gradient: "linear-gradient(135deg,#8b5cf6,#ec4899)", tab: "gacha",      sub: "New cards await"   },
  { label: "Games",      Icon: Gamepad2,  gradient: "linear-gradient(135deg,#10b981,#059669)", tab: "games",      sub: "Quiz & match"      },
  { label: "Battle",     Icon: Swords,    gradient: "linear-gradient(135deg,#ef4444,#f97316)", tab: "battle",     sub: "Win rewards"       },
];

const STAT_CARDS = [
  { Icon: Flame,  iconColor: "#f97316", bgColor: "#fff7ed", label: "Day Streak",  key: "streak"  as const },
  { Icon: Layers, iconColor: "#8b5cf6", bgColor: "#f5f3ff", label: "Cards",       key: "cards"   as const },
  { Icon: Swords, iconColor: "#f43f5e", bgColor: "#fff1f2", label: "Victories",   key: "wins"    as const },
];

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

function xpForLevel(level: number) { return level * 1000; }

function SectionHeader({
  icon, title, action, onAction,
}: { icon: React.ReactNode; title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full" style={{ background: "var(--primary)" }} />
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="font-bold text-sm" style={{ color: "var(--foreground)", fontFamily: "'Outfit', sans-serif" }}>
            {title}
          </span>
        </div>
      </div>
      {action && (
        <button onClick={onAction} className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--primary)" }}>
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
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
  const earnedAchievements = ACHIEVEMENTS.filter(a => a.earned);

  const statValues = { streak, cards: ownedCards.length, wins: totalBattleWins };

  function handleClaimQuest(quest: typeof DAILY_QUESTS[0]) {
    onClaimQuest(quest.id);
    onEarnCoins(quest.reward, `Quest complete!`);
  }

  return (
    <div className="pb-6">

      {/* ── Hero header ──────────────────────────────────── */}
      <div
        className="relative px-5 pt-10 pb-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 45%, #4338ca 100%)" }}
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="absolute right-4 bottom-4 w-20 h-20 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="absolute -left-6 top-12 w-24 h-24 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />

        <div className="relative flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl select-none shrink-0"
              style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
              {avatar}
            </div>
            <div>
              <p className="text-white/65 text-xs font-medium">Welcome back</p>
              <p className="text-white font-black text-xl leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {username}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("gacha")}
            className="flex items-center gap-1.5 rounded-2xl px-3 py-2"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
          >
            <Coins size={15} className="text-amber-300" />
            <span className="text-white font-black text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {coins.toLocaleString()}
            </span>
          </button>
        </div>

        {/* XP bar */}
        <div className="relative rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
          <div className="flex justify-between text-xs text-white/75 mb-2 font-semibold">
            <span>Level {level} Scholar</span>
            <span>{xp.toLocaleString()} / {xpNeeded.toLocaleString()} XP</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.18)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #fbbf24, #f59e0b)" }}
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
          </div>
          <p className="text-white/55 text-xs mt-1.5">
            {xpNeeded - xp > 0 ? `${(xpNeeded - xp).toLocaleString()} XP to level ${level + 1}` : "Level up ready!"}
          </p>
        </div>
      </div>

      {/* ── Floating stat cards ──────────────────────────── */}
      <div className="px-4 -mt-5 grid grid-cols-3 gap-3 mb-5">
        {STAT_CARDS.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="bg-white rounded-2xl p-3 text-center"
            style={{ boxShadow: "0 4px 20px rgba(124,58,237,0.14), 0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <div className="flex justify-center mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bgColor }}>
                <s.Icon size={18} style={{ color: s.iconColor }} />
              </div>
            </div>
            <div className="font-black text-xl leading-tight" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
              {statValues[s.key]}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="px-4 space-y-6">

        {/* ── Quick Actions ─────────────────────────────── */}
        <section>
          <SectionHeader icon={<Zap size={14} style={{ color: "var(--primary)" }} />} title="Quick Actions" />
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.button
                key={action.label}
                onClick={() => onNavigate(action.tab)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="relative overflow-hidden rounded-2xl p-4 text-left active:scale-95 transition-transform"
                style={{ background: action.gradient, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
              >
                <div className="absolute -right-3 -bottom-3 opacity-15">
                  <action.Icon size={64} className="text-white" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                  <action.Icon size={20} className="text-white" />
                </div>
                <p className="text-white font-black text-base leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {action.label}
                </p>
                <p className="text-white/70 text-xs mt-0.5 font-medium">{action.sub}</p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── Daily Quests ──────────────────────────────── */}
        <section>
          <SectionHeader
            icon={<Target size={14} style={{ color: "var(--primary)" }} />}
            title="Daily Quests"
            action="Resets midnight"
          />
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            {DAILY_QUESTS.map((quest, i) => {
              const claimed = claimedQuests.includes(quest.id);
              return (
                <div
                  key={quest.id}
                  className="px-4 py-3 flex items-center gap-3"
                  style={{ borderBottom: i < DAILY_QUESTS.length - 1 ? "1px solid rgba(124,58,237,0.08)" : "none" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: quest.iconBg }}>
                    <quest.Icon size={16} style={{ color: quest.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{quest.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 5, background: "var(--muted)" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(quest.progress / quest.total) * 100}%`,
                            background: quest.done ? "#10b981" : "var(--primary)",
                          }}
                        />
                      </div>
                      <span className="text-xs shrink-0" style={{ color: "var(--muted-foreground)" }}>
                        {quest.progress}/{quest.total}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      <Coins size={11} className="text-amber-500" />
                      <span className="text-xs font-bold" style={{ color: "#d97706" }}>{quest.reward}</span>
                    </div>
                    {quest.done && !claimed ? (
                      <button
                        onClick={() => handleClaimQuest(quest)}
                        className="text-xs font-bold text-white rounded-xl px-2.5 py-1.5 active:scale-95 transition-transform"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", boxShadow: "0 2px 8px rgba(124,58,237,0.35)" }}
                      >
                        Claim
                      </button>
                    ) : claimed ? (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#dcfce7" }}>
                        <span className="text-green-600 text-sm font-black">✓</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Recent Cards ──────────────────────────────── */}
        {recentChars.length > 0 && (
          <section>
            <SectionHeader
              icon={<Layers size={14} style={{ color: "var(--primary)" }} />}
              title="Recent Cards"
              action="View all"
              onAction={() => onNavigate("collection")}
            />
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {recentChars.map((char, i) => char && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className="flex-shrink-0 w-[72px]"
                >
                  <CardImage character={char} size="xs" showName />
                </motion.div>
              ))}
              <button
                onClick={() => onNavigate("collection")}
                className="flex-shrink-0 w-[72px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1"
                style={{ borderColor: "rgba(124,58,237,0.25)", minHeight: 64 }}
              >
                <ArrowRight size={14} style={{ color: "var(--primary)" }} />
                <span className="text-xs font-bold" style={{ color: "var(--primary)", fontSize: "0.5rem" }}>ALL</span>
              </button>
            </div>
          </section>
        )}

        {/* ── Achievements ──────────────────────────────── */}
        <section>
          <SectionHeader
            icon={<Trophy size={14} style={{ color: "#f59e0b" }} />}
            title="Achievements"
            action={`${earnedAchievements.length}/${ACHIEVEMENTS.length}`}
          />
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex gap-4 p-4 overflow-x-auto">
              {ACHIEVEMENTS.map(ach => (
                <div
                  key={ach.id}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5"
                  style={{ width: 52, opacity: ach.earned ? 1 : 0.35 }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background: ach.earned ? "linear-gradient(135deg,#fef3c7,#fde68a)" : "var(--muted)",
                      border: ach.earned ? "2px solid #fbbf24" : "2px solid var(--border)",
                      boxShadow: ach.earned ? "0 2px 8px rgba(251,191,36,0.3)" : "none",
                    }}
                  >
                    {ach.icon}
                  </div>
                  <p className="text-center leading-tight" style={{ fontSize: "0.55rem", color: "var(--muted-foreground)", fontWeight: 600 }}>
                    {ach.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Expedition ────────────────────────────────── */}
        <section>
          <SectionHeader icon={<Map size={14} style={{ color: "var(--primary)" }} />} title="Expeditions" />
          <div
            className="relative overflow-hidden rounded-2xl p-5 text-white"
            style={{
              background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #7e22ce 100%)",
              boxShadow: "0 8px 24px rgba(109,40,217,0.3)",
            }}
          >
            <div className="absolute -right-6 -top-6 w-36 h-36 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-white/70 text-xs font-semibold mb-0.5">EXPEDITION ACTIVE</p>
                <p className="text-white font-black text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>3 cards on mission</p>
                <div className="inline-flex items-center gap-1.5 mt-2 rounded-xl px-3 py-1.5" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <Clock size={13} className="text-amber-300" />
                  <span className="text-white text-xs font-bold">Returns in 2h 15m</span>
                </div>
              </div>
              <Map size={52} className="text-white/30" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
