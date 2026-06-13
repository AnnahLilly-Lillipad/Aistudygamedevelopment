import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, ChevronRight, X, Check, Star, Upload, Plus, Trash2, FileText, AlertCircle } from "lucide-react";
import { STUDY_SETS, QUIZ_QUESTIONS } from "../data/characters";
import { AnimatePresence, motion } from "motion/react";

const POMODORO_WORK = 25 * 60;
const POMODORO_SHORT = 5 * 60;
const POMODORO_LONG = 15 * 60;

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Flashcard { front: string; back: string; }
interface QuizQuestion { question: string; options: string[]; answer: number; coins: number; }
interface MatchPair { term: string; def: string; }

interface CustomStudySet {
  id: string;
  name: string;
  subject: string;
  cards: Flashcard[];
  color: string;
  icon: string;
  progress: number;
}

const CUSTOM_SET_COLORS = [
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-teal-400 to-cyan-500",
  "from-lime-400 to-green-500",
  "from-sky-400 to-blue-500",
];
const CUSTOM_SET_ICONS = ["📚", "🧠", "✍️", "💡", "🎯", "🌟", "📖", "🔬", "🎨", "🧩"];

// ─── Per-set flashcard data ────────────────────────────────────────────────────
const SET_FLASHCARDS: Record<number, Flashcard[]> = {
  1: [
    { front: "What is a derivative?", back: "Rate of change of a function. d/dx gives the slope at any point." },
    { front: "What is the chain rule?", back: "d/dx[f(g(x))] = f'(g(x)) · g'(x)" },
    { front: "What is an integral?", back: "The area under a curve. Antiderivative of a function." },
    { front: "Derivative of sin(x)?", back: "cos(x)" },
    { front: "Derivative of e^x?", back: "e^x — it is its own derivative!" },
  ],
  2: [
    { front: "When did WWII end?", back: "1945 — V-E Day (May 8) and V-J Day (Sept 2)." },
    { front: "What was the French Revolution?", back: "1789–1799. Overthrow of the French monarchy. Led to Napoleon." },
    { front: "Who was Julius Caesar?", back: "Roman general and statesman, assassinated 44 BC." },
    { front: "What caused WWI?", back: "Assassination of Archduke Franz Ferdinand (1914) + alliances." },
    { front: "What was the Cold War?", back: "1947–1991 geopolitical rivalry: USA vs Soviet Union." },
  ],
  3: [
    { front: "What is an element?", back: "A pure substance made of only one type of atom." },
    { front: "What is a covalent bond?", back: "Atoms share electrons. Found in molecules like H₂O." },
    { front: "What is pH?", back: "Measure of acidity. 0–6 acidic, 7 neutral, 8–14 basic." },
    { front: "What is the periodic table?", back: "Table of elements ordered by atomic number." },
    { front: "What is Avogadro's number?", back: "6.022 × 10²³ — the number of atoms in one mole." },
  ],
  4: [
    { front: "Who wrote 'The Great Gatsby'?", back: "F. Scott Fitzgerald, 1925. Themes: American Dream, wealth." },
    { front: "What is haiku?", back: "Japanese poem: 5-7-5 syllable structure." },
    { front: "What is a metaphor?", back: "Comparing two things without 'like' or 'as'. 'Life is a journey.'" },
    { front: "Who is Dazai Osamu?", back: "Japanese author (1909–1948). No Longer Human is his most famous work." },
    { front: "What is foreshadowing?", back: "Hints in a story about what will happen later." },
  ],
  5: [
    { front: "What is Newton's 1st Law?", back: "An object in motion stays in motion unless acted on by an external force." },
    { front: "What is F = ma?", back: "Newton's 2nd Law: Force = mass × acceleration." },
    { front: "What is kinetic energy?", back: "Energy of motion. KE = ½mv²" },
    { front: "What is the speed of light?", back: "~3 × 10⁸ m/s in a vacuum." },
    { front: "What is gravity?", back: "Force attracting objects. g ≈ 9.8 m/s² on Earth." },
  ],
};

