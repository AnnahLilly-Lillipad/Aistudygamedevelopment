import { useState } from "react";
import { X, Check, HelpCircle, Layers, Brain, PenLine, MoveDown, Skull, RefreshCw,
  BookOpen, FlaskConical, Globe, Atom, BookMarked, ChevronLeft, Gamepad2 } from "lucide-react";
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
      { front: "Who is the world's greatest detective in BSD?", back: "Ranpo Edogawa — his 'ability' is actually just genius intellect" },
      { front: "What is Fyodor's ability called?", back: "Crime and Punishment — kills with a single touch" },
      { front: "What is Rashomon?", back: "Akutagawa's black coat ability that attacks and defends" },
      { front: "Who has the ability 'Thou Shalt Not Die'?", back: "Yosano Akiko — heals allies from near-death" },
      { front: "What is the Decay of the Angel?", back: "A secret organization manipulating ability users from the shadows" },
    ],
  },
  {
    id: "calc", name: "Calculus", subject: "Math", Icon: Atom, color: "from-blue-500 to-indigo-600",
    cards: [
      { front: "What is a derivative?", back: "Rate of change of a function. d/dx gives the slope at any point." },
      { front: "What is the chain rule?", back: "d/dx[f(g(x))] = f′(g(x)) · g′(x)" },
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
      { front: "When did WWII end?", back: "1945 — V-E Day (May 8) and V-J Day (September 2)" },
      { front: "What was the French Revolution?", back: "1789–1799 overthrow of the French monarchy, led to Napoleon's rise" },
      { front: "What caused WWI?", back: "Assassination of Archduke Franz Ferdinand (1914) + entangled alliances" },
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
      { front: "What is a covalent bond?", back: "Atoms share electrons. Found in molecules like H₂O and CO₂." },
      { front: "What is pH?", back: "Measure of acidity: 0–6 acidic, 7 neutral, 8–14 basic." },
      { front: "What is Avogadro's number?", back: "6.022 × 10²³ — number of atoms or molecules in one mole." },
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
      { front: "Who wrote 'No Longer Human' (Ningen Shikkaku)?", back: "Osamu Dazai, published in 1948." },
      { front: "What is 'Rashomon' by Akutagawa about?", back: "A servant at the Rashomon gate must choose between starvation or becoming a thief." },
      { front: "What is mono no aware?", back: "'The pathos of things' — Japanese concept of beauty and sadness in impermanence." },
      { front: "Who wrote 'I Am a Cat'?", back: "Natsume Soseki — the story is told from a cat's perspective." },
      { front: "What is wabi-sabi?", back: "Finding beauty in imperfection and transience." },
      { front: "What era is the Heian period famous for?", back: "Classical Japanese art and literature (794–1185), including The Tale of Genji." },
    ],
  },
  {
    id: "physics", name: "Physics", subject: "Science", Icon: Atom, color: "from-violet-500 to-purple-600",
    cards: [
      { front: "What is Newton's First Law?", back: "An object at rest stays at rest unless acted upon by a net force (inertia)." },
      { front: "What is E = mc²?", back: "Energy equals mass times the speed of light squared. (Einstein's mass-energy equivalence)" },
      { front: "What is velocity?", back: "Speed in a given direction. Measured in m/s." },
      { front: "What is the unit of force?", back: "Newton (N). F = ma (force = mass × acceleration)." },
      { front: "What is Ohm's Law?", back: "V = IR — Voltage equals current times resistance." },
      { front: "What is a wave?", back: "A disturbance that transfers energy through a medium without transferring matter." },
      { front: "What is gravity?", back: "The attractive force between masses. On Earth's surface: g ≈ 9.8 m/s²." },
    ],
  },
];

function makeQuizFromCards(cards: FlashCard[]): QuizQuestion[] {
  const shuffled = [...cards].sort(() => Math.random() - 0.5).slice(0, 10);
  return shuffled.map((card) => {
    const others = cards.filter(c => c.back !== card.back).map(c => c.back).sort(() => Math.random() - 0.5).slice(0, 3);
    while (others.length < 3) others.push(`— not "${card.back.slice(0, 20)}..."`);
    const opts = [card.back, ...others].sort(() => Math.random() - 0.5);
    return { question: card.front, options: opts, answer: opts.indexOf(card.back), coins: 15 };
  });
}

