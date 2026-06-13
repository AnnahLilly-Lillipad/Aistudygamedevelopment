import { useState, useRef, useEffect } from "react";
import { Send, ChevronDown } from "lucide-react";
import { CHARACTERS, AI_RESPONSES, type Character } from "../data/characters";
import { CardImage } from "./CardImage";

interface Message {
  id: string;
  role: "user" | "char";
  text: string;
  timestamp: Date;
}

const DEFAULT_RESPONSES = [
  "Interesting. Tell me more.",
  "That's… unexpected. Continue.",
  "I see. I'll consider that.",
  "Hmm. You have a peculiar way of thinking.",
];

function getResponse(charId: number): string {
  const list = AI_RESPONSES[charId] ?? DEFAULT_RESPONSES;
  return list[Math.floor(Math.random() * list.length)];
}

export function AIChat() {
  const [selectedChar, setSelectedChar] = useState<Character>(CHARACTERS[0]);
  const [messages, setMessages] = useState<Message[]>([{
    id: "init",
    role: "char",
    text: `Hello. I'm ${CHARACTERS[0].characterName}${CHARACTERS[0].variant ? ` [${CHARACTERS[0].variant}]` : ""}. What would you like to talk about?`,
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"chat" | "study">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const selectChar = (char: Character) => {
    setSelectedChar(char);
    setShowPicker(false);
    setMessages([{
      id: Date.now().toString(),
      role: "char",
      text: `...You called? I'm ${char.characterName}${char.variant ? ` — ${char.variant}` : ""}. Make it quick.`,
      timestamp: new Date(),
    }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 700 + Math.random() * 900));
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "char", text: getResponse(selectedChar.id), timestamp: new Date() }]);
    setIsTyping(false);
  };

  const STUDY_PROMPTS = [
    `Explain ${selectedChar.ability} in detail`,
    "Quiz me on BSD character abilities",
    "What's the element triangle?",
    "Tell me about your faction",
  ];

  const pickerChars = CHARACTERS.slice(0, 30);

  return (
    <div className="h-full flex flex-col">
      {/* Header — retro OS window style */}
      <div className="os-window mx-3 mt-3 mb-2 flex-shrink-0">
        <div className="os-titlebar">
          <div className="os-btn-red" /><div className="os-btn-yellow" /><div className="os-btn-green" />
          <span className="os-titlebar-title">CHAT.EXE</span>
        </div>
        <div style={{ background: "#ddeef6", padding: "10px 12px" }}>
          <button onClick={() => setShowPicker(!showPicker)} className="flex items-center gap-3 w-full">
            <div className="w-14 h-20 rounded overflow-hidden flex-shrink-0 border-2" style={{ borderColor: "#7ab2c8" }}>
              <CardImage character={selectedChar} size="xs" showName={false} className="w-full h-full" />
            </div>
            <div className="flex-1 text-left">
              <p className="vt" style={{ fontSize: "1.1rem", color: "#1a3d52", letterSpacing: "0.05em" }}>{selectedChar.characterName}</p>
              {selectedChar.variant && <p className="text-xs" style={{ color: "#5a7d8a" }}>{selectedChar.variant}</p>}
              <p className="text-xs" style={{ color: "#5a7d8a" }}>{selectedChar.ability} · {selectedChar.rarity}</p>
              {selectedChar.au && <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#b0d0e2", color: "#1a3d52" }}>{selectedChar.au}</span>}
            </div>
            <ChevronDown size={18} style={{ color: "#5b9aba", flexShrink: 0, transform: showPicker ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }} />
          </button>

          {showPicker && (
            <div className="mt-2 rounded border-2 p-2 max-h-36 overflow-y-auto" style={{ borderColor: "#7ab2c8", background: "#f0f8fc" }}>
              <div className="grid grid-cols-6 gap-1.5">
                {pickerChars.map(char => (
                  <button
                    key={char.id}
                    onClick={() => selectChar(char)}
                    className="rounded overflow-hidden border-2 transition-all"
                    style={{ borderColor: selectedChar.id === char.id ? "#5b9aba" : "transparent" }}
                  >
                    <CardImage character={char} size="xs" showName={false} />
                    <p className="vt text-center py-0.5" style={{ fontSize: "0.55rem", color: "#1a3d52" }}>{char.displayName}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-2">
            {[{ id: "chat", label: "CHAT" }, { id: "study", label: "STUDY" }].map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as typeof mode)}
                className="retro-btn flex-1 text-center"
                style={mode === m.id ? { background: "#5b9aba", color: "#fff", borderColor: "#3d7a98", boxShadow: "none", transform: "none" } : {}}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === "study" && (
        <div className="flex gap-2 overflow-x-auto px-3 py-2 no-scrollbar flex-shrink-0" style={{ background: "#f0f8fc", borderBottom: "2px solid #7ab2c8" }}>
          {STUDY_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => setInput(p)} className="retro-btn flex-shrink-0 text-xs whitespace-nowrap">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" style={{ background: "#f0f8fc" }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "char" && (
              <div className="w-8 h-10 rounded overflow-hidden flex-shrink-0 border" style={{ borderColor: "#7ab2c8" }}>
                <CardImage character={selectedChar} size="xs" showName={false} className="w-full h-full" />
              </div>
            )}
            <div
              className="max-w-[75%] rounded px-3 py-2 border-2"
              style={msg.role === "user"
                ? { background: "#5b9aba", borderColor: "#3d7a98", color: "#fff", borderRadius: "4px 4px 4px 12px" }
                : { background: "#fff", borderColor: "#7ab2c8", color: "#1a3d52", borderRadius: "4px 12px 12px 4px", boxShadow: "2px 2px 0 #cde5f0" }
              }
            >
              <p className="text-sm" style={{ lineHeight: 1.5 }}>{msg.text}</p>
              <p className="text-xs mt-1" style={{ color: msg.role === "user" ? "rgba(255,255,255,0.6)" : "#8aaab8" }}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-8 h-10 rounded overflow-hidden flex-shrink-0 border" style={{ borderColor: "#7ab2c8" }}>
              <CardImage character={selectedChar} size="xs" showName={false} className="w-full h-full" />
            </div>
            <div className="border-2 rounded px-4 py-3" style={{ background: "#fff", borderColor: "#7ab2c8" }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#5b9aba", animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-3 border-t-2" style={{ background: "#fff", borderColor: "#7ab2c8" }}>
        <div className="flex items-center gap-2 border-2 rounded px-3 py-2" style={{ borderColor: "#7ab2c8", background: "#f0f8fc" }}>
          <input
            className="flex-1 bg-transparent outline-none text-sm vt"
            style={{ color: "#1a3d52", fontSize: "1rem" }}
            placeholder={`Message ${selectedChar.displayName}…`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 flex items-center justify-center rounded border-2 transition-opacity"
            style={{ background: "#5b9aba", borderColor: "#3d7a98", opacity: (!input.trim() || isTyping) ? 0.4 : 1 }}
          >
            <Send size={14} color="#fff" />
          </button>
        </div>
        <p className="text-center text-xs mt-1.5 vt" style={{ color: "#8aaab8", fontSize: "0.8rem" }}>AI responses are fictional. Entertainment only.</p>
      </div>
    </div>
  );
}
