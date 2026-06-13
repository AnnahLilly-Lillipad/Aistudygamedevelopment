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
  { id: "home", label: "Home", icon: <Home size={20} /> },
  { id: "study", label: "Study", icon: <BookOpen size={20} /> },
  { id: "games", label: "Games", icon: <Gamepad2 size={20} /> },
  { id: "gacha", label: "Gacha", icon: <Sparkles size={20} /> },
  { id: "collection", label: "Cards", icon: <Library size={20} /> },
  { id: "battle", label: "Battle", icon: <Sword size={20} /> },
  { id: "chat", label: "Chat", icon: <MessageCircle size={20} /> },
  { id: "profile", label: "Profile", icon: <User size={20} /> },
];

interface ToastNotif { id: string; message: string; coins?: number; }

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [toasts, setToasts] = useState<ToastNotif[]>([]);

  const gs = useGameState();

  const showToast = useCallback((message: string, coins?: number) => {
    const id = Math.random().toString(36);
    setToasts(prev => [...prev, { id, message, coins }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const handleEarnCoins = useCallback((amount: number, reason: string) => {
    gs.earnCoins(amount);
    showToast(reason, amount);
  }, [gs, showToast]);

  const handleAwakenCard = useCallback((characterId: number) => {
    gs.awakenCard(characterId);
    showToast("Card Awakened! ✦ New power unlocked!");
  }, [gs, showToast]);

  const handleRecordWin = useCallback(() => {
    gs.recordBattleWin();
    gs.earnXp(100);
    showToast("⚔️ Victory! +100 XP");
  }, [gs, showToast]);

  const navigate = useCallback((tab: string) => setActiveTab(tab as Tab), []);

  const claimedQuests = gs.getClaimedQuests();

  if (!gs.user) {
    return <LoginScreen onLogin={gs.login} />;
  }

  const renderContent = () => {
    const { state } = gs;
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
          />
        );
      case "study":
        return <StudyMode onEarnCoins={handleEarnCoins} />;
      case "games":
        return <GamesHub onEarnCoins={handleEarnCoins} />;
      case "gacha":
        return (
          <GachaScreen
            coins={state.coins}
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
      case "chat":
        return <AIChat />;
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
      default:
        return null;
    }
  };

  return (
    <div
      className="size-full flex flex-col bg-background overflow-hidden"
      style={{ fontFamily: "'Nunito', sans-serif", maxWidth: 480, margin: "0 auto" }}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            className="min-h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="bg-white border-t border-border flex-shrink-0">
        <div className="flex">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 transition-colors ${
                activeTab === item.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all ${activeTab === item.id ? "bg-primary/10" : ""}`}>
                {item.icon}
                {item.id === "gacha" && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </div>
              <span style={{ fontSize: "0.6rem", fontWeight: activeTab === item.id ? 700 : 500 }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: 360, width: "90%" }}
      >
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl px-4 py-3 shadow-xl border border-border flex items-center gap-3"
            >
              {toast.coins !== undefined && (
                <span className="text-amber-500 font-bold text-sm">🪙 +{toast.coins}</span>
              )}
              <span className="text-sm font-semibold text-foreground">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