const SET_QUIZ: Record<number, QuizQuestion[]> = {
  1: [
    { question: "What is the derivative of x²?", options: ["x", "2x", "2", "x²"], answer: 1, coins: 15 },
    { question: "∫x dx = ?", options: ["x² + C", "x²/2 + C", "2x + C", "x + C"], answer: 1, coins: 15 },
    { question: "What does a limit represent?", options: ["Area under curve", "Max value", "Approaching value", "Slope"], answer: 2, coins: 10 },
  ],
  2: [
    { question: "In what year did WWII end?", options: ["1943", "1944", "1945", "1946"], answer: 2, coins: 10 },
    { question: "Who led the French Revolution?", options: ["Napoleon", "The people / bourgeoisie", "King Louis XVI", "Marie Antoinette"], answer: 1, coins: 15 },
    { question: "What empire did Julius Caesar lead?", options: ["Greek", "Ottoman", "Roman", "Persian"], answer: 2, coins: 10 },
  ],
  3: [
    { question: "What is the symbol for Gold?", options: ["Ag", "Go", "Au", "Gl"], answer: 2, coins: 10 },
    { question: "What pH is neutral?", options: ["0", "7", "14", "5"], answer: 1, coins: 10 },
    { question: "Water is made of?", options: ["H₂O₂", "HO", "H₂O", "OH"], answer: 2, coins: 10 },
  ],
  4: [
    { question: "Who wrote The Great Gatsby?", options: ["Hemingway", "Steinbeck", "Fitzgerald", "Faulkner"], answer: 2, coins: 10 },
    { question: "How many syllables in a haiku middle line?", options: ["5", "6", "7", "8"], answer: 2, coins: 10 },
    { question: "A metaphor compares WITHOUT using?", options: ["nouns", "'like' or 'as'", "verbs", "adjectives"], answer: 1, coins: 15 },
  ],
  5: [
    { question: "F = ma is Newton's which law?", options: ["1st", "2nd", "3rd", "4th"], answer: 1, coins: 10 },
    { question: "What is the unit of force?", options: ["Watt", "Joule", "Newton", "Pascal"], answer: 2, coins: 10 },
    { question: "Speed of light ≈ ?", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "300 m/s"], answer: 1, coins: 15 },
  ],
};

const SET_MATCH: Record<number, MatchPair[]> = {
  1: [{ term: "Derivative", def: "Rate of change" }, { term: "Integral", def: "Area under curve" }, { term: "Chain Rule", def: "f'(g(x))·g'(x)" }, { term: "Limit", def: "Approaching value" }],
  2: [{ term: "1945", def: "WWII ended" }, { term: "1789", def: "French Revolution" }, { term: "44 BC", def: "Caesar assassinated" }, { term: "1914", def: "WWI started" }],
  3: [{ term: "Au", def: "Gold" }, { term: "H₂O", def: "Water" }, { term: "pH 7", def: "Neutral" }, { term: "Mole", def: "6.022×10²³" }],
  4: [{ term: "Haiku", def: "5-7-5 syllables" }, { term: "Metaphor", def: "No 'like' or 'as'" }, { term: "Fitzgerald", def: "Great Gatsby" }, { term: "Foreshadowing", def: "Hints at future events" }],
  5: [{ term: "F = ma", def: "2nd Law" }, { term: "½mv²", def: "Kinetic energy" }, { term: "9.8 m/s²", def: "Earth's gravity" }, { term: "3×10⁸ m/s", def: "Speed of light" }],
};

// ─── Auto-generate quiz from flashcards ────────────────────────────────────────
function generateQuizFromCards(cards: Flashcard[]): QuizQuestion[] {
  if (cards.length < 2) return [];
  return cards.map((card, i) => {
    const otherBacks = cards.filter((_, j) => j !== i).map(c => c.back);
    const shuffledWrong = otherBacks.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffledWrong, card.back].sort(() => Math.random() - 0.5);
    const correctIdx = options.indexOf(card.back);
    return { question: card.front, options, answer: correctIdx, coins: 10 };
  });
}

function generateMatchFromCards(cards: Flashcard[]): MatchPair[] {
  return cards.slice(0, 6).map(c => ({ term: c.front.length > 30 ? c.front.slice(0, 30) + "…" : c.front, def: c.back.length > 35 ? c.back.slice(0, 35) + "…" : c.back }));
}

