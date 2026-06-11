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

  // Show a mix of canon + AU chars in the picker
  const pickerChars = CHARACTERS.slice(0, 30);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`p-4 bg-gradient-to-r ${selectedChar.gradient} text-white`}>
        <button onClick={() => setShowPicker(!showPicker)} className="flex items-center gap-3 w-full">
          <div className="w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/40">
            <CardImage character={selectedChar} size="xs" showName={false} className="w-full h-full" />
          </div>
          <div className="flex-1 text-left">
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1rem" }}>{selectedChar.characterName}</p>
            {selectedChar.variant && <p className="text-white/80 text-xs">{selectedChar.variant}</p>}
            <p className="text-white/70 text-xs">{selectedChar.ability} · {selectedChar.rarity}</p>
            {selectedChar.au && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{selectedChar.au}</span>}
          </div>
          <ChevronDown size={20} className={`transition-transform ${showPicker ? "rotate-180" : ""}`} />
        </button>

        {showPicker && (
          <div className="mt-3 bg-white/10 rounded-2xl p-2 max-h-36 overflow-y-auto">
            <div className="grid grid-cols-6 gap-1.5">
              {pickerChars.map(char => (
                <button
                  key={char.id}
                  onClick={() => selectChar(char)}
                  className={`rounded-xl overflow-hidden border-2 transition-all ${selectedChar.id === char.id ? "border-white" : "border-transparent"}`}
                >
                  <CardImage character={char} size="xs" showName={false} />
                  <p className="text-white text-center py-0.5" style={{ fontSize: "0.4rem", fontWeight: 700 }}>{char.displayName}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          {[{ id: "chat", label: "Chat" }, { id: "study", label: "Study Assistant" }].map(m => (
            <button key={m.id} onClick={() => setMode(m.id as typeof mode)} className={`px-4 py-1.5 rounded-xl text-sm font-semibold ${mode === m.id ? "bg-white text-foreground" : "bg-white/20 text-white"}`}>{m.label}</button>
          ))}
        </div>
      </div>

      {mode === "study" && (
        <div className="flex gap-2 overflow-x-auto p-3 bg-secondary border-b border-border">
          {STUDY_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => setInput(p)} className="flex-shrink-0 bg-white border border-border rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-primary hover:text-white transition-colors">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "char" && (
              <div className="w-8 h-10 rounded-xl overflow-hidden flex-shrink-0">
                <CardImage character={selectedChar} size="xs" showName={false} className="w-full h-full" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-white border border-border text-foreground rounded-tl-sm shadow-sm"}`}>
              <p className="text-sm" style={{ lineHeight: 1.5 }}>{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.role === "user" ? "text-white/60" : "text-muted-foreground"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-8 h-10 rounded-xl overflow-hidden flex-shrink-0">
              <CardImage character={selectedChar} size="xs" showName={false} className="w-full h-full" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-border">
        <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-2">
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            placeholder={`Message ${selectedChar.displayName}…`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            style={{ color: "var(--foreground)" }}
          />
          <button onClick={sendMessage} disabled={!input.trim() || isTyping} className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center disabled:opacity-40">
            <Send size={14} className="text-white" />
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">AI responses are fictional. For entertainment only.</p>
      </div>
    </div>
  );
}
