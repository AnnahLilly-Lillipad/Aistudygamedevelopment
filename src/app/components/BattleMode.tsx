import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Swords, Shield, Zap, Sparkles } from "lucide-react";
import { CHARACTERS, type Character, type OwnedCard } from "../data/characters";
import { CardImage } from "./CardImage";

type BattleState = "teamSelect" | "battle" | "result";

const ELEMENT_ADVANTAGE: Record<string, string> = {
  Logic: "Emotion", Emotion: "Strength", Strength: "Logic",
};

function getMultiplier(attacker: Character, defender: Character): number {
  if (ELEMENT_ADVANTAGE[attacker.element] === defender.element) return 1.5;
  if (ELEMENT_ADVANTAGE[defender.element] === attacker.element) return 0.7;
  return 1.0;
}

const ENEMY_TEAMS: { name: string; chars: number[] }[] = [
  { name: "Akutagawa Squad", chars: [10, 13, 14] },
  { name: "The Guild",       chars: [15, 16, 17] },
  { name: "Rats in House",   chars: [20, 21, 22] },
  { name: "Hunting Dogs",    chars: [23, 24, 25] },
];

interface BattleCharState { char: Character; hp: number; maxHp: number; effectiveAtk: number; isAwakened: boolean; }
interface Props { ownedCards: OwnedCard[]; onEarnCoins: (amount: number, reason: string) => void; onRecordWin?: () => void; equippedFrame: string; }

const DEMO_TEAM = [1, 2, 5];

