import { useState } from "react";
import { X, Check, HelpCircle, Layers, Brain, PenLine, MoveDown, Skull, RefreshCw,
  BookOpen, FlaskConical, Globe, Atom, BookMarked, ChevronLeft, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QUIZ_QUESTIONS } from "../data/characters";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlashCard { front: string; back: string; }
interface QuizQuestion { question: string; options: string[]; answer: number; coins: number; }
interface StudySetData { id: string; name: string; subject: string; Icon: React.ElementType; color: string; cards: FlashCard[]; }

// ─── Study Content ────────────────────────────────────────────────────────────

const STUDY_CONTENT: StudySetData[] = [
  {
    id: "bsd",
    name: "BSD Lore",
    subject: "Anime",
    Icon: BookMarked,
    color: "from-violet-500 to-indigo-600",
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
    id: "calc",
    name: "Calculus",
    subject: "Math",
    Icon: Atom,
    color: "from-blue-500 to-indigo-600",
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
    id: "history",
    name: "World History",
    subject: "History",
    Icon: Globe,
    color: "from-amber-500 to-orange-600",
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
    id: "chemistry",
    name: "Chemistry",
    subject: "Science",
    Icon: FlaskConical,
    color: "from-green-500 to-emerald-600",
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
    id: "literature",
    name: "Japanese Lit",
    subject: "Literature",
    Icon: BookOpen,
    color: "from-pink-500 to-rose-600",
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
    id: "physics",
    name: "Physics",
    subject: "Science",
    Icon: Atom,
    color: "from-violet-500 to-purple-600",
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeQuizFromCards(cards: FlashCard[]): QuizQuestion[] {
  const shuffled = [...cards].sort(() => Math.random() - 0.5).slice(0, 10);
  return shuffled.map((card) => {
    const others = cards.filter(c => c.back !== card.back).map(c => c.back).sort(() => Math.random() - 0.5).slice(0, 3);
    while (others.length < 3) others.push(`— not "${card.back.slice(0, 20)}..."`);
    const opts = [card.back, ...others].sort(() => Math.random() - 0.5);
    return { question: card.front, options: opts, answer: opts.indexOf(card.back), coins: 15 };
  });
}

// ─── Games List ───────────────────────────────────────────────────────────────

const GAMES = [
  { id: "quiz",       name: "Quiz Battle",        description: "Answer Qs, earn coins",   Icon: HelpCircle, color: "from-blue-500 to-indigo-600",  available: true,  tag: "KNOWLEDGE", badge: "HOT" },
  { id: "flashcard",  name: "Flashcard Flip",      description: "Flip & memorize",         Icon: Layers,     color: "from-purple-500 to-violet-600", available: true,  tag: "MEMORY",    badge: null  },
  { id: "memory",     name: "Memory Match",        description: "Find matching pairs",     Icon: Brain,      color: "from-green-500 to-emerald-600", available: false, tag: "BRAIN",     badge: "SOON" },
  { id: "fillblank",  name: "Fill the Blank",      description: "Complete the sentence",   Icon: PenLine,    color: "from-orange-500 to-amber-500",  available: false, tag: "WRITING",   badge: "SOON" },
  { id: "falling",    name: "Falling Terms",       description: "Catch right answers",     Icon: MoveDown,   color: "from-pink-500 to-rose-500",     available: false, tag: "REFLEX",    badge: "SOON" },
  { id: "boss",       name: "Boss Battle Exam",    description: "Fight with knowledge",    Icon: Skull,      color: "from-red-600 to-orange-600",    available: false, tag: "EPIC",      badge: "SOON" },
  { id: "spaced",     name: "Spaced Repetition",   description: "Smart review scheduling", Icon: RefreshCw,  color: "from-teal-500 to-cyan-500",     available: false, tag: "SMART",     badge: "SOON" },
];

// ─── Quiz Game ────────────────────────────────────────────────────────────────

interface QuizGameProps {
  onEarnCoins: (amount: number, reason: string) => void;
  onBack: () => void;
  questions: QuizQuestion[];
  setName: string;
}

function QuizGame({ onEarnCoins, onBack, questions, setName }: QuizGameProps) {
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
    if (correct) {
      setScore(s => s + 1);
      setTotalCoins(c => c + earned);
      onEarnCoins(earned, `Correct!${newStreak > 1 ? ` ${newStreak}x streak!` : ""}`);
    }
    setTimeout(() => {
      if (qIndex + 1 >= questions.length) setDone(true);
      else { setQIndex(i => i + 1); setSelected(null); }
    }, 1200);
  };

  if (done) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "var(--foreground)" }}>Quiz Complete!</h2>
        <p className="text-muted-foreground mt-2">{score} / {questions.length} correct · {setName}</p>
        <div className="flex items-center gap-1.5 mt-4 text-2xl font-bold" style={{ color: "#d97706" }}>
          <span style={{ fontSize: "1.2rem" }}>🪙</span> +{totalCoins}
        </div>
        <div className="mt-6 w-full max-w-xs">
          <div className="bg-white rounded-2xl border border-border p-4 mb-3">
            <div className="text-sm text-muted-foreground mb-1">Accuracy</div>
            <div className="text-3xl font-bold text-primary" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {Math.round((score / questions.length) * 100)}%
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(score / questions.length) * 100}%` }} />
            </div>
          </div>
          <button onClick={onBack} className="w-full bg-primary text-white rounded-2xl py-3 font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Back to Games
          </button>
          <button
            onClick={() => { setQIndex(0); setSelected(null); setScore(0); setTotalCoins(0); setDone(false); setStreak(0); }}
            className="w-full mt-2 bg-white border-2 border-primary text-primary rounded-2xl py-3 font-bold"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center flex-shrink-0">
          <X size={18} className="text-muted-foreground" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-semibold">{setName} · Quiz</p>
          <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(qIndex / questions.length) * 100}%` }} />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{qIndex + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 flex flex-col">
          <div className="bg-white rounded-3xl p-5 border border-border shadow-sm mb-4">
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.4 }}>{q.question}</p>
            <p className="text-xs font-semibold mt-2" style={{ color: "#d97706" }}>
              🪙 +{q.coins}{streak > 1 ? ` · 🔥 ${streak}x` : ""}
            </p>
          </div>
          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.answer;
              const isSelected = i === selected;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`w-full text-left rounded-2xl p-4 border-2 font-semibold text-sm transition-all ${
                    selected === null ? "bg-white border-border hover:border-primary hover:bg-secondary"
                    : isCorrect ? "bg-green-50 border-green-400 text-green-700"
                    : isSelected ? "bg-red-50 border-red-400 text-red-700"
                    : "bg-white border-border opacity-50"}`}
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selected !== null && isCorrect && <Check size={18} className="text-green-500 flex-shrink-0" />}
                    {isSelected && !isCorrect && <X size={18} className="text-red-500 flex-shrink-0" />}
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

