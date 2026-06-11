import { useState } from "react";
import { X, Check, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QUIZ_QUESTIONS } from "../data/characters";

const GAMES = [
  { id: "quiz", name: "Quiz Battle", description: "Answer questions to earn coins", icon: "❓", color: "from-blue-500 to-indigo-600", available: true },
  { id: "flashcard", name: "Flashcard Flip", description: "Flip cards to memorize", icon: "🃏", color: "from-purple-500 to-violet-600", available: true },
  { id: "memory", name: "Memory Match", description: "Find matching pairs", icon: "🧠", color: "from-green-500 to-emerald-600", available: false },
  { id: "fillblank", name: "Fill the Blank", description: "Complete story sentences", icon: "✍️", color: "from-orange-500 to-amber-500", available: false },
  { id: "falling", name: "Falling Terms", description: "Catch the right answers", icon: "⬇️", color: "from-pink-500 to-rose-500", available: false },
  { id: "boss", name: "Boss Battle Exam", description: "Fight the Boss with knowledge", icon: "👹", color: "from-red-600 to-orange-600", available: false },
  { id: "spaced", name: "Spaced Repetition", description: "Smart review scheduling", icon: "🔁", color: "from-teal-500 to-cyan-500", available: false },
];

interface FlashCard {
  front: string;
  back: string;
}

const FLASHCARDS: FlashCard[] = [
  { front: "What is Dazai's ability?", back: "No Longer Human — Nullifies any supernatural ability" },
  { front: "What faction is Atsushi in?", back: "Armed Detective Agency (ADA)" },
  { front: "What is the element triangle?", back: "Logic > Emotion > Strength > Logic" },
  { front: "Who leads Port Mafia?", back: "Mori Ougai" },
  { front: "What does Chuuya's Corruption do?", back: "Grants immense power at the cost of control. ATK ×3 but loses consciousness." },
];

interface QuizGameProps {
  onEarnCoins: (amount: number, reason: string) => void;
  onBack: () => void;
}

function QuizGame({ onEarnCoins, onBack }: QuizGameProps) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  const q = QUIZ_QUESTIONS[qIndex];

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
      onEarnCoins(earned, `Correct! ${newStreak > 1 ? `🔥 ${newStreak}x streak!` : ""}`);
    }
    setTimeout(() => {
      if (qIndex + 1 >= QUIZ_QUESTIONS.length) {
        setDone(true);
      } else {
        setQIndex(i => i + 1);
        setSelected(null);
      }
    }, 1200);
  };

  if (done) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "var(--foreground)" }}>Quiz Complete!</h2>
        <p className="text-muted-foreground mt-2">{score} / {QUIZ_QUESTIONS.length} correct</p>
        <div className="flex items-center gap-2 mt-4 text-2xl font-bold text-amber-500">
          🪙 +{totalCoins}
        </div>
        <div className="mt-6 w-full max-w-xs">
          <div className="bg-white rounded-2xl border border-border p-4 mb-3">
            <div className="text-sm text-muted-foreground mb-1">Accuracy</div>
            <div className="text-3xl font-bold text-primary" style={{ fontFamily: "'Outfit', sans-serif" }}>{Math.round((score / QUIZ_QUESTIONS.length) * 100)}%</div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(score / QUIZ_QUESTIONS.length) * 100}%` }} />
            </div>
          </div>
          <button onClick={onBack} className="w-full bg-primary text-white rounded-2xl py-3 font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Back to Games
          </button>
          <button onClick={() => { setQIndex(0); setSelected(null); setScore(0); setTotalCoins(0); setDone(false); setStreak(0); }} className="w-full mt-2 bg-white border-2 border-primary text-primary rounded-2xl py-3 font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center">
          <X size={18} className="text-muted-foreground" />
        </button>
        <div className="flex items-center gap-4">
          {streak > 1 && (
            <span className="text-sm font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">🔥 {streak}x</span>
          )}
          <span className="text-sm font-semibold text-muted-foreground">{qIndex + 1} / {QUIZ_QUESTIONS.length}</span>
        </div>
        <div className="flex items-center gap-1 text-amber-500 font-bold">
          🪙 {totalCoins}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-6">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(qIndex / QUIZ_QUESTIONS.length) * 100}%` }} />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="flex-1 flex flex-col"
        >
          <div className="bg-white rounded-3xl p-6 border border-border shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle size={18} className="text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Question {qIndex + 1}</span>
            </div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)", lineHeight: 1.4 }}>
              {q.question}
            </p>
            <div className="flex items-center gap-1 mt-3 text-amber-500">
              <span className="text-xs font-semibold">🪙 +{q.coins} reward</span>
            </div>
          </div>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.answer;
              const isSelected = i === selected;
              const isWrong = isSelected && !isCorrect;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`w-full text-left rounded-2xl p-4 border-2 font-semibold transition-all active:scale-98 ${
                    selected === null
                      ? "bg-white border-border hover:border-primary hover:bg-secondary"
                      : isCorrect
                      ? "bg-green-50 border-green-400 text-green-700"
                      : isWrong
                      ? "bg-red-50 border-red-400 text-red-700"
                      : "bg-white border-border opacity-50"
                  }`}
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selected !== null && isCorrect && <Check size={18} className="text-green-500 flex-shrink-0" />}
                    {isWrong && <X size={18} className="text-red-500 flex-shrink-0" />}
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

