import { useState, useMemo } from "react";
import { Search, Sparkles, Check } from "lucide-react";
import { CHARACTERS, type OwnedCard, type Rarity, type Element } from "../data/characters";
import { CardImage } from "./CardImage";
import { FRAMES, FRAMES_MAP } from "../data/frames";

const RARITY_ORDER: Rarity[] = ["UR", "SSR", "SR", "R"];
const MAX_LIMIT_BREAK = 5;

interface Props {
  ownedCards: OwnedCard[];
  onNavigate: (tab: string) => void;
  onAwaken: (characterId: number) => void;
  equippedFrame: string;
  ownedFrames: string[];
  coins: number;
  onBuyFrame: (frameId: string, price: number) => boolean;
  onEquipFrame: (frameId: string) => void;
}

function CardDetail({ characterId, owned, onClose, onAwaken, equippedFrame }: {
  characterId: number; owned: OwnedCard | undefined; onClose: () => void;
  onAwaken: (id: number) => void; equippedFrame: string;
}) {
  const char = CHARACTERS.find(c => c.id === characterId);
  if (!char) return null;

  const isAwakened = owned?.awakened === true;
  const canAwaken = owned && owned.limitBreak >= MAX_LIMIT_BREAK && !isAwakened;
  const awakenedChar = isAwakened && char.awakenedImageUrl ? { ...char, imageUrl: char.awakenedImageUrl } : char;
  const displaySkill = isAwakened && char.awakenedSkill ? char.awakenedSkill : char.skill;
  const displaySkillDesc = isAwakened && char.awakenedSkillDescription ? char.awakenedSkillDescription : char.skillDescription;

  const ELEMENT_STYLE: Record<string, { bg: string; color: string }> = {
    Logic:    { bg: "#dbeafe", color: "#1d4ed8" },
    Emotion:  { bg: "#fce7f3", color: "#be185d" },
    Strength: { bg: "#ffedd5", color: "#c2410c" },
  };
  const es = ELEMENT_STYLE[char.element] ?? { bg: "#ddeef6", color: "#1a3d52" };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div className="os-window w-full max-w-md" style={{ borderRadius: "8px 8px 0 0" }} onClick={e => e.stopPropagation()}>
        <div className="os-titlebar">
          <div className="os-btn-red" onClick={onClose} style={{ cursor: "pointer" }} />
          <div className="os-btn-yellow" /><div className="os-btn-green" />
          <span className="os-titlebar-title">{char.characterName.toUpperCase()}.EXE</span>
        </div>
        <div className="p-5 pb-10 overflow-y-auto" style={{ maxHeight: "80vh", background: "#f0f8fc" }}>
          {isAwakened && (
            <div className="flex items-center justify-center gap-1.5 mb-3 px-3 py-1.5 rounded vt text-sm" style={{ background: "#ffd166", color: "#1a3d52", border: "2px solid #e0b050" }}>
              <Sparkles size={12} /> AWAKENED <Sparkles size={12} />
            </div>
          )}
          <div className="flex gap-4">
            <div className="flex-shrink-0" style={{ width: 96 }}>
              <CardImage character={awakenedChar} size="md" showName={false} frameId={equippedFrame} isAwakened={isAwakened} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="vt" style={{ fontSize: "1.2rem", color: "#1a3d52" }}>{char.characterName}</h2>
              {char.variant && <p className="text-sm font-semibold" style={{ color: "#5b9aba" }}>{char.variant}</p>}
              <p className="text-xs italic mt-0.5" style={{ color: "#5a7d8a" }}>{char.ability}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-xs px-2 py-1 rounded font-semibold" style={{ background: es.bg, color: es.color }}>{char.element}</span>
                <span className="text-xs px-2 py-1 rounded font-semibold" style={{ background: "#ddeef6", color: "#1a3d52" }}>{char.faction}</span>
                {owned && <span className="text-xs px-2 py-1 rounded font-semibold" style={{ background: "#d1f0e0", color: "#1a6640" }}>Lv. {owned.level}</span>}
                {char.au && <span className="text-xs px-2 py-1 rounded font-semibold" style={{ background: "#e8d5f5", color: "#6b21a8" }}>{char.au}</span>}
              </div>
            </div>
          </div>
          <div className="pixel-divider" />
          <div className="rounded p-3 mt-1" style={{ background: char.au ? "#f3eeff" : "#e8f4fb", border: "2px solid #b0d0e2" }}>
            {char.au && <p className="text-xs font-bold mb-1" style={{ color: "#6b21a8" }}>AU Story — {char.au}</p>}
            <p className="text-sm leading-relaxed" style={{ color: "#2a5a70" }}>{char.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[["HP", char.hp], ["ATK", char.atk], ["DEF", char.def]].map(([label, val]) => (
              <div key={String(label)} className="rounded p-2 text-center border-2"
                style={{ background: isAwakened ? "#fffbeb" : "#fff", borderColor: isAwakened ? "#e0b050" : "#7ab2c8" }}>
                <div className="mono-label" style={{ fontSize: "0.7rem" }}>{label}</div>
                <div className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>{(val as number).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded p-3 border-2" style={{ background: isAwakened ? "#fffbeb" : "#fff", borderColor: isAwakened ? "#e0b050" : "#7ab2c8" }}>
            <p className="text-sm font-bold mb-1" style={{ color: isAwakened ? "#92400e" : "#1a3d52" }}>
              {isAwakened ? "✦ " : ""}{displaySkill}
            </p>
            <p className="text-sm" style={{ color: "#5a7d8a" }}>{displaySkillDesc}</p>
          </div>
          {!owned && (
            <div className="mt-3 text-center py-3 rounded border-2" style={{ background: "#ddeef6", borderColor: "#7ab2c8" }}>
              <p className="text-sm" style={{ color: "#5a7d8a" }}>Not in collection yet</p>
              {char.banner && <p className="text-xs mt-1" style={{ color: "#8aaab8" }}>Available in: {char.au ?? "Limited Banner"}</p>}
            </div>
          )}
          {owned && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="mono-label" style={{ fontSize: "0.7rem" }}>Awakening Progress</span>
                {isAwakened && <span className="vt text-xs" style={{ color: "#d97706" }}>AWAKENED</span>}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: MAX_LIMIT_BREAK }).map((_, i) => (
                  <div key={i} className="flex-1 h-2 rounded-sm transition-all"
                    style={{ background: isAwakened ? "#fbbf24" : i < owned.limitBreak ? "#5b9aba" : "#b0d0e2" }} />
                ))}
              </div>
              <p className="text-xs mt-1" style={{ color: "#5a7d8a" }}>
                {isAwakened ? "Card awakened to final form." : `${owned.limitBreak} / ${MAX_LIMIT_BREAK} — ${MAX_LIMIT_BREAK - owned.limitBreak > 0 ? `${MAX_LIMIT_BREAK - owned.limitBreak} more to awaken` : "ready to awaken!"}`}
              </p>
            </div>
          )}
          {canAwaken && (
            <button onClick={() => { onAwaken(characterId); onClose(); }}
              className="retro-btn w-full mt-3 py-2.5 flex items-center justify-center gap-2 text-sm"
              style={{ background: "#ffd166", borderColor: "#e0b050", color: "#1a3d52", boxShadow: "2px 2px 0 #e0b050" }}>
              <Sparkles size={14} /> AWAKEN CARD <Sparkles size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CardCollection({ ownedCards, onNavigate, onAwaken, equippedFrame, ownedFrames, coins, onBuyFrame, onEquipFrame }: Props) {
  const [search, setSearch] = useState("");
  const [filterRarity, setFilterRarity] = useState<Rarity | "ALL">("ALL");
  const [filterElement, setFilterElement] = useState<Element | "ALL">("ALL");
  const [filterAU, setFilterAU] = useState<"ALL" | "CANON" | "AU">("ALL");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"collection" | "frames">("collection");
  const [frameFeedback, setFrameFeedback] = useState<string | null>(null);

  const ownedMap = useMemo(() => {
    const map = new Map<number, OwnedCard>();
    ownedCards.forEach(oc => { if (!map.has(oc.characterId)) map.set(oc.characterId, oc); });
    return map;
  }, [ownedCards]);

  const filteredChars = useMemo(() => {
    let chars = CHARACTERS.filter(c => ownedMap.has(c.id));
    if (filterRarity !== "ALL") chars = chars.filter(c => c.rarity === filterRarity);
    if (filterElement !== "ALL") chars = chars.filter(c => c.element === filterElement);
    if (filterAU === "CANON") chars = chars.filter(c => !c.au);
    if (filterAU === "AU") chars = chars.filter(c => !!c.au);
    if (search) chars = chars.filter(c =>
      c.characterName.toLowerCase().includes(search.toLowerCase()) ||
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (c.variant ?? "").toLowerCase().includes(search.toLowerCase()) ||
      c.ability.toLowerCase().includes(search.toLowerCase())
    );
    chars.sort((a, b) => {
      const ri = RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
      return ri !== 0 ? ri : a.characterName.localeCompare(b.characterName);
    });
    return chars;
  }, [search, filterRarity, filterElement, filterAU, ownedMap]);

  const auCount = useMemo(
    () => new Set(CHARACTERS.filter(c => c.au && ownedMap.has(c.id)).map(c => c.id)).size,
    [ownedMap]
  );

  const handleBuyFrame = (frameId: string, price: number) => {
    if (coins < price) {
      setFrameFeedback(`Not enough coins. Need ${price.toLocaleString()}.`);
      setTimeout(() => setFrameFeedback(null), 2500);
      return;
    }
    onBuyFrame(frameId, price);
  };

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div style={{ background: "#d1fae5", borderBottom: "3px solid #34d399", padding: "8px 14px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: "1.4rem", color: "#064e3b", letterSpacing: "0.06em", lineHeight: 1 }}>
              MY COLLECTION
            </p>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", color: "#059669", letterSpacing: "0.08em" }}>
              {ownedMap.size} cards · frame: {FRAMES_MAP[equippedFrame]?.name ?? "Standard"}
            </p>
          </div>
          <div style={{
            background: "#059669", color: "white",
            fontFamily: "'VT323', monospace", fontSize: "1.1rem",
            border: "2px solid #047857", borderRadius: 6,
            padding: "2px 10px", boxShadow: "2px 2px 0 #047857",
          }}>
            {ownedMap.size}
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 0, borderBottom: "none" }}>
          {[
            { id: "collection", label: "COLLECTION" },
            { id: "frames",     label: "FRAMES SHOP" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as "collection" | "frames")}
              style={{
                fontFamily: "'VT323', monospace", fontSize: "0.8rem", letterSpacing: "0.06em",
                padding: "5px 14px", cursor: "pointer",
                background: activeTab === tab.id ? "white" : "transparent",
                color: activeTab === tab.id ? "#064e3b" : "#059669",
                border: "2px solid transparent",
                borderBottom: activeTab === tab.id ? "2px solid white" : "2px solid transparent",
                borderRadius: "4px 4px 0 0",
                marginBottom: -2,
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* COLLECTION TAB */}
      {activeTab === "collection" && (
        <>
          {/* Filters */}
          <div style={{ background: "#f0faf5", borderBottom: "2px solid #a7f3d0", padding: "8px 12px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "2px solid #34d399", borderRadius: 6, padding: "5px 10px", marginBottom: 7, boxShadow: "2px 2px 0 #34d399" }}>
              <Search size={13} style={{ color: "#059669", flexShrink: 0 }} />
              <input
                className="flex-1 bg-transparent outline-none text-sm min-w-0"
                style={{ color: "#064e3b", fontFamily: "inherit" }}
                placeholder="Search name, variant, ability…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 5, overflowX: "auto" }} className="no-scrollbar">
              {(["ALL", "CANON", "AU"] as const).map(f => (
                <button key={f} onClick={() => setFilterAU(f)}
                  style={{
                    flexShrink: 0, fontFamily: "'VT323', monospace", fontSize: "0.72rem", letterSpacing: "0.04em",
                    padding: "2px 10px", borderRadius: 20, cursor: "pointer",
                    background: filterAU === f ? "#059669" : "white",
                    color: filterAU === f ? "white" : "#064e3b",
                    border: `2px solid ${filterAU === f ? "#047857" : "#34d399"}`,
                  }}>
                  {f === "ALL" ? "All" : f === "CANON" ? "Canon" : `AU (${auCount})`}
                </button>
              ))}
              {RARITY_ORDER.map(r => (
                <button key={r} onClick={() => setFilterRarity(filterRarity === r ? "ALL" : r)}
                  style={{
                    flexShrink: 0, fontFamily: "'VT323', monospace", fontSize: "0.72rem", letterSpacing: "0.04em",
                    padding: "2px 10px", borderRadius: 20, cursor: "pointer",
                    background: filterRarity === r ? "#059669" : "white",
                    color: filterRarity === r ? "white" : r === "UR" ? "#dc2626" : r === "SSR" ? "#d97706" : r === "SR" ? "#7c3aed" : "#64748b",
                    border: `2px solid ${filterRarity === r ? "#047857" : "#34d399"}`,
                  }}>
                  {r}
                </button>
              ))}
              {(["Logic", "Emotion", "Strength"] as Element[]).map(el => (
                <button key={el} onClick={() => setFilterElement(filterElement === el ? "ALL" : el)}
                  style={{
                    flexShrink: 0, fontFamily: "'VT323', monospace", fontSize: "0.72rem", letterSpacing: "0.04em",
                    padding: "2px 10px", borderRadius: 20, cursor: "pointer",
                    background: filterElement === el ? "#059669" : "white",
                    color: filterElement === el ? "white" : "#064e3b",
                    border: `2px solid ${filterElement === el ? "#047857" : "#34d399"}`,
                  }}>
                  {el}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 pt-3">
            <div className="grid grid-cols-4 gap-2">
              {filteredChars.map(char => {
                const owned = ownedMap.get(char.id)!;
                const isAwakened = owned.awakened === true;
                const canAwaken = owned.limitBreak >= MAX_LIMIT_BREAK && !isAwakened;
                const displayChar = isAwakened && char.awakenedImageUrl ? { ...char, imageUrl: char.awakenedImageUrl } : char;
                return (
                  <button key={char.id} onClick={() => setSelectedCard(char.id)}
                    className="relative active:scale-95 transition-transform">
                    {/* Just the image — CardImage handles the border/frame */}
                    <CardImage
                      character={displayChar}
                      size="sm"
                      showName
                      frameId={equippedFrame}
                      isAwakened={isAwakened}
                    />
                    {isAwakened && (
                      <div className="absolute top-1 left-1 rounded-full w-4 h-4 flex items-center justify-center"
                        style={{ background: "#fbbf24", fontSize: "0.45rem", color: "#1a3d52", fontWeight: 900, zIndex: 20 }}>✦</div>
                    )}
                    {canAwaken && (
                      <div className="absolute top-1 left-1 rounded px-1 py-0.5 flex items-center gap-0.5 vt"
                        style={{ background: "#ffd166", color: "#1a3d52", fontSize: "0.42rem", border: "1px solid #e0b050", zIndex: 20 }}>
                        <Sparkles size={5} />AWK
                      </div>
                    )}
                    {!isAwakened && !canAwaken && owned.limitBreak > 0 && (
                      <div className="absolute top-1 right-1 rounded-full w-4 h-4 flex items-center justify-center vt"
                        style={{ background: "#5b9aba", color: "#fff", fontSize: "0.5rem", zIndex: 20 }}>+{owned.limitBreak}</div>
                    )}
                  </button>
                );
              })}
            </div>
            {filteredChars.length === 0 && (
              <div className="text-center py-12">
                <p className="vt" style={{ fontSize: "1.1rem", color: "#064e3b" }}>No cards yet</p>
                <p className="text-sm mt-1" style={{ color: "#5a7d8a" }}>Pull from Gacha to build your collection</p>
                <button onClick={() => onNavigate("gacha")}
                  style={{
                    marginTop: 10, fontFamily: "'VT323', monospace", fontSize: "0.9rem", letterSpacing: "0.06em",
                    background: "#d1fae5", border: "2px solid #34d399", borderRadius: 20,
                    padding: "4px 16px", cursor: "pointer", color: "#064e3b",
                    boxShadow: "2px 2px 0 #34d399",
                  }}>
                  Go to Gacha
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* FRAMES SHOP TAB */}
      {activeTab === "frames" && (
        <div className="flex-1 overflow-y-auto px-3 pb-4 pt-3">

          {frameFeedback && (
            <div style={{ background: "#fee2e2", border: "2px solid #f87171", borderRadius: 6, padding: "7px 12px", marginBottom: 10 }}>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#dc2626" }}>{frameFeedback}</p>
            </div>
          )}

          <div style={{ background: "#ddeef6", border: "2px solid #7ab2c8", borderRadius: 6, padding: "7px 10px", marginBottom: 12 }}>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#1a3d52" }}>
              Equipped: <strong>{FRAMES_MAP[equippedFrame]?.name ?? "Standard"}</strong>
            </p>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.65rem", color: "#5a7d8a", letterSpacing: "0.04em" }}>
              Your balance: {coins.toLocaleString()} coins
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FRAMES.map(frame => {
              const isOwned = ownedFrames.includes(frame.id);
              const isEquipped = equippedFrame === frame.id;
              const canAfford = coins >= frame.price;

              // Preview card — first owned card, or first character
              const previewChar = CHARACTERS.find(c => ownedMap.has(c.id)) ?? CHARACTERS[0];

              return (
                <div key={frame.id} style={{
                  background: isEquipped ? "#f0f8fc" : "white",
                  border: `2px solid ${isEquipped ? "#5b9aba" : "#b0d0e2"}`,
                  borderRadius: 8,
                  boxShadow: isEquipped ? "3px 3px 0 #5b9aba" : "2px 2px 0 #b0d0e2",
                  overflow: "hidden",
                }}>
                  <div style={{ display: "flex", gap: 10, padding: "10px 12px", alignItems: "center" }}>
                    {/* Frame preview on a sample card */}
                    <div style={{ flexShrink: 0 }}>
                      <CardImage
                        character={previewChar}
                        size="xs"
                        showName={false}
                        frameId={frame.id}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#1a3d52" }}>{frame.name}</p>
                        {isEquipped && (
                          <span style={{
                            fontFamily: "'VT323', monospace", fontSize: "0.6rem", letterSpacing: "0.06em",
                            background: "#5b9aba", color: "white", padding: "1px 6px",
                            borderRadius: 3, border: "1.5px solid #3d7a98",
                          }}>EQUIPPED</span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "#5a7d8a", marginBottom: 6 }}>{frame.description}</p>
                      {/* Color swatch */}
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <div style={{
                          width: 14, height: 14, borderRadius: 3,
                          background: frame.borderColor,
                          border: "1.5px solid rgba(0,0,0,0.15)",
                        }} />
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", color: "#5a7d8a" }}>
                          {frame.price === 0 ? "Free" : `${frame.price.toLocaleString()} coins`}
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div style={{ flexShrink: 0 }}>
                      {isEquipped ? (
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: "#5b9aba", display: "flex", alignItems: "center", justifyContent: "center",
                          border: "2px solid #3d7a98",
                        }}>
                          <Check size={14} color="white" />
                        </div>
                      ) : isOwned ? (
                        <button onClick={() => onEquipFrame(frame.id)}
                          style={{
                            fontFamily: "'VT323', monospace", fontSize: "0.75rem", letterSpacing: "0.04em",
                            background: "#ddeef6", color: "#1a3d52",
                            border: "2px solid #5b9aba", borderRadius: 4,
                            padding: "5px 10px", cursor: "pointer",
                            boxShadow: "2px 2px 0 #3d7a98",
                          }}>
                          EQUIP
                        </button>
                      ) : (
                        <button onClick={() => handleBuyFrame(frame.id, frame.price)}
                          disabled={!canAfford}
                          style={{
                            fontFamily: "'VT323', monospace", fontSize: "0.75rem", letterSpacing: "0.04em",
                            background: canAfford ? "#1a3d52" : "#b0d0e2",
                            color: canAfford ? "white" : "#5a7d8a",
                            border: `2px solid ${canAfford ? "#3d7a98" : "#b0d0e2"}`,
                            borderRadius: 4, padding: "5px 10px",
                            cursor: canAfford ? "pointer" : "not-allowed",
                            boxShadow: canAfford ? "2px 2px 0 #3d7a98" : "none",
                            opacity: canAfford ? 1 : 0.6,
                          }}>
                          BUY
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedCard !== null && (
        <CardDetail
          characterId={selectedCard}
          owned={ownedMap.get(selectedCard)}
          onClose={() => setSelectedCard(null)}
          onAwaken={onAwaken}
          equippedFrame={equippedFrame}
        />
      )}
    </div>
  );
}
