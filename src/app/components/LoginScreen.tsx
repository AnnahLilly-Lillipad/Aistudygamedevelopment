import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { UserProfile } from "../hooks/useGameState";

const AVATARS = ["🧙", "⚡", "🌸", "🎭", "🐯", "👑", "🔮", "🌊", "🔥", "💫", "🗡️", "🦋"];

const CHIBI_CHARS = [
  { src: "/chars/char2.png", name: "Dazai",   delay: 0   },
  { src: "/chars/char5.png", name: "Sailor",  delay: 0.6 },
  { src: "/chars/char3.png", name: "Chuuya",  delay: 1.2 },
];

interface Props {
  onLogin: (profile: UserProfile) => void;
}

export function LoginScreen({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🧙");
  const [error, setError] = useState("");

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
    if (!trimmed) { setError("please enter a name!"); return; }
    if (trimmed.length < 2) { setError("min 2 characters"); return; }
    if (trimmed.length > 20) { setError("max 20 characters"); return; }
    onLogin({ username: trimmed, avatar: selectedAvatar, createdAt: Date.now() });
  }

  function handleQuickLogin(name: string) {
    onLogin({ username: name, avatar: "🧙", createdAt: Date.now() });
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center dot-grid-bg"
      style={{ padding: "20px 14px", overflowY: "auto" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ width: "100%", maxWidth: 390 }}
      >

        {/* ── Big title bar ──────────────────────────────────── */}
        <div
          style={{
            background: "linear-gradient(180deg, #cde5f0 0%, #afd0e2 100%)",
            border: "2px solid #7ab2c8",
            borderBottom: "none",
            borderRadius: "8px 8px 0 0",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span className="os-btn-red" />
          <span className="os-btn-yellow" />
          <span className="os-btn-green" />
          <span style={{ flex: 1, textAlign: "center", fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#1a3d52", letterSpacing: "0.08em" }}>
            STUDYTALES.EXE
          </span>
        </div>

        {/* ── Character showcase banner ─────────────────────── */}
        <div
          style={{
            background: "linear-gradient(180deg, #b8d8ec 0%, #cde5f0 100%)",
            border: "2px solid #7ab2c8",
            borderBottom: "none",
            padding: "16px 12px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 16,
            minHeight: 130,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Cloud-like bg elements */}
          <div style={{ position: "absolute", top: 8, left: 10, width: 50, height: 18, background: "rgba(255,255,255,0.5)", borderRadius: 12 }} />
          <div style={{ position: "absolute", top: 6, left: 40, width: 30, height: 14, background: "rgba(255,255,255,0.4)", borderRadius: 10 }} />
          <div style={{ position: "absolute", top: 12, right: 20, width: 45, height: 16, background: "rgba(255,255,255,0.45)", borderRadius: 12 }} />
          <div style={{ position: "absolute", top: 9, right: 50, width: 28, height: 12, background: "rgba(255,255,255,0.35)", borderRadius: 9 }} />

          {CHIBI_CHARS.map((ch, i) => (
            <motion.div
              key={ch.src}
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 2.8, delay: ch.delay, repeat: Infinity, ease: "easeInOut" }}
              style={{ flexShrink: 0 }}
            >
              <img
                src={ch.src}
                alt={ch.name}
                style={{
                  height: i === 1 ? 110 : 90,
                  width: "auto",
                  imageRendering: "auto",
                  filter: "drop-shadow(0 4px 8px rgba(26,61,82,0.2))",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Greeting strip ────────────────────────────────── */}
        <div
          style={{
            background: "#5b9aba",
            border: "2px solid #7ab2c8",
            borderTop: "none",
            borderBottom: "none",
            padding: "5px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "white", letterSpacing: "0.12em" }}>
            ✦ Hi! Welcome to StudyTales! ✦
          </span>
        </div>

        {/* ── Profile creation window ───────────────────────── */}
        <div
          style={{
            background: "#ffffff",
            border: "2px solid #7ab2c8",
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            padding: "14px",
            boxShadow: "3px 3px 0 rgba(91,154,186,0.2)",
          }}
        >
          {/* Scholar Name */}
          <div style={{ marginBottom: 12 }}>
            <label className="mono-label" style={{ display: "block", marginBottom: 4 }}>
              scholar name
            </label>
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
                border: "2px solid #7ab2c8",
                borderRadius: 4,
                padding: "7px 10px",
                fontFamily: "'VT323', monospace",
                fontSize: "1.1rem",
                color: "#1a3d52",
                letterSpacing: "0.04em",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "#5b9aba")}
              onBlur={e => (e.target.style.borderColor = "#7ab2c8")}
            />
            {error && (
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#d94040", marginTop: 3, letterSpacing: "0.04em" }}>
                ⚠ {error}
              </p>
            )}
          </div>

          <div className="pixel-divider" />

          {/* Avatar picker */}
          <div style={{ marginBottom: 12 }}>
            <label className="mono-label" style={{ display: "block", marginBottom: 6 }}>
              choose avatar
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 5 }}>
              {AVATARS.map(av => (
                <button
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  style={{
                    height: 38,
                    border: selectedAvatar === av ? "2px solid #5b9aba" : "2px solid #9dc4d8",
                    borderRadius: 4,
                    fontSize: "1.1rem",
                    background: selectedAvatar === av ? "#c6e2f0" : "#f0f8fc",
                    boxShadow: selectedAvatar === av ? "1px 1px 0 #5b9aba" : "1px 1px 0 #9dc4d8",
                    transform: selectedAvatar === av ? "translate(-1px,-1px)" : "none",
                    transition: "all 0.08s",
                    cursor: "pointer",
                    lineHeight: 1,
                  }}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleSubmit}
            className="retro-btn retro-btn-primary"
            style={{ width: "100%", fontSize: "1.1rem", padding: "7px 0", letterSpacing: "0.12em", borderRadius: 4 }}
          >
            ✦ START LEARNING ✦
          </button>
        </div>

        {/* ── Returning scholars window ─────────────────────── */}
        <AnimatePresence>
          {savedNames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 10 }}
            >
              <div className="os-window">
                <div className="os-titlebar">
                  <span className="os-btn-red" />
                  <span className="os-btn-yellow" />
                  <span className="os-btn-green" />
                  <span className="os-titlebar-title">returning_scholar.exe</span>
                </div>
                <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
                  {savedNames.map(name => (
                    <button
                      key={name}
                      onClick={() => handleQuickLogin(name)}
                      style={{
                        background: "#f0f8fc",
                        border: "2px solid #9dc4d8",
                        borderRadius: 4,
                        padding: "7px 10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        boxShadow: "2px 2px 0 #9dc4d8",
                        transition: "all 0.08s",
                        textAlign: "left",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#ddeef6"; e.currentTarget.style.boxShadow = "1px 1px 0 #9dc4d8"; e.currentTarget.style.transform = "translate(1px,1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#f0f8fc"; e.currentTarget.style.boxShadow = "2px 2px 0 #9dc4d8"; e.currentTarget.style.transform = "none"; }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>🧙</span>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#1a3d52", letterSpacing: "0.04em" }}>
                        {name}
                      </span>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#5b9aba", marginLeft: "auto", letterSpacing: "0.06em" }}>
                        CONTINUE →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#5a7d8a", textAlign: "center", marginTop: 12, letterSpacing: "0.06em" }}>
          data is saved locally on this device
        </p>
      </motion.div>
    </div>
  );
}
