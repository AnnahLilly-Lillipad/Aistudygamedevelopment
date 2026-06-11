import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { CHARACTERS, type OwnedCard, type Rarity, type Element } from "../data/characters";
import { CardImage } from "./CardImage";

const RARITY_ORDER: Rarity[] = ["UR", "SSR", "SR", "R"];

const ELEMENT_COLORS: Record<Element, string> = {
  Logic: "bg-blue-100 text-blue-600",
  Emotion: "bg-pink-100 text-pink-600",
  Strength: "bg-orange-100 text-orange-600",
};

interface Props {
  ownedCards: OwnedCard[];
  onNavigate: (tab: string) => void;
}

function CardDetail({ characterId, owned, onClose }: { characterId: number; owned: OwnedCard | undefined; onClose: () => void }) {
  const char = CHARACTERS.find(c => c.id === characterId);
  if (!char) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
        <div className="flex gap-4">
          <div className="w-28 flex-shrink-0">
            <CardImage character={char} size="md" showName={false} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "var(--foreground)" }}>{char.characterName}</h2>
            {char.variant && (
              <p className="text-primary text-sm font-semibold">{char.variant}</p>
            )}
            <p className="text-muted-foreground text-sm">{char.ability}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${ELEMENT_COLORS[char.element]}`}>{char.element}</span>
              <span className="text-xs px-2 py-1 rounded-full font-semibold bg-secondary text-secondary-foreground">{char.faction}</span>
              {owned && <span className="text-xs px-2 py-1 rounded-full font-semibold bg-green-100 text-green-600">Lv. {owned.level}</span>}
              {char.au && <span className="text-xs px-2 py-1 rounded-full font-semibold bg-violet-100 text-violet-600">{char.au}</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[["HP", char.hp], ["ATK", char.atk], ["DEF", char.def]].map(([label, val]) => (
            <div key={String(label)} className="bg-secondary rounded-xl p-3 text-center">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>{(val as number).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-secondary rounded-2xl p-4">
          <p className="text-sm font-bold text-foreground mb-1">⚡ {char.skill}</p>
          <p className="text-sm text-muted-foreground">{char.skillDescription}</p>
        </div>

        {!owned && (
          <div className="mt-4 text-center py-3 bg-muted rounded-2xl">
            <p className="text-muted-foreground text-sm">Not in collection yet</p>
            {char.banner && <p className="text-xs text-muted-foreground mt-1">Available in: {CHARACTERS.find(c => c.id === characterId)?.au ?? "Limited Banner"}</p>}
          </div>
        )}
        {owned && owned.limitBreak > 0 && (
          <div className="mt-3 text-center">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">✦ Limit Break +{owned.limitBreak}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function CardCollection({ ownedCards, onNavigate }: Props) {
  const [search, setSearch] = useState("");
  const [filterRarity, setFilterRarity] = useState<Rarity | "ALL">("ALL");
  const [filterElement, setFilterElement] = useState<Element | "ALL">("ALL");
  const [filterAU, setFilterAU] = useState<"ALL" | "CANON" | "AU">("ALL");
  const [showOwned, setShowOwned] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const ownedMap = useMemo(() => {
    const map = new Map<number, OwnedCard>();
    ownedCards.forEach(oc => { if (!map.has(oc.characterId)) map.set(oc.characterId, oc); });
    return map;
  }, [ownedCards]);

  const filteredChars = useMemo(() => {
    let chars = [...CHARACTERS];
    if (showOwned) chars = chars.filter(c => ownedMap.has(c.id));
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
  }, [search, filterRarity, filterElement, filterAU, showOwned, ownedMap]);

  const auCount = new Set(CHARACTERS.filter(c => c.au).map(c => c.id)).size;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-2 space-y-3">
        <div className="flex items-center justify-between">
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--foreground)" }}>
            Card Collection
          </h2>
          <span className="text-sm text-muted-foreground">{ownedMap.size} / {CHARACTERS.length}</span>
        </div>

        <div className="flex items-center gap-2 bg-white border border-border rounded-2xl px-4 py-2.5 shadow-sm">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            className="flex-1 bg-transparent outline-none text-sm min-w-0"
            placeholder='Search name, variant, ability…'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setShowOwned(!showOwned)} className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold ${showOwned ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground"}`}>Owned</button>
          {(["ALL", "CANON", "AU"] as const).map(f => (
            <button key={f} onClick={() => setFilterAU(f)} className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold ${filterAU === f ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground"}`}>
              {f === "ALL" ? "All" : f === "CANON" ? "Canon" : `AU (${auCount})`}
            </button>
          ))}
          {RARITY_ORDER.map(r => (
            <button key={r} onClick={() => setFilterRarity(filterRarity === r ? "ALL" : r)} className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold ${filterRarity === r ? "bg-primary text-white" : `bg-white border border-border ${r === "UR" ? "text-rose-500" : r === "SSR" ? "text-amber-500" : r === "SR" ? "text-purple-500" : "text-slate-400"}`}`}>{r}</button>
          ))}
          {(["Logic", "Emotion", "Strength"] as Element[]).map(el => (
            <button key={el} onClick={() => setFilterElement(filterElement === el ? "ALL" : el)} className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold ${filterElement === el ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground"}`}>
              {el === "Logic" ? "🧠" : el === "Emotion" ? "💕" : "💪"} {el}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-4 gap-2">
          {filteredChars.map(char => {
            const owned = ownedMap.get(char.id);
            return (
              <button
                key={char.id}
                onClick={() => setSelectedCard(char.id)}
                className={`relative active:scale-95 transition-transform ${!owned ? "opacity-40 grayscale" : ""}`}
              >
                <CardImage character={char} size="sm" showName />
                {owned && owned.limitBreak > 0 && (
                  <div className="absolute top-1 left-1 bg-amber-400 text-white font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: "0.5rem" }}>+{owned.limitBreak}</div>
                )}
              </button>
            );
          })}
        </div>
        {filteredChars.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-muted-foreground">No cards found</p>
          </div>
        )}
      </div>

      {selectedCard !== null && (
        <CardDetail characterId={selectedCard} owned={ownedMap.get(selectedCard)} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}
