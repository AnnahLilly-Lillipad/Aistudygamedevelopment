import { useState } from "react";
import type { Character } from "../data/characters";

interface Props {
  character: Character;
  size?: "xs" | "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  xs: { container: "w-12 h-16", emoji: "text-xl",  name: "text-[0.5rem]" },
  sm: { container: "w-16 h-24", emoji: "text-3xl", name: "text-[0.6rem]" },
  md: { container: "w-24 h-36", emoji: "text-5xl", name: "text-xs"       },
  lg: { container: "w-40 h-56", emoji: "text-7xl", name: "text-sm"       },
};

export function CardImage({ character, size = "md", showName = true, className = "" }: Props) {
  const [imgError, setImgError] = useState(false);
  const s = SIZE_CLASSES[size];

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
    </div>
  );
}
