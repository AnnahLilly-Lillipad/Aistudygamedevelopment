import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CHARACTERS } from "../data/characters";
import { CardImage } from "./CardImage";
import type { UserProfile } from "../hooks/useGameState";

const AVATARS = ["🧙", "⚡", "🌸", "🎭", "🐯", "👑", "🔮", "🌊", "🔥", "💫", "🗡️", "🦋"];

const SHOWCASE_IDS = [1, 11, 20];

interface Props {
  onLogin: (profile: UserProfile) => void;
}

export function LoginScreen({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🧙");
  const [error, setError] = useState("");

  const showcaseChars = SHOWCASE_IDS.map(id => CHARACTERS.find(c => c.id === id)!).filter(Boolean);

  function getSavedUsernames(): string[] {
    const found: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("studytales_") && key.endsWith("_state")) {
        const name = key.replace("studytales_", "").replace("_state", "");
        if (name) found.push(name);
      }
    }
    return found;
  }

  const savedNames = getSavedUsernames();

  function handleSubmit() {
    const trimmed = username.trim();
    if (!trimmed) { setError("Please enter a username!"); return; }
    if (trimmed.length < 2) { setError("Username must be at least 2 characters."); return; }
    if (trimmed.length > 20) { setError("Username must be 20 characters or less."); return; }
    onLogin({ username: trimmed, avatar: selectedAvatar, createdAt: Date.now() });
  }

  function handleQuickLogin(name: string) {
    const key = `studytales_${name}_state`;
    try {
      const raw = localStorage.getItem(key);
      const avatar = raw ? "🧙" : "🧙";
      onLogin({ username: name, avatar, createdAt: Date.now() });
    } catch {
      onLogin({ username: name, avatar: "🧙", createdAt: Date.now() });
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start overflow-y-auto"
      style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)" }}>

      <div className="w-full max-w-sm px-6 py-8 flex flex-col items-center gap-6">

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-white font-black text-4xl" style={{ fontFamily: "'Outfit', sans-serif", textShadow: "0 0 40px rgba(167,139,250,0.8)" }}>
            StudyTales
          </h1>
          <p className="text-purple-200 text-sm mt-1 font-medium">Collect. Battle. Learn.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-3 justify-center"
        >
          {showcaseChars.map((char, i) => (
            <motion.div
              key={char.id}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20"
              style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))" }}
            >
              <CardImage character={char} size="sm" showName />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full bg-white/10 backdrop-blur-sm rounded-3xl p-5 border border-white/20 space-y-4"
        >
          <div>
            <p className="text-white font-bold text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Create your profile
            </p>
            <p className="text-purple-200 text-xs mt-0.5">Your username is your save file — remember it!</p>
          </div>

          <div>
            <label className="text-purple-200 text-xs font-semibold mb-1.5 block">SCHOLAR NAME</label>
            <input
              type="text"
              placeholder="e.g. DazaiFan99"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              maxLength={20}
              className="w-full bg-white/15 border border-white/25 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 font-semibold text-sm outline-none focus:border-purple-400 focus:bg-white/20 transition-all"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            />
            {error && <p className="text-rose-300 text-xs mt-1 font-semibold">{error}</p>}
          </div>

          <div>
            <label className="text-purple-200 text-xs font-semibold mb-2 block">CHOOSE AVATAR</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map(av => (
                <button
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`h-10 rounded-xl text-xl transition-all ${selectedAvatar === av ? "bg-purple-500 ring-2 ring-white scale-110" : "bg-white/10 hover:bg-white/20"}`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl font-black text-white text-base shadow-lg"
            style={{
              fontFamily: "'Outfit', sans-serif",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
            }}
          >
            ✨ Start Learning!
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {savedNames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <p className="text-purple-300 text-xs font-semibold text-center mb-2">↩ RETURNING SCHOLAR?</p>
              <div className="flex flex-col gap-2">
                {savedNames.map(name => (
                  <button
                    key={name}
                    onClick={() => handleQuickLogin(name)}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl px-4 py-3 text-white font-bold text-sm text-left transition-all flex items-center gap-3"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <span className="text-xl">🧙</span>
                    <span>{name}</span>
                    <span className="ml-auto text-purple-300 text-xs">Continue →</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-white/30 text-xs text-center pb-4">
          Data is saved locally on this device.
        </p>
      </div>
    </div>
  );
}
