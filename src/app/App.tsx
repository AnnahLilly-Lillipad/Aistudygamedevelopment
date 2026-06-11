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
import type { OwnedCard } from "./data/characters";

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

const INITIAL_OWNED_CARDS: OwnedCard[] = [
  { characterId: 1, id: "init-1", level: 15, limitBreak: 0, obtainedAt: new Date() },
  { characterId: 2, id: "init-2", level: 8, limitBreak: 0, obtainedAt: new Date() },
  { characterId: 5, id: "init-5", level: 12, limitBreak: 1, obtainedAt: new Date() },
  { characterId: 10, id: "init-10", level: 10, limitBreak: 0, obtainedAt: new Date() },
  { characterId: 11, id: "init-11", level: 20, limitBreak: 2, obtainedAt: new Date() },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [coins, setCoins] = useState(3200);
  const [ownedCards, setOwnedCards] = useState<OwnedCard[]>(INITIAL_OWNED_CARDS);
  const [pityCount, setPityCount] = useState(0);
  const [toasts, setToasts] = useState<ToastNotif[]>([]);

  const showToast = useCallback((message: string, coins?: number) => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, message, coins }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const earnCoins = useCallback((amount: number, reason: string) => {
    setCoins(prev => prev + amount);
    showToast(reason, amount);
  }, [showToast]);

  const spendCoins = useCallback((amount: number) => {
    setCoins(prev => Math.max(0, prev - amount));
  }, []);

  const gainCards = useCallback((cards: OwnedCard[]) => {
    setOwnedCards(prev => {
      const merged = new Map<number, OwnedCard>();
      [...prev, ...cards].forEach(card => {
        if (merged.has(card.characterId)) {
          const existing = merged.get(card.characterId)!;
          merged.set(card.characterId, { ...existing, limitBreak: Math.min(existing.limitBreak + 1, 5) });
        } else {
          merged.set(card.characterId, card);
        }
      });
      return Array.from(merged.values());
    });
  }, []);

  const navigate = useCallback((tab: string) => setActiveTab(tab as Tab), []);

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <Dashboard coins={coins} ownedCards={ownedCards} onNavigate={navigate} />;
      case "study": return <StudyMode onEarnCoins={earnCoins} />;
      case "games": return <GamesHub onEarnCoins={earnCoins} />;
      case "gacha": return <GachaScreen coins={coins} onSpend={spendCoins} onGain={gainCards} pityCount={pityCount} setPityCount={setPityCount} />;
      case "collection": return <CardCollection ownedCards={ownedCards} onNavigate={navigate} />;
      case "battle": return <BattleMode ownedCards={ownedCards} onEarnCoins={earnCoins} />;
      case "chat": return <AIChat />;
      case "profile": return <ProfilePage coins={coins} ownedCards={ownedCards} />;
      default: return null;
    }
  };

  return (
    <div className="size-full flex flex-col bg-background overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif", maxWidth: 480, margin: "0 auto" }}>
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
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 transition-colors ${activeTab === item.id ? "text-primary" : "text-muted-foreground"}`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all ${activeTab === item.id ? "bg-primary/10" : ""}`}>
                {item.icon}
                {item.id === "gacha" && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full" />}
              </div>
              <span style={{ fontSize: "0.6rem", fontWeight: activeTab === item.id ? 700 : 500 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 360, width: "90%" }}>
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
              {toast.coins !== undefined && <span className="text-amber-500 font-bold text-sm">🪙 +{toast.coins}</span>}
              <span className="text-sm font-semibold text-foreground">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