// ─── Parse imported text ────────────────────────────────────────────────────────
function parseImportText(raw: string): Flashcard[] | null {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const separators = ["|", "\t", ";", "–", "—", " - "];
  const cards: Flashcard[] = [];

  for (const line of lines) {
    if (line.startsWith("#") || line.startsWith("//")) continue;
    let split: [string, string] | null = null;
    for (const sep of separators) {
      const idx = line.indexOf(sep);
      if (idx > 0) {
        split = [line.slice(0, idx).trim(), line.slice(idx + sep.length).trim()];
        break;
      }
      if (sep === " - ") {
        const m = line.match(/^(.+?)\s+-\s+(.+)$/);
        if (m) { split = [m[1].trim(), m[2].trim()]; break; }
      }
    }
    if (split && split[0] && split[1]) {
      cards.push({ front: split[0], back: split[1] });
    }
  }
  return cards.length >= 2 ? cards : null;
}

// ─── Import Modal ───────────────────────────────────────────────────────────────
function ImportModal({ onClose, onImport }: { onClose: () => void; onImport: (set: CustomStudySet) => void }) {
  const [step, setStep] = useState<"input" | "preview">("input");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState<Flashcard[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleParse = () => {
    if (!name.trim()) { setError("Please enter a set name."); return; }
    const cards = parseImportText(rawText);
    if (!cards) {
      setError("Couldn't parse any cards. Make sure each line has a term and definition separated by | or a tab.");
      return;
    }
    setParsed(cards);
    setError(null);
    setStep("preview");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setRawText(ev.target?.result as string ?? "");
      if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
    };
    reader.readAsText(file);
  };

  const handleConfirm = () => {
    if (!parsed) return;
    const colorIdx = Math.floor(Math.random() * CUSTOM_SET_COLORS.length);
    const iconIdx = Math.floor(Math.random() * CUSTOM_SET_ICONS.length);
    onImport({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      subject: subject.trim() || "Custom",
      cards: parsed,
      color: CUSTOM_SET_COLORS[colorIdx],
      icon: CUSTOM_SET_ICONS[iconIdx],
      progress: 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end" onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white w-full rounded-t-3xl p-5 pb-10 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.2rem" }}>
            {step === "input" ? "Import Study Set" : "Preview"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {step === "input" ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">SET NAME *</label>
              <input
                className="w-full border-2 border-border rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary transition-colors"
                placeholder="e.g. Spanish Vocab Chapter 3"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">SUBJECT</label>
              <input
                className="w-full border-2 border-border rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary transition-colors"
                placeholder="e.g. Languages, Science, History…"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">PASTE CARDS</label>
              <div className="bg-muted/40 rounded-xl p-3 mb-2 text-xs text-muted-foreground space-y-0.5 border border-dashed border-border">
                <p className="font-bold text-foreground">Format (one card per line):</p>
                <p>term <span className="bg-border px-1 rounded font-mono">|</span> definition</p>
                <p>term <span className="bg-border px-1 rounded font-mono">TAB</span> definition</p>
                <p>term <span className="bg-border px-1 rounded font-mono"> - </span> definition</p>
              </div>
              <textarea
                className="w-full border-2 border-border rounded-xl p-3 text-sm outline-none focus:border-primary transition-colors resize-none"
                rows={8}
                placeholder={"Bonjour | Hello\nMerci | Thank you\nS'il vous plaît | Please"}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                style={{ fontFamily: "monospace" }}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-semibold">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-3 rounded-xl border-2 border-dashed border-border flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Upload size={16} />
              Upload .txt or .csv file
            </button>
            <input ref={fileRef} type="file" accept=".txt,.csv,.tsv" className="hidden" onChange={handleFile} />

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 font-semibold">{error}</p>
              </div>
            )}

            <button
              onClick={handleParse}
              disabled={!rawText.trim() || !name.trim()}
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Preview Cards →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <p className="font-bold text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{subject || "Custom"} · {parsed?.length} cards found</p>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {parsed?.map((card, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-3 flex gap-3">
                  <span className="text-xs text-muted-foreground font-mono mt-0.5 w-5 flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{card.front}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{card.back}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setStep("input"); setError(null); }} className="flex-1 py-3 rounded-2xl bg-white border-2 border-border font-bold text-sm">
                ← Edit
              </button>
              <button onClick={handleConfirm} className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Add Set ✓
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Inline Quiz ──────────────────────────────────────────────────────────────
function InlineQuiz({ setId, customCards, setName, onBack, onEarnCoins }: {
  setId: number | string; customCards?: Flashcard[]; setName: string; onBack: () => void;
  onEarnCoins: (amount: number, reason: string) => void;
}) {
  const questions: QuizQuestion[] = typeof setId === "string"
    ? generateQuizFromCards(customCards ?? [])
    : (SET_QUIZ[setId as number] ?? QUIZ_QUESTIONS.slice(0, 3));

  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  if (questions.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
      <div className="text-4xl">😅</div>
      <p className="font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>Need at least 2 cards to generate a quiz.</p>
      <button onClick={onBack} className="py-3 px-6 rounded-2xl bg-primary text-white font-bold">Go Back</button>
    </div>
  );

  const q = questions[qIdx];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.answer;
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    const earned = correct ? q.coins + (newStreak > 1 ? newStreak * 5 : 0) : 0;
    if (correct) { setScore(s => s + 1); setTotalCoins(c => c + earned); onEarnCoins(earned, `✅ Correct! ${newStreak > 1 ? `🔥 ${newStreak}x streak!` : ""}`); }
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) setDone(true);
      else { setQIdx(i => i + 1); setSelected(null); }
    }, 1100);
  };

  if (done) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-5xl mb-3">🎉</div>
      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>Quiz Done!</h3>
      <p className="text-muted-foreground mt-1">{score}/{questions.length} correct</p>
      <div className="text-2xl font-bold text-amber-500 mt-3">🪙 +{totalCoins}</div>
      <div className="flex gap-3 mt-6 w-full max-w-xs">
        <button onClick={onBack} className="flex-1 py-3 rounded-2xl bg-white border-2 border-border font-bold">Back</button>
        <button onClick={() => { setQIdx(0); setSelected(null); setScore(0); setTotalCoins(0); setDone(false); setStreak(0); }} className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold">Again</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center flex-shrink-0">
          <X size={18} className="text-muted-foreground" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-semibold">{setName} · Quiz</p>
          <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(qIdx / questions.length) * 100}%` }} />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{qIdx + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 flex flex-col">
          <div className="bg-white rounded-3xl p-5 border border-border shadow-sm mb-4">
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.4 }}>{q.question}</p>
            <p className="text-xs text-amber-500 font-semibold mt-2">🪙 +{q.coins}{streak > 1 ? ` · 🔥 ${streak}x` : ""}</p>
          </div>
          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.answer;
              const isSelected = i === selected;
              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                  className={`w-full text-left rounded-2xl p-4 border-2 font-semibold text-sm transition-all ${selected === null ? "bg-white border-border hover:border-primary"
                    : isCorrect ? "bg-green-50 border-green-400 text-green-700"
                    : isSelected ? "bg-red-50 border-red-400 text-red-700"
                    : "bg-white border-border opacity-40"}`}>
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selected !== null && isCorrect && <Check size={16} className="text-green-500" />}
                    {isSelected && !isCorrect && <X size={16} className="text-red-500" />}
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

// ─── Inline Flashcards ────────────────────────────────────────────────────────
function InlineFlashcards({ setId, customCards, setName, onBack, onEarnCoins }: {
  setId: number | string; customCards?: Flashcard[]; setName: string; onBack: () => void;
  onEarnCoins: (amount: number, reason: string) => void;
}) {
  const cards: Flashcard[] = typeof setId === "string"
    ? (customCards ?? [])
    : (SET_FLASHCARDS[setId as number] ?? []);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));
  const [done, setDone] = useState(false);

  const goTo = (newIdx: number) => { setIdx(newIdx); setFlipped(false); setSeen(prev => { const n = new Set(prev); n.add(newIdx); return n; }); };

  if (cards.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
      <div className="text-4xl">📭</div>
      <p className="font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>No flashcards in this set yet.</p>
      <button onClick={onBack} className="py-3 px-6 rounded-2xl bg-primary text-white font-bold">Go Back</button>
    </div>
  );

  if (done) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-5xl mb-3">🃏</div>
      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>All Done!</h3>
      <p className="text-muted-foreground mt-1">Reviewed {cards.length} cards</p>
      <div className="text-2xl font-bold text-amber-500 mt-3">🪙 +40</div>
      <div className="flex gap-3 mt-6 w-full max-w-xs">
        <button onClick={onBack} className="flex-1 py-3 rounded-2xl bg-white border-2 border-border font-bold">Back</button>
        <button onClick={() => { setIdx(0); setFlipped(false); setSeen(new Set([0])); setDone(false); }} className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold">Again</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-4 items-center">
      <div className="flex items-center gap-3 w-full mb-3">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center flex-shrink-0">
          <X size={18} className="text-muted-foreground" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-semibold">{setName} · Flashcards</p>
          <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(seen.size / cards.length) * 100}%` }} />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{idx + 1}/{cards.length}</span>
      </div>
      <p className="text-muted-foreground text-xs mb-3">Tap card to flip · +40 🪙 on complete</p>
      <div className="w-full max-w-sm" style={{ perspective: 800 }} onClick={() => setFlipped(f => !f)}>
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.45 }} style={{ transformStyle: "preserve-3d", position: "relative", height: 200 }}>
          <div className="absolute inset-0 rounded-3xl bg-white border-2 border-primary shadow-lg flex items-center justify-center p-6 text-center" style={{ backfaceVisibility: "hidden" }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1rem" }}>{cards[idx].front}</p>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-indigo-700 shadow-lg flex items-center justify-center p-6 text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <p className="text-white font-semibold text-sm leading-relaxed">{cards[idx].back}</p>
          </div>
        </motion.div>
      </div>
      <div className="flex gap-3 mt-5 w-full max-w-sm">
        <button onClick={() => goTo(idx - 1)} disabled={idx === 0} className="flex-1 py-3 rounded-2xl bg-white border-2 border-border text-muted-foreground font-semibold disabled:opacity-40">← Prev</button>
        {idx === cards.length - 1
          ? <button onClick={() => { onEarnCoins(40, "🃏 Flashcards complete!"); setDone(true); }} className="flex-1 py-3 rounded-2xl bg-green-500 text-white font-semibold">Done ✓</button>
          : <button onClick={() => goTo(idx + 1)} className="flex-1 py-3 rounded-2xl bg-primary text-white font-semibold">Next →</button>
        }
      </div>
    </div>
  );
}