const GAMES = [
  { id: "quiz",      name: "Quiz Battle",       description: "Answer Qs, earn coins",    Icon: HelpCircle, color: "#5b9aba", available: true,  tag: "KNOWLEDGE", badge: "HOT" },
  { id: "flashcard", name: "Flashcard Flip",     description: "Flip & memorize",          Icon: Layers,     color: "#7c3aed", available: true,  tag: "MEMORY",    badge: null  },
  { id: "memory",    name: "Memory Match",       description: "Find matching pairs",      Icon: Brain,      color: "#059669", available: false, tag: "BRAIN",     badge: "SOON" },
  { id: "fillblank", name: "Fill the Blank",     description: "Complete the sentence",    Icon: PenLine,    color: "#d97706", available: false, tag: "WRITING",   badge: "SOON" },
  { id: "falling",   name: "Falling Terms",      description: "Catch right answers",      Icon: MoveDown,   color: "#db2777", available: false, tag: "REFLEX",    badge: "SOON" },
  { id: "boss",      name: "Boss Battle Exam",   description: "Fight with knowledge",     Icon: Skull,      color: "#dc2626", available: false, tag: "EPIC",      badge: "SOON" },
  { id: "spaced",    name: "Spaced Repetition",  description: "Smart review scheduling",  Icon: RefreshCw,  color: "#0891b2", available: false, tag: "SMART",     badge: "SOON" },
];

// ─── Quiz Game ─────────────────────────────────────────────────────────────────
function QuizGame({ onEarnCoins, onBack, questions, setName }: {
  onEarnCoins: (amount: number, reason: string) => void;
  onBack: () => void;
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
        <button onClick={onBack} className="retro-btn w-9 h-9 flex items-center justify-center p-0">
          <X size={16} style={{ color: "#5a7d8a" }} />
        </button>
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
                    opacity: selected !== null && !isCorrect && !isSelected ? 0.5 : 1,
                    fontSize: "0.85rem",
                  }}
                >
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

// ─── Flashcard Game ────────────────────────────────────────────────────────────
function FlashcardGame({ onBack, onEarnCoins, cards, setName }: {
  onBack: () => void;
  onEarnCoins: (amount: number, reason: string) => void;
  cards: FlashCard[];
  setName: string;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));
  const [done, setDone] = useState(false);
  const [coinsAwarded, setCoinsAwarded] = useState(false);

  const card = cards[index];
  const progress = (seen.size / cards.length) * 100;

  const goTo = (newIndex: number) => {
    setIndex(newIndex); setFlipped(false);
    setSeen(prev => { const next = new Set(prev); next.add(newIndex); return next; });
  };

  const handleDone = () => {
    if (!coinsAwarded) { onEarnCoins(60, "Flashcard deck complete!"); setCoinsAwarded(true); }
    setDone(true);
  };

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
        <button onClick={onBack} className="retro-btn w-9 h-9 flex items-center justify-center p-0">
          <X size={16} style={{ color: "#5a7d8a" }} />
        </button>
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

