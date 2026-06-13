import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Swords, Shield, Zap, X } from "lucide-react";
import { CHARACTERS, type Character, type OwnedCard } from "../data/characters";
import { CardImage } from "./CardImage";

type BattleState = "teamSelect" | "battle" | "result";

const ELEMENT_ADVANTAGE: Record<string, string> = {
  Logic: "Emotion",
  Emotion: "Strength",
  Strength: "Logic",
};

function getMultiplier(attacker: Character, defender: Character): number {
  if (ELEMENT_ADVANTAGE[attacker.element] === defender.element) return 1.5;
  if (ELEMENT_ADVANTAGE[defender.element] === attacker.element) return 0.7;
  return 1.0;
}

const ENEMY_TEAMS: { name: string; chars: number[] }[] = [
  { name: "Akutagawa Squad", chars: [10, 13, 14] },
  { name: "The Guild", chars: [15, 16, 17] },
  { name: "Rats in the House", chars: [20, 21, 22] },
  { name: "Hunting Dogs", chars: [23, 24, 25] },
];

interface BattleCharState { char: Character; hp: number; maxHp: number; }

interface Props {
  ownedCards: OwnedCard[];
  onEarnCoins: (amount: number, reason: string) => void;
}

const DEMO_TEAM = [1, 2, 5];