// ─── Flashcard Game ───────────────────────────────────────────────────────────

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
    setIndex(newIndex);
    setFlipped(false);
    setSeen(prev => { const next = new Set(prev); next.add(newIndex); return next; });
  };

  const handleDone = () => {
    if (!coinsAwarded) { onEarnCoins(60, "Flashcard deck complete!"); setCoinsAwarded(true); }
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">🃏</div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "var(--foreground)" }}>Deck Complete!</h2>
        <p className="text-muted-foreground mt-2">You reviewed all {cards.length} cards · {setName}</p>
        <div className="flex items-center gap-1.5 mt-4 text-2xl font-bold" style={{ color: "#d97706" }}>
          <span>🪙</span> +60
        </div>
        <div className="flex gap-3 mt-8 w-full max-w-xs">
          <button onClick={onBack} className="flex-1 py-3 rounded-2xl bg-white border-2 border-border font-bold">Back</button>
          <button
            onClick={() => { setIndex(0); setFlipped(false); setSeen(new Set([0])); setDone(false); setCoinsAwarded(false); }}
            className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold"
          >
            Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 items-center">
      <div className="flex items-center justify-between w-full mb-3">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center">
          <X size={18} className="text-muted-foreground" />
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold text-muted-foreground">{setName}</p>
          <span className="text-sm text-muted-foreground">{index + 1} / {cards.length}</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-sm" style={{ color: "#d97706" }}>
          <span>🪙</span> +60
        </div>
      </div>

      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-4">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <p className="text-muted-foreground text-sm mb-4">Tap card to flip</p>

      <div className="w-full max-w-sm" style={{ perspective: 800 }} onClick={() => setFlipped(f => !f)}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: "preserve-3d", position: "relative", height: 220 }}
        >
          <div
            className="absolute inset-0 rounded-3xl bg-white border-2 shadow-lg flex items-center justify-center p-6 text-center"
            style={{ backfaceVisibility: "hidden", borderColor: "var(--primary)" }}
          >
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)" }}>{card.front}</p>
          </div>
          <div
            className="absolute inset-0 rounded-3xl shadow-lg flex items-center justify-center p-6 text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg, var(--primary), #4338ca)" }}
          >
            <p className="text-white font-semibold text-base">{card.back}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-3 mt-6 w-full max-w-sm">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="flex-1 py-3 rounded-2xl bg-white border-2 border-border text-muted-foreground font-semibold disabled:opacity-40"
        >
          ← Prev
        </button>
        {index === cards.length - 1 ? (
          <button onClick={handleDone} className="flex-1 py-3 rounded-2xl bg-green-500 text-white font-semibold">
            Done <Check size={16} className="inline ml-1" />
          </button>
        ) : (
          <button onClick={() => goTo(index + 1)} className="flex-1 py-3 rounded-2xl bg-primary text-white font-semibold">
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Study Set Picker ─────────────────────────────────────────────────────────

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
      <div
        className="relative px-5 pt-9 pb-6 overflow-hidden"
        style={{ background: `linear-gradient(135deg, #166534, #15803d)` }}
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        <button onClick={onCancel} className="flex items-center gap-1.5 text-white/70 text-sm font-semibold mb-3 active:opacity-70">
          <ChevronLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-3 relative">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
            <game.Icon size={22} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-xl" style={{ fontFamily: "'Outfit', sans-serif" }}>{game.name}</p>
            <p className="text-white/65 text-xs font-medium">{game.description}</p>
          </div>
        </div>
      </div>

      {/* Set list */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs font-bold tracking-wide mb-3" style={{ color: "var(--muted-foreground)" }}>
          CHOOSE WHAT TO STUDY
        </p>
        <div className="space-y-2.5">
          {STUDY_CONTENT.map(set => (
            <motion.button
              key={set.id}
              onClick={() => setSelected(set.id)}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                selected === set.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-white hover:border-primary/40"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${set.color} flex items-center justify-center flex-shrink-0`}>
                <set.Icon size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>{set.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{set.cards.length} cards · {set.subject}</p>
              </div>
              {selected === set.id && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--primary)" }}>
                  <Check size={13} className="text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-border flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 rounded-2xl bg-white border-2 border-border font-bold text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Cancel
        </button>
        <button
          onClick={() => { const s = STUDY_CONTENT.find(s => s.id === selected); if (s) onSelect(s); }}
          className="flex-1 py-3 rounded-2xl text-white font-bold text-sm active:scale-95 transition-transform"
          style={{ background: "var(--primary)", fontFamily: "'Outfit', sans-serif", boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}
        >
          Start {game.name}
        </button>
      </div>
    </div>
  );
}

// ─── Main Hub ─────────────────────────────────────────────────────────────────

interface Props {
  onEarnCoins: (amount: number, reason: string) => void;
}

type ActiveGame = { game: string; cards: FlashCard[]; questions: QuizQuestion[]; name: string } | null;

export function GamesHub({ onEarnCoins }: Props) {
  const [pendingGame, setPendingGame] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  // Fallback built-in BSD questions for "Play Now" without picker
  const defaultSet = STUDY_CONTENT[0];

  const handleSelectSet = (gameId: string, set: StudySetData) => {
    setActiveGame({
      game: gameId,
      cards: set.cards,
      questions: gameId === "quiz" ? makeQuizFromCards(set.cards) : [],
      name: set.name,
    });
    setPendingGame(null);
  };

  if (activeGame?.game === "quiz") {
    const questions = activeGame.questions.length > 0 ? activeGame.questions : QUIZ_QUESTIONS;
    return (
      <div className="h-full flex flex-col">
        <QuizGame onEarnCoins={onEarnCoins} onBack={() => setActiveGame(null)} questions={questions} setName={activeGame.name} />
      </div>
    );
  }

  if (activeGame?.game === "flashcard") {
    return (
      <div className="h-full flex flex-col">
        <FlashcardGame onBack={() => setActiveGame(null)} onEarnCoins={onEarnCoins} cards={activeGame.cards} setName={activeGame.name} />
      </div>
    );
  }

  if (pendingGame) {
    return (
      <div className="h-full flex flex-col">
        <StudySetPicker
          gameId={pendingGame}
          onCancel={() => setPendingGame(null)}
          onSelect={(set) => handleSelectSet(pendingGame, set)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-6">
      {/* Page header */}
      <div
        className="relative px-5 pt-10 pb-8 overflow-hidden"
        style={{ background: "linear-gradient(150deg, #052e16 0%, #064e3b 40%, #065f46 75%, #047857 100%)" }}
      >
        {/* Dot-grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.3,
        }} />
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-400/25 flex items-center justify-center">
              <Gamepad2 size={13} className="text-emerald-300" />
            </div>
            <p className="text-emerald-300/80 text-xs font-bold tracking-widest uppercase">Game Room</p>
          </div>
          <h1 className="text-white font-black leading-tight" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2rem" }}>
            Pick a game.
          </h1>
          <p className="text-emerald-200/60 text-sm mt-0.5 font-medium">All of them earn coins — no excuses.</p>
        </div>
      </div>

      {/* Games grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {GAMES.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            onClick={() => game.available ? setPendingGame(game.id) : undefined}
            className={`relative overflow-hidden rounded-2xl p-4 text-left transition-transform ${game.available ? "active:scale-[0.97]" : "cursor-default"}`}
            style={{
              boxShadow: game.available ? "0 6px 20px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.06)",
              opacity: game.available ? 1 : 0.55,
            }}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} rounded-2xl`} />

            <div className="relative">
              {/* Category tag + badge row */}
              <div className="flex items-center justify-between mb-2.5">
                <span
                  className="text-white/75 font-black tracking-widest"
                  style={{ fontSize: "0.52rem", letterSpacing: "0.1em" }}
                >
                  {game.tag}
                </span>
                {game.badge === "HOT" && (
                  <span
                    className="text-white font-black rounded-md px-1.5 py-0.5"
                    style={{ fontSize: "0.5rem", letterSpacing: "0.05em", background: "rgba(255,255,255,0.25)" }}
                  >
                    🔥 HOT
                  </span>
                )}
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-2.5 relative">
                <game.Icon size={20} className="text-white" />
                {/* Big faded bg icon */}
                <div className="absolute -right-3 -bottom-5 pointer-events-none opacity-10">
                  <game.Icon size={56} className="text-white" />
                </div>
              </div>

              <p className="text-white font-black text-sm leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {game.name}
              </p>
              <p className="text-white/65 text-xs mt-0.5 font-medium">{game.description}</p>

              {/* Footer pill */}
              <div
                className="mt-2.5 inline-block rounded-lg px-2 py-0.5"
                style={{ background: game.available ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.15)" }}
              >
                <span className="text-white text-xs font-bold" style={{ fontSize: "0.6rem" }}>
                  {game.available ? "▶ Play Now" : "Coming Soon"}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Tip */}
      <div className="mx-4 mt-1 rounded-2xl p-4 flex items-start gap-3" style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.12)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(124,58,237,0.15)" }}>
          <Gamepad2 size={16} style={{ color: "var(--primary)" }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--foreground)", fontFamily: "'Outfit', sans-serif" }}>Pick your subject</p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Each game lets you choose which topic to study — BSD lore, calculus, history, chemistry, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
