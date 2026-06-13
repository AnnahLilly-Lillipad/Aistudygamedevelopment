import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Sparkles, Coins, Clock, ChevronRight } from "lucide-react";
import { CHARACTERS, BANNERS, type Character, type Rarity, type OwnedCard } from "../data/characters";
import { CardImage } from "./CardImage";

const RARITY_STYLES: Record<Rarity, { border: string; stars: number }> = {
  R: { border: "border-slate-300", stars: 1 },
  SR: { border: "border-purple-400", stars: 3 },
  SSR: { border: "border-amber-400", stars: 4 },
  UR: { border: "border-rose-400", stars: 5 },
};

const PULL_COST = { single: 160, ten: 1440 };

function rollRarity(rates: Record<Rarity, number>): Rarity {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const [rarity, rate] of Object.entries(rates) as [Rarity, number][]) {
    cumulative += rate;
    if (rand <= cumulative) return rarity;
  }
  return "R";
}

function pullCard(banner: typeof BANNERS[0], pity: number, awakenedIds: Set<number>): Character {
  const rarity = pity >= 100 ? "UR" : rollRarity(banner.rates);
  const candidatePool = banner.pool
    ? CHARACTERS.filter(c => banner.pool!.includes(c.id) && c.rarity === rarity)
    : CHARACTERS.filter(c => !c.banner && c.rarity === rarity);
  const pool = candidatePool.filter(c => !awakenedIds.has(c.id));
  const finalPool = pool.length > 0 ? pool : candidatePool;
  if (finalPool.length === 0) {
    const fallback = CHARACTERS.filter(c => c.rarity === "R");
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  const weighted: Character[] = [];
  finalPool.forEach(c => {
    const times = banner.featured.includes(c.id) ? 3 : 1;
    for (let i = 0; i < times; i++) weighted.push(c);
  });
  return weighted[Math.floor(Math.random() * weighted.length)];
}

interface CardRevealProps {
  char: Character;
  index: number;
  revealed: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
}

function CardReveal({ char, index, revealed, onClick, size = "sm" }: CardRevealProps) {
  const style = RARITY_STYLES[char.rarity];
  const starSize = size === "lg" ? 14 : size === "md" ? 11 : 8;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 280, damping: 22 }}
      style={{ perspective: 600 }}
      onClick={onClick}
    >
      <motion.div
        animate={{ rotateY: revealed ? 0 : 180 }}
        transition={{ duration: 0.42 }}
        style={{ transformStyle: "preserve-3d", position: "relative" }}
      >
        {/* Front */}
        <div
          className={`rounded border-2 ${style.border} overflow-hidden cursor-pointer ${char.rarity === "UR" ? "shadow-rose-400 shadow-xl" : char.rarity === "SSR" ? "shadow-amber-300 shadow-lg" : char.rarity === "SR" ? "shadow-purple-300 shadow-md" : ""}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative">
            <CardImage character={char} size={size} showName={false} />
            <div className="absolute bottom-1.5 right-1.5 flex gap-0.5">
              {Array.from({ length: style.stars }).map((_, i) => (
                <Star key={i} size={starSize} className="fill-amber-400 text-amber-400 drop-shadow" />
              ))}
            </div>
            {(char.rarity === "UR" || char.rarity === "SSR") && (
              <div className="absolute inset-0 pointer-events-none" style={{
                background: char.rarity === "UR"
                  ? "linear-gradient(to top, rgba(251,113,133,0.25) 0%, transparent 60%)"
                  : "linear-gradient(to top, rgba(251,191,36,0.2) 0%, transparent 60%)"
              }} />
            )}
          </div>
        </div>
        {/* Back — retro blue */}
        <div
          className="absolute inset-0 rounded border-2 flex items-center justify-center cursor-pointer"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#5b9aba", borderColor: "#3d7a98" }}
        >
          <div className="text-center flex flex-col items-center gap-1">
            <Sparkles size={size === "lg" ? 32 : 22} style={{ color: "rgba(255,255,255,0.8)" }} />
            <p className="vt" style={{ color: "rgba(255,255,255,0.7)", fontSize: size === "lg" ? "0.75rem" : "0.55rem" }}>TAP TO REVEAL</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface Props {
  coins: number;
  ownedCards: OwnedCard[];
  onSpend: (amount: number) => void;
  onGain: (cards: OwnedCard[]) => void;
  pityCount: number;
  setPityCount: (n: number) => void;
}

export function GachaScreen({ coins, ownedCards, onSpend, onGain, pityCount, setPityCount }: Props) {
  const [pulledCards, setPulledCards] = useState<Character[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  const today = new Date();
  const activeLimited = BANNERS.find(b => {
    if (!b.limited || !b.startDate) return false;
    const start = new Date(b.startDate);
    const end = b.endDate ? new Date(b.endDate) : new Date("9999-12-31");
    return today >= start && today <= end;
  });
  const visibleBanners = BANNERS.filter(b => !b.limited || b === activeLimited);

  const [selectedBannerIdx, setSelectedBannerIdx] = useState(0);
  const banner = visibleBanners[Math.min(selectedBannerIdx, visibleBanners.length - 1)];

  const doPull = useCallback((count: 1 | 10) => {
    const cost = count === 1 ? PULL_COST.single : PULL_COST.ten;
    if (coins < cost) return;
    onSpend(cost);

    const awakenedIds = new Set(ownedCards.filter(oc => oc.awakened).map(oc => oc.characterId));
    let newPity = pityCount;
    const cards: Character[] = [];

    for (let i = 0; i < count; i++) {
      const card = pullCard(banner, newPity, awakenedIds);
      cards.push(card);
      newPity = card.rarity === "UR" ? 0 : newPity + 1;
    }
    setPityCount(newPity);

    const newOwned: OwnedCard[] = cards.map(c => ({
      characterId: c.id,
      id: `${c.id}-${Date.now()}-${Math.random()}`,
      level: 1,
      limitBreak: 0,
      awakened: false,
      obtainedAt: new Date(),
    }));
    onGain(newOwned);
    setPulledCards(cards);
    setRevealed(new Array(cards.length).fill(false));
    setShowResults(true);
  }, [coins, banner, pityCount, onSpend, onGain, setPityCount]);

  const revealAll = () => setRevealed(prev => prev.map(() => true));
  const revealOne = (i: number) => setRevealed(prev => { const n = [...prev]; n[i] = true; return n; });
  const close = () => { setShowResults(false); setPulledCards([]); };

  const nextLimited = BANNERS.find(b => {
    if (!b.limited || !b.startDate) return false;
    return new Date(b.startDate) > today;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Page header */}
      <div className="os-window mx-3 mt-3 mb-2 flex-shrink-0">
        <div className="os-titlebar">
          <div className="os-btn-red" /><div className="os-btn-yellow" /><div className="os-btn-green" />
          <span className="os-titlebar-title">GACHA.EXE</span>
        </div>
        <div style={{ background: "#ddeef6", padding: "8px 10px" }}>
          <span className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>✦ WISH MACHINE ✦</span>
        </div>
      </div>

      {/* Banner tabs */}
      <div className="flex gap-2 overflow-x-auto px-3 pb-2 no-scrollbar flex-shrink-0">
        {visibleBanners.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setSelectedBannerIdx(i)}
            className="retro-btn flex-shrink-0 text-sm"
            style={selectedBannerIdx === i ? { background: "#5b9aba", color: "#fff", borderColor: "#3d7a98" } : {}}
          >
            {b.emoji} {b.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Banner hero — retro window */}
      <div className="os-window mx-3 mb-2 flex-shrink-0">
        <div className="os-titlebar">
          <div className="os-btn-green" />
          {banner.limited && <span className="retro-btn py-0 px-1.5 text-xs" style={{ background: "#ff6b6b", color: "#fff", borderColor: "#e05555", boxShadow: "none" }}>LIMITED</span>}
          <span className="os-titlebar-title">{banner.name.toUpperCase()}</span>
        </div>
        <div style={{ background: "#f0f8fc", padding: "12px" }}>
          <p className="text-xs mb-0.5" style={{ color: "#5a7d8a" }}>{banner.subtitle}</p>
          <p className="text-sm mb-2" style={{ color: "#2a5a70" }}>{banner.description}</p>
          {banner.endDate && (
            <div className="flex items-center gap-1 text-xs mb-3" style={{ color: "#8aaab8" }}>
              <Clock size={11} />
              <span>Ends {banner.endDate}</span>
            </div>
          )}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {banner.featured.map(id => {
              const char = CHARACTERS.find(c => c.id === id);
              if (!char) return null;
              return (
                <div key={id} className="flex-shrink-0 w-14 rounded overflow-hidden border-2" style={{ borderColor: "#7ab2c8" }}>
                  <CardImage character={char} size="xs" showName />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rates + pity */}
      <div className="os-window mx-3 mb-2 flex-shrink-0">
        <div className="os-titlebar">
          <div className="os-btn-green" />
          <span className="os-titlebar-title">RATES & PITY</span>
        </div>
        <div className="flex items-center justify-between px-4 py-2" style={{ background: "#fff" }}>
          <div className="flex gap-4">
            {(Object.entries(banner.rates) as [Rarity, number][]).map(([r, rate]) => (
              <div key={r} className="text-center">
                <div className="vt" style={{ fontSize: "0.9rem", color: r === "UR" ? "#dc2626" : r === "SSR" ? "#d97706" : r === "SR" ? "#7c3aed" : "#64748b" }}>{r}</div>
                <div className="text-xs" style={{ color: "#5a7d8a" }}>{rate}%</div>
              </div>
            ))}
          </div>
          <div className="text-right">
            <div className="mono-label" style={{ fontSize: "0.7rem" }}>PITY</div>
            <div className="vt" style={{ fontSize: "1.2rem", color: "#5b9aba" }}>{pityCount}/100</div>
          </div>
        </div>
      </div>

      {/* Pull buttons */}
      <div className="px-3 flex gap-3 mb-2 flex-shrink-0">
        <button
          disabled={coins < PULL_COST.single}
          onClick={() => doPull(1)}
          className="retro-btn flex-1 py-3 disabled:opacity-50"
        >
          <div className="vt" style={{ fontSize: "1rem" }}>SINGLE PULL</div>
          <div className="flex items-center justify-center gap-1 text-xs mt-0.5" style={{ color: "#d97706" }}>
            <Coins size={11} /> {PULL_COST.single.toLocaleString()}
          </div>
        </button>
        <button
          disabled={coins < PULL_COST.ten}
          onClick={() => doPull(10)}
          className="retro-btn retro-btn-primary flex-1 py-3 disabled:opacity-50"
        >
          <div className="vt" style={{ fontSize: "1rem" }}>10 PULL</div>
          <div className="flex items-center justify-center gap-1 text-xs mt-0.5" style={{ color: "#ffd166" }}>
            <Coins size={11} /> {PULL_COST.ten.toLocaleString()}
          </div>
        </button>
      </div>
      <div className="text-center text-xs flex items-center justify-center gap-1 mb-2 flex-shrink-0">
        <Coins size={12} style={{ color: "#d97706" }} />
        <span className="vt" style={{ color: "#d97706", fontSize: "1rem" }}>{coins.toLocaleString()}</span>
        <span style={{ color: "#5a7d8a" }}>coins available</span>
      </div>

      {/* Upcoming banner */}
      {nextLimited && (
        <div className="os-window mx-3 mb-2 flex-shrink-0">
          <div className="os-titlebar">
            <div className="os-btn-yellow" />
            <span className="os-titlebar-title">UP NEXT</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2" style={{ background: "#fff" }}>
            <div className="text-2xl">{nextLimited.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: "#1a3d52" }}>{nextLimited.name}</p>
              <p className="text-xs" style={{ color: "#8aaab8" }}>Starts {nextLimited.startDate}</p>
            </div>
            <ChevronRight size={14} style={{ color: "#8aaab8" }} />
          </div>
        </div>
      )}

      {/* ── Results bottom sheet ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showResults && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.7)" }}
              onClick={close}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 380 }}
              className="fixed bottom-0 left-0 right-0 z-50 os-window"
              style={{ borderRadius: "8px 8px 0 0", background: "#1a3d52" }}
            >
              {/* Titlebar */}
              <div className="os-titlebar" style={{ background: "linear-gradient(180deg, #2a5a70 0%, #1a3d52 100%)", borderColor: "#3d7a98" }}>
                <div className="os-btn-red" onClick={close} style={{ cursor: "pointer" }} />
                <div className="os-btn-yellow" /><div className="os-btn-green" />
                <span className="os-titlebar-title" style={{ color: "#cde5f0" }}>
                  {pulledCards.length === 1 ? "✨ SINGLE PULL RESULT" : "✨ 10 PULL RESULTS"}
                </span>
                <div className="flex gap-2 ml-2">
                  <button onClick={revealAll} className="retro-btn text-xs py-0 px-2" style={{ background: "rgba(255,255,255,0.15)", color: "#cde5f0", borderColor: "rgba(255,255,255,0.3)", boxShadow: "none", fontSize: "0.7rem" }}>
                    REVEAL ALL
                  </button>
                  <button onClick={close} className="retro-btn py-0 px-1.5" style={{ background: "rgba(255,255,255,0.15)", color: "#cde5f0", borderColor: "rgba(255,255,255,0.3)", boxShadow: "none" }}>
                    <X size={12} />
                  </button>
                </div>
              </div>

              <div style={{ background: "#1a3d52", padding: "12px" }}>
                {pulledCards.length === 1 ? (
                  <div className="w-44 mx-auto py-2">
                    <CardReveal char={pulledCards[0]} index={0} revealed={revealed[0]} onClick={() => revealOne(0)} size="lg" />
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-1.5">
                    {pulledCards.map((char, i) => (
                      <CardReveal key={i} char={char} index={i} revealed={revealed[i]} onClick={() => revealOne(i)} />
                    ))}
                  </div>
                )}
              </div>

              <div className="px-4 pt-3 pb-8" style={{ borderTop: "2px solid rgba(255,255,255,0.1)", background: "#1a3d52" }}>
                <div className="flex justify-around text-center mb-3">
                  {(["UR", "SSR", "SR", "R"] as Rarity[]).map(r => {
                    const count = pulledCards.filter(c => c.rarity === r).length;
                    return (
                      <div key={r} style={{ opacity: count > 0 ? 1 : 0.25 }}>
                        <div className="vt" style={{ fontSize: "1.4rem", color: r === "UR" ? "#f87171" : r === "SSR" ? "#fbbf24" : r === "SR" ? "#c084fc" : "#94a3b8" }}>
                          {count}
                        </div>
                        <div className="vt" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{r}</div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => { close(); doPull(pulledCards.length === 1 ? 1 : 10); }}
                  disabled={coins < (pulledCards.length === 1 ? PULL_COST.single : PULL_COST.ten)}
                  className="retro-btn retro-btn-primary w-full py-2.5 disabled:opacity-50"
                >
                  <span className="vt" style={{ fontSize: "1.1rem" }}>PULL AGAIN</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
