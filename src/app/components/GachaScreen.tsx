import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Sparkles, Coins, Clock, ChevronRight } from "lucide-react";
import { CHARACTERS, BANNERS, type Character, type Rarity, type OwnedCard } from "../data/characters";
import { CardImage } from "./CardImage";

const RARITY_STYLES: Record<Rarity, { border: string; stars: number }> = {
  R:   { border: "border-slate-300",  stars: 1 },
  SR:  { border: "border-purple-400", stars: 3 },
  SSR: { border: "border-amber-400",  stars: 4 },
  UR:  { border: "border-rose-400",   stars: 5 },
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
  char: Character; index: number; revealed: boolean; onClick: () => void; size?: "sm" | "md" | "lg";
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
                  : "linear-gradient(to top, rgba(251,191,36,0.2) 0%, transparent 60%)",
              }} />
            )}
          </div>
        </div>
        {/* Back — ocean blue */}
        <div
          className="absolute inset-0 rounded border-2 flex items-center justify-center cursor-pointer"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#1a3d52", borderColor: "#3d7a98" }}
        >
          <div className="text-center flex flex-col items-center gap-1">
            <span style={{ fontSize: size === "lg" ? "1.8rem" : "1.1rem" }}>◆</span>
            <p className="vt" style={{ color: "rgba(255,255,255,0.7)", fontSize: size === "lg" ? "0.75rem" : "0.55rem" }}>TAP TO REVEAL</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface Props {
  coins: number; ownedCards: OwnedCard[];
  onSpend: (amount: number) => void; onGain: (cards: OwnedCard[]) => void;
  pityCount: number; setPityCount: (n: number) => void;
  equippedFrame: string;
}