function FlashcardGame({ onBack }: { onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = FLASHCARDS[index];

  return (
    <div className="flex-1 flex flex-col p-4 items-center">
      <div className="flex items-center justify-between w-full mb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center">
          <X size={18} className="text-muted-foreground" />
        </button>
        <span className="text-sm text-muted-foreground">{index + 1} / {FLASHCARDS.length}</span>
        <div />
      </div>

      <p className="text-muted-foreground text-sm mb-4">Tap card to flip</p>

      <div className="w-full max-w-sm" style={{ perspective: 800 }} onClick={() => setFlipped(f => !f)}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: "preserve-3d", position: "relative", height: 240 }}
        >
          <div className="absolute inset-0 rounded-3xl bg-white border-2 border-primary shadow-lg flex items-center justify-center p-6 text-center" style={{ backfaceVisibility: "hidden" }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)" }}>{card.front}</p>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-indigo-700 shadow-lg flex items-center justify-center p-6 text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <p className="text-white font-semibold text-base">{card.back}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={() => { setIndex(i => Math.max(0, i - 1)); setFlipped(false); }}
          disabled={index === 0}
          className="flex-1 py-3 rounded-2xl bg-white border-2 border-border text-muted-foreground font-semibold disabled:opacity-40"
        >
          ← Prev
        </button>
        <button
          onClick={() => { setIndex(i => Math.min(FLASHCARDS.length - 1, i + 1)); setFlipped(false); }}
          disabled={index === FLASHCARDS.length - 1}
          className="flex-1 py-3 rounded-2xl bg-primary text-white font-semibold disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

interface Props {
  onEarnCoins: (amount: number, reason: string) => void;
}

export function GamesHub({ onEarnCoins }: Props) {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame === "quiz") return (
    <div className="h-full flex flex-col">
      <QuizGame onEarnCoins={onEarnCoins} onBack={() => setActiveGame(null)} />
    </div>
  );

  if (activeGame === "flashcard") return (
    <div className="h-full flex flex-col">
      <FlashcardGame onBack={() => setActiveGame(null)} />
    </div>
  );

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--foreground)" }}>Study Games</h2>
      <div className="grid grid-cols-2 gap-3">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => game.available ? setActiveGame(game.id) : null}
            disabled={!game.available}
            className={`relative rounded-3xl p-5 text-left bg-gradient-to-br ${game.color} text-white shadow-sm active:scale-95 transition-transform ${!game.available ? "opacity-60" : ""}`}
          >
            {!game.available && (
              <span className="absolute top-2 right-2 bg-black/30 text-white text-xs px-2 py-0.5 rounded-full">Soon</span>
            )}
            <div className="text-3xl mb-3">{game.icon}</div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>{game.name}</p>
            <p className="text-white/70 text-xs mt-1">{game.description}</p>
          </button>
        ))}
      </div>

      {/* Coin rewards info */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
        <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>💡 How to earn coins</p>
        <div className="space-y-2">
          {[
            { action: "Quiz correct answer", coins: "10–25 🪙" },
            { action: "Quiz streak bonus", coins: "+5/streak 🪙" },
            { action: "Pomodoro session", coins: "50 🪙" },
            { action: "Notes saved", coins: "10 🪙" },
            { action: "Battle win", coins: "100 🪙" },
          ].map(item => (
            <div key={item.action} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.action}</span>
              <span className="font-semibold text-amber-500">{item.coins}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
