import { useState } from "react";
import type { Character, Rarity } from "../data/characters";

// Drop your card photos into /public/cards/{id}.jpg
// e.g. /public/cards/1.jpg   → Dazai (Standard)
//      /public/cards/101.jpg → Dazai (Slytherin AU)

const RARITY_OVERLAYS: Record<Rarity, string> = {
  R: "",
  SR: "after:absolute after:inset-0 after:bg-purple-500/10",
  SSR: "after:absolute after:inset-0 after:bg-amber-400/15",
  UR: "after:absolute after:inset-0 after:bg-rose-400/20",
};

interface Props {
  character: Character;
  size?: "xs" | "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  xs: { container: "w-12 h-16", emoji: "text-xl", name: "text-[0.5rem]" },
  sm: { container: "w-16 h-24", emoji: "text-3xl", name: "text-[0.6rem]" },
  md: { container: "w-24 h-36", emoji: "text-5xl", name: "text-xs" },
  lg: { container: "w-40 h-56", emoji: "text-7xl", name: "text-sm" },
};

export function CardImage({ character, size = "md", showName = true, className = "" }: Props) {
  const [imgError, setImgError] = useState(false);
  const s = SIZE_CLASSES[size];

  return (
    <div className={`relative overflow-hidden rounded-2xl ${s.container} ${className}`}>
      {!imgError ? (
        <img
          src={character.imageUrl}
          alt={character.displayName}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top"
          draggable={false}
        />
      ) : (
        /* Gradient fallback when no photo is available */
        <div className={`w-full h-full bg-gradient-to-b ${character.gradient} flex flex-col items-center justify-center`}>
          <span className={s.emoji}>{character.emoji}</span>
        </div>
      )}

      {/* Rarity shimmer overlay for SSR+ */}
      {(character.rarity === "SSR" || character.rarity === "UR") && (
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: character.rarity === "UR"
              ? "linear-gradient(135deg, transparent 40%, rgba(255,214,10,0.18) 60%, transparent 80%)"
              : "linear-gradient(135deg, transparent 40%, rgba(168,85,247,0.12) 60%, transparent 80%)",
          }}
        />
      )}

      {/* Bottom name bar */}
      {showName && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-4 pb-1.5 px-2">
          <p className={`text-white font-bold text-center leading-tight ${s.name}`}>{character.displayName}</p>
          {character.variant && (
            <p className="text-white/60 text-center font-medium leading-tight" style={{ fontSize: "0.45rem" }}>{character.variant}</p>
          )}
        </div>
      )}

      {/* Rarity badge */}
      <div className="absolute top-1.5 right-1.5">
        <RarityBadge rarity={character.rarity} />
      </div>

      {/* AU badge */}
      {character.au && (
        <div className="absolute top-1.5 left-1.5 bg-black/50 text-white rounded-full px-1.5 py-0.5" style={{ fontSize: "0.45rem", fontWeight: 700 }}>
          AU
        </div>
      )}
    </div>
  );
}

function RarityBadge({ rarity }: { rarity: Rarity }) {
  const styles: Record<Rarity, string> = {
    R: "bg-slate-500/80 text-white",
    SR: "bg-purple-600/90 text-white",
    SSR: "bg-amber-500/90 text-white",
    UR: "bg-gradient-to-r from-rose-500 to-pink-500 text-white",
  };
  return (
    <span className={`${styles[rarity]} text-[0.5rem] font-black px-1.5 py-0.5 rounded-full backdrop-blur-sm`}>
      {rarity}
    </span>
  );
}
