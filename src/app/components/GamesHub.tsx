import { useState, useEffect, useRef, useCallback } from "react";
import { X, Check, HelpCircle, Layers, Brain, PenLine, MoveDown, Skull, RefreshCw,
  BookOpen, FlaskConical, Globe, Atom, BookMarked, ChevronLeft, Timer } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QUIZ_QUESTIONS } from "../data/characters";

interface FlashCard { front: string; back: string; }
interface QuizQuestion { question: string; options: string[]; answer: number; coins: number; }
interface StudySetData { id: string; name: string; subject: string; Icon: React.ElementType; color: string; cards: FlashCard[]; }

const STUDY_CONTENT: StudySetData[] = [
  {
    id: "bsd", name: "BSD Lore", subject: "Anime", Icon: BookMarked, color: "from-violet-500 to-indigo-600",
    cards: [
      { front: "What is Dazai's ability?", back: "No Longer Human — Nullifies any supernatural ability" },
      { front: "What faction is Atsushi in?", back: "Armed Detective Agency (ADA)" },
      { front: "What is the element triangle?", back: "Logic > Emotion > Strength > Logic" },
      { front: "Who leads Port Mafia?", back: "Mori Ougai" },
      { front: "What does Chuuya's Corruption do?", back: "ATK ×3 but loses consciousness — Dazai must deactivate it" },
      { front: "Who is the world's greatest detective in BSD?", back: "Ranpo Edogawa — his ability is actually just genius intellect" },
      { front: "What is Fyodor's ability called?", back: "Crime and Punishment — kills with a single touch" },
      { front: "What is Rashomon?", back: "Akutagawa's black coat ability that attacks and defends" },
    ],
  },
  {
    id: "calc", name: "Calculus", subject: "Math", Icon: Atom, color: "from-blue-500 to-indigo-600",
    cards: [
      { front: "What is a derivative?", back: "Rate of change of a function. d/dx gives the slope at any point." },
      { front: "What is the chain rule?", back: "d/dx[f(g(x))] = f(g(x)) · g(x)" },
      { front: "What is an integral?", back: "The area under a curve. It is the antiderivative of a function." },
      { front: "Derivative of sin(x)?", back: "cos(x)" },
      { front: "Derivative of e^x?", back: "e^x — it is its own derivative!" },
      { front: "What is the Power Rule?", back: "d/dx[x^n] = n·x^(n−1)" },
      { front: "What is a limit?", back: "The value a function approaches as x approaches a point." },
      { front: "What does the Fundamental Theorem of Calculus state?", back: "Differentiation and integration are inverse operations." },
    ],
  },
  {
    id: "history", name: "World History", subject: "History", Icon: Globe, color: "from-amber-500 to-orange-600",
    cards: [
      { front: "When did WWII end?", back: "1945 — V-E Day May 8 and V-J Day September 2" },
      { front: "What was the French Revolution?", back: "1789–1799 overthrow of the French monarchy, led to Napoleon's rise" },
      { front: "What caused WWI?", back: "Assassination of Archduke Franz Ferdinand 1914 plus entangled alliances" },
      { front: "What was the Cold War?", back: "1947–1991 geopolitical rivalry between the USA and Soviet Union" },
      { front: "Who was Julius Caesar?", back: "Roman general and statesman, assassinated 44 BC on the Ides of March" },
      { front: "What was the Renaissance?", back: "14th–17th century cultural rebirth in Europe; art, science, and humanism flourished" },
      { front: "What was the Industrial Revolution?", back: "18th–19th century shift from hand production to machine manufacturing" },
      { front: "What was the Silk Road?", back: "Ancient trade routes connecting East Asia to the Mediterranean" },
    ],
  },
  {
    id: "chemistry", name: "Chemistry", subject: "Science", Icon: FlaskConical, color: "from-green-500 to-emerald-600",
    cards: [
      { front: "What is an element?", back: "A pure substance made of only one type of atom." },
      { front: "What is a covalent bond?", back: "Atoms share electrons. Found in molecules like H2O and CO2." },
      { front: "What is pH?", back: "Measure of acidity: 0–6 acidic, 7 neutral, 8–14 basic." },
      { front: "What is Avogadro's number?", back: "6.022 × 10^23 — number of atoms or molecules in one mole." },
      { front: "What is the periodic table?", back: "Table of elements ordered by atomic number." },
      { front: "What is an ionic bond?", back: "Electrostatic attraction between oppositely charged ions." },
      { front: "What is oxidation?", back: "Loss of electrons. OIL RIG: Oxidation Is Loss, Reduction Is Gain." },
      { front: "What is a catalyst?", back: "A substance that speeds up a reaction without being consumed." },
    ],
  },
  {
    id: "literature", name: "Japanese Lit", subject: "Literature", Icon: BookOpen, color: "from-pink-500 to-rose-600",
    cards: [
      { front: "What is haiku?", back: "Japanese poem with 5-7-5 syllable structure in three lines." },
      { front: "Who wrote No Longer Human?", back: "Osamu Dazai, published in 1948." },
      { front: "What is Rashomon by Akutagawa about?", back: "A servant at the Rashomon gate must choose between starvation or becoming a thief." },
      { front: "What is mono no aware?", back: "The pathos of things — Japanese concept of beauty and sadness in impermanence." },
      { front: "Who wrote I Am a Cat?", back: "Natsume Soseki — the story is told from a cat's perspective." },
      { front: "What is wabi-sabi?", back: "Finding beauty in imperfection and transience." },
      { front: "What era is the Heian period famous for?", back: "Classical Japanese art and literature 794–1185, including The Tale of Genji." },
      { front: "What is the meaning of Bungou?", back: "Literary Master — a title for acclaimed Japanese authors." },
    ],
  },
  {
    id: "physics", name: "Physics", subject: "Science", Icon: Atom, color: "from-violet-500 to-purple-600",
    cards: [
      { front: "What is Newton's First Law?", back: "An object at rest stays at rest unless acted upon by a net force (inertia)." },
      { front: "What is E = mc squared?", back: "Energy equals mass times the speed of light squared. Einstein's mass-energy equivalence." },
      { front: "What is velocity?", back: "Speed in a given direction. Measured in m/s." },
      { front: "What is the unit of force?", back: "Newton (N). F = ma (force = mass × acceleration)." },
      { front: "What is Ohm's Law?", back: "V = IR — Voltage equals current times resistance." },
      { front: "What is a wave?", back: "A disturbance that transfers energy through a medium without transferring matter." },
      { front: "What is gravity?", back: "The attractive force between masses. On Earth's surface: g = 9.8 m/s^2." },
      { front: "What is momentum?", back: "Mass times velocity (p = mv). Conserved in isolated systems." },
    ],
  },
];

