import { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { CHARACTERS, type OwnedCard, type Rarity, type Element } from "../data/characters";
import { CardImage } from "./CardImage";

const RARITY_ORDER: Rarity[] = ["UR", "SSR", "SR", "R"];

const ELEMENT_COLORS: Record<Element, string> = {
  Logic: "bg-blue-100 text-blue-600",
  Emotion: "bg-pink-100 text-pink-600",
  Strength: "bg-orange-100 text-orange-600",
};

const MAX_LIMIT_BREAK = 5;

interface Props {
  ownedCards: OwnedCard[];
  onNavigate: (tab: string) => void;
  onAwaken: (characterId: number) => void;
}

function CardDetail({
  characterId,
  owned,
  onClose,
  onAwaken,
}: {
  characterId: number;
  owned: OwnedCard | undefined;
  onClose: () => void;
  onAwaken: (characterId: number) => void;
}) {
  const char = CHARACTERS.find(c => c.id === characterId);
  if (!char) return null;

  const isAwakened = owned?.awakened === true;
  const canAwaken = owned && owned.limitBreak >= MAX_LIMIT_BREAK && !isAwakened;

  const awakenedChar = isAwakened && char.awakenedImageUrl
    ? { ...char, imageUrl: char.awakenedImageUrl }
    : char;

  const displaySkill = isAwakened && char.awakenedSkill ? char.awakenedSkill : char.skill;
  const displaySkillDesc = isAwakened && char.awakenedSkillDescription ? char.awakenedSkillDescription : char.skillDescription;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div
        className="os-window w-full max-w-md"
        style={{ borderRadius: "8px 8px 0 0" }}
        onClick={e => e.stopPropagation()}
      >
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
            <div className="w-28 flex-shrink-0">
              <CardImage character={awakenedChar} size="md" showName={false} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="vt" style={{ fontSize: "1.2rem", color: "#1a3d52" }}>{char.characterName}</h2>
              {char.variant && <p className="text-sm font-semibold" style={{ color: "#5b9aba" }}>{char.variant}</p>}
              <p className="text-xs italic mt-0.5" style={{ color: "#5a7d8a" }}>{char.ability}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded font-semibold ${ELEMENT_COLORS[char.element]}`}>{char.element}</span>
                <span className="text-xs px-2 py-1 rounded font-semibold" style={{ background: "#ddeef6", color: "#1a3d52" }}>{char.faction}</span>
                {owned && <span className="text-xs px-2 py-1 rounded font-semibold" style={{ background: "#d1f0e0", color: "#1a6640" }}>Lv. {owned.level}</span>}
                {char.au && <span className="text-xs px-2 py-1 rounded font-semibold" style={{ background: "#e8d5f5", color: "#6b21a8" }}>{char.au}</span>}
              </div>
            </div>
          </div>

          <div className="pixel-divider" />

          <div className="rounded p-3 mt-1" style={{ background: char.au ? "#f3eeff" : "#e8f4fb", border: "2px solid #b0d0e2" }}>
            {char.au && <p className="text-xs font-bold mb-1" style={{ color: "#6b21a8" }}>📖 {char.au} Story</p>}
            <p className="text-sm leading-relaxed" style={{ color: "#2a5a70" }}>{char.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {[["HP", char.hp], ["ATK", char.atk], ["DEF", char.def]].map(([label, val]) => (
              <div key={String(label)} className="rounded p-2 text-center border-2" style={{ background: isAwakened ? "#fffbeb" : "#fff", borderColor: isAwakened ? "#e0b050" : "#7ab2c8" }}>
                <div className="mono-label" style={{ fontSize: "0.7rem" }}>{label}</div>
                <div className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>{(val as number).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded p-3 border-2" style={{ background: isAwakened ? "#fffbeb" : "#fff", borderColor: isAwakened ? "#e0b050" : "#7ab2c8" }}>
            <p className="text-sm font-bold mb-1" style={{ color: isAwakened ? "#92400e" : "#1a3d52" }}>
              {isAwakened ? "✦ " : "⚡ "}{displaySkill}
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
                {isAwakened && <span className="vt text-xs" style={{ color: "#d97706" }}>✦ AWAKENED</span>}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: MAX_LIMIT_BREAK }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-2 rounded-sm transition-all"
                    style={{ background: isAwakened ? "#fbbf24" : i < owned.limitBreak ? "#5b9aba" : "#b0d0e2" }}
                  />
                ))}
              </div>
              <p className="text-xs mt-1" style={{ color: "#5a7d8a" }}>
                {isAwakened
                  ? "Card has been awakened into its final form."
                  : `${owned.limitBreak} / ${MAX_LIMIT_BREAK} duplicates — ${MAX_LIMIT_BREAK - owned.limitBreak > 0 ? `${MAX_LIMIT_BREAK - owned.limitBreak} more to awaken` : "ready to awaken!"}`}
              </p>
            </div>
          )}

          {canAwaken && (
            <button
              onClick={() => { onAwaken(characterId); onClose(); }}
              className="retro-btn w-full mt-3 py-2.5 flex items-center justify-center gap-2 text-sm"
              style={{ background: "#ffd166", borderColor: "#e0b050", color: "#1a3d52", boxShadow: "2px 2px 0 #e0b050" }}
            >
              <Sparkles size={14} /> AWAKEN CARD <Sparkles size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CardCollection({ ownedCards, onNavigate, onAwaken }: Props) {
  const [search, setSearch] = useState("");
  const [filterRarity, setFilterRarity] = useState<Rarity | "ALL">("ALL");
  const [filterElement, setFilterElement] = useState<Element | "ALL">("ALL");
  const [filterAU, setFilterAU] = useState<"ALL" | "CANON" | "AU">("ALL");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

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
      if (ri !== 0) return ri;
      return a.characterName.localeCompare(b.characterName);
    });
    return chars;
  }, [search, filterRarity, filterElement, filterAU, ownedMap]);

  const auCount = useMemo(
    () => new Set(CHARACTERS.filter(c => c.au && ownedMap.has(c.id)).map(c => c.id)).size,
    [ownedMap]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="os-window mx-3 mt-3 mb-2 flex-shrink-0">
        <div className="os-titlebar">
          <div className="os-btn-red" /><div className="os-btn-yellow" /><div className="os-btn-green" />
          <span className="os-titlebar-title">COLLECTION.EXE</span>
        </div>
        <div style={{ background: "#ddeef6", padding: "8px 10px" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>MY COLLECTION</span>
            <span className="mono-label" style={{ fontSize: "0.72rem" }}>{ownedMap.size} CARDS</span>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 border-2 rounded px-3 py-1.5 mb-2" style={{ background: "#fff", borderColor: "#7ab2c8" }}>
            <Search size={14} style={{ color: "#5b9aba", flexShrink: 0 }} />
            <input
              className="flex-1 bg-transparent outline-none text-sm min-w-0"
              style={{ color: "#1a3d52", fontFamily: "inherit" }}
              placeholder="Search name, variant, ability…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Filter chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {(["ALL", "CANON", "AU"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterAU(f)}
                className="retro-btn flex-shrink-0 text-xs py-0.5 px-2"
                style={filterAU === f ? { background: "#5b9aba", color: "#fff", borderColor: "#3d7a98" } : {}}
              >
                {f === "ALL" ? "ALL" : f === "CANON" ? "CANON" : `AU (${auCount})`}
              </button>
            ))}
            {RARITY_ORDER.map(r => (
              <button
                key={r}
                onClick={() => setFilterRarity(filterRarity === r ? "ALL" : r)}
                className="retro-btn flex-shrink-0 text-xs py-0.5 px-2"
                style={filterRarity === r ? { background: "#5b9aba", color: "#fff", borderColor: "#3d7a98" } : {
                  color: r === "UR" ? "#dc2626" : r === "SSR" ? "#d97706" : r === "SR" ? "#7c3aed" : "#64748b"
                }}
              >
                {r}
              </button>
            ))}
            {(["Logic", "Emotion", "Strength"] as Element[]).map(el => (
              <button
                key={el}
                onClick={() => setFilterElement(filterElement === el ? "ALL" : el)}
                className="retro-btn flex-shrink-0 text-xs py-0.5 px-2"
                style={filterElement === el ? { background: "#5b9aba", color: "#fff", borderColor: "#3d7a98" } : {}}
              >
                {el === "Logic" ? "🧠" : el === "Emotion" ? "💕" : "💪"} {el}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="grid grid-cols-4 gap-2">
          {filteredChars.map(char => {
            const owned = ownedMap.get(char.id)!;
            const isAwakened = owned.awakened === true;
            const canAwaken = owned.limitBreak >= MAX_LIMIT_BREAK && !isAwakened;
            const displayChar = isAwakened && char.awakenedImageUrl
              ? { ...char, imageUrl: char.awakenedImageUrl }
              : char;
            return (
              <button
                key={char.id}
                onClick={() => setSelectedCard(char.id)}
                className="relative active:scale-95 transition-transform"
              >
                <div className="os-window" style={isAwakened ? { boxShadow: "0 0 0 2px #fbbf24, 2px 2px 0 #e0b050" } : {}}>
                  <CardImage character={displayChar} size="sm" showName />
                </div>
                {isAwakened && (
                  <div className="absolute top-1 left-1 rounded-full w-5 h-5 flex items-center justify-center" style={{ background: "#fbbf24", fontSize: "0.5rem", color: "#1a3d52", fontWeight: 900 }}>✦</div>
                )}
                {canAwaken && (
                  <div className="absolute top-1 left-1 rounded px-1.5 py-0.5 flex items-center gap-0.5 vt" style={{ background: "#ffd166", color: "#1a3d52", fontSize: "0.45rem", border: "1px solid #e0b050" }}>
                    <Sparkles size={6} />AWAKEN
                  </div>
                )}
                {!isAwakened && !canAwaken && owned.limitBreak > 0 && (
                  <div className="absolute top-1 left-1 rounded-full w-4 h-4 flex items-center justify-center vt" style={{ background: "#5b9aba", color: "#fff", fontSize: "0.5rem" }}>+{owned.limitBreak}</div>
                )}
              </button>
            );
          })}
        </div>
        {filteredChars.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">✨</div>
            <p className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>NO CARDS YET</p>
            <p className="text-sm mt-1" style={{ color: "#5a7d8a" }}>Pull from the Gacha to build your collection!</p>
          </div>
        )}
      </div>

      {selectedCard !== null && (
        <CardDetail
          characterId={selectedCard}
          owned={ownedMap.get(selectedCard)}
          onClose={() => setSelectedCard(null)}
          onAwaken={onAwaken}
        />
      )}
    </div>
  );
}
