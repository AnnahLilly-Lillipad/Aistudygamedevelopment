import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Home, BookOpen, Gamepad2, Sparkles, Sword, MessageCircle, User, Library } from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { StudyMode } from "./components/StudyMode";
import { GamesHub } from "./components/GamesHub";
import { GachaScreen } from "./components/GachaScreen";
import { CardCollection } from "./components/CardCollection";
import { BattleMode } from "./components/BattleMode";
import { AIChat } from "./components/AIChat";
import { ProfilePage } from "./components/ProfilePage";
import { LoginScreen } from "./components/LoginScreen";
import { useGameState } from "./hooks/useGameState";

type Tab = "home" | "study" | "games" | "gacha" | "collection" | "battle" | "chat" | "profile";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "home",       label: "Home",    icon: <Home size={19} /> },
  { id: "study",      label: "Study",   icon: <BookOpen size={19} /> },
  { id: "games",      label: "Games",   icon: <Gamepad2 size={19} /> },
  { id: "gacha",      label: "Gacha",   icon: <Sparkles size={19} /> },
  { id: "collection", label: "Cards",   icon: <Library size={19} /> },
  { id: "battle",     label: "Battle",  icon: <Sword size={19} /> },
  { id: "chat",       label: "Chat",    icon: <MessageCircle size={19} /> },
  { id: "profile",    label: "Profile", icon: <User size={19} /> },
];

interface ToastNotif { id: string; message: string; coins?: number; }

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [toasts, setToasts] = useState<ToastNotif[]>([]);
  const gs = useGameState();

  const showToast = useCallback((message: string, coins?: number) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, coins }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const handleEarnCoins = useCallback((amount: number, reason: string) => {
    gs.earnCoins(amount);
    showToast(reason, amount);
  }, [gs, showToast]);

  const handleAwakenCard = useCallback((characterId: number) => {
    gs.awakenCard(characterId);
    showToast("✦ Card Awakened! New power unlocked!");
  }, [gs, showToast]);

  const handleRecordWin = useCallback(() => {
    gs.recordBattleWin();
    gs.earnXp(100);
    showToast("⚔️ Victory! +100 XP");
  }, [gs, showToast]);

  const navigate = useCallback((tab: string) => setActiveTab(tab as Tab), []);

  if (!gs.user) {
    return <LoginScreen onLogin={gs.login} />;
  }

  const { state } = gs;
  const claimedQuests = gs.getClaimedQuests();

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <Dashboard
            coins={state.coins}
            ownedCards={state.ownedCards}
            onNavigate={navigate}
            username={gs.user!.username}
            avatar={gs.user!.avatar}
            xp={state.xp}
            level={state.level}
            streak={state.streak}
            claimedQuests={claimedQuests}
            onClaimQuest={gs.claimQuest}
            onEarnCoins={handleEarnCoins}
            totalBattleWins={state.totalBattleWins}
          />
        );
      case "study":      return <StudyMode onEarnCoins={handleEarnCoins} />;
      case "games":      return <GamesHub onEarnCoins={handleEarnCoins} />;
      case "gacha":
        return (
          <GachaScreen
            coins={state.coins}
            ownedCards={state.ownedCards}
            onSpend={gs.spendCoins}
            onGain={gs.gainCards}
            pityCount={state.pityCount}
            setPityCount={gs.setPityCount}
          />
        );
      case "collection":
        return (
          <CardCollection
            ownedCards={state.ownedCards}
            onNavigate={navigate}
            onAwaken={handleAwakenCard}
          />
        );
      case "battle":
        return (
          <BattleMode
            ownedCards={state.ownedCards}
            onEarnCoins={handleEarnCoins}
            onRecordWin={handleRecordWin}
          />
        );
      case "chat":    return <AIChat />;
      case "profile":
        return (
          <ProfilePage
            coins={state.coins}
            ownedCards={state.ownedCards}
            username={gs.user!.username}
            avatar={gs.user!.avatar}
            xp={state.xp}
            level={state.level}
            streak={state.streak}
            totalBattleWins={state.totalBattleWins}
            totalPulls={state.totalPulls}
            onLogout={gs.logout}
            xpToNextLevel={gs.xpToNextLevel}
          />
        );
      default: return null;
    }
  };

  return (
    <div
      className="size-full flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', 'Nunito', sans-serif", maxWidth: 480, margin: "0 auto", background: "var(--background)" }}
    >
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="min-h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Premium nav bar ───────────────────────────────── */}
      <nav
        className="flex-shrink-0 safe-bottom"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(124,58,237,0.1)",
          boxShadow: "0 -4px 24px rgba(124,58,237,0.07), 0 -1px 0 rgba(124,58,237,0.06)",
        }}
      >
        <div className="flex">
          {NAV_ITEMS.map(item => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex-1 flex flex-col items-center py-2 gap-0.5 relative"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {/* Top active indicator */}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-b-full"
                    style={{ background: "var(--primary)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}

                {/* Icon container */}
                <div
                  className="relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? "rgba(124,58,237,0.1)" : "transparent",
                  }}
                >
                  <div style={{ color: active ? "var(--primary)" : "#9ca3af", transition: "color 0.2s" }}>
                    {item.icon}
                  </div>
                  {/* Gacha notification dot */}
                  {item.id === "gacha" && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white"
                      style={{ background: "#ef4444" }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className="leading-none font-semibold"
                  style={{
                    fontSize: "0.52rem",
                    letterSpacing: "0.04em",
                    color: active ? "var(--primary)" : "#9ca3af",
                    transition: "color 0.2s",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Toast notifications ───────────────────────────── */}
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: 340, width: "90%" }}
      >
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.92, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex items-center gap-2.5 rounded-2xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.97)",
                boxShadow: "0 8px 32px rgba(124,58,237,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(124,58,237,0.1)",
              }}
            >
              {toast.coins !== undefined && (
                <span
                  className="font-black text-sm shrink-0 px-2 py-0.5 rounded-lg"
                  style={{ background: "rgba(251,191,36,0.15)", color: "#d97706" }}
                >
                  🪙 +{toast.coins}
                </span>
              )}
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {toast.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