function makeQuizFromCards(cards: FlashCard[]): QuizQuestion[] {
  const shuffled = [...cards].sort(() => Math.random() - 0.5).slice(0, 10);
  return shuffled.map((card) => {
    const others = cards.filter(c => c.back !== card.back).map(c => c.back).sort(() => Math.random() - 0.5).slice(0, 3);
    while (others.length < 3) others.push(`Not: "${card.back.slice(0, 18)}..."`);
    const opts = [card.back, ...others].sort(() => Math.random() - 0.5);
    return { question: card.front, options: opts, answer: opts.indexOf(card.back), coins: 15 };
  });
}

// ─── Quiz Game ─────────────────────────────────────────────────────────────────
function QuizGame({ onEarnCoins, onBack, onTrackQuizAnswer, questions, setName }: {
  onEarnCoins: (amount: number, reason: string) => void;
  onBack: () => void;
  onTrackQuizAnswer?: () => void;
  questions: QuizQuestion[];
  setName: string;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  const q = questions[qIndex];
  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    onTrackQuizAnswer?.();
    const correct = i === q.answer;
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    const earned = correct ? q.coins + (newStreak > 1 ? newStreak * 5 : 0) : 0;
    if (correct) { setScore(s => s + 1); setTotalCoins(c => c + earned); onEarnCoins(earned, `Correct!${newStreak > 1 ? ` ${newStreak}x streak!` : ""}`); }
    setTimeout(() => {
      if (qIndex + 1 >= questions.length) setDone(true);
      else { setQIndex(i => i + 1); setSelected(null); }
    }, 1200);
  };

  if (done) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <p className="vt" style={{ fontSize: "1.8rem", color: "#1a3d52" }}>QUIZ COMPLETE!</p>
      <p className="mt-2" style={{ color: "#5a7d8a" }}>{score} / {questions.length} correct · {setName}</p>
      <div className="vt mt-4" style={{ fontSize: "1.4rem", color: "#d97706" }}>🪙 +{totalCoins}</div>
      <div className="mt-6 w-full max-w-xs space-y-2">
        <div className="os-window">
          <div className="os-titlebar py-1"><span className="os-titlebar-title" style={{ fontSize: "0.7rem" }}>ACCURACY</span></div>
          <div className="p-3 text-center" style={{ background: "#fff" }}>
            <div className="vt" style={{ fontSize: "2rem", color: "#5b9aba" }}>{Math.round((score / questions.length) * 100)}%</div>
            <div className="h-2 rounded overflow-hidden border mt-2" style={{ background: "#ddeef6", borderColor: "#7ab2c8" }}>
              <div className="h-full" style={{ width: `${(score / questions.length) * 100}%`, background: "#5b9aba" }} />
            </div>
          </div>
        </div>
        <button onClick={onBack} className="retro-btn retro-btn-primary w-full py-2.5">BACK TO GAMES</button>
        <button onClick={() => { setQIndex(0); setSelected(null); setScore(0); setTotalCoins(0); setDone(false); setStreak(0); }} className="retro-btn w-full py-2.5">PLAY AGAIN</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-3">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onBack} className="retro-btn w-9 h-9 flex items-center justify-center p-0"><X size={16} style={{ color: "#5a7d8a" }} /></button>
        <div className="flex-1">
          <p className="mono-label" style={{ fontSize: "0.65rem" }}>{setName} · QUIZ</p>
          <div className="h-2 rounded overflow-hidden border mt-1" style={{ background: "#ddeef6", borderColor: "#7ab2c8" }}>
            <div className="h-full transition-all" style={{ width: `${(qIndex / questions.length) * 100}%`, background: "#5b9aba" }} />
          </div>
        </div>
        <span className="mono-label" style={{ fontSize: "0.65rem" }}>{qIndex + 1}/{questions.length}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={qIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 flex flex-col">
          <div className="os-window mb-3">
            <div className="os-titlebar py-1">
              <div className="os-btn-green" />
              <span className="os-titlebar-title" style={{ fontSize: "0.7rem" }}>QUESTION {qIndex + 1}</span>
            </div>
            <div className="p-4" style={{ background: "#fff" }}>
              <p className="font-semibold" style={{ fontSize: "1rem", lineHeight: 1.4, color: "#1a3d52" }}>{q.question}</p>
              <p className="text-xs font-semibold mt-2" style={{ color: "#d97706" }}>🪙 +{q.coins}{streak > 1 ? ` · 🔥 ${streak}x` : ""}</p>
            </div>
          </div>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.answer;
              const isSelected = i === selected;
              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                  className="retro-btn w-full text-left py-3 px-4"
                  style={{
                    background: selected === null ? "#fff" : isCorrect ? "#d1f0e0" : isSelected ? "#ffeaea" : "#fff",
                    borderColor: selected === null ? "#7ab2c8" : isCorrect ? "#22c55e" : isSelected ? "#f87171" : "#b0d0e2",
                    color: selected === null ? "#1a3d52" : isCorrect ? "#166534" : isSelected ? "#b91c1c" : "#9ab3bf",
                    opacity: selected !== null && !isCorrect && !isSelected ? 0.5 : 1, fontSize: "0.85rem",
                  }}>
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selected !== null && isCorrect && <Check size={14} style={{ color: "#22c55e" }} />}
                    {isSelected && !isCorrect && <X size={14} style={{ color: "#dc2626" }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Flashcard Game ─────────────────────────────────────────────────────────────
function FlashcardGame({ onBack, onEarnCoins, cards, setName }: {
  onBack: () => void; onEarnCoins: (amount: number, reason: string) => void; cards: FlashCard[]; setName: string;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));
  const [done, setDone] = useState(false);
  const [coinsAwarded, setCoinsAwarded] = useState(false);

  const card = cards[index];
  const progress = (seen.size / cards.length) * 100;
  const goTo = (newIndex: number) => { setIndex(newIndex); setFlipped(false); setSeen(prev => { const next = new Set(prev); next.add(newIndex); return next; }); };
  const handleDone = () => { if (!coinsAwarded) { onEarnCoins(60, "Flashcard deck complete!"); setCoinsAwarded(true); } setDone(true); };

  if (done) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">🃏</div>
      <p className="vt" style={{ fontSize: "1.8rem", color: "#1a3d52" }}>DECK COMPLETE!</p>
      <p className="mt-2" style={{ color: "#5a7d8a" }}>You reviewed all {cards.length} cards · {setName}</p>
      <div className="vt mt-4" style={{ fontSize: "1.4rem", color: "#d97706" }}>🪙 +60</div>
      <div className="flex gap-3 mt-8 w-full max-w-xs">
        <button onClick={onBack} className="retro-btn flex-1 py-2.5">BACK</button>
        <button onClick={() => { setIndex(0); setFlipped(false); setSeen(new Set([0])); setDone(false); setCoinsAwarded(false); }} className="retro-btn retro-btn-primary flex-1 py-2.5">AGAIN</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-3 items-center">
      <div className="flex items-center justify-between w-full mb-2">
        <button onClick={onBack} className="retro-btn w-9 h-9 flex items-center justify-center p-0"><X size={16} style={{ color: "#5a7d8a" }} /></button>
        <div className="text-center">
          <p className="mono-label" style={{ fontSize: "0.65rem" }}>{setName}</p>
          <span className="mono-label" style={{ fontSize: "0.65rem" }}>{index + 1} / {cards.length}</span>
        </div>
        <div className="vt" style={{ fontSize: "1rem", color: "#d97706" }}>🪙 +60</div>
      </div>
      <div className="w-full h-2 rounded overflow-hidden border mb-3" style={{ background: "#ddeef6", borderColor: "#7ab2c8" }}>
        <div className="h-full transition-all" style={{ width: `${progress}%`, background: "#5b9aba" }} />
      </div>
      <p className="mono-label mb-3" style={{ fontSize: "0.65rem" }}>TAP CARD TO FLIP</p>
      <div className="w-full max-w-sm" style={{ perspective: 800 }} onClick={() => setFlipped(f => !f)}>
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.5 }} style={{ transformStyle: "preserve-3d", position: "relative", height: 220 }}>
          <div className="absolute inset-0 rounded flex items-center justify-center p-6 text-center border-2 cursor-pointer"
            style={{ backfaceVisibility: "hidden", background: "#fff", borderColor: "#5b9aba", boxShadow: "3px 3px 0 #7ab2c8" }}>
            <p className="font-semibold" style={{ fontSize: "1.05rem", color: "#1a3d52" }}>{card.front}</p>
          </div>
          <div className="absolute inset-0 rounded flex items-center justify-center p-6 text-center border-2 cursor-pointer"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#5b9aba", borderColor: "#3d7a98", boxShadow: "3px 3px 0 #3d7a98" }}>
            <p className="font-semibold text-base" style={{ color: "#fff" }}>{card.back}</p>
          </div>
        </motion.div>
      </div>
      <div className="flex gap-3 mt-4 w-full max-w-sm">
        <button onClick={() => goTo(index - 1)} disabled={index === 0} className="retro-btn flex-1 py-2.5 disabled:opacity-40">← PREV</button>
        {index === cards.length - 1
          ? <button onClick={handleDone} className="retro-btn flex-1 py-2.5" style={{ background: "#4ade80", color: "#fff", borderColor: "#22c55e" }}>DONE <Check size={14} className="inline ml-1" /></button>
          : <button onClick={() => goTo(index + 1)} className="retro-btn retro-btn-primary flex-1 py-2.5">NEXT →</button>
        }
      </div>
    </div>
  );
}