export function BattleMode({ ownedCards, onEarnCoins, onRecordWin, equippedFrame }: Props) {
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
    const initPlayer = (ids: number[]): BattleCharState[] => ids.map(id => {
      const char = CHARACTERS.find(c => c.id === id)!;
      const ownedCard = ownedCards.find(oc => oc.characterId === id);
      const isAwakened = ownedCard?.awakened === true;
      const hp = isAwakened ? Math.floor(char.hp * 1.25) : char.hp;
      const effectiveAtk = isAwakened ? Math.floor(char.atk * 1.5) : char.atk;
      return { char, hp, maxHp: hp, effectiveAtk, isAwakened };
    });
    const initEnemy = (ids: number[]): BattleCharState[] => ids.map(id => {
      const char = CHARACTERS.find(c => c.id === id)!;
      return { char, hp: char.hp, maxHp: char.hp, effectiveAtk: char.atk, isAwakened: false };
    });
    setPlayerStates(initPlayer(team));
    setEnemyStates(initEnemy(enemy.chars));
    setTurn("player");
    setLog(["⚔️ Battle started! Your turn."]);
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
      addLog(`🛡️ ${attacker.char.displayName} braces! (DMG -50% next hit)`);
      setIsDefending(true);
    }
    if (skillCooldown > 0) setSkillCooldown(c => Math.max(0, c - 1));
    setEnemyStates(prev => {
      const next = [...prev];
      if (dmg > 0 && next[targetIdx]) next[targetIdx] = { ...next[targetIdx], hp: Math.max(0, next[targetIdx].hp - dmg) };
      if (next.every(s => s.hp <= 0)) {
        setWinner("player"); setState("result");
        onEarnCoins(150, "⚔️ Battle Victory!");
        onRecordWin?.(); setIsAnimating(false);
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
          if (next.every(s => s.hp <= 0)) { setWinner("enemy"); setState("result"); }
          return next;
        });
        setSkillCooldown(c => Math.max(0, c - 1));
        setTurn("player"); setIsAnimating(false);
        return current;
      });
    }, 900);
  }, [isAnimating, turn, skillCooldown, isDefending, playerStates, enemyStates, onEarnCoins]);

  /* ── Team Select ─────────────────────────────────────────────────────── */
  if (state === "teamSelect") {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header — red arena banner */}
        <div style={{
          background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)",
          borderBottom: "3px solid #f87171",
          padding: "10px 14px", marginBottom: 0,
        }}>
          <p style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem", color: "#fee2e2", letterSpacing: "0.08em", lineHeight: 1 }}>
            ⚔️ BATTLE MODE
          </p>
          <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#fca5a5", letterSpacing: "0.05em" }}>
            build your team · defeat enemies · earn coins
          </p>
        </div>

        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Enemy selector — coral panel */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, paddingLeft: 2 }}>
              <div style={{ width: 4, height: 16, background: "#dc2626", borderRadius: 2 }} />
              <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.1em" }}>
                CHOOSE ENEMY
              </span>
            </div>
            <div style={{ display: "flex", gap: 5, overflowX: "auto", marginBottom: 8 }} className="no-scrollbar">
              {ENEMY_TEAMS.map((team, i) => (
                <button key={i} onClick={() => setEnemyTeamIdx(i)}
                  style={{
                    flexShrink: 0,
                    fontFamily: "'VT323', monospace", fontSize: "0.8rem", letterSpacing: "0.04em",
                    padding: "4px 12px", borderRadius: 20, cursor: "pointer",
                    background: enemyTeamIdx === i ? "#dc2626" : "#fee2e2",
                    color: enemyTeamIdx === i ? "white" : "#7f1d1d",
                    border: `2px solid ${enemyTeamIdx === i ? "#b91c1c" : "#fca5a5"}`,
                    boxShadow: `2px 2px 0 ${enemyTeamIdx === i ? "#b91c1c" : "#fca5a5"}`,
                  }}>
                  {team.name}
                </button>
              ))}
            </div>
            {/* Enemy cards — CardImage handles its own border */}
            <div style={{ display: "flex", gap: 8 }}>
              {ENEMY_TEAMS[enemyTeamIdx].chars.map(id => {
                const char = CHARACTERS.find(c => c.id === id)!;
                return (
                  <div key={id} style={{ flex: 1 }}>
                    <CardImage character={char} size="sm" showName frameId="crimson" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team select — seafoam panel */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7, paddingLeft: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 16, background: "#059669", borderRadius: 2 }} />
                <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.1em" }}>
                  YOUR TEAM ({playerTeam.length}/3)
                </span>
              </div>
              {playerTeam.length > 0 && (
                <button onClick={() => setPlayerTeam([])}
                  style={{
                    fontFamily: "'VT323', monospace", fontSize: "0.7rem", letterSpacing: "0.04em",
                    background: "#fee2e2", color: "#dc2626", border: "2px solid #fca5a5",
                    borderRadius: 4, padding: "1px 8px", cursor: "pointer",
                  }}>CLEAR</button>
              )}
            </div>

            {playerTeam.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {playerTeam.map(id => {
                  const char = CHARACTERS.find(c => c.id === id)!;
                  const isAwakened = ownedCards.find(oc => oc.characterId === id)?.awakened === true;
                  return (
                    <div key={id} style={{ flex: 1, position: "relative" }}>
                      <CardImage character={char} size="sm" showName frameId={equippedFrame} isAwakened={isAwakened} />
                      {isAwakened && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#f59e0b", boxShadow: "0 0 8px rgba(251,191,36,0.7)", zIndex: 20 }}>
                          <Sparkles size={10} color="#fff" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {ownedChars.length === 0 ? (
              <div style={{ border: "2px dashed #9dc4d8", borderRadius: 6, padding: "16px", textAlign: "center", background: "#f0f8fc" }}>
                <p style={{ fontSize: "0.85rem", color: "#5a7d8a" }}>Pull some cards from Gacha first!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, maxHeight: 240, overflowY: "auto" }}>
                {ownedChars.map(char => {
                  const isAwakened = ownedCards.find(oc => oc.characterId === char.id)?.awakened === true;
                  const isSelected = playerTeam.includes(char.id);
                  return (
                    <button key={char.id} onClick={() => toggleMember(char.id)}
                      style={{
                        position: "relative", borderRadius: 4, overflow: "visible",
                        transform: isSelected ? "scale(1.08)" : "scale(1)",
                        transition: "all 0.1s", cursor: "pointer", background: "none",
                        border: isSelected ? "2px solid #fbbf24" : "2px solid transparent",
                      }}>
                      <CardImage character={char} size="xs" showName frameId={isSelected ? equippedFrame : "standard"} isAwakened={isAwakened} />
                      {isAwakened && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center z-10"
                          style={{ background: "#f59e0b", boxShadow: "0 0 6px rgba(251,191,36,0.8)" }}>
                          <Sparkles size={8} color="#fff" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {ownedChars.length === 0 && (
            <button onClick={() => setPlayerTeam(DEMO_TEAM)} className="retro-btn w-full py-2 text-sm">
              🎭 USE DEMO TEAM (Dazai, Atsushi, Yosano)
            </button>
          )}

          {/* Start button — big red chunky */}
          <button onClick={() => startBattle()} disabled={playerTeam.length === 0}
            style={{
              width: "100%", padding: "14px 0", fontFamily: "'VT323', monospace", fontSize: "1.3rem",
              letterSpacing: "0.1em", background: playerTeam.length === 0 ? "#fca5a5" : "#dc2626",
              color: "white", border: "3px solid #b91c1c", borderRadius: 6,
              cursor: playerTeam.length === 0 ? "not-allowed" : "pointer",
              boxShadow: playerTeam.length === 0 ? "none" : "4px 4px 0 #7f1d1d",
              transition: "all 0.08s",
            }}>
            ⚔️ START BATTLE! ⚔️
          </button>
        </div>
      </div>
    );
  }

  /* ── Result ──────────────────────────────────────────────────────────── */
  if (state === "result") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <div style={{ fontSize: "4rem", marginBottom: 12 }}>{winner === "player" ? "🏆" : "💀"}</div>
        </motion.div>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: "2.2rem", color: winner === "player" ? "#059669" : "#dc2626", letterSpacing: "0.08em" }}>
          {winner === "player" ? "VICTORY!" : "DEFEATED"}
        </p>
        {winner === "player" && (
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.4rem", color: "#d97706", marginTop: 10 }}>🪙 +150 COINS</div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 20, width: "100%", maxWidth: 280 }}>
          <button onClick={() => setState("teamSelect")} className="retro-btn flex-1 py-2.5">← BACK</button>
          <button onClick={() => startBattle()} style={{
            flex: 1, padding: "10px 0", fontFamily: "'VT323', monospace", fontSize: "1rem", letterSpacing: "0.06em",
            background: "#dc2626", color: "white", border: "2px solid #b91c1c",
            borderRadius: 4, cursor: "pointer", boxShadow: "3px 3px 0 #7f1d1d",
          }}>RETRY ⚔️</button>
        </div>
      </div>
    );
  }

  /* ── Battle ──────────────────────────────────────────────────────────── */
  return (
    <div className="h-full flex flex-col p-3 max-w-2xl mx-auto gap-2">

      {/* Enemy team — red panel */}
      <div style={{ background: "#fee2e2", border: "3px solid #f87171", borderRadius: 6, overflow: "hidden", flexShrink: 0, boxShadow: "3px 3px 0 #dc2626" }}>
        <div style={{ background: "#dc2626", padding: "3px 10px" }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "white", letterSpacing: "0.08em" }}>
            💀 ENEMY TEAM
          </span>
        </div>
        <div style={{ padding: "8px", display: "flex", gap: 8 }}>
          {enemyStates.map((es, i) => (
            <div key={i} style={{ flex: 1, opacity: es.hp === 0 ? 0.3 : 1, filter: es.hp === 0 ? "grayscale(1)" : "none" }}>
              <div style={{ borderRadius: 4, overflow: "hidden", border: "2px solid #fca5a5" }}>
                <CardImage character={es.char} size="xs" showName />
              </div>
              <div style={{ marginTop: 3, height: 6, background: "#fecaca", border: "1.5px solid #f87171", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(es.hp / es.maxHp) * 100}%`, background: "#dc2626", transition: "width 0.3s ease", borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Battle log — terminal/notebook style */}
      <div style={{
        background: "#fdfbf4", border: "2px solid #e8d5a0", borderRadius: 6,
        overflow: "hidden", flex: 1, minHeight: 0, boxShadow: "2px 2px 0 #c9a87c",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          background: "#c4a868", padding: "3px 10px",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "white", letterSpacing: "0.08em" }}>
            📜 BATTLE LOG
          </span>
        </div>
        <div style={{ padding: "8px", overflowY: "auto", flex: 1 }}>
          {log.map((entry, i) => (
            <p key={i} style={{
              fontFamily: "'VT323', monospace", fontSize: "0.85rem", marginBottom: 2,
              color: i === 0 ? "#1a3d52" : "#5a7d8a",
            }}>{entry}</p>
          ))}
        </div>
      </div>

      {/* Player team — seafoam panel */}
      <div style={{ background: "#d1fae5", border: "3px solid #34d399", borderRadius: 6, overflow: "hidden", flexShrink: 0, boxShadow: "3px 3px 0 #059669" }}>
        <div style={{ background: "#059669", padding: "3px 10px" }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "white", letterSpacing: "0.08em" }}>
            YOUR TEAM
          </span>
        </div>
        <div style={{ padding: "8px", display: "flex", gap: 8 }}>
          {playerStates.map((ps, i) => {
            const isActive = ps.hp > 0 && turn === "player" && playerStates.find(s => s.hp > 0)?.char.id === ps.char.id;
            return (
              <div key={i} style={{ flex: 1, opacity: ps.hp === 0 ? 0.3 : 1, filter: ps.hp === 0 ? "grayscale(1)" : "none" }}>
                <div style={{ borderRadius: 4, overflow: "hidden", border: `2px solid ${isActive ? "#059669" : "#a7f3d0"}`, boxShadow: isActive ? "0 0 8px rgba(16,185,129,0.4)" : "none" }}>
                  <CardImage character={ps.char} size="xs" showName />
                </div>
                <div style={{ marginTop: 3, height: 6, background: "#a7f3d0", border: "1.5px solid #34d399", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(ps.hp / ps.maxHp) * 100}%`, background: "#059669", transition: "width 0.3s ease", borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons — big chunky arcade style, each color */}
      <div className={`grid grid-cols-3 gap-2 flex-shrink-0 ${(turn !== "player" || isAnimating) ? "opacity-40 pointer-events-none" : ""}`}>
        <button onClick={() => doAction("attack")}
          style={{
            padding: "12px 8px", fontFamily: "'VT323', monospace", cursor: "pointer",
            background: "#dc2626", color: "white", border: "3px solid #b91c1c",
            borderRadius: 6, boxShadow: "3px 3px 0 #7f1d1d",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "all 0.08s",
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "1px 1px 0 #7f1d1d"; e.currentTarget.style.transform = "translate(2px,2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "3px 3px 0 #7f1d1d"; e.currentTarget.style.transform = "none"; }}>
          <Swords size={18} />
          <span style={{ fontSize: "0.95rem" }}>ATTACK</span>
        </button>
        <button onClick={() => doAction("skill")} disabled={skillCooldown > 0}
          style={{
            padding: "12px 8px", fontFamily: "'VT323', monospace", cursor: skillCooldown > 0 ? "not-allowed" : "pointer",
            background: skillCooldown > 0 ? "#4c1270" : "#7c3aed", color: "white",
            border: "3px solid #5b21b6", borderRadius: 6,
            boxShadow: skillCooldown > 0 ? "none" : "3px 3px 0 #4c1270", opacity: skillCooldown > 0 ? 0.5 : 1,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative", transition: "all 0.08s",
          }}>
          <Zap size={18} />
          <span style={{ fontSize: "0.95rem" }}>SKILL</span>
          {skillCooldown > 0 && (
            <span style={{
              position: "absolute", top: 4, right: 6, background: "rgba(0,0,0,0.5)",
              color: "white", fontFamily: "'VT323', monospace", fontSize: "0.85rem",
              borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
            }}>{skillCooldown}</span>
          )}
        </button>
        <button onClick={() => doAction("defend")}
          style={{
            padding: "12px 8px", fontFamily: "'VT323', monospace", cursor: "pointer",
            background: isDefending ? "#ddeef6" : "#5b9aba", color: isDefending ? "#1a3d52" : "white",
            border: `3px solid ${isDefending ? "#5b9aba" : "#3d7a98"}`, borderRadius: 6,
            boxShadow: `3px 3px 0 ${isDefending ? "#7ab2c8" : "#1a3d52"}`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "all 0.08s",
          }}>
          <Shield size={18} />
          <span style={{ fontSize: "0.95rem" }}>{isDefending ? "BRACED" : "DEFEND"}</span>
        </button>
      </div>

      {(turn === "enemy" || isAnimating) && (
        <p className="text-center text-xs animate-pulse flex-shrink-0 vt" style={{ color: "#5a7d8a", fontSize: "0.85rem" }}>
          Enemy is thinking…
        </p>
      )}
      {turn === "player" && !isAnimating && (isDefending || skillCooldown > 0) && (
        <p className="text-center text-xs flex-shrink-0 vt" style={{ color: "#5a7d8a", fontSize: "0.8rem" }}>
          {isDefending ? "🛡️ Defending — next hit blocked 50%" : `⚡ Skill ready in ${skillCooldown} turn${skillCooldown > 1 ? "s" : ""}`}
        </p>
      )}
    </div>
  );
}
