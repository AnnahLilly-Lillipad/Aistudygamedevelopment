import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { UserProfile } from "../hooks/useGameState";

const AVATARS = ["🧙", "⚡", "🌸", "🎭", "🐯", "👑", "🔮", "🌊", "🔥", "💫", "🗡️", "🦋", "🐚", "🌴", "🐠", "🦀"];

const CHIBI_CHARS = [
  { src: "/chars/char2.png", name: "Dazai",  delay: 0   },
  { src: "/chars/char5.png", name: "Sailor", delay: 0.6 },
  { src: "/chars/char3.png", name: "Chuuya", delay: 1.2 },
];

interface Props { onLogin: (profile: UserProfile) => void; }

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
    if (!trimmed) { setError("⚓ please enter a name!"); return; }
    if (trimmed.length < 2) { setError("⚓ min 2 characters"); return; }
    if (trimmed.length > 20) { setError("⚓ max 20 characters"); return; }
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

        {/* ── Title bar — OS window style ──────────────────────── */}
        <div style={{
          background: "linear-gradient(180deg, #b8ddf0 0%, #9ecfe6 100%)",
          border: "2px solid #7ab2c8", borderBottom: "none",
          borderRadius: "8px 8px 0 0",
          padding: "6px 12px",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span className="os-btn-red" />
          <span className="os-btn-yellow" />
          <span className="os-btn-green" />
          <span style={{ flex: 1, textAlign: "center", fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#1a3d52", letterSpacing: "0.1em" }}>
            🌊 STUDYTALES.EXE 🌊
          </span>
        </div>

        {/* ── Character banner ─────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(180deg, #a8d4ea 0%, #c8e8f5 100%)",
          border: "2px solid #7ab2c8", borderBottom: "none", borderTop: "none",
          padding: "16px 12px 0",
          display: "flex", justifyContent: "center", alignItems: "flex-end",
          gap: 16, minHeight: 130, position: "relative", overflow: "hidden",
        }}>
          {/* wave clouds */}
          <div style={{ position: "absolute", top: 8, left: 10, width: 50, height: 18, background: "rgba(255,255,255,0.55)", borderRadius: 12 }} />
          <div style={{ position: "absolute", top: 6, left: 40, width: 30, height: 14, background: "rgba(255,255,255,0.4)", borderRadius: 10 }} />
          <div style={{ position: "absolute", top: 12, right: 20, width: 45, height: 16, background: "rgba(255,255,255,0.45)", borderRadius: 12 }} />
          <div style={{ position: "absolute", top: 14, right: 8, fontSize: "1.1rem", opacity: 0.6 }}>🌊</div>
          <div style={{ position: "absolute", top: 8, left: 6, fontSize: "0.9rem", opacity: 0.5 }}>🐚</div>
          <div style={{ position: "absolute", top: 6, right: 52, fontSize: "0.8rem", opacity: 0.4 }}>✦</div>
          {CHIBI_CHARS.map((ch, i) => (
            <motion.div key={ch.src}
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 2.8, delay: ch.delay, repeat: Infinity, ease: "easeInOut" }}
              style={{ flexShrink: 0 }}>
              <img src={ch.src} alt={ch.name} style={{
                height: i === 1 ? 110 : 90, width: "auto", imageRendering: "auto",
                filter: "drop-shadow(0 4px 8px rgba(26,61,82,0.2))",
              }} />
            </motion.div>
          ))}
        </div>

        {/* ── Greeting strip — coral/wave style ────────────────── */}
        <div style={{
          background: "linear-gradient(90deg, #5b9aba 0%, #4a88a8 50%, #5b9aba 100%)",
          border: "2px solid #7ab2c8", borderTop: "none", borderBottom: "none",
          padding: "5px 14px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "white", letterSpacing: "0.1em" }}>
            🌊 welcome to studytales! ⛵ make waves! 🌊
          </span>
        </div>

        {/* ── Profile creation — sandy panel ───────────────────── */}
        <div style={{
          background: "#fdfaf3",
          border: "2px solid #7ab2c8", borderTop: "none",
          borderRadius: "0 0 8px 8px",
          padding: "14px",
          boxShadow: "3px 3px 0 rgba(91,154,186,0.2)",
        }}>

          {/* Scholar Name */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.1em" }}>
              🐚 SCHOLAR NAME
            </label>
            <input
              type="text"
              placeholder="e.g. DazaiFan99"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              maxLength={20}
              style={{
                width: "100%", background: "#edf6fb",
                border: "2px solid #7ab2c8", borderRadius: 4,
                padding: "7px 10px", fontFamily: "'VT323', monospace",
                fontSize: "1.1rem", color: "#1a3d52", letterSpacing: "0.04em",
                outline: "none", boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "#5b9aba")}
              onBlur={e => (e.target.style.borderColor = "#7ab2c8")}
            />
            {error && (
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#d94040", marginTop: 3, letterSpacing: "0.04em" }}>
                {error}
              </p>
            )}
          </div>

          {/* wave divider */}
          <div style={{
            height: 0, borderTop: "2px dashed #9dc4d8", margin: "10px 0",
            position: "relative",
          }}>
            <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "#fdfaf3", padding: "0 6px", fontSize: "0.75rem" }}>
              🌊
            </span>
          </div>

          {/* Avatar picker */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6, fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#5a7d8a", letterSpacing: "0.1em" }}>
              🌴 CHOOSE AVATAR
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4 }}>
              {AVATARS.map(av => (
                <button key={av} onClick={() => setSelectedAvatar(av)} style={{
                  height: 36,
                  border: selectedAvatar === av ? "2px solid #5b9aba" : "2px solid #b0d4e4",
                  borderRadius: 6, fontSize: "1rem",
                  background: selectedAvatar === av ? "#c6e2f0" : "#f0f8fc",
                  boxShadow: selectedAvatar === av ? "2px 2px 0 #5b9aba" : "1px 1px 0 #b0d4e4",
                  transform: selectedAvatar === av ? "translate(-1px,-1px)" : "none",
                  transition: "all 0.08s", cursor: "pointer", lineHeight: 1,
                }}>
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleSubmit}
            style={{
              width: "100%", fontFamily: "'VT323', monospace", fontSize: "1.15rem",
              letterSpacing: "0.12em", padding: "9px 0",
              background: "linear-gradient(180deg, #5b9aba 0%, #4a88a8 100%)",
              color: "white", border: "2px solid #3d7a98",
              borderRadius: 4, cursor: "pointer",
              boxShadow: "3px 3px 0 #3d7a98",
              transition: "all 0.08s",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "1px 1px 0 #3d7a98"; e.currentTarget.style.transform = "translate(2px,2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "3px 3px 0 #3d7a98"; e.currentTarget.style.transform = "none"; }}
          >
            🌊 SET SAIL ✦ START LEARNING ⛵
          </button>
        </div>

        {/* ── Returning scholars ────────────────────────────────── */}
        <AnimatePresence>
          {savedNames.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 10 }}>
              {/* Pill header */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#ddeef6", border: "2px solid #7ab2c8",
                borderRadius: 20, padding: "3px 12px", marginBottom: 6,
                boxShadow: "2px 2px 0 #7ab2c8",
              }}>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#1a3d52", letterSpacing: "0.08em" }}>
                  ⚓ RETURNING SCHOLAR
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {savedNames.map(name => (
                  <button key={name} onClick={() => handleQuickLogin(name)} style={{
                    background: "#f0f8fc", border: "2px solid #9dc4d8",
                    borderRadius: 4, padding: "7px 10px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: "2px 2px 0 #9dc4d8", transition: "all 0.08s", textAlign: "left",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#ddeef6"; e.currentTarget.style.boxShadow = "1px 1px 0 #9dc4d8"; e.currentTarget.style.transform = "translate(1px,1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f0f8fc"; e.currentTarget.style.boxShadow = "2px 2px 0 #9dc4d8"; e.currentTarget.style.transform = "none"; }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>🧙</span>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#1a3d52", letterSpacing: "0.04em" }}>{name}</span>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#5b9aba", marginLeft: "auto", letterSpacing: "0.06em" }}>
                      CONTINUE →
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ fontFamily: "'VT323', monospace", fontSize: "0.82rem", color: "#5a7d8a", textAlign: "center", marginTop: 12, letterSpacing: "0.06em" }}>
          🐚 data saves locally on this device 🐚
        </p>
      </motion.div>
    </div>
  );
}