// ─── Study Set Picker ──────────────────────────────────────────────────────────
function StudySetPicker({ gameId, onCancel, onSelect }: {
  gameId: string;
  onCancel: () => void;
  onSelect: (set: StudySetData) => void;
}) {
  const [selected, setSelected] = useState<string>("bsd");
  const game = GAMES.find(g => g.id === gameId)!;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
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
          <span className="vt" style={{ fontSize: "1rem" }}>START {game.name.toUpperCase()}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Hub ──────────────────────────────────────────────────────────────────
interface Props { onEarnCoins: (amount: number, reason: string) => void; }
type ActiveGame = { game: string; cards: FlashCard[]; questions: QuizQuestion[]; name: string } | null;

export function GamesHub({ onEarnCoins }: Props) {
  const [pendingGame, setPendingGame] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  const handleSelectSet = (gameId: string, set: StudySetData) => {
    setActiveGame({ game: gameId, cards: set.cards, questions: gameId === "quiz" ? makeQuizFromCards(set.cards) : [], name: set.name });
    setPendingGame(null);
  };

  if (activeGame?.game === "quiz") {
    const questions = activeGame.questions.length > 0 ? activeGame.questions : QUIZ_QUESTIONS;
    return <div className="h-full flex flex-col"><QuizGame onEarnCoins={onEarnCoins} onBack={() => setActiveGame(null)} questions={questions} setName={activeGame.name} /></div>;
  }

  if (activeGame?.game === "flashcard") {
    return <div className="h-full flex flex-col"><FlashcardGame onBack={() => setActiveGame(null)} onEarnCoins={onEarnCoins} cards={activeGame.cards} setName={activeGame.name} /></div>;
  }

  if (pendingGame) {
    return <div className="h-full flex flex-col"><StudySetPicker gameId={pendingGame} onCancel={() => setPendingGame(null)} onSelect={(set) => handleSelectSet(pendingGame, set)} /></div>;
  }

  const GAME_PALETTES = [
    { bg: "#dbeafe", border: "#3b82f6", shadow: "#1d4ed8", text: "#1e3a8a" },
    { bg: "#ede9fe", border: "#7c3aed", shadow: "#5b21b6", text: "#3b0764" },
    { bg: "#d1fae5", border: "#059669", shadow: "#047857", text: "#064e3b" },
    { bg: "#fef3c7", border: "#d97706", shadow: "#b45309", text: "#78350f" },
    { bg: "#fce7f3", border: "#db2777", shadow: "#9d174d", text: "#500724" },
    { bg: "#fee2e2", border: "#dc2626", shadow: "#b91c1c", text: "#7f1d1d" },
    { bg: "#cffafe", border: "#0891b2", shadow: "#0e7490", text: "#164e63" },
  ];

  return (
    <div className="max-w-2xl mx-auto pb-6">

      {/* ── Header — boardwalk sign style ──────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1a3d52 0%, #2a5a70 100%)",
        borderBottom: "3px solid #fbbf24",
        padding: "10px 14px", marginBottom: 12,
      }}>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem", color: "#fbbf24", letterSpacing: "0.1em", lineHeight: 1 }}>
          🎮 GAME ROOM 🎮
        </p>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#7ab2c8", letterSpacing: "0.05em" }}>
          pick a game · study · earn coins
        </p>
      </div>

      {/* ── Games — colorful per-card arcade grid ─────────────────── */}
      <div style={{ padding: "0 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {GAMES.map((game, i) => {
          const pal = GAME_PALETTES[i % GAME_PALETTES.length];
          return (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              onClick={() => game.available ? setPendingGame(game.id) : undefined}
              style={{
                background: pal.bg,
                border: `3px solid ${pal.border}`,
                borderRadius: 8,
                padding: 0, overflow: "hidden",
                boxShadow: `4px 4px 0 ${pal.shadow}`,
                cursor: game.available ? "pointer" : "default",
                opacity: game.available ? 1 : 0.6,
                textAlign: "left",
                transition: "all 0.08s",
              }}
              whileTap={game.available ? { scale: 0.97, boxShadow: `2px 2px 0 ${pal.shadow}`, x: 2, y: 2 } : undefined}
            >
              {/* Card top ribbon */}
              <div style={{
                background: pal.border, padding: "3px 8px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.6rem", color: "white", letterSpacing: "0.1em" }}>
                  {game.tag}
                </span>
                {game.badge === "HOT" && (
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.55rem", background: "#fbbf24", color: "#78350f", padding: "0 4px", borderRadius: 2 }}>
                    🔥 HOT
                  </span>
                )}
                {game.badge === "SOON" && (
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.55rem", background: "rgba(0,0,0,0.2)", color: "white", padding: "0 4px", borderRadius: 2 }}>
                    SOON
                  </span>
                )}
              </div>

              {/* Card body */}
              <div style={{ padding: "10px 10px 8px" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 6, marginBottom: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.7)", border: `2px solid ${pal.border}`,
                }}>
                  <game.Icon size={18} style={{ color: pal.border }} />
                </div>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: pal.text, letterSpacing: "0.03em", lineHeight: 1, marginBottom: 3 }}>
                  {game.name}
                </p>
                <p style={{ fontSize: "0.7rem", color: pal.text, opacity: 0.75, marginBottom: 8 }}>
                  {game.description}
                </p>
                <div style={{
                  display: "inline-block",
                  fontFamily: "'VT323', monospace", fontSize: "0.65rem", letterSpacing: "0.06em",
                  background: game.available ? "white" : "rgba(255,255,255,0.4)",
                  color: game.available ? pal.border : pal.text,
                  border: `1.5px solid ${pal.border}`, borderRadius: 3,
                  padding: "1px 7px",
                }}>
                  {game.available ? "▶ PLAY NOW" : "COMING SOON"}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Tip — Sandy note card ──────────────────────────────────── */}
      <div style={{ margin: "12px 12px 0" }}>
        <div style={{
          background: "#fefce8", border: "2px solid #fbbf24",
          borderRadius: 6, overflow: "hidden", boxShadow: "3px 3px 0 #fbbf24",
        }}>
          <div style={{ background: "#fbbf24", padding: "3px 10px" }}>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#78350f", letterSpacing: "0.08em" }}>
              💡 PRO TIP
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px" }}>
            <Gamepad2 size={14} style={{ color: "#d97706", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1a3d52", marginBottom: 2 }}>Pick your subject</p>
              <p style={{ fontSize: "0.72rem", color: "#5a7d8a", lineHeight: 1.4 }}>
                Each game lets you choose which topic to study — BSD lore, calculus, history, chemistry, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
