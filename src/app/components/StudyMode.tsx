import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, ChevronRight, X, Check, Star, Upload, Plus, Trash2, FileText, AlertCircle } from "lucide-react";
import { STUDY_SETS, QUIZ_QUESTIONS } from "../data/characters";
import { AnimatePresence, motion } from "motion/react";

const POMODORO_WORK = 25 * 60;
const POMODORO_SHORT = 5 * 60;
const POMODORO_LONG = 15 * 60;

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
      if (idx > 0) { split = [line.slice(0, idx).trim(), line.slice(idx + sep.length).trim()]; break; }
      if (sep === " - ") {
        const m = line.match(/^(.+?)\s+-\s+(.+)$/);
        if (m) { split = [m[1].trim(), m[2].trim()]; break; }
      }
    }
    if (split && split[0] && split[1]) cards.push({ front: split[0], back: split[1] });
  }
  return cards.length >= 2 ? cards : null;
}

// ─── Import Modal ──────────────────────────────────────────────────────────────
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
    if (!cards) { setError("Couldn't parse any cards. Each line needs term and definition separated by | or tab."); return; }
    setParsed(cards); setError(null); setStep("preview");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setRawText(ev.target?.result as string ?? ""); if (!name) setName(file.name.replace(/\.[^.]+$/, "")); };
    reader.readAsText(file);
  };

  const handleConfirm = () => {
    if (!parsed) return;
    const colorIdx = Math.floor(Math.random() * CUSTOM_SET_COLORS.length);
    const iconIdx = Math.floor(Math.random() * CUSTOM_SET_ICONS.length);
    onImport({ id: `custom-${Date.now()}`, name: name.trim(), subject: subject.trim() || "Custom", cards: parsed, color: CUSTOM_SET_COLORS[colorIdx], icon: CUSTOM_SET_ICONS[iconIdx], progress: 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="os-window w-full max-h-[85vh] overflow-y-auto"
        style={{ borderRadius: "8px 8px 0 0" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="os-titlebar">
          <div className="os-btn-red" onClick={onClose} style={{ cursor: "pointer" }} />
          <div className="os-btn-yellow" /><div className="os-btn-green" />
          <span className="os-titlebar-title">{step === "input" ? "IMPORT STUDY SET" : "PREVIEW CARDS"}</span>
        </div>

        <div className="p-5 pb-10" style={{ background: "#f0f8fc" }}>
          {step === "input" ? (
            <div className="space-y-4">
              <div>
                <label className="mono-label block mb-1" style={{ fontSize: "0.7rem" }}>SET NAME *</label>
                <input
                  className="w-full border-2 rounded px-3 py-2 text-sm font-semibold outline-none"
                  style={{ borderColor: "#7ab2c8", background: "#fff", color: "#1a3d52" }}
                  placeholder="e.g. Spanish Vocab Chapter 3"
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="mono-label block mb-1" style={{ fontSize: "0.7rem" }}>SUBJECT</label>
                <input
                  className="w-full border-2 rounded px-3 py-2 text-sm font-semibold outline-none"
                  style={{ borderColor: "#7ab2c8", background: "#fff", color: "#1a3d52" }}
                  placeholder="e.g. Languages, Science, History…"
                  value={subject} onChange={e => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="mono-label block mb-1" style={{ fontSize: "0.7rem" }}>PASTE CARDS</label>
                <div className="rounded p-3 mb-2 text-xs space-y-0.5 border-2" style={{ background: "#ddeef6", borderColor: "#7ab2c8", borderStyle: "dashed" }}>
                  <p className="font-bold" style={{ color: "#1a3d52" }}>Format (one card per line):</p>
                  <p style={{ color: "#5a7d8a" }}>term <span className="px-1 rounded font-mono" style={{ background: "#b0d0e2" }}>|</span> definition</p>
                  <p style={{ color: "#5a7d8a" }}>term <span className="px-1 rounded font-mono" style={{ background: "#b0d0e2" }}>TAB</span> definition</p>
                  <p style={{ color: "#5a7d8a" }}>term <span className="px-1 rounded font-mono" style={{ background: "#b0d0e2" }}> - </span> definition</p>
                </div>
                <textarea
                  className="w-full border-2 rounded p-3 text-sm outline-none resize-none"
                  style={{ borderColor: "#7ab2c8", background: "#fff", color: "#1a3d52", fontFamily: "monospace" }}
                  rows={8}
                  placeholder={"Bonjour | Hello\nMerci | Thank you\nS'il vous plaît | Please"}
                  value={rawText} onChange={e => setRawText(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "#b0d0e2" }} />
                <span className="mono-label" style={{ fontSize: "0.65rem" }}>OR</span>
                <div className="flex-1 h-px" style={{ background: "#b0d0e2" }} />
              </div>

              <button
                onClick={() => fileRef.current?.click()}
                className="retro-btn w-full py-3 flex items-center justify-center gap-2 text-sm"
                style={{ borderStyle: "dashed" }}
              >
                <Upload size={14} /> Upload .txt or .csv file
              </button>
              <input ref={fileRef} type="file" accept=".txt,.csv,.tsv" className="hidden" onChange={handleFile} />

              {error && (
                <div className="flex items-start gap-2 rounded p-3 border-2" style={{ background: "#ffeaea", borderColor: "#f87171" }}>
                  <AlertCircle size={14} style={{ color: "#dc2626", flexShrink: 0, marginTop: 2 }} />
                  <p className="text-xs font-semibold" style={{ color: "#b91c1c" }}>{error}</p>
                </div>
              )}

              <button
                onClick={handleParse}
                disabled={!rawText.trim() || !name.trim()}
                className="retro-btn retro-btn-primary w-full py-3 disabled:opacity-40"
              >
                <span className="vt" style={{ fontSize: "1rem" }}>PREVIEW CARDS →</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded p-4 border-2" style={{ background: "#ddeef6", borderColor: "#7ab2c8" }}>
                <p className="font-bold text-sm" style={{ color: "#1a3d52" }}>{name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#5a7d8a" }}>{subject || "Custom"} · {parsed?.length} cards found</p>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {parsed?.map((card, i) => (
                  <div key={i} className="os-window">
                    <div className="flex gap-3 p-3" style={{ background: "#fff" }}>
                      <span className="mono-label w-5 flex-shrink-0 mt-0.5" style={{ fontSize: "0.6rem" }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "#1a3d52" }}>{card.front}</p>
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "#5a7d8a" }}>{card.back}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setStep("input"); setError(null); }} className="retro-btn flex-1 py-2.5">← EDIT</button>
                <button onClick={handleConfirm} className="retro-btn retro-btn-primary flex-1 py-2.5">
                  <span className="vt" style={{ fontSize: "1rem" }}>ADD SET ✓</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Inline Quiz ───────────────────────────────────────────────────────────────
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
      <p className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>Need at least 2 cards to generate a quiz.</p>
      <button onClick={onBack} className="retro-btn retro-btn-primary py-2 px-6">GO BACK</button>
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
      <p className="vt" style={{ fontSize: "1.8rem", color: "#1a3d52" }}>QUIZ DONE!</p>
      <p className="mt-1" style={{ color: "#5a7d8a" }}>{score}/{questions.length} correct</p>
      <div className="vt mt-3" style={{ fontSize: "1.4rem", color: "#d97706" }}>🪙 +{totalCoins}</div>
      <div className="flex gap-3 mt-6 w-full max-w-xs">
        <button onClick={onBack} className="retro-btn flex-1 py-2.5">BACK</button>
        <button onClick={() => { setQIdx(0); setSelected(null); setScore(0); setTotalCoins(0); setDone(false); setStreak(0); }} className="retro-btn retro-btn-primary flex-1 py-2.5">AGAIN</button>
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
            <div className="h-full transition-all" style={{ width: `${(qIdx / questions.length) * 100}%`, background: "#5b9aba" }} />
          </div>
        </div>
        <span className="mono-label" style={{ fontSize: "0.65rem" }}>{qIdx + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 flex flex-col">
          <div className="os-window mb-3">
            <div className="os-titlebar py-1">
              <div className="os-btn-green" />
              <span className="os-titlebar-title" style={{ fontSize: "0.7rem" }}>QUESTION {qIdx + 1}</span>
            </div>
            <div className="p-4" style={{ background: "#fff" }}>
              <p className="font-semibold" style={{ fontSize: "1rem", lineHeight: 1.4, color: "#1a3d52" }}>{q.question}</p>
              <p className="text-xs font-semibold mt-2" style={{ color: "#d97706" }}>🪙 +{q.coins}{streak > 1 ? ` · 🔥 ${streak}x` : ""}</p>
            </div>
          </div>
          <div className="space-y-2.5">
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
                    fontSize: "0.9rem",
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

// ─── Inline Flashcards ─────────────────────────────────────────────────────────
function InlineFlashcards({ setId, customCards, setName, onBack, onEarnCoins }: {
  setId: number | string; customCards?: Flashcard[]; setName: string; onBack: () => void;
  onEarnCoins: (amount: number, reason: string) => void;
}) {
  const cards: Flashcard[] = typeof setId === "string" ? (customCards ?? []) : (SET_FLASHCARDS[setId as number] ?? []);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));
  const [done, setDone] = useState(false);

  const goTo = (newIdx: number) => { setIdx(newIdx); setFlipped(false); setSeen(prev => { const n = new Set(prev); n.add(newIdx); return n; }); };

  if (cards.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
      <div className="text-4xl">📭</div>
      <p className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>No flashcards in this set yet.</p>
      <button onClick={onBack} className="retro-btn retro-btn-primary py-2 px-6">GO BACK</button>
    </div>
  );

  if (done) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-5xl mb-3">🃏</div>
      <p className="vt" style={{ fontSize: "1.8rem", color: "#1a3d52" }}>ALL DONE!</p>
      <p className="mt-1" style={{ color: "#5a7d8a" }}>Reviewed {cards.length} cards</p>
      <div className="vt mt-3" style={{ fontSize: "1.4rem", color: "#d97706" }}>🪙 +40</div>
      <div className="flex gap-3 mt-6 w-full max-w-xs">
        <button onClick={onBack} className="retro-btn flex-1 py-2.5">BACK</button>
        <button onClick={() => { setIdx(0); setFlipped(false); setSeen(new Set([0])); setDone(false); }} className="retro-btn retro-btn-primary flex-1 py-2.5">AGAIN</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-3 items-center">
      <div className="flex items-center gap-3 w-full mb-3">
        <button onClick={onBack} className="retro-btn w-9 h-9 flex items-center justify-center p-0">
          <X size={16} style={{ color: "#5a7d8a" }} />
        </button>
        <div className="flex-1">
          <p className="mono-label" style={{ fontSize: "0.65rem" }}>{setName} · FLASHCARDS</p>
          <div className="h-2 rounded overflow-hidden border mt-1" style={{ background: "#ddeef6", borderColor: "#7ab2c8" }}>
            <div className="h-full transition-all" style={{ width: `${(seen.size / cards.length) * 100}%`, background: "#5b9aba" }} />
          </div>
        </div>
        <span className="mono-label" style={{ fontSize: "0.65rem" }}>{idx + 1}/{cards.length}</span>
      </div>
      <p className="mono-label mb-3" style={{ fontSize: "0.65rem" }}>TAP CARD TO FLIP · +40 🪙 ON COMPLETE</p>
      <div className="w-full max-w-sm" style={{ perspective: 800 }} onClick={() => setFlipped(f => !f)}>
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.45 }} style={{ transformStyle: "preserve-3d", position: "relative", height: 200 }}>
          <div className="absolute inset-0 rounded flex items-center justify-center p-6 text-center border-2 cursor-pointer"
            style={{ backfaceVisibility: "hidden", background: "#fff", borderColor: "#5b9aba", boxShadow: "3px 3px 0 #7ab2c8" }}>
            <p className="font-semibold" style={{ fontSize: "1rem", color: "#1a3d52" }}>{cards[idx].front}</p>
          </div>
          <div className="absolute inset-0 rounded flex items-center justify-center p-6 text-center border-2 cursor-pointer"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#5b9aba", borderColor: "#3d7a98", boxShadow: "3px 3px 0 #3d7a98" }}>
            <p className="font-semibold text-sm leading-relaxed" style={{ color: "#fff" }}>{cards[idx].back}</p>
          </div>
        </motion.div>
      </div>
      <div className="flex gap-3 mt-5 w-full max-w-sm">
        <button onClick={() => goTo(idx - 1)} disabled={idx === 0} className="retro-btn flex-1 py-2.5 disabled:opacity-40">← PREV</button>
        {idx === cards.length - 1
          ? <button onClick={() => { onEarnCoins(40, "🃏 Flashcards complete!"); setDone(true); }} className="retro-btn flex-1 py-2.5" style={{ background: "#4ade80", color: "#fff", borderColor: "#22c55e" }}>DONE ✓</button>
          : <button onClick={() => goTo(idx + 1)} className="retro-btn retro-btn-primary flex-1 py-2.5">NEXT →</button>
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
      <p className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>Need at least 2 cards for a match game.</p>
      <button onClick={onBack} className="retro-btn retro-btn-primary py-2 px-6">GO BACK</button>
    </div>
  );

  if (done) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-5xl mb-3">🧩</div>
      <p className="vt" style={{ fontSize: "1.8rem", color: "#1a3d52" }}>MATCHED!</p>
      <p className="mt-1" style={{ color: "#5a7d8a" }}>All {pairs.length} pairs found</p>
      <div className="vt mt-3" style={{ fontSize: "1.4rem", color: "#d97706" }}>🪙 +50</div>
      <div className="flex gap-3 mt-6 w-full max-w-xs">
        <button onClick={onBack} className="retro-btn flex-1 py-2.5">BACK</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-3">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onBack} className="retro-btn w-9 h-9 flex items-center justify-center p-0">
          <X size={16} style={{ color: "#5a7d8a" }} />
        </button>
        <div>
          <p className="font-bold text-sm" style={{ color: "#1a3d52" }}>{setName} · Match</p>
          <p className="mono-label" style={{ fontSize: "0.6rem" }}>{matched.length}/{pairs.length} matched · +50 🪙</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        <div className="space-y-2">
          <p className="mono-label text-center mb-2" style={{ fontSize: "0.65rem" }}>TERM</p>
          {termOrder.map((pairIdx, i) => (
            <button key={i} onClick={() => handleSelect("terms", i)}
              className="retro-btn w-full p-2.5 text-xs text-left leading-snug"
              style={{
                background: isMatched(i) ? "#d1f0e0" : isWrong("terms", i) ? "#ffeaea" : isSelected("terms", i) ? "#ddeef6" : "#fff",
                borderColor: isMatched(i) ? "#22c55e" : isWrong("terms", i) ? "#f87171" : isSelected("terms", i) ? "#5b9aba" : "#7ab2c8",
                color: isMatched(i) ? "#166534" : isWrong("terms", i) ? "#b91c1c" : isSelected("terms", i) ? "#1a3d52" : "#2a5a70",
                opacity: isMatched(i) ? 0.6 : 1,
              }}>
              {pairs[pairIdx].term}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="mono-label text-center mb-2" style={{ fontSize: "0.65rem" }}>DEFINITION</p>
          {defOrder.map((pairIdx, i) => {
            const matchedTermIdx = termOrder.findIndex(t => t === pairIdx);
            const matchedAlready = isMatched(matchedTermIdx);
            return (
              <button key={i} onClick={() => handleSelect("defs", i)}
                className="retro-btn w-full p-2.5 text-xs text-left leading-snug"
                style={{
                  background: matchedAlready ? "#d1f0e0" : isWrong("defs", i) ? "#ffeaea" : isSelected("defs", i) ? "#ddeef6" : "#fff",
                  borderColor: matchedAlready ? "#22c55e" : isWrong("defs", i) ? "#f87171" : isSelected("defs", i) ? "#5b9aba" : "#7ab2c8",
                  color: matchedAlready ? "#166534" : isWrong("defs", i) ? "#b91c1c" : isSelected("defs", i) ? "#1a3d52" : "#2a5a70",
                  opacity: matchedAlready ? 0.6 : 1,
                }}>
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
interface Props { onEarnCoins: (amount: number, reason: string) => void; onTrackStudyMinutes?: (minutes: number) => void; }

type StudyView = null | {
  type: "quiz" | "flashcards" | "match";
  setId: number | string;
  setName: string;
  customCards?: Flashcard[];
};

export function StudyMode({ onEarnCoins, onTrackStudyMinutes }: Props) {
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
          if (mode === "work") { setSessions(s => s + 1); onEarnCoins(50, "Pomodoro complete! 🍅"); onTrackStudyMinutes?.(25); }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [mode, onEarnCoins, onTrackStudyMinutes]);

  const pause = useCallback(() => { setIsRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); }, []);
  const reset = useCallback(() => { pause(); setTimeLeft(maxTime); }, [pause, maxTime]);
  const switchMode = (m: "work" | "short" | "long") => { pause(); setMode(m); setTimeLeft(m === "work" ? POMODORO_WORK : m === "short" ? POMODORO_SHORT : POMODORO_LONG); };
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const handleImport = (set: CustomStudySet) => setCustomSets(prev => [...prev, set]);
  const handleDeleteCustom = (id: string) => setCustomSets(prev => prev.filter(s => s.id !== id));

  const allSetsForPicker = [...STUDY_SETS, ...customSets.map(s => ({ id: s.id as unknown as number, name: s.name, subject: s.subject, cards: s.cards.length, progress: s.progress, color: s.color, icon: s.icon }))];

  const tabs = [
    { id: "sets", label: "📚 SETS" },
    { id: "timer", label: "🍅 TIMER" },
    { id: "notes", label: "📝 NOTES" },
  ] as const;

  if (studyView) {
    const props = { setId: studyView.setId, customCards: studyView.customCards, setName: studyView.setName, onBack: () => setStudyView(null), onEarnCoins };
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
      {/* Header */}
      <div className="os-window mx-3 mt-3 mb-2 flex-shrink-0">
        <div className="os-titlebar">
          <div className="os-btn-red" /><div className="os-btn-yellow" /><div className="os-btn-green" />
          <span className="os-titlebar-title">STUDY.EXE</span>
        </div>
        <div style={{ background: "#ddeef6", padding: "6px 10px" }}>
          <span className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>📚 STUDY HUB — Flashcards · Pomodoro · Notes</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 pb-2 flex-shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="retro-btn flex-1 py-1.5 text-center"
            style={activeTab === tab.id ? { background: "#5b9aba", color: "#fff", borderColor: "#3d7a98", fontSize: "0.75rem" } : { fontSize: "0.75rem" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Study Sets ─────────────────────────────────────────────────────── */}
      {activeTab === "sets" && (
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>STUDY SETS</span>
            <button onClick={() => setShowImport(true)} className="retro-btn retro-btn-primary text-xs py-1 px-2 flex items-center gap-1">
              <Upload size={11} /> IMPORT
            </button>
          </div>

          {STUDY_SETS.map(set => (
            <div key={set.id} className="os-window">
              <div className="os-titlebar py-1">
                <div className="os-btn-green" />
                <span className="os-titlebar-title" style={{ fontSize: "0.75rem" }}>{set.name.toUpperCase()} — {set.subject.toUpperCase()}</span>
                <span className="vt ml-1" style={{ fontSize: "0.85rem", color: "#5b9aba" }}>{set.progress}%</span>
              </div>
              <div style={{ background: "#fff" }}>
                {/* Progress bar */}
                <div className="h-1.5" style={{ background: "#ddeef6" }}>
                  <div className="h-full transition-all" style={{ width: `${set.progress}%`, background: "#5b9aba" }} />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{set.icon}</span>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#1a3d52" }}>{set.name}</p>
                      <p className="text-xs" style={{ color: "#5a7d8a" }}>{set.subject} · {set.cards} cards</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {(["Quiz", "Flashcards", "Match"] as const).map(m => (
                      <button key={m}
                        onClick={() => setStudyView({ type: m.toLowerCase() as "quiz" | "flashcards" | "match", setId: set.id, setName: set.name })}
                        className="retro-btn flex-1 py-1 text-xs text-center">
                        {m.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {customSets.length > 0 && (
            <>
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-px" style={{ background: "#b0d0e2" }} />
                <span className="mono-label" style={{ fontSize: "0.65rem" }}>MY IMPORTS</span>
                <div className="flex-1 h-px" style={{ background: "#b0d0e2" }} />
              </div>
              {customSets.map(set => (
                <div key={set.id} className="os-window">
                  <div className="os-titlebar py-1">
                    <div className="os-btn-yellow" />
                    <span className="os-titlebar-title" style={{ fontSize: "0.75rem" }}>{set.name.toUpperCase()} [IMPORTED]</span>
                    <button onClick={() => handleDeleteCustom(set.id)} className="ml-1 p-0.5 rounded" style={{ color: "#dc2626" }}>
                      <Trash2 size={10} />
                    </button>
                  </div>
                  <div className="p-3" style={{ background: "#fff" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{set.icon}</span>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "#1a3d52" }}>{set.name}</p>
                        <p className="text-xs" style={{ color: "#5a7d8a" }}>{set.subject} · {set.cards.length} cards</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {(["Quiz", "Flashcards", "Match"] as const).map(m => (
                        <button key={m}
                          onClick={() => setStudyView({ type: m.toLowerCase() as "quiz" | "flashcards" | "match", setId: set.id, setName: set.name, customCards: set.cards })}
                          className="retro-btn flex-1 py-1 text-xs text-center">
                          {m.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {customSets.length === 0 && (
            <button onClick={() => setShowImport(true)} className="retro-btn w-full py-4 flex flex-col items-center gap-2" style={{ borderStyle: "dashed" }}>
              <FileText size={18} style={{ color: "#5b9aba" }} />
              <span className="vt" style={{ fontSize: "0.9rem", color: "#1a3d52" }}>IMPORT YOUR OWN STUDY SET</span>
              <span className="text-xs" style={{ color: "#8aaab8" }}>Paste terms & definitions, or upload a file</span>
            </button>
          )}
        </div>
      )}

      {/* ── Pomodoro Timer ─────────────────────────────────────────────────── */}
      {activeTab === "timer" && (
        <div className="flex-1 flex flex-col items-center px-3 pb-4 overflow-y-auto">
          <div className="flex gap-1 w-full mb-6 mt-1">
            {[{ id: "work", label: "FOCUS", duration: "25m" }, { id: "short", label: "SHORT BRK", duration: "5m" }, { id: "long", label: "LONG BRK", duration: "15m" }].map(m => (
              <button key={m.id} onClick={() => switchMode(m.id as typeof mode)}
                className="retro-btn flex-1 py-1.5 text-center"
                style={mode === m.id ? { background: "#5b9aba", color: "#fff", borderColor: "#3d7a98", fontSize: "0.7rem" } : { fontSize: "0.7rem" }}>
                {m.label}
              </button>
            ))}
          </div>

          <div className="relative w-52 h-52 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#ddeef6" strokeWidth="12" />
              <circle cx="100" cy="100" r="90" fill="none" stroke={mode === "work" ? "#5b9aba" : "#4ade80"} strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: "stroke-dashoffset 1s linear" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="vt" style={{ fontSize: "3rem", lineHeight: 1, color: "#1a3d52" }}>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <div className="mono-label mt-2" style={{ fontSize: "0.65rem" }}>{mode === "work" ? "FOCUS TIME" : "BREAK TIME"}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <button onClick={reset} className="retro-btn w-12 h-12 flex items-center justify-center p-0">
              <RotateCcw size={18} style={{ color: "#5a7d8a" }} />
            </button>
            <button onClick={isRunning ? pause : start} className="w-20 h-20 rounded-full flex items-center justify-center border-4" style={{ background: "#5b9aba", borderColor: "#3d7a98", boxShadow: "3px 3px 0 #3d7a98" }}>
              {isRunning ? <Pause size={28} color="#fff" /> : <Play size={28} color="#fff" className="ml-1" />}
            </button>
            <div className="retro-btn w-12 h-12 flex items-center justify-center p-0">
              <span className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>{sessions}</span>
            </div>
          </div>
          <p className="mono-label mb-4" style={{ fontSize: "0.65rem" }}>
            {sessions} SESSIONS · <span style={{ color: "#d97706" }}>🪙 50 PER SESSION</span>
          </p>

          <div className="os-window w-full">
            <div className="os-titlebar py-1">
              <div className="os-btn-green" />
              <span className="os-titlebar-title" style={{ fontSize: "0.7rem" }}>STUDYING</span>
            </div>
            <div className="flex items-center justify-between p-3" style={{ background: "#fff" }}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{linkedSet.icon}</span>
                <span className="font-semibold text-sm" style={{ color: "#1a3d52" }}>{linkedSet.name}</span>
              </div>
              <button onClick={() => setShowSetPicker(true)} className="retro-btn text-xs py-1 px-2 flex items-center gap-1">
                CHANGE <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {showSetPicker && (
            <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setShowSetPicker(false)}>
              <div className="os-window w-full" style={{ borderRadius: "8px 8px 0 0" }} onClick={e => e.stopPropagation()}>
                <div className="os-titlebar">
                  <div className="os-btn-red" onClick={() => setShowSetPicker(false)} style={{ cursor: "pointer" }} />
                  <div className="os-btn-yellow" /><div className="os-btn-green" />
                  <span className="os-titlebar-title">CHOOSE STUDY SET</span>
                </div>
                <div className="p-4 pb-10 space-y-2 max-h-72 overflow-y-auto" style={{ background: "#f0f8fc" }}>
                  {allSetsForPicker.map(s => (
                    <button key={String(s.id)} onClick={() => { setLinkedSet(s as typeof linkedSet); setShowSetPicker(false); }}
                      className="retro-btn w-full flex items-center gap-3 p-2.5 text-left"
                      style={linkedSet.id === s.id ? { background: "#ddeef6", borderColor: "#5b9aba" } : {}}>
                      <span className="text-xl">{s.icon}</span>
                      <div className="text-left flex-1">
                        <p className="font-bold text-sm" style={{ color: "#1a3d52" }}>{s.name}</p>
                        <p className="text-xs" style={{ color: "#5a7d8a" }}>{s.subject}</p>
                      </div>
                      {linkedSet.id === s.id && <Star size={14} style={{ color: "#5b9aba", fill: "#5b9aba" }} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Notes ──────────────────────────────────────────────────────────── */}
      {activeTab === "notes" && (
        <div className="flex-1 flex flex-col px-3 pb-4 gap-2">
          <div className="flex items-center justify-between">
            <span className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52" }}>NOTES</span>
            <button onClick={() => onEarnCoins(10, "Notes saved! 📝")} className="retro-btn retro-btn-primary text-xs py-1 px-2">
              SAVE (+10 🪙)
            </button>
          </div>
          <textarea
            className="flex-1 border-2 rounded p-3 text-sm outline-none resize-none"
            style={{ borderColor: "#7ab2c8", background: "#fff", color: "#1a3d52", lineHeight: 1.7, fontFamily: "monospace" }}
            placeholder="Start taking notes..."
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
          />
          <p className="mono-label text-center" style={{ fontSize: "0.6rem" }}>
            {noteText.trim().split(/\s+/).filter(Boolean).length} WORDS
          </p>
        </div>
      )}

      <AnimatePresence>
        {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
      </AnimatePresence>
    </div>
  );
}
