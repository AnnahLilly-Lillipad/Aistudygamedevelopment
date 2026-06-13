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
    try {
      onLogin({ username: name, avatar: "🧙", createdAt: Date.now() });
    } catch {
      onLogin({ username: name, avatar: "🧙", createdAt: Date.now() });
    }
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center overflow-y-auto dot-grid-bg"
      style={{ padding: "24px 16px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
        style={{ maxWidth: 400 }}
      >

        {/* ── Title ── */}
        <div className="text-center mb-5">
          <h1
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "2rem",
              fontWeight: 900,
              color: "#1a3d52",
              letterSpacing: "0.04em",
              textShadow: "2px 2px 0 rgba(91,154,186,0.3)",
            }}
          >
            ✦ StudyTales
          </h1>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.7rem", color: "#5a7d8a", letterSpacing: "0.1em" }}>
            COLLECT · BATTLE · LEARN
          </p>
        </div>

        {/* ── Character showcase ── */}
        <div className="flex gap-3 justify-center mb-5">
          {showcaseChars.map((char, i) => (
            <motion.div
              key={char.id}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-20"
              style={{ filter: "drop-shadow(0 4px 8px rgba(26,61,82,0.2))" }}
            >
              <CardImage character={char} size="sm" showName />
            </motion.div>
          ))}
        </div>

        {/* ── OS Window: Create profile ── */}
        <div className="os-window mb-3" style={{ boxShadow: "0 4px 16px rgba(26,61,82,0.12)" }}>
          <div className="os-titlebar">
            <div className="os-btn" />
            <div className="os-btn" />
            <span className="os-titlebar-title">new_profile.exe</span>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="mono-label block mb-1.5">scholar name</label>
              <input
                type="text"
                placeholder="e.g. DazaiFan99"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                maxLength={20}
                style={{
                  width: "100%",
                  background: "#edf6fb",
                  border: "2px solid #9dc4d8",
                  borderRadius: 5,
                  padding: "8px 12px",
                  fontSize: "0.875rem",
                  fontFamily: "'Courier New', monospace",
                  color: "#1a3d52",
                  outline: "none",
                }}
                onFocus={e => (e.target.style.borderColor = "#5b9aba")}
                onBlur={e => (e.target.style.borderColor = "#9dc4d8")}
              />
              {error && (
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.65rem", color: "#d94040", marginTop: 4, letterSpacing: "0.03em" }}>
                  ⚠ {error}
                </p>
              )}
            </div>

            <div>
              <label className="mono-label block mb-2">choose avatar</label>
              <div className="grid grid-cols-6 gap-1.5">
                {AVATARS.map(av => (
                  <button
                    key={av}
                    onClick={() => setSelectedAvatar(av)}
                    style={{
                      height: 38,
                      border: selectedAvatar === av ? "2px solid #5b9aba" : "2px solid #9dc4d8",
                      borderRadius: 5,
                      fontSize: "1.1rem",
                      background: selectedAvatar === av ? "#c6e2f0" : "#f0f8fc",
                      transform: selectedAvatar === av ? "scale(1.08)" : "scale(1)",
                      transition: "all 0.1s",
                      cursor: "pointer",
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full retro-btn retro-btn-primary"
              style={{ padding: "10px 0", fontSize: "0.8rem", borderRadius: 5, letterSpacing: "0.08em" }}
            >
              ✦ START LEARNING
            </button>
          </div>
        </div>

        {/* ── Returning users ── */}
        <AnimatePresence>
          {savedNames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="os-window"
            >
              <div className="os-titlebar">
                <div className="os-btn" />
                <div className="os-btn" />
                <span className="os-titlebar-title">returning_scholar.exe</span>
              </div>
              <div className="p-3 space-y-2">
                {savedNames.map(name => (
                  <button
                    key={name}
                    onClick={() => handleQuickLogin(name)}
                    className="w-full text-left flex items-center gap-2.5"
                    style={{
                      background: "#f0f8fc",
                      border: "2px solid #9dc4d8",
                      borderRadius: 5,
                      padding: "8px 10px",
                      cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#ddeef6")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#f0f8fc")}
                  >
                    <span style={{ fontSize: "1.2rem" }}>🧙</span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.8rem", fontWeight: 700, color: "#1a3d52" }}>
                      {name}
                    </span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.6rem", color: "#5b9aba", marginLeft: "auto", letterSpacing: "0.05em" }}>
                      CONTINUE →
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.6rem", color: "#5a7d8a", textAlign: "center", marginTop: 16, letterSpacing: "0.06em" }}>
          data saved locally on this device
        </p>
      </motion.div>
    </div>
  );
}