// ─── Inline Match ──────────────────────────────────────────────────────────────
function InlineMatch({ setId, customCards, setName, onBack, onEarnCoins }: {
  setId: number | string; customCards?: Flashcard[]; setName: string; onBack: () => void;
  onEarnCoins: (amount: number, reason: string) => void;
}) {
  const pairs: MatchPair[] = typeof setId === "string"
    ? generateMatchFromCards(customCards ?? [])
    : (SET_MATCH[setId as number] ?? []);

  const [selected, setSelected] = useState<{ col: "terms" | "defs"; idx: number } | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<{ col: "terms" | "defs"; idx: number } | null>(null);
  const [done, setDone] = useState(false);

  const termOrder = useRef(pairs.map((_, i) => i)).current;
  const defOrder = useRef([...pairs.map((_, i) => i)].sort(() => Math.random() - 0.5)).current;

  const handleSelect = (col: "terms" | "defs", idx: number) => {
    if (matched.includes(idx)) return;
    if (!selected) { setSelected({ col, idx }); return; }
    if (selected.col === col) { setSelected({ col, idx }); return; }
    const termIdx = col === "terms" ? idx : selected.idx;
    const defIdx = col === "defs" ? idx : selected.idx;
    const actualDefIdx = defOrder[defIdx];
    if (termOrder[termIdx] === actualDefIdx) {
      const newMatched = [...matched, termIdx];
      setMatched(newMatched);
      setSelected(null);
      if (newMatched.length === pairs.length) { onEarnCoins(50, "🧩 Match complete!"); setDone(true); }
    } else {
      setWrong({ col, idx });
      setTimeout(() => { setWrong(null); setSelected(null); }, 700);
    }
  };

  const isSelected = (col: "terms" | "defs", idx: number) => selected?.col === col && selected?.idx === idx;
  const isMatched = (termIdx: number) => matched.includes(termIdx);
  const isWrong = (col: "terms" | "defs", idx: number) => wrong?.col === col && wrong?.idx === idx;

  if (pairs.length < 2) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
      <div className="text-4xl">😅</div>
      <p className="font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>Need at least 2 cards for a match game.</p>
      <button onClick={onBack} className="py-3 px-6 rounded-2xl bg-primary text-white font-bold">Go Back</button>
    </div>
  );

  if (done) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-5xl mb-3">🧩</div>
      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>Matched!</h3>
      <p className="text-muted-foreground mt-1">All {pairs.length} pairs found</p>
      <div className="text-2xl font-bold text-amber-500 mt-3">🪙 +50</div>
      <div className="flex gap-3 mt-6 w-full max-w-xs">
        <button onClick={onBack} className="flex-1 py-3 rounded-2xl bg-white border-2 border-border font-bold">Back</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center flex-shrink-0">
          <X size={18} className="text-muted-foreground" />
        </button>
        <div>
          <p className="text-sm font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>{setName} · Match</p>
          <p className="text-xs text-muted-foreground">{matched.length}/{pairs.length} matched · +50 🪙</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground mb-2 text-center">TERM</p>
          {termOrder.map((pairIdx, i) => (
            <button key={i} onClick={() => handleSelect("terms", i)}
              className={`w-full p-3 rounded-xl text-xs font-semibold text-left transition-all leading-snug ${isMatched(i) ? "bg-green-100 border-2 border-green-400 text-green-700 opacity-60"
                : isWrong("terms", i) ? "bg-red-100 border-2 border-red-400 text-red-600"
                : isSelected("terms", i) ? "bg-primary/10 border-2 border-primary text-primary"
                : "bg-white border-2 border-border hover:border-primary"}`}>
              {pairs[pairIdx].term}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground mb-2 text-center">DEFINITION</p>
          {defOrder.map((pairIdx, i) => {
            const matchedTermIdx = termOrder.findIndex(t => t === pairIdx);
            const matchedAlready = isMatched(matchedTermIdx);
            return (
              <button key={i} onClick={() => handleSelect("defs", i)}
                className={`w-full p-3 rounded-xl text-xs font-semibold text-left transition-all leading-snug ${matchedAlready ? "bg-green-100 border-2 border-green-400 text-green-700 opacity-60"
                  : isWrong("defs", i) ? "bg-red-100 border-2 border-red-400 text-red-600"
                  : isSelected("defs", i) ? "bg-primary/10 border-2 border-primary text-primary"
                  : "bg-white border-2 border-border hover:border-primary"}`}>
                {pairs[pairIdx].def}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main StudyMode ────────────────────────────────────────────────────────────
interface Props {
  onEarnCoins: (amount: number, reason: string) => void;
}

type StudyView = null | {
  type: "quiz" | "flashcards" | "match";
  setId: number | string;
  setName: string;
  customCards?: Flashcard[];
};

export function StudyMode({ onEarnCoins }: Props) {
  const [activeTab, setActiveTab] = useState<"sets" | "timer" | "notes">("sets");
  const [studyView, setStudyView] = useState<StudyView>(null);
  const [timeLeft, setTimeLeft] = useState(POMODORO_WORK);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "short" | "long">("work");
  const [sessions, setSessions] = useState(0);
  const [noteText, setNoteText] = useState("# My Study Notes\n\nStart typing here...");
  const [linkedSet, setLinkedSet] = useState(STUDY_SETS[0]);
  const [showSetPicker, setShowSetPicker] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [customSets, setCustomSets] = useState<CustomStudySet[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxTime = mode === "work" ? POMODORO_WORK : mode === "short" ? POMODORO_SHORT : POMODORO_LONG;
  const progress = ((maxTime - timeLeft) / maxTime) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress / 100);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const start = useCallback(() => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          if (mode === "work") { setSessions(s => s + 1); onEarnCoins(50, "Pomodoro complete! 🍅"); }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [mode, onEarnCoins]);

  const pause = useCallback(() => { setIsRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); }, []);
  const reset = useCallback(() => { pause(); setTimeLeft(maxTime); }, [pause, maxTime]);
  const switchMode = (m: "work" | "short" | "long") => { pause(); setMode(m); setTimeLeft(m === "work" ? POMODORO_WORK : m === "short" ? POMODORO_SHORT : POMODORO_LONG); };
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const handleImport = (set: CustomStudySet) => {
    setCustomSets(prev => [...prev, set]);
  };

  const handleDeleteCustom = (id: string) => {
    setCustomSets(prev => prev.filter(s => s.id !== id));
  };

  const allSetsForPicker = [...STUDY_SETS, ...customSets.map(s => ({ id: s.id as unknown as number, name: s.name, subject: s.subject, cards: s.cards.length, progress: s.progress, color: s.color, icon: s.icon }))];

  const tabs = [
    { id: "sets", label: "Study Sets", icon: "📚" },
    { id: "timer", label: "Pomodoro", icon: "🍅" },
    { id: "notes", label: "Notes", icon: "📝" },
  ] as const;

  if (studyView) {
    const props = {
      setId: studyView.setId,
      customCards: studyView.customCards,
      setName: studyView.setName,
      onBack: () => setStudyView(null),
      onEarnCoins,
    };
    return (
      <div className="h-full flex flex-col">
        {studyView.type === "quiz" && <InlineQuiz {...props} />}
        {studyView.type === "flashcards" && <InlineFlashcards {...props} />}
        {studyView.type === "match" && <InlineMatch {...props} />}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Page header */}
      <div
        className="relative px-5 pt-9 pb-5 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #4338ca 50%, #7c3aed 100%)" }}
      >
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="absolute left-4 -bottom-4 w-16 h-16 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        <p className="text-white/60 text-xs font-bold tracking-widest mb-0.5">STUDY MODE</p>
        <h1 className="text-white font-black text-2xl relative" style={{ fontFamily: "'Outfit', sans-serif" }}>Study Hub</h1>
        <p className="text-white/65 text-sm mt-1 relative">Flashcards · Pomodoro · Notes</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 p-3 pb-2 bg-white border-b" style={{ borderColor: "rgba(124,58,237,0.1)" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "text-white shadow-sm" : "text-muted-foreground"}`}
            style={{
              fontFamily: "'Outfit', sans-serif",
              background: activeTab === tab.id ? "var(--primary)" : "transparent",
            }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Study Sets ──────────────────────────────────────────────────────── */}
      {activeTab === "sets" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.2rem" }}>Study Sets</h2>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm hover:bg-primary/90 transition-colors"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <Upload size={13} />
              Import
            </button>
          </div>

          {/* Built-in sets */}
          {STUDY_SETS.map(set => (
            <div key={set.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${set.color}`} style={{ width: `${set.progress}%` }} />
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{set.icon}</span>
                    <div>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{set.name}</p>
                      <p className="text-xs text-muted-foreground">{set.subject} · {set.cards} cards</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{set.progress}%</p>
                    <p className="text-xs text-muted-foreground">mastered</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(["Quiz", "Flashcards", "Match"] as const).map(m => (
                    <button key={m}
                      onClick={() => setStudyView({ type: m.toLowerCase() as "quiz" | "flashcards" | "match", setId: set.id, setName: set.name })}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-primary hover:text-white transition-colors">
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Custom imported sets */}
          {customSets.length > 0 && (
            <>
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-bold text-muted-foreground">MY IMPORTS</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              {customSets.map(set => (
                <div key={set.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className={`h-1.5 bg-gradient-to-r ${set.color}`} />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{set.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{set.name}</p>
                            <span className="text-xs bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-full">Imported</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{set.subject} · {set.cards.length} cards</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteCustom(set.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {(["Quiz", "Flashcards", "Match"] as const).map(m => (
                        <button key={m}
                          onClick={() => setStudyView({ type: m.toLowerCase() as "quiz" | "flashcards" | "match", setId: set.id, setName: set.name, customCards: set.cards })}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-primary hover:text-white transition-colors">
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Import CTA when no custom sets yet */}
          {customSets.length === 0 && (
            <button
              onClick={() => setShowImport(true)}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-border flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <FileText size={20} />
              <span className="text-sm font-semibold">Import your own study set</span>
              <span className="text-xs opacity-70">Paste terms & definitions, or upload a file</span>
            </button>
          )}
        </div>
      )}

      {/* ── Pomodoro Timer ──────────────────────────────────────────────────── */}
      {activeTab === "timer" && (
        <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
          <div className="flex gap-1 bg-white rounded-2xl p-1 border border-border shadow-sm mb-8 w-full">
            {[{ id: "work", label: "Focus", duration: "25m" }, { id: "short", label: "Short Break", duration: "5m" }, { id: "long", label: "Long Break", duration: "15m" }].map(m => (
              <button key={m.id} onClick={() => switchMode(m.id as typeof mode)}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${mode === m.id ? "bg-primary text-white shadow-sm" : "text-muted-foreground"}`}
                style={{ fontFamily: "'Outfit', sans-serif" }}>
                {m.label}
              </button>
            ))}
          </div>

          <div className="relative w-52 h-52 mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--muted)" strokeWidth="12" />
              <circle cx="100" cy="100" r="90" fill="none" stroke={mode === "work" ? "var(--primary)" : "#10b981"} strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: "stroke-dashoffset 1s linear" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "3rem", lineHeight: 1 }}>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <div className="text-muted-foreground text-sm mt-2">{mode === "work" ? "Focus time" : "Break time"}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={reset} className="w-12 h-12 rounded-full bg-white border-2 border-border flex items-center justify-center shadow-sm">
              <RotateCcw size={20} className="text-muted-foreground" />
            </button>
            <button onClick={isRunning ? pause : start} className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg">
              {isRunning ? <Pause size={32} className="text-white" /> : <Play size={32} className="text-white ml-1" />}
            </button>
            <div className="w-12 h-12 rounded-full bg-white border-2 border-border flex items-center justify-center shadow-sm">
              <span className="font-bold text-sm text-muted-foreground">{sessions}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-4">{sessions} sessions · <span className="text-amber-500 font-bold">🪙 50</span> per session</p>

          <div className="w-full mt-6 bg-white rounded-2xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">STUDYING</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{linkedSet.icon}</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{linkedSet.name}</span>
              </div>
              <button onClick={() => setShowSetPicker(true)} className="text-primary text-sm font-semibold flex items-center gap-1">
                Change <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {showSetPicker && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-end" onClick={() => setShowSetPicker(false)}>
              <div className="bg-white w-full rounded-t-3xl p-5 pb-10" onClick={e => e.stopPropagation()}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.1rem", marginBottom: "1rem" }}>Choose Study Set</h3>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {allSetsForPicker.map(s => (
                    <button key={String(s.id)} onClick={() => { setLinkedSet(s as typeof linkedSet); setShowSetPicker(false); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${linkedSet.id === s.id ? "border-primary bg-primary/5" : "border-border bg-white"}`}>
                      <span className="text-2xl">{s.icon}</span>
                      <div className="text-left flex-1">
                        <p className="font-bold text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.subject} · {s.cards} cards</p>
                      </div>
                      {linkedSet.id === s.id && <Star size={16} className="fill-primary text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Notes ───────────────────────────────────────────────────────────── */}
      {activeTab === "notes" && (
        <div className="flex-1 flex flex-col p-4 gap-3">
          <div className="flex items-center justify-between">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.2rem" }}>Notes</h2>
            <button onClick={() => onEarnCoins(10, "Notes saved! 📝")}
              className="text-xs text-primary font-semibold bg-secondary px-3 py-1.5 rounded-xl border border-border">
              Save (+10 🪙)
            </button>
          </div>
          <textarea
            className="flex-1 bg-white border border-border rounded-2xl p-4 text-sm outline-none resize-none shadow-sm focus:border-primary transition-colors"
            placeholder="Start taking notes..."
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            style={{ fontFamily: "'Nunito', sans-serif", lineHeight: 1.7 }}
          />
          <p className="text-xs text-muted-foreground text-center">
            {noteText.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>
      )}

      {/* Import modal */}
      <AnimatePresence>
        {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
      </AnimatePresence>
    </div>
  );
}
