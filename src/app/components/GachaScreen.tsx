import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Sparkles, Coins, Clock, ChevronRight, ChevronLeft } from "lucide-react";
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

function pullCard(banner: typeof BANNERS[0], pity: number): Character {
  const rarity = pity >= 100 ? "UR" : rollRarity(banner.rates);
  const pool = banner.pool
    ? CHARACTERS.filter(c => banner.pool!.includes(c.id) && c.rarity === rarity)
    : CHARACTERS.filter(c => !c.banner && c.rarity === rarity);
  if (pool.length === 0) {
    const fallback = CHARACTERS.filter(c => c.rarity === rarity);
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  const weighted: Character[] = [];
  pool.forEach(c => {
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
}

function CardReveal({ char, index, revealed, onClick }: CardRevealProps) {
  const style = RARITY_STYLES[char.rarity];
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
          className={`rounded-2xl border-2 ${style.border} overflow-hidden cursor-pointer ${char.rarity === "UR" ? "shadow-rose-400 shadow-xl" : char.rarity === "SSR" ? "shadow-amber-300 shadow-lg" : char.rarity === "SR" ? "shadow-purple-300 shadow-md" : ""}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative">
            <CardImage character={char} size="sm" showName={false} />
            {/* Stars — bottom-right */}
            <div className="absolute bottom-1 right-1 flex gap-px">
              {Array.from({ length: style.stars }).map((_, i) => (
                <Star key={i} size={8} className="fill-amber-400 text-amber-400 drop-shadow" />
              ))}
            </div>
          </div>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-primary bg-gradient-to-b from-primary to-indigo-800 flex items-center justify-center cursor-pointer"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center flex flex-col items-center gap-1">
            <Sparkles size={22} className="text-white/80" />
            <p className="text-white/70" style={{ fontSize: "0.52rem" }}>Tap to reveal</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface Props {
  coins: number;
  onSpend: (amount: number) => void;
  onGain: (cards: OwnedCard[]) => void;
  pityCount: number;
  setPityCount: (n: number) => void;
}

export function GachaScreen({ coins, onSpend, onGain, pityCount, setPityCount }: Props) {
  const [pulledCards, setPulledCards] = useState<Character[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  // ── Determine currently active limited banner by date ──────────────────────
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

    let newPity = pityCount;
    const cards: Character[] = [];

    for (let i = 0; i < count; i++) {
      const card = pullCard(banner, newPity);
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

  // Upcoming limited banner info
  const nextLimited = BANNERS.find(b => {
    if (!b.limited || !b.startDate) return false;
    return new Date(b.startDate) > today;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Banner tabs */}
      <div className="flex gap-2 overflow-x-auto p-4 pb-2 no-scrollbar">
        {visibleBanners.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setSelectedBannerIdx(i)}
            className={`flex-shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${selectedBannerIdx === i ? "bg-primary text-white shadow-md scale-105" : "bg-white text-muted-foreground border border-border"}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {b.emoji} {b.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Banner hero */}
      <div className={`mx-4 rounded-3xl bg-gradient-to-br ${banner.gradient} p-5 text-white relative overflow-hidden shadow-lg`}>
        <div className="absolute top-3 right-4 opacity-10 select-none">
          <Sparkles size={72} className="text-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            {banner.limited && <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">LIMITED</span>}
            <span className="text-white/70 text-xs">{banner.subtitle}</span>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.3rem" }}>{banner.name}</h2>
          <p className="text-white/80 text-sm mt-1">{banner.description}</p>
          {banner.endDate && (
            <div className="flex items-center gap-1 text-white/60 text-xs mt-2">
              <Clock size={11} />
              <span>Ends {banner.endDate}</span>
            </div>
          )}

          {/* Featured cards */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {banner.featured.map(id => {
              const char = CHARACTERS.find(c => c.id === id);
              if (!char) return null;
              return (
                <div key={id} className="flex-shrink-0 w-14 border-2 border-white/40 rounded-xl overflow-hidden">
                  <CardImage character={char} size="xs" showName />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rates + pity */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-3 border border-border flex items-center justify-between shadow-sm">
        <div className="flex gap-4">
          {(Object.entries(banner.rates) as [Rarity, number][]).map(([r, rate]) => (
            <div key={r} className="text-center">
              <div className={`text-xs font-bold ${r === "UR" ? "text-rose-500" : r === "SSR" ? "text-amber-500" : r === "SR" ? "text-purple-500" : "text-slate-400"}`}>{r}</div>
              <div className="text-xs text-muted-foreground">{rate}%</div>
            </div>
          ))}
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Pity</div>
          <div className="text-sm font-bold text-primary">{pityCount}/100</div>
        </div>
      </div>

      {/* Pull buttons */}
      <div className="px-4 mt-4 flex gap-3">
        <button
          disabled={coins < PULL_COST.single}
          onClick={() => doPull(1)}
          className="flex-1 bg-white border-2 border-primary text-primary rounded-2xl py-4 font-bold disabled:opacity-50 active:scale-95 transition-transform"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <div>Single Pull</div>
          <div className="flex items-center justify-center gap-1 text-sm text-amber-500 mt-0.5">
            <Coins size={13} /> {PULL_COST.single.toLocaleString()}
          </div>
        </button>
        <button
          disabled={coins < PULL_COST.ten}
          onClick={() => doPull(10)}
          className="flex-1 bg-primary text-white rounded-2xl py-4 font-bold disabled:opacity-50 active:scale-95 transition-transform shadow-md"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <div>10 Pull</div>
          <div className="flex items-center justify-center gap-1 text-sm text-amber-300 mt-0.5">
            <Coins size={13} /> {PULL_COST.ten.toLocaleString()}
          </div>
        </button>
      </div>
      <div className="mt-2 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
        <Coins size={12} className="text-amber-500" />
        <span className="font-bold text-amber-500">{coins.toLocaleString()}</span>
        <span>coins available</span>
      </div>

      {/* Upcoming banner teaser */}
      {nextLimited && (
        <div className="mx-4 mt-3 rounded-2xl border border-border bg-white p-3 flex items-center gap-3">
          <div className="text-2xl">{nextLimited.emoji}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-semibold">Up Next</p>
            <p className="text-sm font-bold text-foreground truncate">{nextLimited.name}</p>
            <p className="text-xs text-muted-foreground">Starts {nextLimited.startDate}</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
        </div>
      )}

      {/* ── Results bottom sheet ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showResults && (
          <>
            {/* Dark backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/65"
              onClick={close}
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 380 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 rounded-t-3xl overflow-hidden"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-white font-bold text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {pulledCards.length === 1 ? "✨ Single Pull!" : "✨ 10 Pull Results!"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={revealAll}
                    className="bg-white/15 text-white text-xs px-3 py-1.5 rounded-xl font-semibold"
                  >
                    Reveal All
                  </button>
                  <button onClick={close} className="bg-white/15 text-white rounded-xl p-1.5">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Cards grid */}
              <div className="px-3 py-2">
                {pulledCards.length === 1 ? (
                  <div className="max-w-[150px] mx-auto py-2">
                    <CardReveal char={pulledCards[0]} index={0} revealed={revealed[0]} onClick={() => revealOne(0)} />
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-1.5">
                    {pulledCards.map((char, i) => (
                      <CardReveal key={i} char={char} index={i} revealed={revealed[i]} onClick={() => revealOne(i)} />
                    ))}
                  </div>
                )}
              </div>

              {/* Rarity summary + pull again */}
              <div className="px-4 pt-3 pb-8 border-t border-white/10 mt-1">
                <div className="flex justify-around text-center mb-3">
                  {(["UR", "SSR", "SR", "R"] as Rarity[]).map(r => {
                    const count = pulledCards.filter(c => c.rarity === r).length;
                    return (
                      <div key={r} className={count > 0 ? "opacity-100" : "opacity-25"}>
                        <div className={`font-bold text-xl ${r === "UR" ? "text-rose-400" : r === "SSR" ? "text-amber-400" : r === "SR" ? "text-purple-400" : "text-slate-400"}`}>
                          {count}
                        </div>
                        <div className="text-white/50 text-xs">{r}</div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => { close(); doPull(pulledCards.length === 1 ? 1 : 10); }}
                  disabled={coins < (pulledCards.length === 1 ? PULL_COST.single : PULL_COST.ten)}
                  className="w-full bg-primary text-white rounded-2xl py-3 font-bold disabled:opacity-50 active:scale-98 transition-transform"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Pull Again
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
