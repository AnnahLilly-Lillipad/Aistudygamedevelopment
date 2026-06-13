import { useState } from "react";
import type { Character } from "../data/characters";
import { FRAMES_MAP, RARITY_BORDER_COLORS } from "../data/frames";

interface Props {
  character: Character;
  size?: "xs" | "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
  frameId?: string;
  isAwakened?: boolean;
}

const SIZE_CLASSES = {
  xs: { container: "w-12 h-16", emoji: "text-xl",  name: "text-[0.5rem]" },
  sm: { container: "w-16 h-24", emoji: "text-3xl", name: "text-[0.6rem]" },
  md: { container: "w-24 h-36", emoji: "text-5xl", name: "text-xs"       },
  lg: { container: "w-40 h-56", emoji: "text-7xl", name: "text-sm"       },
};

export function CardImage({
  character,
  size = "md",
  showName = true,
  className = "",
  frameId = "standard",
  isAwakened = false,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const s = SIZE_CLASSES[size];

  const customFrame = frameId !== "standard" ? FRAMES_MAP[frameId] : null;
  const borderColor = customFrame?.borderColor ?? RARITY_BORDER_COLORS[character.rarity] ?? "#7ab2c8";
  const borderWidth = customFrame?.borderWidth ?? 2;
  const boxShadow = [
    customFrame?.shadow ?? "",
    isAwakened ? "0 0 0 2px #fbbf24, 0 0 8px rgba(251,191,36,0.5)" : "",
  ].filter(Boolean).join(", ") || "none";

  return (
    <div className={`relative overflow-hidden ${s.container} ${className}`}>
      {!imgError ? (
        <img
          src={character.imageUrl}
          alt={character.displayName}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top"
          draggable={false}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-b ${character.gradient} flex items-center justify-center`}>
          <span className={s.emoji}>{character.emoji}</span>
        </div>
      )}

      {showName && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent pb-1.5 pt-5 px-1">
          <p className={`text-white font-bold text-center leading-tight ${s.name}`}>
            {character.displayName}
          </p>
          {character.variant && (
            <p className="text-white/55 text-center leading-tight" style={{ fontSize: "0.42rem" }}>
              {character.variant}
            </p>
          )}
        </div>
      )}

      {/* Frame overlay — inset border directly on the image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `${borderWidth}px solid ${borderColor}`,
          boxShadow,
          zIndex: 10,
        }}
      />
    </div>
  );
}