export function GachaScreen({ coins, ownedCards, onSpend, onGain, pityCount, setPityCount, equippedFrame }: Props) {
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
      characterId: c.id, id: `${c.id}-${Date.now()}-${Math.random()}`,
      level: 1, limitBreak: 0, awakened: false, obtainedAt: new Date(),
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
    <div className="h-full flex flex-col" style={{ paddingBottom: 2 }}>

      {/* ── Page header — deep ocean gradient ────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1a3d52 0%, #2a5a70 60%, #1a4a60 100%)",
        borderBottom: "3px solid #5b9aba",
        padding: "10px 14px",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem", color: "#cde5f0", letterSpacing: "0.08em", lineHeight: 1 }}>
              TREASURE PULL ✦
            </p>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#7ab2c8", letterSpacing: "0.06em", marginTop: 2 }}>
              dive deep · discover rare cards
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#fbbf24" }}>
              🪙 {coins.toLocaleString()}
            </div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.65rem", color: "#7ab2c8", letterSpacing: "0.06em" }}>
              PITY {pityCount}/100
            </div>
          </div>
        </div>
      </div>

      {/* ── Banner tabs — pill style ──────────────────────────── */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "8px 12px", flexShrink: 0 }} className="no-scrollbar">
        {visibleBanners.map((b, i) => (
          <button key={b.id} onClick={() => setSelectedBannerIdx(i)}
            style={{
              flexShrink: 0,
              fontFamily: "'VT323', monospace", fontSize: "0.8rem", letterSpacing: "0.05em",
              padding: "4px 14px", borderRadius: 20, cursor: "pointer",
              background: selectedBannerIdx === i ? "#5b9aba" : "#ddeef6",
              color: selectedBannerIdx === i ? "#fff" : "#1a3d52",
              border: `2px solid ${selectedBannerIdx === i ? "#3d7a98" : "#9dc4d8"}`,
              boxShadow: selectedBannerIdx === i ? "2px 2px 0 #3d7a98" : "2px 2px 0 #9dc4d8",
              transition: "all 0.08s",
            }}>
            {b.emoji} {b.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* ── Banner hero — colorful card panel ────────────────── */}
      <div style={{ margin: "0 12px 8px", flexShrink: 0 }}>
        <div style={{
          background: "#f8fefe",
          border: `3px solid #5b9aba`,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "3px 3px 0 #3d7a98",
        }}>
          {/* colored title bar */}
          <div style={{
            background: banner.limited
              ? "linear-gradient(90deg, #7c3aed, #a855f7)"
              : "linear-gradient(90deg, #5b9aba, #4a88a8)",
            padding: "5px 12px",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {banner.limited && (
              <span style={{
                fontFamily: "'VT323', monospace", fontSize: "0.7rem", letterSpacing: "0.05em",
                background: "#fbbf24", color: "#1a3d52", padding: "1px 6px",
                borderRadius: 3, border: "1.5px solid #e0b050",
              }}>⭐ LIMITED</span>
            )}
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "white", letterSpacing: "0.08em", flex: 1 }}>
              {banner.name.toUpperCase()}
            </span>
            {banner.endDate && (
              <div style={{ display: "flex", alignItems: "center", gap: 3, color: "rgba(255,255,255,0.7)", fontSize: "0.65rem", fontFamily: "'VT323', monospace" }}>
                <Clock size={10} /> {banner.endDate}
              </div>
            )}
          </div>
          <div style={{ padding: "10px 12px" }}>
            <p style={{ fontSize: "0.75rem", color: "#5a7d8a", marginBottom: 4 }}>{banner.description}</p>
            <div style={{ display: "flex", gap: 6, overflowX: "auto" }} className="no-scrollbar">
              {banner.featured.map(id => {
                const char = CHARACTERS.find(c => c.id === id);
                if (!char) return null;
                return (
                  <div key={id} style={{ flexShrink: 0, width: 52, borderRadius: 4, overflow: "hidden", border: "2px solid #7ab2c8" }}>
                    <CardImage character={char} size="xs" showName />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Rates — horizontal floating tags (no window wrapper) ── */}
      <div style={{ margin: "0 12px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(Object.entries(banner.rates) as [Rarity, number][]).map(([r, rate]) => (
            <div key={r} style={{
              fontFamily: "'VT323', monospace", textAlign: "center",
              background: r === "UR" ? "#fee2e2" : r === "SSR" ? "#fef3c7" : r === "SR" ? "#ede9fe" : "#f1f5f9",
              border: `2px solid ${r === "UR" ? "#f87171" : r === "SSR" ? "#fbbf24" : r === "SR" ? "#a78bfa" : "#cbd5e1"}`,
              borderRadius: 6, padding: "3px 8px",
              boxShadow: `2px 2px 0 ${r === "UR" ? "#f87171" : r === "SSR" ? "#fbbf24" : r === "SR" ? "#a78bfa" : "#cbd5e1"}`,
            }}>
              <div style={{ fontSize: "0.9rem", color: r === "UR" ? "#dc2626" : r === "SSR" ? "#d97706" : r === "SR" ? "#7c3aed" : "#64748b" }}>{r}</div>
              <div style={{ fontSize: "0.65rem", color: "#5a7d8a" }}>{rate}%</div>
            </div>
          ))}
        </div>
        <div style={{
          background: "#1a3d52", borderRadius: 6, padding: "4px 10px",
          border: "2px solid #3d7a98", boxShadow: "2px 2px 0 #3d7a98",
          fontFamily: "'VT323', monospace", textAlign: "center",
        }}>
          <div style={{ fontSize: "0.65rem", color: "#7ab2c8", letterSpacing: "0.06em" }}>PITY</div>
          <div style={{ fontSize: "1.2rem", color: "#cde5f0" }}>{pityCount}/100</div>
        </div>
      </div>

      {/* ── Pull buttons — big chunky ─────────────────────────── */}
      <div style={{ padding: "0 12px 6px", display: "flex", gap: 8, flexShrink: 0 }}>
        <button disabled={coins < PULL_COST.single} onClick={() => doPull(1)}
          style={{
            flex: 1, padding: "12px 8px",
            fontFamily: "'VT323', monospace", cursor: "pointer",
            background: "#ddeef6", border: "3px solid #5b9aba", borderRadius: 6,
            boxShadow: "3px 3px 0 #3d7a98", transition: "all 0.08s",
            opacity: coins < PULL_COST.single ? 0.5 : 1,
          }}
          onMouseEnter={e => { if (coins >= PULL_COST.single) { e.currentTarget.style.boxShadow = "1px 1px 0 #3d7a98"; e.currentTarget.style.transform = "translate(2px,2px)"; }}}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "3px 3px 0 #3d7a98"; e.currentTarget.style.transform = "none"; }}
        >
          <div style={{ fontSize: "1.05rem", color: "#1a3d52" }}>SINGLE PULL</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, color: "#d97706", fontSize: "0.85rem", marginTop: 2 }}>
            <Coins size={11} /> {PULL_COST.single.toLocaleString()}
          </div>
        </button>
        <button disabled={coins < PULL_COST.ten} onClick={() => doPull(10)}
          style={{
            flex: 1, padding: "12px 8px",
            fontFamily: "'VT323', monospace", cursor: "pointer",
            background: "#1a3d52", border: "3px solid #5b9aba", borderRadius: 6,
            boxShadow: "3px 3px 0 #3d7a98", transition: "all 0.08s",
            opacity: coins < PULL_COST.ten ? 0.5 : 1,
          }}
          onMouseEnter={e => { if (coins >= PULL_COST.ten) { e.currentTarget.style.boxShadow = "1px 1px 0 #3d7a98"; e.currentTarget.style.transform = "translate(2px,2px)"; }}}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "3px 3px 0 #3d7a98"; e.currentTarget.style.transform = "none"; }}
        >
          <div style={{ fontSize: "1.05rem", color: "#cde5f0" }}>✨ 10 PULL</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, color: "#ffd166", fontSize: "0.85rem", marginTop: 2 }}>
            <Coins size={11} /> {PULL_COST.ten.toLocaleString()}
          </div>
        </button>
      </div>

      {/* ── Upcoming banner — ticket stub style ──────────────── */}
      {nextLimited && (
        <div style={{ margin: "0 12px 6px", flexShrink: 0 }}>
          <div style={{
            background: "#fffbeb", border: "2px solid #fbbf24",
            borderRadius: 6, overflow: "hidden", boxShadow: "2px 2px 0 #e0b050",
          }}>
            <div style={{ background: "#fbbf24", padding: "3px 10px" }}>
              <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#78350f", letterSpacing: "0.1em" }}>
                ⏳ UP NEXT
              </span>
            </div>
            <div style={{ padding: "6px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: "1.5rem" }}>{nextLimited.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#1a3d52" }}>{nextLimited.name}</p>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.65rem", color: "#8aaab8", letterSpacing: "0.04em" }}>Starts {nextLimited.startDate}</p>
              </div>
              <ChevronRight size={14} style={{ color: "#8aaab8" }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Results bottom sheet ──────────────────────────────── */}
      <AnimatePresence>
        {showResults && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.75)" }}
              onClick={close}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 380 }}
              className="fixed bottom-0 left-0 right-0 z-50 os-window"
              style={{ borderRadius: "8px 8px 0 0", background: "#1a3d52" }}
            >
              <div className="os-titlebar" style={{ background: "linear-gradient(180deg, #2a5a70 0%, #1a3d52 100%)", borderColor: "#3d7a98" }}>
                <div className="os-btn-red" onClick={close} style={{ cursor: "pointer" }} />
                <div className="os-btn-yellow" /><div className="os-btn-green" />
                <span className="os-titlebar-title" style={{ color: "#cde5f0" }}>
                  {pulledCards.length === 1 ? "SINGLE PULL RESULT" : "10 PULL RESULTS"}
                </span>
                <div className="flex gap-2 ml-2">
                  <button onClick={revealAll} className="retro-btn text-xs py-0 px-2"
                    style={{ background: "rgba(255,255,255,0.15)", color: "#cde5f0", borderColor: "rgba(255,255,255,0.3)", boxShadow: "none", fontSize: "0.7rem" }}>
                    REVEAL ALL
                  </button>
                  <button onClick={close} className="retro-btn py-0 px-1.5"
                    style={{ background: "rgba(255,255,255,0.15)", color: "#cde5f0", borderColor: "rgba(255,255,255,0.3)", boxShadow: "none" }}>
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
                        <div className="vt" style={{ fontSize: "1.4rem", color: r === "UR" ? "#f87171" : r === "SSR" ? "#fbbf24" : r === "SR" ? "#c084fc" : "#94a3b8" }}>{count}</div>
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