// ─── Memory Match Game ─────────────────────────────────────────────────────────
interface MemTile { id: number; pairId: number; label: string; type: "term" | "def"; matched: boolean; flipped: boolean; }
function MemoryMatchGame({ onBack, onEarnCoins, cards, setName }: {
  onBack: () => void; onEarnCoins: (amount: number, reason: string) => void; cards: FlashCard[]; setName: string;
}) {
  const pairs = cards.slice(0, 6);
  const makeTiles = (): MemTile[] => {
    const raw: MemTile[] = pairs.flatMap((c, i) => [
      { id: i * 2,     pairId: i, label: c.front, type: "term", matched: false, flipped: false },
      { id: i * 2 + 1, pairId: i, label: c.back,  type: "def",  matched: false, flipped: false },
    ]);
    return raw.sort(() => Math.random() - 0.5);
  };
  const [tiles, setTiles] = useState<MemTile[]>(makeTiles);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [done, setDone] = useState(false);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  const handleTile = (id: number) => {
    if (locked || flippedIds.length >= 2) return;
    const tile = tiles.find(t => t.id === id);
    if (!tile || tile.matched || tile.flipped) return;
    const newFlipped = [...flippedIds, id];
    setTiles(prev => prev.map(t => t.id === id ? { ...t, flipped: true } : t));
    setFlippedIds(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped.map(fid => tiles.find(t => t.id === fid)!);
      if (a.pairId === b.pairId) {
        setTiles(prev => prev.map(t => newFlipped.includes(t.id) ? { ...t, matched: true } : t));
        setMatches(m => m + 1);
        setFlippedIds([]);
        setLocked(false);
        if (matches + 1 === pairs.length) { const reward = Math.max(50, 200 - moves * 5); onEarnCoins(reward, "Memory Match complete!"); setDone(true); }
      } else {
        setTimeout(() => {
          setTiles(prev => prev.map(t => newFlipped.includes(t.id) ? { ...t, flipped: false } : t));
          setFlippedIds([]);
          setLocked(false);
        }, 1000);
      }
    }
  };

  const reset = () => { setTiles(makeTiles()); setFlippedIds([]); setMatches(0); setDone(false); setLocked(false); setMoves(0); };

  if (done) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">🧠</div>
      <p className="vt" style={{ fontSize: "1.8rem", color: "#1a3d52" }}>ALL MATCHED!</p>
      <p className="mt-2" style={{ color: "#5a7d8a" }}>{moves} moves · {setName}</p>
      <div className="vt mt-4" style={{ fontSize: "1.4rem", color: "#d97706" }}>🪙 +{Math.max(50, 200 - moves * 5)}</div>
      <div className="flex gap-3 mt-8 w-full max-w-xs">
        <button onClick={onBack} className="retro-btn flex-1 py-2.5">BACK</button>
        <button onClick={reset} className="retro-btn retro-btn-primary flex-1 py-2.5">PLAY AGAIN</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-3">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onBack} className="retro-btn w-9 h-9 flex items-center justify-center p-0"><X size={16} style={{ color: "#5a7d8a" }} /></button>
        <div className="flex-1">
          <p className="mono-label" style={{ fontSize: "0.65rem" }}>{setName} · MEMORY MATCH</p>
          <div className="h-2 rounded overflow-hidden border mt-1" style={{ background: "#ddeef6", borderColor: "#7ab2c8" }}>
            <div className="h-full transition-all" style={{ width: `${(matches / pairs.length) * 100}%`, background: "#059669" }} />
          </div>
        </div>
        <span className="mono-label" style={{ fontSize: "0.65rem" }}>{matches}/{pairs.length}</span>
      </div>
      <p className="mono-label mb-2 text-center" style={{ fontSize: "0.62rem" }}>MATCH TERM WITH DEFINITION · {moves} MOVES</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {tiles.map(tile => (
          <motion.button key={tile.id} onClick={() => handleTile(tile.id)} whileTap={{ scale: 0.95 }}
            style={{
              minHeight: 72, borderRadius: 6, border: `2px solid ${tile.matched ? "#22c55e" : tile.flipped ? "#5b9aba" : "#b0d0e2"}`,
              background: tile.matched ? "#d1fae5" : tile.flipped ? (tile.type === "term" ? "#ddeef6" : "#ede9fe") : "#f0f8fc",
              cursor: tile.matched ? "default" : "pointer", padding: "6px",
              boxShadow: tile.matched ? "2px 2px 0 #22c55e" : tile.flipped ? "2px 2px 0 #5b9aba" : "2px 2px 0 #b0d0e2",
              display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
            }}>
            {tile.flipped || tile.matched ? (
              <span style={{ fontSize: "0.65rem", color: tile.matched ? "#166534" : tile.type === "term" ? "#1a3d52" : "#4c1d95", lineHeight: 1.3, fontFamily: "'VT323', monospace" }}>
                {tile.label.length > 50 ? tile.label.slice(0, 50) + "…" : tile.label}
              </span>
            ) : (
              <span style={{ fontSize: "1.2rem" }}>?</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Fill the Blank ────────────────────────────────────────────────────────────
function blankify(text: string): { display: string; answer: string } {
  const words = text.replace(/[^a-zA-Z0-9 ]/g, " ").split(" ").filter(w => w.length > 4);
  if (!words.length) return { display: text + " ___", answer: text.split(" ").pop() || text };
  const word = words[Math.floor(Math.random() * words.length)];
  const re = new RegExp(`\\b${word}\\b`, "i");
  const match = text.match(re);
  if (!match) return { display: text + " ___", answer: word };
  return { display: text.replace(re, "_____"), answer: match[0] };
}

function FillBlankGame({ onBack, onEarnCoins, onTrackQuizAnswer, cards, setName }: {
  onBack: () => void; onEarnCoins: (amount: number, reason: string) => void; onTrackQuizAnswer?: () => void; cards: FlashCard[]; setName: string;
}) {
  const questions = cards.map(c => {
    const { display, answer } = blankify(c.back);
    const distractors = cards.filter(d => d !== c).map(d => d.back.split(" ").filter(w => w.length > 4)[0] || "—").filter(Boolean).slice(0, 3);
    while (distractors.length < 3) distractors.push("—");
    const opts = [answer, ...distractors].sort(() => Math.random() - 0.5);
    return { prompt: c.front, display, opts, answer };
  }).slice(0, 8);

  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[qi];
  const handlePick = (opt: string) => {
    if (selected !== null) return;
    setSelected(opt);
    onTrackQuizAnswer?.();
    const correct = opt.toLowerCase() === q.answer.toLowerCase();
    if (correct) { setScore(s => s + 1); setCoins(c => c + 12); onEarnCoins(12, "Correct blank!"); }
    setTimeout(() => {
      if (qi + 1 >= questions.length) setDone(true);
      else { setQi(i => i + 1); setSelected(null); }
    }, 1100);
  };

  if (done) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">✍️</div>
      <p className="vt" style={{ fontSize: "1.8rem", color: "#1a3d52" }}>COMPLETE!</p>
      <p className="mt-2" style={{ color: "#5a7d8a" }}>{score}/{questions.length} correct · {setName}</p>
      <div className="vt mt-4" style={{ fontSize: "1.4rem", color: "#d97706" }}>🪙 +{coins}</div>
      <div className="flex gap-3 mt-8 w-full max-w-xs">
        <button onClick={onBack} className="retro-btn flex-1 py-2.5">BACK</button>
        <button onClick={() => { setQi(0); setSelected(null); setScore(0); setCoins(0); setDone(false); }} className="retro-btn retro-btn-primary flex-1 py-2.5">AGAIN</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-3">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onBack} className="retro-btn w-9 h-9 flex items-center justify-center p-0"><X size={16} style={{ color: "#5a7d8a" }} /></button>
        <div className="flex-1">
          <p className="mono-label" style={{ fontSize: "0.65rem" }}>{setName} · FILL THE BLANK</p>
          <div className="h-2 rounded overflow-hidden border mt-1" style={{ background: "#ddeef6", borderColor: "#7ab2c8" }}>
            <div className="h-full transition-all" style={{ width: `${(qi / questions.length) * 100}%`, background: "#d97706" }} />
          </div>
        </div>
        <span className="mono-label" style={{ fontSize: "0.65rem" }}>{qi + 1}/{questions.length}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={qi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col gap-3">
          <div className="os-window">
            <div className="os-titlebar py-1"><span className="os-titlebar-title" style={{ fontSize: "0.7rem" }}>CONTEXT</span></div>
            <div className="p-3" style={{ background: "#fff" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#5a7d8a" }}>{q.prompt}</p>
              <p style={{ fontSize: "0.95rem", color: "#1a3d52", lineHeight: 1.5, fontFamily: "'VT323', monospace" }}>{q.display}</p>
            </div>
          </div>
          <p className="mono-label" style={{ fontSize: "0.62rem" }}>FILL IN THE BLANK:</p>
          <div className="grid grid-cols-2 gap-2">
            {q.opts.map(opt => {
              const isCorrect = opt.toLowerCase() === q.answer.toLowerCase();
              const isSelected = opt === selected;
              return (
                <button key={opt} onClick={() => handlePick(opt)} disabled={selected !== null}
                  className="retro-btn py-3 px-2 text-center"
                  style={{
                    background: selected === null ? "#fff" : isCorrect ? "#d1fae5" : isSelected ? "#ffeaea" : "#fff",
                    borderColor: selected === null ? "#7ab2c8" : isCorrect ? "#22c55e" : isSelected ? "#f87171" : "#b0d0e2",
                    color: "#1a3d52", fontSize: "0.8rem",
                    opacity: selected !== null && !isCorrect && !isSelected ? 0.5 : 1,
                  }}>
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Falling Terms ─────────────────────────────────────────────────────────────
function FallingTermsGame({ onBack, onEarnCoins, onTrackQuizAnswer, cards, setName }: {
  onBack: () => void; onEarnCoins: (amount: number, reason: string) => void; onTrackQuizAnswer?: () => void; cards: FlashCard[]; setName: string;
}) {
  const TIME_PER_Q = 8;
  const questions = cards.map(c => {
    const opts = [c.front, ...cards.filter(d => d !== c).map(d => d.front).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
    return { definition: c.back, answer: c.front, opts };
  }).slice(0, 8);

  const [qi, setQi] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[qi];

  useEffect(() => {
    if (selected !== null) return;
    if (timeLeft <= 0) { setSelected("TIMEOUT"); setTimeout(advance, 800); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, selected]);

  const advance = useCallback(() => {
    if (qi + 1 >= questions.length) setDone(true);
    else { setQi(i => i + 1); setSelected(null); setTimeLeft(TIME_PER_Q); }
  }, [qi, questions.length]);

  const handlePick = (opt: string) => {
    if (selected !== null) return;
    setSelected(opt);
    onTrackQuizAnswer?.();
    const correct = opt === q.answer;
    if (correct) {
      const bonus = Math.ceil((timeLeft / TIME_PER_Q) * 10);
      setScore(s => s + 1); setCoins(c => c + 10 + bonus); onEarnCoins(10 + bonus, `Fast answer! +${10 + bonus}`);
    }
    setTimeout(advance, 900);
  };

  const pct = (timeLeft / TIME_PER_Q) * 100;
  const timerColor = pct > 60 ? "#059669" : pct > 30 ? "#d97706" : "#dc2626";

  if (done) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">⚡</div>
      <p className="vt" style={{ fontSize: "1.8rem", color: "#1a3d52" }}>ROUND OVER!</p>
      <p className="mt-2" style={{ color: "#5a7d8a" }}>{score}/{questions.length} caught · {setName}</p>
      <div className="vt mt-4" style={{ fontSize: "1.4rem", color: "#d97706" }}>🪙 +{coins}</div>
      <div className="flex gap-3 mt-8 w-full max-w-xs">
        <button onClick={onBack} className="retro-btn flex-1 py-2.5">BACK</button>
        <button onClick={() => { setQi(0); setSelected(null); setScore(0); setCoins(0); setDone(false); setTimeLeft(TIME_PER_Q); }} className="retro-btn retro-btn-primary flex-1 py-2.5">AGAIN</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-3">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onBack} className="retro-btn w-9 h-9 flex items-center justify-center p-0"><X size={16} style={{ color: "#5a7d8a" }} /></button>
        <div className="flex-1">
          <p className="mono-label" style={{ fontSize: "0.65rem" }}>{setName} · FALLING TERMS</p>
          <div className="h-2 rounded overflow-hidden border mt-1" style={{ background: "#ddeef6", borderColor: "#7ab2c8" }}>
            <div className="h-full transition-all" style={{ width: `${(qi / questions.length) * 100}%`, background: "#db2777" }} />
          </div>
        </div>
        <span className="mono-label" style={{ fontSize: "0.65rem" }}>{qi + 1}/{questions.length}</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Timer size={14} style={{ color: timerColor }} />
        <div className="flex-1 h-3 rounded overflow-hidden border" style={{ background: "#f0f8fc", borderColor: "#b0d0e2" }}>
          <div className="h-full transition-all" style={{ width: `${pct}%`, background: timerColor }} />
        </div>
        <span className="vt" style={{ fontSize: "1rem", color: timerColor }}>{timeLeft}s</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qi} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col gap-4">
          <div className="os-window">
            <div className="os-titlebar py-1">
              <div className="os-btn-red" /><div className="os-btn-yellow" />
              <span className="os-titlebar-title" style={{ fontSize: "0.7rem" }}>DEFINITION</span>
            </div>
            <div className="p-4 text-center" style={{ background: "#fff8f0" }}>
              <p style={{ fontSize: "0.95rem", color: "#1a3d52", lineHeight: 1.4 }}>{q.definition}</p>
            </div>
          </div>
          <p className="mono-label text-center" style={{ fontSize: "0.62rem" }}>PICK THE MATCHING TERM — FAST!</p>
          <div className="grid grid-cols-2 gap-2">
            {q.opts.map(opt => {
              const isCorrect = opt === q.answer;
              const isSelected = opt === selected;
              return (
                <button key={opt} onClick={() => handlePick(opt)} disabled={selected !== null}
                  className="retro-btn py-3 px-2 text-center"
                  style={{
                    background: selected === null ? "#fff" : isCorrect ? "#d1fae5" : isSelected ? "#ffeaea" : "#fff",
                    borderColor: selected === null ? "#7ab2c8" : isCorrect ? "#22c55e" : isSelected ? "#f87171" : "#b0d0e2",
                    color: "#1a3d52", fontSize: "0.78rem",
                    opacity: selected !== null && !isCorrect && !isSelected ? 0.5 : 1,
                  }}>
                  {opt.length > 40 ? opt.slice(0, 40) + "…" : opt}
                </button>
              );
            })}
          </div>
          {selected === "TIMEOUT" && <p className="text-center vt" style={{ color: "#dc2626", fontSize: "1rem" }}>TIME'S UP!</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Boss Battle Exam ──────────────────────────────────────────────────────────
const BOSSES = [
  { name: "Port Mafia Boss", avatar: "🎩", color: "#7f1d1d", hp: 300 },
  { name: "Guild Commander", avatar: "💎", color: "#1e3a8a", hp: 350 },
  { name: "Fyodor Dostoevsky", avatar: "☦️", color: "#3b0764", hp: 400 },
];
function BossBattleGame({ onBack, onEarnCoins, onTrackQuizAnswer, cards, setName }: {
  onBack: () => void; onEarnCoins: (amount: number, reason: string) => void; onTrackQuizAnswer?: () => void; cards: FlashCard[]; setName: string;
}) {
  const boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
  const questions = cards.map(c => {
    const opts = [c.back, ...cards.filter(d => d !== c).map(d => d.back).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
    return { question: c.front, opts, answer: c.back };
  }).sort(() => Math.random() - 0.5);

  const PLAYER_MAX_HP = 200;
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [bossHp, setBossHp] = useState(boss.hp);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>(["The battle begins..."]);
  const [outcome, setOutcome] = useState<"win" | "lose" | null>(null);
  const [totalCoins, setTotalCoins] = useState(0);

  const q = questions[qi % questions.length];
  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  const handlePick = (opt: string) => {
    if (selected !== null || outcome) return;
    setSelected(opt);
    onTrackQuizAnswer?.();
    const correct = opt === q.answer;
    if (correct) {
      const dmg = 40 + Math.floor(Math.random() * 30);
      const newBossHp = Math.max(0, bossHp - dmg);
      setBossHp(newBossHp);
      const earned = 20; setTotalCoins(c => c + earned); onEarnCoins(earned, `Hit for ${dmg}!`);
      addLog(`Correct! You deal ${dmg} damage.`);
      if (newBossHp <= 0) { setOutcome("win"); return; }
    } else {
      const dmg = 30 + Math.floor(Math.random() * 20);
      const newPlayerHp = Math.max(0, playerHp - dmg);
      setPlayerHp(newPlayerHp);
      addLog(`Wrong! ${boss.name} hits you for ${dmg}.`);
      if (newPlayerHp <= 0) { setOutcome("lose"); return; }
    }
    setTimeout(() => { setQi(i => i + 1); setSelected(null); }, 1100);
  };

  if (outcome) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">{outcome === "win" ? "🏆" : "💀"}</div>
      <p className="vt" style={{ fontSize: "1.8rem", color: outcome === "win" ? "#059669" : "#dc2626" }}>{outcome === "win" ? "VICTORY!" : "DEFEATED"}</p>
      <p className="mt-2" style={{ color: "#5a7d8a" }}>{outcome === "win" ? `${boss.name} defeated!` : `${boss.name} prevails...`}</p>
      {outcome === "win" && <div className="vt mt-4" style={{ fontSize: "1.4rem", color: "#d97706" }}>🪙 +{totalCoins + 100}</div>}
      <div className="flex gap-3 mt-8 w-full max-w-xs">
        <button onClick={onBack} className="retro-btn flex-1 py-2.5">BACK</button>
        {outcome === "lose" && <button onClick={() => { setPlayerHp(PLAYER_MAX_HP); setBossHp(boss.hp); setQi(0); setSelected(null); setLog(["The battle begins..."]); setOutcome(null); setTotalCoins(0); }} className="retro-btn retro-btn-primary flex-1 py-2.5">RETRY</button>}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-3 gap-3">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="retro-btn w-9 h-9 flex items-center justify-center p-0"><X size={16} style={{ color: "#5a7d8a" }} /></button>
        <p className="mono-label flex-1" style={{ fontSize: "0.65rem" }}>{setName} · BOSS BATTLE</p>
      </div>
      <div style={{ background: "#1a0a0a", border: "3px solid #dc2626", borderRadius: 8, padding: "10px 14px" }}>
        <div className="flex items-center gap-3 mb-2">
          <span style={{ fontSize: "2rem" }}>{boss.avatar}</span>
          <div className="flex-1">
            <p className="vt" style={{ fontSize: "0.9rem", color: "#fca5a5" }}>{boss.name}</p>
            <div className="h-3 rounded overflow-hidden border mt-1" style={{ background: "#3f0000", borderColor: "#dc2626" }}>
              <div className="h-full transition-all" style={{ width: `${(bossHp / boss.hp) * 100}%`, background: "#dc2626" }} />
            </div>
            <p className="vt" style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 2 }}>{bossHp}/{boss.hp} HP</p>
          </div>
        </div>
        <div style={{ background: "#2d0000", borderRadius: 4, padding: "6px 8px", maxHeight: 70, overflowY: "auto" }}>
          {log.map((l, i) => <p key={i} className="vt" style={{ fontSize: "0.75rem", color: i === 0 ? "#fca5a5" : "#7f2020" }}>{l}</p>)}
        </div>
      </div>
      <div style={{ background: "#ddeef6", border: "2px solid #5b9aba", borderRadius: 6, padding: "6px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "1.2rem" }}>🧑‍🎓</span>
        <div className="flex-1">
          <p className="vt" style={{ fontSize: "0.75rem", color: "#1a3d52" }}>You</p>
          <div className="h-2 rounded overflow-hidden border" style={{ background: "#b0d0e2", borderColor: "#5b9aba" }}>
            <div className="h-full transition-all" style={{ width: `${(playerHp / PLAYER_MAX_HP) * 100}%`, background: "#5b9aba" }} />
          </div>
          <p className="vt" style={{ fontSize: "0.65rem", color: "#5a7d8a" }}>{playerHp}/{PLAYER_MAX_HP} HP</p>
        </div>
      </div>
      <div className="os-window">
        <div className="os-titlebar py-1"><span className="os-titlebar-title" style={{ fontSize: "0.7rem" }}>BATTLE QUESTION</span></div>
        <div className="p-3" style={{ background: "#fff" }}>
          <p style={{ fontSize: "0.9rem", color: "#1a3d52" }}>{q.question}</p>
        </div>
      </div>
      <div className="space-y-2">
        {q.opts.map(opt => {
          const isCorrect = opt === q.answer;
          const isSelected = opt === selected;
          return (
            <button key={opt} onClick={() => handlePick(opt)} disabled={selected !== null}
              className="retro-btn w-full text-left py-2 px-3"
              style={{
                background: selected === null ? "#fff" : isCorrect ? "#d1fae5" : isSelected ? "#ffeaea" : "#fff",
                borderColor: selected === null ? "#7ab2c8" : isCorrect ? "#22c55e" : isSelected ? "#f87171" : "#b0d0e2",
                color: "#1a3d52", fontSize: "0.8rem",
                opacity: selected !== null && !isCorrect && !isSelected ? 0.45 : 1,
              }}>
              {opt.length > 60 ? opt.slice(0, 60) + "…" : opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Spaced Repetition ─────────────────────────────────────────────────────────
function SpacedRepGame({ onBack, onEarnCoins, cards, setName }: {
  onBack: () => void; onEarnCoins: (amount: number, reason: string) => void; cards: FlashCard[]; setName: string;
}) {
  const [queue, setQueue] = useState<FlashCard[]>([...cards].sort(() => Math.random() - 0.5));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState(0);
  const [done, setDone] = useState(false);
  const [totalCards, setTotalCards] = useState(cards.length);

  const card = queue[index];

  const rate = (easy: boolean) => {
    const reward = easy ? 8 : 3;
    onEarnCoins(reward, easy ? "Mastered!" : "Keep reviewing…");
    if (easy) {
      setMastered(m => m + 1);
    } else {
      setQueue(prev => {
        const next = [...prev];
        const [removed] = next.splice(index, 1);
        const insertAt = Math.min(index + 3, next.length);
        next.splice(insertAt, 0, removed);
        setTotalCards(next.length);
        return next;
      });
    }
    setFlipped(false);
    const nextIndex = index + 1;
    if (easy && nextIndex >= queue.filter((_, i) => i !== index).length + mastered + 1) {
      setDone(true);
    } else if (easy && nextIndex >= queue.length) {
      setDone(true);
    } else {
      if (easy) setIndex(i => i + 1);
    }
  };

  const handleEasy = () => rate(true);
  const handleHard = () => {
    rate(false);
  };

  useEffect(() => {
    if (index >= queue.length && queue.length > 0) setDone(true);
  }, [index, queue.length]);

  if (done || queue.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">🧩</div>
      <p className="vt" style={{ fontSize: "1.8rem", color: "#1a3d52" }}>SESSION DONE!</p>
      <p className="mt-2" style={{ color: "#5a7d8a" }}>{mastered} cards mastered · {setName}</p>
      <div className="vt mt-4" style={{ fontSize: "1.4rem", color: "#d97706" }}>🪙 +{mastered * 8}</div>
      <div className="flex gap-3 mt-8 w-full max-w-xs">
        <button onClick={onBack} className="retro-btn flex-1 py-2.5">BACK</button>
        <button onClick={() => { setQueue([...cards].sort(() => Math.random() - 0.5)); setIndex(0); setFlipped(false); setMastered(0); setDone(false); setTotalCards(cards.length); }} className="retro-btn retro-btn-primary flex-1 py-2.5">AGAIN</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-3">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onBack} className="retro-btn w-9 h-9 flex items-center justify-center p-0"><X size={16} style={{ color: "#5a7d8a" }} /></button>
        <div className="flex-1">
          <p className="mono-label" style={{ fontSize: "0.65rem" }}>{setName} · SPACED REPETITION</p>
          <div className="h-2 rounded overflow-hidden border mt-1" style={{ background: "#ddeef6", borderColor: "#7ab2c8" }}>
            <div className="h-full transition-all" style={{ width: `${(mastered / (mastered + (queue.length - index))) * 100}%`, background: "#0891b2" }} />
          </div>
        </div>
        <span className="mono-label" style={{ fontSize: "0.65rem" }}>{mastered} mastered</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="mono-label" style={{ fontSize: "0.6rem" }}>Rate each card after seeing the answer</span>
        <span className="mono-label" style={{ fontSize: "0.6rem" }}>🃏 {queue.length - index} left</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm" style={{ perspective: 800 }} onClick={() => !flipped && setFlipped(true)}>
          <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.45 }} style={{ transformStyle: "preserve-3d", position: "relative", height: 200 }}>
            <div className="absolute inset-0 rounded flex flex-col items-center justify-center p-6 text-center border-2 cursor-pointer"
              style={{ backfaceVisibility: "hidden", background: "#fff", borderColor: "#0891b2", boxShadow: "3px 3px 0 #0e7490" }}>
              <p style={{ fontSize: "0.65rem", color: "#5a7d8a", fontFamily: "'VT323', monospace", letterSpacing: "0.08em", marginBottom: 8 }}>TAP TO REVEAL</p>
              <p className="font-semibold" style={{ fontSize: "1.05rem", color: "#1a3d52" }}>{card?.front}</p>
            </div>
            <div className="absolute inset-0 rounded flex flex-col items-center justify-center p-6 text-center border-2"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#0891b2", borderColor: "#0e7490", boxShadow: "3px 3px 0 #0e7490" }}>
              <p className="font-semibold" style={{ color: "#fff", fontSize: "0.95rem" }}>{card?.back}</p>
            </div>
          </motion.div>
        </div>
        {flipped && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mt-6 w-full max-w-xs">
            <button onClick={handleHard} className="retro-btn flex-1 py-3"
              style={{ background: "#fef3c7", borderColor: "#fbbf24", color: "#92400e" }}>
              <p className="vt" style={{ fontSize: "1rem" }}>HARD</p>
              <p style={{ fontSize: "0.65rem", color: "#b45309" }}>show again +3🪙</p>
            </button>
            <button onClick={handleEasy} className="retro-btn flex-1 py-3"
              style={{ background: "#d1fae5", borderColor: "#22c55e", color: "#166534" }}>
              <p className="vt" style={{ fontSize: "1rem" }}>EASY</p>
              <p style={{ fontSize: "0.65rem", color: "#15803d" }}>mastered! +8🪙</p>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Study Set Picker ──────────────────────────────────────────────────────────
function StudySetPicker({ gameId, onCancel, onSelect }: {
  gameId: string; onCancel: () => void; onSelect: (set: StudySetData) => void;
}) {
  const [selected, setSelected] = useState<string>("bsd");
  const game = GAMES.find(g => g.id === gameId)!;

  return (
    <div className="h-full flex flex-col">
      <div className="os-window mx-3 mt-3 mb-3">
        <div className="os-titlebar">
          <div className="os-btn-red" onClick={onCancel} style={{ cursor: "pointer" }} />
          <div className="os-btn-yellow" /><div className="os-btn-green" />
          <span className="os-titlebar-title">{game.name.toUpperCase()}</span>
        </div>
        <div style={{ background: "#ddeef6", padding: "8px 12px" }}>
          <button onClick={onCancel} className="flex items-center gap-1 text-xs mb-2" style={{ color: "#5a7d8a" }}>
            <ChevronLeft size={13} /> BACK
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded flex items-center justify-center border-2" style={{ background: "#fff", borderColor: "#7ab2c8" }}>
              <game.Icon size={18} style={{ color: "#5b9aba" }} />
            </div>
            <div>
              <p className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>{game.name}</p>
              <p className="text-xs" style={{ color: "#5a7d8a" }}>{game.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <p className="mono-label mb-2" style={{ fontSize: "0.65rem" }}>CHOOSE WHAT TO STUDY</p>
        <div className="space-y-2">
          {STUDY_CONTENT.map(set => (
            <motion.button key={set.id} onClick={() => setSelected(set.id)} whileTap={{ scale: 0.98 }}
              className="retro-btn w-full flex items-center gap-3 p-3 text-left"
              style={selected === set.id ? { background: "#ddeef6", borderColor: "#5b9aba" } : {}}>
              <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 border-2" style={{ borderColor: "#7ab2c8", background: "#f0f8fc" }}>
                <set.Icon size={16} style={{ color: "#5b9aba" }} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: "#1a3d52" }}>{set.name}</p>
                <p className="text-xs" style={{ color: "#5a7d8a" }}>{set.cards.length} cards · {set.subject}</p>
              </div>
              {selected === set.id && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#5b9aba" }}>
                  <Check size={12} color="#fff" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="p-3 flex gap-3" style={{ borderTop: "2px solid #b0d0e2" }}>
        <button onClick={onCancel} className="retro-btn flex-1 py-2.5">CANCEL</button>
        <button onClick={() => { const s = STUDY_CONTENT.find(s => s.id === selected); if (s) onSelect(s); }} className="retro-btn retro-btn-primary flex-1 py-2.5">
          <span className="vt" style={{ fontSize: "1rem" }}>START ▶</span>
        </button>
      </div>
    </div>
  );
}

// ─── GAMES list ────────────────────────────────────────────────────────────────
const GAMES = [
  { id: "quiz",      name: "Quiz Battle",       description: "Answer Qs, earn coins",    Icon: HelpCircle, color: "#5b9aba", available: true, tag: "KNOWLEDGE", badge: "HOT"  },
  { id: "flashcard", name: "Flashcard Flip",     description: "Flip & memorize",          Icon: Layers,     color: "#7c3aed", available: true, tag: "MEMORY",    badge: null   },
  { id: "memory",    name: "Memory Match",       description: "Find matching pairs",      Icon: Brain,      color: "#059669", available: true, tag: "BRAIN",     badge: "NEW"  },
  { id: "fillblank", name: "Fill the Blank",     description: "Complete the sentence",    Icon: PenLine,    color: "#d97706", available: true, tag: "WRITING",   badge: "NEW"  },
  { id: "falling",   name: "Falling Terms",      description: "Race the clock!",          Icon: MoveDown,   color: "#db2777", available: true, tag: "REFLEX",    badge: "NEW"  },
  { id: "boss",      name: "Boss Battle Exam",   description: "Fight with knowledge",     Icon: Skull,      color: "#dc2626", available: true, tag: "EPIC",      badge: "NEW"  },
  { id: "spaced",    name: "Spaced Repetition",  description: "Smart review scheduling",  Icon: RefreshCw,  color: "#0891b2", available: true, tag: "SMART",     badge: "NEW"  },
];

// ─── Main Hub ──────────────────────────────────────────────────────────────────
interface Props { onEarnCoins: (amount: number, reason: string) => void; onTrackQuizAnswer?: () => void; }
type ActiveGame = { game: string; cards: FlashCard[]; questions: QuizQuestion[]; name: string } | null;

export function GamesHub({ onEarnCoins, onTrackQuizAnswer }: Props) {
  const [pendingGame, setPendingGame] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  const handleSelectSet = (gameId: string, set: StudySetData) => {
    setActiveGame({ game: gameId, cards: set.cards, questions: gameId === "quiz" ? makeQuizFromCards(set.cards) : [], name: set.name });
    setPendingGame(null);
  };

  const backToHub = () => setActiveGame(null);

  if (activeGame?.game === "quiz") {
    const questions = activeGame.questions.length > 0 ? activeGame.questions : QUIZ_QUESTIONS;
    return <div className="h-full flex flex-col"><QuizGame onEarnCoins={onEarnCoins} onBack={backToHub} onTrackQuizAnswer={onTrackQuizAnswer} questions={questions} setName={activeGame.name} /></div>;
  }
  if (activeGame?.game === "flashcard") {
    return <div className="h-full flex flex-col"><FlashcardGame onBack={backToHub} onEarnCoins={onEarnCoins} cards={activeGame.cards} setName={activeGame.name} /></div>;
  }
  if (activeGame?.game === "memory") {
    return <div className="h-full flex flex-col"><MemoryMatchGame onBack={backToHub} onEarnCoins={onEarnCoins} cards={activeGame.cards} setName={activeGame.name} /></div>;
  }
  if (activeGame?.game === "fillblank") {
    return <div className="h-full flex flex-col"><FillBlankGame onBack={backToHub} onEarnCoins={onEarnCoins} onTrackQuizAnswer={onTrackQuizAnswer} cards={activeGame.cards} setName={activeGame.name} /></div>;
  }
  if (activeGame?.game === "falling") {
    return <div className="h-full flex flex-col"><FallingTermsGame onBack={backToHub} onEarnCoins={onEarnCoins} onTrackQuizAnswer={onTrackQuizAnswer} cards={activeGame.cards} setName={activeGame.name} /></div>;
  }
  if (activeGame?.game === "boss") {
    return <div className="h-full flex flex-col"><BossBattleGame onBack={backToHub} onEarnCoins={onEarnCoins} onTrackQuizAnswer={onTrackQuizAnswer} cards={activeGame.cards} setName={activeGame.name} /></div>;
  }
  if (activeGame?.game === "spaced") {
    return <div className="h-full flex flex-col"><SpacedRepGame onBack={backToHub} onEarnCoins={onEarnCoins} cards={activeGame.cards} setName={activeGame.name} /></div>;
  }
  if (pendingGame) {
    return <div className="h-full flex flex-col"><StudySetPicker gameId={pendingGame} onCancel={() => setPendingGame(null)} onSelect={(set) => handleSelectSet(pendingGame, set)} /></div>;
  }

  const GAME_PALETTES = [
    { bg: "#dbeafe", border: "#3b82f6", shadow: "#1d4ed8", text: "#1e3a8a" },
    { bg: "#ede9fe", border: "#7c3aed", shadow: "#5b21b6", text: "#3b0764" },
    { bg: "#d1fae5", border: "#059669", shadow: "#047857", text: "#064e3b" },
    { bg: "#fef3c7", border: "#d97706", shadow: "#b45309", text: "#78350f" },
    { bg: "#fce7f3", border: "#db2777", shadow: "#9d174d", text: "#831843" },
    { bg: "#fee2e2", border: "#dc2626", shadow: "#991b1b", text: "#7f1d1d" },
    { bg: "#cffafe", border: "#0891b2", shadow: "#0e7490", text: "#164e63" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)", borderBottom: "3px solid #10b981", padding: "10px 14px" }}>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem", color: "#d1fae5", letterSpacing: "0.08em", lineHeight: 1 }}>🎮 GAME ROOM 🎮</p>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#6ee7b7", letterSpacing: "0.05em" }}>7 games unlocked — pick a subject, start playing</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {GAMES.map((game, i) => {
            const pal = GAME_PALETTES[i % GAME_PALETTES.length];
            return (
              <motion.button key={game.id} onClick={() => setPendingGame(game.id)}
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97, boxShadow: `2px 2px 0 ${pal.shadow}`, x: 2, y: 2 }}
                style={{
                  background: pal.bg, border: `3px solid ${pal.border}`, borderRadius: 8,
                  padding: "12px 10px", textAlign: "left", cursor: "pointer",
                  boxShadow: `4px 4px 0 ${pal.shadow}`, position: "relative", overflow: "hidden",
                }}>
                {game.badge && (
                  <div style={{
                    position: "absolute", top: 6, right: 6,
                    background: game.badge === "HOT" ? "#dc2626" : game.badge === "NEW" ? "#059669" : "#d97706",
                    color: "white", fontFamily: "'VT323', monospace", fontSize: "0.55rem",
                    letterSpacing: "0.06em", padding: "1px 6px", borderRadius: 10,
                  }}>{game.badge}</div>
                )}
                <game.Icon size={22} style={{ color: pal.border, marginBottom: 8 }} />
                <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: pal.text, letterSpacing: "0.04em", lineHeight: 1, marginBottom: 3 }}>{game.name}</p>
                <p style={{ fontSize: "0.65rem", color: pal.border, marginBottom: 6 }}>{game.description}</p>
                <div style={{ display: "inline-block", background: pal.border, color: "white", fontFamily: "'VT323', monospace", fontSize: "0.6rem", letterSpacing: "0.06em", padding: "1px 7px", borderRadius: 3 }}>
                  {game.tag}
                </div>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: pal.border, marginTop: 8 }}>▶ PLAY NOW</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