export function BattleMode({ ownedCards, onEarnCoins }: Props) {
  const [state, setState] = useState<BattleState>("teamSelect");
  const [playerTeam, setPlayerTeam] = useState<number[]>([]);
  const [enemyTeamIdx, setEnemyTeamIdx] = useState(0);
  const [playerStates, setPlayerStates] = useState<BattleCharState[]>([]);
  const [enemyStates, setEnemyStates] = useState<BattleCharState[]>([]);
  const [turn, setTurn] = useState<"player" | "enemy">("player");
  const [log, setLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<"player" | "enemy" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDefending, setIsDefending] = useState(false);
  const [skillCooldown, setSkillCooldown] = useState(0);

  const ownedCharIds = [...new Set(ownedCards.map(oc => oc.characterId))];
  const ownedChars = CHARACTERS.filter(c => ownedCharIds.includes(c.id));

  const toggleMember = (id: number) => {
    setPlayerTeam(prev => prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const startBattle = (team = playerTeam) => {
    const enemy = ENEMY_TEAMS[enemyTeamIdx];
    const init = (ids: number[]): BattleCharState[] =>
      ids.map(id => { const char = CHARACTERS.find(c => c.id === id)!; return { char, hp: char.hp, maxHp: char.hp }; });
    setPlayerStates(init(team));
    setEnemyStates(init(enemy.chars));
    setTurn("player");
    setLog(["Battle started! Your turn."]);
    setWinner(null);
    setState("battle");
  };

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 8));

  const applyDmg = (target: "player" | "enemy", idx: number, dmg: number, setter: React.Dispatch<React.SetStateAction<BattleCharState[]>>) => {
    setter(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], hp: Math.max(0, next[idx].hp - dmg) };
      return next;
    });
  };

  const doAction = useCallback((action: "attack" | "skill" | "defend") => {
    if (isAnimating || turn !== "player") return;
    if (action === "skill" && skillCooldown > 0) return;
    setIsAnimating(true);

    const attacker = playerStates.find(s => s.hp > 0);
    const targetIdx = enemyStates.findIndex(s => s.hp > 0);
    const target = enemyStates[targetIdx];
    if (!attacker || !target) { setIsAnimating(false); return; }

    let dmg = 0;
    if (action === "attack") {
      const mult = getMultiplier(attacker.char, target.char);
      dmg = Math.floor(attacker.char.atk * mult * (0.9 + Math.random() * 0.2));
      addLog(`${attacker.char.displayName} attacks! ${mult > 1 ? "⚡ Effective!" : mult < 1 ? "🔻 Not very effective…" : ""} -${dmg.toLocaleString()}`);
      setIsDefending(false);
    } else if (action === "skill") {
      dmg = Math.floor(attacker.char.atk * 2.2 * (0.9 + Math.random() * 0.2));
      addLog(`⚡ ${attacker.char.displayName} uses ${attacker.char.skill}! -${dmg.toLocaleString()}`);
      setSkillCooldown(3);
      setIsDefending(false);
    } else {
      addLog(`🛡️ ${attacker.char.displayName} braces for impact! (DMG -50% next hit)`);
      setIsDefending(true);
    }

    if (skillCooldown > 0) setSkillCooldown(c => Math.max(0, c - 1));

    setEnemyStates(prev => {
      const next = [...prev];
      if (dmg > 0 && next[targetIdx]) next[targetIdx] = { ...next[targetIdx], hp: Math.max(0, next[targetIdx].hp - dmg) };
      if (next.every(s => s.hp <= 0)) {
        setWinner("player");
        setState("result");
        onEarnCoins(150, "⚔️ Battle Victory!");
        setIsAnimating(false);
      }
      return next;
    });

    setTimeout(() => {
      setEnemyStates(current => {
        if (current.every(s => s.hp <= 0)) { setIsAnimating(false); return current; }

        const eAttacker = current.find(s => s.hp > 0);
        const pTargetIdx = playerStates.findIndex(s => s.hp > 0);
        const pTarget = playerStates[pTargetIdx];
        if (!eAttacker || !pTarget) { setIsAnimating(false); return current; }

        const mult = getMultiplier(eAttacker.char, pTarget.char);
        let eDmg = Math.floor(eAttacker.char.atk * 0.8 * mult * (0.9 + Math.random() * 0.2));
        const defended = isDefending;
        if (defended) eDmg = Math.floor(eDmg * 0.5);
        addLog(`${eAttacker.char.displayName} attacks!${defended ? " 🛡️ Blocked!" : ""} -${eDmg.toLocaleString()}`);
        setIsDefending(false);

        setPlayerStates(prev => {
          const next = [...prev];
          if (next[pTargetIdx]) next[pTargetIdx] = { ...next[pTargetIdx], hp: Math.max(0, next[pTargetIdx].hp - eDmg) };
          if (next.every(s => s.hp <= 0)) {
            setWinner("enemy");
            setState("result");
          }
          return next;
        });

        setSkillCooldown(c => Math.max(0, c - 1));
        setTurn("player");
        setIsAnimating(false);
        return current;
      });
    }, 900);
  }, [isAnimating, turn, skillCooldown, isDefending, playerStates, enemyStates, onEarnCoins]);

  if (state === "teamSelect") {
    return (
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--foreground)" }}>Battle Mode</h2>

        {/* Enemy selector */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-2">Choose Enemy</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {ENEMY_TEAMS.map((team, i) => (
              <button key={i} onClick={() => setEnemyTeamIdx(i)} className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${enemyTeamIdx === i ? "bg-red-500 text-white" : "bg-white border border-border text-muted-foreground"}`}>{team.name}</button>
            ))}
          </div>
        </div>

        {/* Enemy preview */}
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
          <p className="text-xs text-muted-foreground mb-3">Enemy Team</p>
          <div className="flex gap-2">
            {ENEMY_TEAMS[enemyTeamIdx].chars.map(id => {
              const char = CHARACTERS.find(c => c.id === id)!;
              return <div key={id} className="flex-1"><CardImage character={char} size="sm" showName /></div>;
            })}
          </div>
        </div>

        {/* Team select */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-muted-foreground">Your Team ({playerTeam.length}/3)</p>
            {playerTeam.length > 0 && <button onClick={() => setPlayerTeam([])} className="text-xs text-red-500 font-semibold">Clear</button>}
          </div>

          {playerTeam.length > 0 && (
            <div className="flex gap-2 mb-3">
              {playerTeam.map(id => {
                const char = CHARACTERS.find(c => c.id === id)!;
                return <div key={id} className="flex-1"><CardImage character={char} size="sm" showName /></div>;
              })}
            </div>
          )}

          {ownedChars.length === 0 ? (
            <div className="bg-muted rounded-2xl p-6 text-center">
              <p className="text-muted-foreground text-sm">Pull some cards first!</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
              {ownedChars.map(char => (
                <button key={char.id} onClick={() => toggleMember(char.id)} className={`rounded-xl overflow-hidden border-2 transition-all ${playerTeam.includes(char.id) ? "border-primary scale-105" : "border-transparent"}`}>
                  <CardImage character={char} size="xs" showName />
                </button>
              ))}
            </div>
          )}
        </div>

        {ownedChars.length === 0 && (
          <button onClick={() => { setPlayerTeam(DEMO_TEAM); }} className="w-full py-3 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-sm">
            Use Demo Team (Dazai, Atsushi, Yosano)
          </button>
        )}

        <button
          onClick={() => startBattle()}
          disabled={playerTeam.length === 0}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg shadow-md disabled:opacity-50"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          ⚔️ Start Battle!
        </button>
      </div>
    );
  }

  if (state === "result") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="text-6xl mb-4">{winner === "player" ? "🏆" : "💀"}</div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--foreground)" }}>
          {winner === "player" ? "Victory!" : "Defeated"}
        </h2>
        {winner === "player" && <div className="flex items-center gap-2 mt-4 text-2xl font-bold text-amber-500">🪙 +150</div>}
        <div className="flex gap-3 mt-6 w-full max-w-xs">
          <button onClick={() => setState("teamSelect")} className="flex-1 py-3 rounded-2xl bg-white border-2 border-border font-bold">Back</button>
          <button onClick={() => startBattle()} className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 max-w-2xl mx-auto">
      {/* Enemy */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-2 font-semibold">ENEMY</p>
        <div className="flex gap-2">
          {enemyStates.map((es, i) => (
            <div key={i} className={`flex-1 ${es.hp === 0 ? "opacity-30 grayscale" : ""}`}>
              <div className="rounded-2xl overflow-hidden"><CardImage character={es.char} size="xs" showName /></div>
              <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${(es.hp / es.maxHp) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log */}
      <div className="flex-1 bg-white rounded-2xl border border-border p-3 overflow-y-auto shadow-sm mb-3 min-h-0">
        {log.map((entry, i) => (
          <p key={i} className={`text-sm ${i === 0 ? "text-foreground font-semibold" : "text-muted-foreground"} mb-0.5`}>{entry}</p>
        ))}
      </div>

      {/* Player */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-2 font-semibold">YOUR TEAM</p>
        <div className="flex gap-2">
          {playerStates.map((ps, i) => {
            const isActive = ps.hp > 0 && turn === "player" && playerStates.find(s => s.hp > 0)?.char.id === ps.char.id;
            return (
              <div key={i} className={`flex-1 ${ps.hp === 0 ? "opacity-30 grayscale" : ""}`}>
                <div className={`rounded-2xl overflow-hidden border-2 transition-all ${isActive ? "border-primary shadow-md" : "border-transparent"}`}>
                  <CardImage character={ps.char} size="xs" showName />
                </div>
                <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(ps.hp / ps.maxHp) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className={`grid grid-cols-3 gap-2 ${(turn !== "player" || isAnimating) ? "opacity-40 pointer-events-none" : ""}`}>
        <button onClick={() => doAction("attack")} className="py-3 rounded-2xl bg-gradient-to-b from-red-500 to-red-600 text-white font-bold shadow-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <Swords size={18} className="mx-auto mb-0.5" />
          <div className="text-sm">Attack</div>
        </button>
        <button
          onClick={() => doAction("skill")}
          disabled={skillCooldown > 0}
          className="py-3 rounded-2xl bg-gradient-to-b from-purple-500 to-indigo-600 text-white font-bold shadow-sm disabled:opacity-50 relative"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <Zap size={18} className="mx-auto mb-0.5" />
          <div className="text-sm">Skill</div>
          {skillCooldown > 0 && (
            <span className="absolute top-1 right-1.5 text-xs bg-black/40 rounded-full px-1 font-bold">{skillCooldown}</span>
          )}
        </button>
        <button
          onClick={() => doAction("defend")}
          className={`py-3 rounded-2xl font-bold shadow-sm transition-all ${isDefending ? "bg-blue-200 text-blue-700 border-2 border-blue-400" : "bg-gradient-to-b from-blue-400 to-blue-500 text-white"}`}
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <Shield size={18} className="mx-auto mb-0.5" />
          <div className="text-sm">{isDefending ? "Braced" : "Defend"}</div>
        </button>
      </div>
      {turn === "enemy" && <p className="text-center text-sm text-muted-foreground mt-2 animate-pulse">Enemy is thinking…</p>}
      {turn === "player" && !isAnimating && (
        <p className="text-center text-xs text-muted-foreground mt-1">
          {isDefending ? "🛡️ Defending — next hit blocked 50%" : skillCooldown > 0 ? `⚡ Skill ready in ${skillCooldown} turn${skillCooldown > 1 ? "s" : ""}` : ""}
        </p>
      )}
    </div>
  );
}
