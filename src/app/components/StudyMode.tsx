import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Plus, Upload, Globe, Youtube, FileText, ChevronRight, Book } from "lucide-react";
import { STUDY_SETS } from "../data/characters";

const POMODORO_WORK = 25 * 60;
const POMODORO_SHORT = 5 * 60;
const POMODORO_LONG = 15 * 60;

interface Props {
  onEarnCoins: (amount: number, reason: string) => void;
}

export function StudyMode({ onEarnCoins }: Props) {
  const [activeTab, setActiveTab] = useState<"sets" | "timer" | "notes">("sets");
  const [timeLeft, setTimeLeft] = useState(POMODORO_WORK);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "short" | "long">("work");
  const [sessions, setSessions] = useState(0);
  const [noteText, setNoteText] = useState("# My Study Notes\n\nStart typing here...");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxTime = mode === "work" ? POMODORO_WORK : mode === "short" ? POMODORO_SHORT : POMODORO_LONG;
  const progress = ((maxTime - timeLeft) / maxTime) * 100;

  const start = useCallback(() => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          if (mode === "work") {
            setSessions(s => s + 1);
            onEarnCoins(50, "Pomodoro complete! 🍅");
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [mode, onEarnCoins]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    pause();
    setTimeLeft(maxTime);
  }, [pause, maxTime]);

  const switchMode = (m: "work" | "short" | "long") => {
    pause();
    setMode(m);
    setTimeLeft(m === "work" ? POMODORO_WORK : m === "short" ? POMODORO_SHORT : POMODORO_LONG);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const tabs = [
    { id: "sets", label: "Study Sets", icon: "📚" },
    { id: "timer", label: "Pomodoro", icon: "🍅" },
    { id: "notes", label: "Notes", icon: "📝" },
  ] as const;

  return (
    <div className="h-full flex flex-col">
      {/* Tab nav */}
      <div className="flex gap-1 p-4 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab.id ? "bg-primary text-white shadow-sm" : "bg-white text-muted-foreground border border-border"}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Study Sets */}
      {activeTab === "sets" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "var(--foreground)" }}>Study Sets</h2>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 bg-primary text-white text-sm px-3 py-2 rounded-xl font-semibold"
            >
              <Plus size={14} /> Import
            </button>
          </div>

          {STUDY_SETS.map(set => (
            <div key={set.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${set.color}`} style={{ width: `${set.progress}%` }} />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{set.icon}</span>
                    <div>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>{set.name}</p>
                      <p className="text-xs text-muted-foreground">{set.subject} · {set.cards} cards</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{set.progress}%</p>
                    <p className="text-xs text-muted-foreground">mastered</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {["Quiz", "Flashcards", "Match"].map(mode => (
                    <button
                      key={mode}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-primary hover:text-white transition-colors"
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Import modal */}
          {showImport && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-end" onClick={() => setShowImport(false)}>
              <div className="bg-white w-full rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "var(--foreground)", marginBottom: "1rem" }}>Import Study Material</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { icon: <FileText size={20} />, label: "Paste Text", color: "from-blue-500 to-indigo-500" },
                    { icon: <Globe size={20} />, label: "From URL", color: "from-green-500 to-emerald-500" },
                    { icon: <Youtube size={20} />, label: "YouTube", color: "from-red-500 to-rose-500" },
                    { icon: <Upload size={20} />, label: "Upload PDF", color: "from-purple-500 to-violet-500" },
                  ].map(item => (
                    <button key={item.label} className={`bg-gradient-to-br ${item.color} text-white rounded-2xl p-4 flex items-center gap-3 font-semibold`}>
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full h-32 bg-secondary rounded-2xl p-4 text-sm outline-none resize-none"
                  placeholder="Or paste your study material here..."
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                />
                <button
                  className="w-full mt-3 bg-primary text-white rounded-2xl py-3 font-bold"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                  onClick={() => setShowImport(false)}
                >
                  Generate Study Set with AI ✨
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pomodoro Timer */}
      {activeTab === "timer" && (
        <div className="flex-1 flex flex-col items-center p-6">
          {/* Mode selector */}
          <div className="flex gap-2 bg-white rounded-2xl p-1 border border-border shadow-sm mb-8">
            {[
              { id: "work", label: "Focus", duration: "25m" },
              { id: "short", label: "Short Break", duration: "5m" },
              { id: "long", label: "Long Break", duration: "15m" },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => switchMode(m.id as typeof mode)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${mode === m.id ? "bg-primary text-white" : "text-muted-foreground"}`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Circular timer */}
          <div className="relative w-52 h-52 mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--muted)" strokeWidth="12" />
              <circle
                cx="100" cy="100" r="90" fill="none"
                stroke={mode === "work" ? "var(--primary)" : "#10b981"}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "3rem", color: "var(--foreground)", lineHeight: 1 }}>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <div className="text-muted-foreground text-sm mt-2">
                {mode === "work" ? "Focus time" : "Break time"}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button onClick={reset} className="w-12 h-12 rounded-full bg-white border-2 border-border flex items-center justify-center shadow-sm">
              <RotateCcw size={20} className="text-muted-foreground" />
            </button>
            <button
              onClick={isRunning ? pause : start}
              className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg"
            >
              {isRunning
                ? <Pause size={32} className="text-white" />
                : <Play size={32} className="text-white ml-1" />
              }
            </button>
            <div className="w-12 h-12 rounded-full bg-white border-2 border-border flex items-center justify-center shadow-sm">
              <span className="font-bold text-sm text-muted-foreground">{sessions}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mt-4">
            {sessions} sessions today · Earn <span className="text-amber-500 font-bold">🪙 50</span> per session
          </p>

          {/* Linked study set */}
          <div className="w-full mt-6 bg-white rounded-2xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-2">Studying</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📐</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>Calculus</span>
              </div>
              <button className="text-primary text-sm font-semibold flex items-center gap-1">
                Change <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {activeTab === "notes" && (
        <div className="flex-1 flex flex-col p-4 gap-3">
          <div className="flex items-center justify-between">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "var(--foreground)" }}>Notes</h2>
            <button
              onClick={() => onEarnCoins(10, "Notes written! 📝")}
              className="text-xs text-primary font-semibold bg-secondary px-3 py-1.5 rounded-xl"
            >
              Save (+10 🪙)
            </button>
          </div>
          <textarea
            className="flex-1 bg-white border border-border rounded-2xl p-4 text-sm outline-none resize-none shadow-sm"
            placeholder="Start taking notes..."
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            style={{ fontFamily: "'Nunito', sans-serif", color: "var(--foreground)", lineHeight: 1.7 }}
          />
        </div>
      )}
    </div>
  );
}
