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
  { id: "home",       label: "Home",    icon: <Home size={16} /> },
  { id: "study",      label: "Study",   icon: <BookOpen size={16} /> },
  { id: "games",      label: "Games",   icon: <Gamepad2 size={16} /> },
  { id: "gacha",      label: "Gacha",   icon: <Sparkles size={16} /> },
  { id: "collection", label: "Cards",   icon: <Library size={16} /> },
  { id: "battle",     label: "Battle",  icon: <Sword size={16} /> },
  { id: "chat",       label: "Chat",    icon: <MessageCircle size={16} /> },
  { id: "profile",    label: "Profile", icon: <User size={16} /> },
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
      className="size-full flex flex-col overflow-hidden dot-grid-bg"
      style={{ maxWidth: 480, margin: "0 auto" }}
    >
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="min-h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Retro nav bar ─────────────────────────────────────── */}
      <nav
        className="flex-shrink-0 safe-bottom"
        style={{
          background: "linear-gradient(180deg, #c8dfe9 0%, #b8d2e0 100%)",
          borderTop: "2px solid #9dc4d8",
          boxShadow: "0 -1px 0 rgba(255,255,255,0.5) inset",
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
                style={{
                  WebkitTapHighlightColor: "transparent",
                  background: active ? "rgba(255,255,255,0.45)" : "transparent",
                  borderRight: "1px solid rgba(157,196,216,0.5)",
                  transition: "background 0.1s",
                }}
              >
                {/* Active top border */}
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: "#5b9aba",
                    }}
                  />
                )}

                <div style={{ color: active ? "#1a3d52" : "#5a7d8a" }}>
                  {item.icon}
                </div>

                {/* Gacha notification dot */}
                {item.id === "gacha" && (
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      right: "20%",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#d94040",
                      border: "1px solid white",
                    }}
                  />
                )}

                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.48rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: active ? "#1a3d52" : "#5a7d8a",
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Toast notifications ──────────────────────────────── */}
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: 320, width: "90%" }}
      >
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.94, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="os-window flex items-center gap-2.5 px-3 py-2"
              style={{ boxShadow: "0 4px 16px rgba(26,61,82,0.18)" }}
            >
              {toast.coins !== undefined && (
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    background: "#fef3c7",
                    color: "#92400e",
                    padding: "2px 6px",
                    borderRadius: 3,
                    border: "1px solid #fbbf24",
                    flexShrink: 0,
                  }}
                >
                  🪙 +{toast.coins}
                </span>
              )}
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#1a3d52",
                }}
              >
                {toast.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
