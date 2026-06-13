import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Swords, Shield, Zap, Sparkles } from "lucide-react";
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

interface BattleCharState { char: Character; hp: number; maxHp: number; effectiveAtk: number; isAwakened: boolean; }

interface Props {
  ownedCards: OwnedCard[];
  onEarnCoins: (amount: number, reason: string) => void;
  onRecordWin?: () => void;
}

const DEMO_TEAM = [1, 2, 5];

export function BattleMode({ ownedCards, onEarnCoins, onRecordWin }: Props) {
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

    const initPlayer = (ids: number[]): BattleCharState[] =>
      ids.map(id => {
        const char = CHARACTERS.find(c => c.id === id)!;
        const ownedCard = ownedCards.find(oc => oc.characterId === id);
        const isAwakened = ownedCard?.awakened === true;
        const hp = isAwakened ? Math.floor(char.hp * 1.25) : char.hp;
        const effectiveAtk = isAwakened ? Math.floor(char.atk * 1.5) : char.atk;
        return { char, hp, maxHp: hp, effectiveAtk, isAwakened };
      });

    const initEnemy = (ids: number[]): BattleCharState[] =>
      ids.map(id => {
        const char = CHARACTERS.find(c => c.id === id)!;
        return { char, hp: char.hp, maxHp: char.hp, effectiveAtk: char.atk, isAwakened: false };
      });

    setPlayerStates(initPlayer(team));
    setEnemyStates(initEnemy(enemy.chars));
    setTurn("player");
    setLog(["Battle started! Your turn."]);
    setWinner(null);
    setState("battle");
  };

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 8));

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
      dmg = Math.floor(attacker.effectiveAtk * mult * (0.9 + Math.random() * 0.2));
      const eff = mult > 1 ? " ⚡ Effective!" : mult < 1 ? " 🔻 Resisted…" : "";
      addLog(`${attacker.char.displayName} attacks!${eff} -${dmg.toLocaleString()}`);
      setIsDefending(false);
    } else if (action === "skill") {
      dmg = Math.floor(attacker.effectiveAtk * 2.2 * (0.9 + Math.random() * 0.2));
      const skillName = attacker.isAwakened && attacker.char.awakenedSkill ? attacker.char.awakenedSkill : attacker.char.skill;
      const prefix = attacker.isAwakened ? "✦ " : "⚡ ";
      addLog(`${prefix}${attacker.char.displayName} uses ${skillName}! -${dmg.toLocaleString()}`);
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
        onRecordWin?.();
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="os-window mx-3 mt-3 mb-3">
          <div className="os-titlebar">
            <div className="os-btn-red" /><div className="os-btn-yellow" /><div className="os-btn-green" />
            <span className="os-titlebar-title">BATTLE.EXE</span>
          </div>
          <div style={{ background: "#ddeef6", padding: "8px 12px" }}>
            <p className="vt" style={{ fontSize: "1.3rem", color: "#1a3d52" }}>⚔ BATTLE MODE</p>
            <p className="text-xs" style={{ color: "#5a7d8a" }}>Build your team · Defeat enemies · Earn coins</p>
          </div>
        </div>

        <div className="px-3 space-y-3">
          {/* Enemy selector */}
          <div className="os-window">
            <div className="os-titlebar">
              <div className="os-btn-red" />
              <span className="os-titlebar-title">CHOOSE ENEMY</span>
            </div>
            <div style={{ background: "#f0f8fc", padding: "8px" }}>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {ENEMY_TEAMS.map((team, i) => (
                  <button
                    key={i}
                    onClick={() => setEnemyTeamIdx(i)}
                    className="retro-btn flex-shrink-0 text-sm py-1.5"
                    style={enemyTeamIdx === i ? { background: "#d64f4f", color: "#fff", borderColor: "#b03a3a" } : {}}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                {ENEMY_TEAMS[enemyTeamIdx].chars.map(id => {
                  const char = CHARACTERS.find(c => c.id === id)!;
                  return <div key={id} className="flex-1"><CardImage character={char} size="sm" showName /></div>;
                })}
              </div>
            </div>
          </div>

          {/* Team select */}
          <div className="os-window">
            <div className="os-titlebar">
              <div className="os-btn-green" />
              <span className="os-titlebar-title">YOUR TEAM ({playerTeam.length}/3)</span>
              {playerTeam.length > 0 && (
                <button className="retro-btn py-0 px-2 text-xs ml-1" style={{ background: "#ff6b6b", color: "#fff", borderColor: "#e05555", boxShadow: "none", fontSize: "0.65rem" }} onClick={() => setPlayerTeam([])}>
                  CLEAR
                </button>
              )}
            </div>
            <div style={{ background: "#f0f8fc", padding: "8px" }}>
              {playerTeam.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {playerTeam.map(id => {
                    const char = CHARACTERS.find(c => c.id === id)!;
                    const isAwakened = ownedCards.find(oc => oc.characterId === id)?.awakened === true;
                    return (
                      <div key={id} className="flex-1 relative">
                        <CardImage character={char} size="sm" showName />
                        {isAwakened && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#f59e0b", boxShadow: "0 0 8px rgba(251,191,36,0.7)" }}>
                            <Sparkles size={10} color="#fff" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {ownedChars.length === 0 ? (
                <div className="rounded p-4 text-center border-2" style={{ background: "#ddeef6", borderColor: "#7ab2c8", borderStyle: "dashed" }}>
                  <p className="text-sm" style={{ color: "#5a7d8a" }}>Pull some cards first!</p>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                  {ownedChars.map(char => {
                    const isAwakened = ownedCards.find(oc => oc.characterId === char.id)?.awakened === true;
                    const isSelected = playerTeam.includes(char.id);
                    return (
                      <button
                        key={char.id}
                        onClick={() => toggleMember(char.id)}
                        className="relative rounded overflow-visible transition-all"
                        style={{
                          border: `2px solid ${isSelected ? (isAwakened ? "#f59e0b" : "#5b9aba") : "#b0d0e2"}`,
                          transform: isSelected ? "scale(1.06)" : "scale(1)",
                        }}
                      >
                        <div className="rounded overflow-hidden" style={{ borderRadius: "3px" }}>
                          <CardImage character={char} size="xs" showName />
                        </div>
                        {isAwakened && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center z-10" style={{ background: "#f59e0b", boxShadow: "0 0 6px rgba(251,191,36,0.8)" }}>
                            <Sparkles size={8} color="#fff" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {ownedChars.length === 0 && (
            <button onClick={() => setPlayerTeam(DEMO_TEAM)} className="retro-btn w-full py-2 text-sm">
              USE DEMO TEAM (Dazai, Atsushi, Yosano)
            </button>
          )}

          <button
            onClick={() => startBattle()}
            disabled={playerTeam.length === 0}
            className="retro-btn retro-btn-primary w-full py-3 text-center disabled:opacity-50"
          >
            <span className="vt" style={{ fontSize: "1.2rem" }}>⚔ START BATTLE!</span>
          </button>
        </div>
      </div>
    );
  }

  if (state === "result") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="text-6xl mb-4">{winner === "player" ? "🏆" : "💀"}</div>
        <p className="vt" style={{ fontSize: "2rem", color: "#1a3d52" }}>
          {winner === "player" ? "VICTORY!" : "DEFEATED"}
        </p>
        {winner === "player" && (
          <div className="flex items-center gap-2 mt-4 vt" style={{ fontSize: "1.4rem", color: "#d97706" }}>🪙 +150 COINS</div>
        )}
        <div className="flex gap-3 mt-6 w-full max-w-xs">
          <button onClick={() => setState("teamSelect")} className="retro-btn flex-1 py-2.5">BACK</button>
          <button onClick={() => startBattle()} className="retro-btn retro-btn-primary flex-1 py-2.5">RETRY</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-3 max-w-2xl mx-auto gap-2">
      {/* Enemy */}
      <div className="os-window flex-shrink-0">
        <div className="os-titlebar">
          <div className="os-btn-red" />
          <span className="os-titlebar-title">ENEMY TEAM</span>
        </div>
        <div style={{ background: "#fff0f0", padding: "8px" }}>
          <div className="flex gap-2">
            {enemyStates.map((es, i) => (
              <div key={i} className={`flex-1 ${es.hp === 0 ? "opacity-30 grayscale" : ""}`}>
                <div className="rounded overflow-hidden border" style={{ borderColor: "#7ab2c8" }}>
                  <CardImage character={es.char} size="xs" showName />
                </div>
                <div className="mt-1 h-2 rounded overflow-hidden" style={{ background: "#fdd" }}>
                  <div className="h-full rounded transition-all" style={{ width: `${(es.hp / es.maxHp) * 100}%`, background: "#e05555" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className="os-window flex-1 min-h-0">
        <div className="os-titlebar">
          <div className="os-btn-green" />
          <span className="os-titlebar-title">BATTLE LOG</span>
        </div>
        <div className="p-2 overflow-y-auto h-full" style={{ background: "#fff" }}>
          {log.map((entry, i) => (
            <p key={i} className="text-xs mb-0.5 vt" style={{ color: i === 0 ? "#1a3d52" : "#5a7d8a", fontSize: "0.85rem" }}>{entry}</p>
          ))}
        </div>
      </div>

      {/* Player team */}
      <div className="os-window flex-shrink-0">
        <div className="os-titlebar">
          <div className="os-btn-green" />
          <span className="os-titlebar-title">YOUR TEAM</span>
        </div>
        <div style={{ background: "#f0fff4", padding: "8px" }}>
          <div className="flex gap-2">
            {playerStates.map((ps, i) => {
              const isActive = ps.hp > 0 && turn === "player" && playerStates.find(s => s.hp > 0)?.char.id === ps.char.id;
              return (
                <div key={i} className={`flex-1 ${ps.hp === 0 ? "opacity-30 grayscale" : ""}`}>
                  <div className="rounded overflow-hidden border-2 transition-all" style={{ borderColor: isActive ? "#5b9aba" : "#b0d0e2" }}>
                    <CardImage character={ps.char} size="xs" showName />
                  </div>
                  <div className="mt-1 h-2 rounded overflow-hidden" style={{ background: "#ddf5e8" }}>
                    <div className="h-full rounded transition-all" style={{ width: `${(ps.hp / ps.maxHp) * 100}%`, background: "#22c55e" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={`grid grid-cols-3 gap-2 flex-shrink-0 ${(turn !== "player" || isAnimating) ? "opacity-40 pointer-events-none" : ""}`}>
        <button onClick={() => doAction("attack")} className="retro-btn py-2.5 text-center" style={{ background: "#d64f4f", color: "#fff", borderColor: "#b03a3a" }}>
          <Swords size={16} className="mx-auto mb-0.5" />
          <div className="vt" style={{ fontSize: "0.9rem" }}>ATTACK</div>
        </button>
        <button
          onClick={() => doAction("skill")}
          disabled={skillCooldown > 0}
          className="retro-btn py-2.5 text-center relative disabled:opacity-50"
          style={{ background: "#6b21a8", color: "#fff", borderColor: "#4c1270" }}
        >
          <Zap size={16} className="mx-auto mb-0.5" />
          <div className="vt" style={{ fontSize: "0.9rem" }}>SKILL</div>
          {skillCooldown > 0 && (
            <span className="absolute top-1 right-1.5 text-xs font-bold rounded-full px-1" style={{ background: "rgba(0,0,0,0.4)", color: "#fff" }}>{skillCooldown}</span>
          )}
        </button>
        <button
          onClick={() => doAction("defend")}
          className="retro-btn py-2.5 text-center transition-all"
          style={isDefending ? { background: "#cde5f0", color: "#1a3d52", borderColor: "#5b9aba" } : { background: "#5b9aba", color: "#fff", borderColor: "#3d7a98" }}
        >
          <Shield size={16} className="mx-auto mb-0.5" />
          <div className="vt" style={{ fontSize: "0.9rem" }}>{isDefending ? "BRACED" : "DEFEND"}</div>
        </button>
      </div>
      {(turn === "enemy" || isAnimating) && (
        <p className="text-center text-xs animate-pulse flex-shrink-0 vt" style={{ color: "#5a7d8a", fontSize: "0.85rem" }}>Enemy is thinking…</p>
      )}
      {turn === "player" && !isAnimating && (isDefending || skillCooldown > 0) && (
        <p className="text-center text-xs flex-shrink-0 vt" style={{ color: "#5a7d8a", fontSize: "0.8rem" }}>
          {isDefending ? "🛡️ Defending — next hit blocked 50%" : `⚡ Skill ready in ${skillCooldown} turn${skillCooldown > 1 ? "s" : ""}`}
        </p>
      )}
    </div>
  );
}
