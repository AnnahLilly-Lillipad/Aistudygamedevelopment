import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
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

const NAV_ITEMS: { id: Tab; label: string }[] = [
  { id: "home",       label: "Home"    },
  { id: "study",      label: "Study"   },
  { id: "games",      label: "Games"   },
  { id: "gacha",      label: "Gacha"   },
  { id: "collection", label: "Cards"   },
  { id: "battle",     label: "Battle"  },
  { id: "chat",       label: "Chat"    },
  { id: "profile",    label: "Profile" },
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
    showToast("Card Awakened! New power unlocked.");
  }, [gs, showToast]);

  const handleRecordWin = useCallback(() => {
    gs.recordBattleWin();
    gs.earnXp(100);
    showToast("Victory! +100 XP");
  }, [gs, showToast]);

  const handleTrackStudyMinutes = useCallback((minutes: number) => {
    gs.trackStudyMinutes(minutes);
  }, [gs]);

  const handleTrackQuizAnswer = useCallback(() => {
    gs.trackQuizAnswer();
  }, [gs]);

  const handleUnlockBuff = useCallback((buffId: number, cost: number): boolean => {
    return gs.unlockBuff(buffId, cost);
  }, [gs]);

  const navigate = useCallback((tab: string) => setActiveTab(tab as Tab), []);

  if (!gs.user) return <LoginScreen onLogin={gs.login} />;

  const { state } = gs;
  const claimedQuests = gs.getClaimedQuests();

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <Dashboard
            coins={state.coins} ownedCards={state.ownedCards}
            onNavigate={navigate} username={gs.user!.username}
            avatar={gs.user!.avatar} xp={state.xp} level={state.level}
            streak={state.streak} claimedQuests={claimedQuests}
            onClaimQuest={gs.claimQuest} onEarnCoins={handleEarnCoins}
            totalBattleWins={state.totalBattleWins}
            equippedFrame={state.equippedFrame}
            dailyStats={state.dailyStats}
          />
        );
      case "study":
        return (
          <StudyMode
            onEarnCoins={handleEarnCoins}
            onTrackStudyMinutes={handleTrackStudyMinutes}
          />
        );
      case "games":
        return (
          <GamesHub
            onEarnCoins={handleEarnCoins}
            onTrackQuizAnswer={handleTrackQuizAnswer}
          />
        );
      case "gacha":
        return (
          <GachaScreen
            coins={state.coins} ownedCards={state.ownedCards}
            onSpend={gs.spendCoins} onGain={gs.gainCards}
            pityCount={state.pityCount} setPityCount={gs.setPityCount}
            equippedFrame={state.equippedFrame}
          />
        );
      case "collection":
        return (
          <CardCollection
            ownedCards={state.ownedCards} onNavigate={navigate}
            onAwaken={handleAwakenCard}
            equippedFrame={state.equippedFrame}
            ownedFrames={state.ownedFrames}
            coins={state.coins}
            onBuyFrame={gs.buyFrame}
            onEquipFrame={gs.equipFrame}
          />
        );
      case "battle":
        return (
          <BattleMode
            ownedCards={state.ownedCards} onEarnCoins={handleEarnCoins}
            onRecordWin={handleRecordWin}
            equippedFrame={state.equippedFrame}
          />
        );
      case "chat":    return <AIChat />;
      case "profile":
        return (
          <ProfilePage
            coins={state.coins} ownedCards={state.ownedCards}
            username={gs.user!.username} avatar={gs.user!.avatar}
            xp={state.xp} level={state.level} streak={state.streak}
            totalBattleWins={state.totalBattleWins} totalPulls={state.totalPulls}
            onLogout={gs.logout} xpToNextLevel={gs.xpToNextLevel}
            onEarnCoins={handleEarnCoins}
            unlockedBuffIds={state.unlockedBuffIds}
            onUnlockBuff={handleUnlockBuff}
            dailyStats={state.dailyStats}
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
      {/* Top system bar */}
      <div style={{
        background: "linear-gradient(180deg, #b8ddf0 0%, #a8d0e6 100%)",
        borderBottom: "2px solid #7ab2c8",
        padding: "3px 10px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#1a3d52", letterSpacing: "0.08em" }}>
          STUDYTALES
        </span>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#5a7d8a", letterSpacing: "0.04em" }}>
          {gs.user.username} · {state.coins.toLocaleString()} coins
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="min-h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav bar */}
      <nav className="flex-shrink-0 safe-bottom" style={{
        background: "linear-gradient(180deg, #cde5f0 0%, #b8d5e5 100%)",
        borderTop: "2px solid #7ab2c8",
      }}>
        <div style={{ display: "flex" }}>
          {NAV_ITEMS.map((item, idx) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  flex: 1,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", padding: "6px 2px 5px",
                  background: active ? "linear-gradient(180deg, #eef7fc 0%, #d8edf7 100%)" : "transparent",
                  borderRight: idx < NAV_ITEMS.length - 1 ? "1px solid rgba(122,178,200,0.35)" : "none",
                  borderTop: active ? "2.5px solid #5b9aba" : "2.5px solid transparent",
                  boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.6)" : "none",
                  transition: "background 0.1s", cursor: "pointer", WebkitTapHighlightColor: "transparent",
                }}
              >
                <span style={{
                  fontFamily: "'VT323', monospace", fontSize: "0.6rem", letterSpacing: "0.04em",
                  color: active ? "#1a3d52" : "#5a7d8a",
                }}>
                  {item.label.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Toast notifications */}
      <div style={{
        position: "fixed", top: 36, left: "50%", transform: "translateX(-50%)",
        zIndex: 100, display: "flex", flexDirection: "column", gap: 6,
        pointerEvents: "none", maxWidth: 300, width: "90%",
      }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              style={{
                background: "#ddeef6", border: "2px solid #7ab2c8",
                borderRadius: 6, boxShadow: "3px 3px 0 rgba(91,154,186,0.3)",
                display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
              }}
            >
              {toast.coins !== undefined && (
                <span style={{
                  fontFamily: "'VT323', monospace", fontSize: "0.85rem",
                  background: "#fef3c7", color: "#92400e",
                  padding: "1px 6px", borderRadius: 3,
                  border: "1.5px solid #fbbf24", flexShrink: 0,
                }}>
                  +{toast.coins}
                </span>
              )}
              <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#1a3d52", letterSpacing: "0.03em" }}>
                {toast.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
