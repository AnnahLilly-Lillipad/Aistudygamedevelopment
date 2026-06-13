import { useState } from "react";
import { Zap } from "lucide-react";
import { ACHIEVEMENTS, CHARACTERS, type OwnedCard } from "../data/characters";

const HEATMAP_DATA = Array.from({ length: 91 }, (_, i) => ({
  day: i,
  value: Math.random() < 0.6 ? Math.floor(Math.random() * 5) : 0,
}));

const GLOBAL_BUFFS = [
  { id: 1, name: "Coin Boost I", description: "+5% coin gain from all sources", cost: "50 Rare Drops", unlocked: true },
  { id: 2, name: "XP Amplifier", description: "+10% XP from quiz games", cost: "100 Rare Drops", unlocked: true },
  { id: 3, name: "Pity Reduction", description: "Pity triggers at 90 pulls", cost: "200 Rare Drops", unlocked: false },
  { id: 4, name: "Double Study Coins", description: "+100% coins from Pomodoro", cost: "500 Rare Drops", unlocked: false },
];

const LEADERBOARD = [
  { rank: 1, name: "Dazai_Fan99", xp: 48200, avatar: "🏆" },
  { rank: 2, name: "PortMafiaAce", xp: 41500, avatar: "⭐" },
  { rank: 3, name: "BSDScholar", xp: 38900, avatar: "📚" },
  { rank: 4, name: "ChuuyaSimp", xp: 2100, avatar: "🌹" },
  { rank: 5, name: "RanpoDetective", xp: 1800, avatar: "🔍" },
];

interface Props {
  coins: number;
  ownedCards: OwnedCard[];
  username: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  totalBattleWins: number;
  totalPulls: number;
  onLogout: () => void;
  xpToNextLevel: (level: number) => number;
}

export function ProfilePage({
  coins,
  ownedCards,
  username,
  avatar,
  xp,
  level,
  streak,
  totalBattleWins,
  totalPulls,
  onLogout,
  xpToNextLevel,
}: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "buffs" | "leaderboard" | "legal">("overview");
  const [leaderboardFilter, setLeaderboardFilter] = useState<"Global" | "Friends" | "Weekly">("Global");
  const [collectedExpeditions, setCollectedExpeditions] = useState<Set<number>>(new Set());
  const [buffFeedback, setBuffFeedback] = useState<number | null>(null);
  const [expeditionMsg, setExpeditionMsg] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const ownedCount = new Set(ownedCards.map(c => c.characterId)).size;
  const urCount = ownedCards.filter(oc => CHARACTERS.find(c => c.id === oc.characterId)?.rarity === "UR").length;
  const ssrCount = ownedCards.filter(oc => CHARACTERS.find(c => c.id === oc.characterId)?.rarity === "SSR").length;
  const earnedAchievements = ACHIEVEMENTS.filter(a => a.earned).length;

  const xpNeeded = xpToNextLevel(level);
  const xpProgress = Math.min(100, Math.round((xp / xpNeeded) * 100));

  const heatmapIntensity = (val: number) => {
    if (val === 0) return "#ddeef6";
    if (val === 1) return "#b0d0e2";
    if (val === 2) return "#7ab2c8";
    if (val === 3) return "#5b9aba";
    return "#2a5a70";
  };

  const tabs = [
    { id: "overview", label: "OVERVIEW" },
    { id: "achievements", label: "BADGES" },
    { id: "buffs", label: "BUFFS" },
    { id: "leaderboard", label: "RANKING" },
    { id: "legal", label: "LEGAL" },
  ] as const;

  const userLeaderboardEntry = { rank: 4, name: username, xp, avatar, isUser: true };
  const fullLeaderboard = [...LEADERBOARD.filter(e => e.xp > xp), userLeaderboardEntry, ...LEADERBOARD.filter(e => e.xp <= xp)]
    .sort((a, b) => b.xp - a.xp)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  return (
    <div className="h-full flex flex-col">
      {/* Profile header */}
      <div className="os-window mx-3 mt-3 mb-2 flex-shrink-0">
        <div className="os-titlebar">
          <div className="os-btn-red" /><div className="os-btn-yellow" /><div className="os-btn-green" />
          <span className="os-titlebar-title">PROFILE.EXE</span>
        </div>
        <div style={{ background: "#ddeef6", padding: "12px 14px" }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded flex items-center justify-center text-4xl select-none border-2" style={{ background: "#fff", borderColor: "#7ab2c8" }}>
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="mono-label" style={{ fontSize: "0.7rem" }}>Scholar Level {level}</p>
              <h2 className="vt truncate" style={{ fontSize: "1.5rem", color: "#1a3d52" }}>{username}</h2>
              <span className="retro-btn py-0 px-2 text-xs inline-block mt-1" style={{ background: "#ffd166", borderColor: "#e0b050", color: "#1a3d52", boxShadow: "none", fontSize: "0.7rem" }}>
                Aspiring Detective
              </span>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="vt" style={{ fontSize: "1.2rem", color: "#d97706" }}>🪙 {coins.toLocaleString()}</div>
              <div className="mono-label" style={{ fontSize: "0.65rem" }}>COINS</div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="retro-btn py-0.5 px-2 mt-1 text-xs"
                style={{ fontSize: "0.65rem" }}
              >
                LOG OUT
              </button>
            </div>
          </div>

          {/* XP bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="mono-label" style={{ fontSize: "0.65rem" }}>XP {xp.toLocaleString()}</span>
              <span className="mono-label" style={{ fontSize: "0.65rem" }}>NEXT: {xpNeeded.toLocaleString()}</span>
            </div>
            <div className="h-2.5 rounded overflow-hidden border" style={{ background: "#b0d0e2", borderColor: "#7ab2c8" }}>
              <div className="h-full transition-all" style={{ width: `${xpProgress}%`, background: "#fbbf24" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div className="mx-3 mb-2 os-window flex-shrink-0">
          <div className="os-titlebar" style={{ background: "linear-gradient(180deg,#ffeaea,#ffd0d0)", borderColor: "#e05555" }}>
            <div className="os-btn-red" /><div className="os-btn-yellow" /><div className="os-btn-green" />
            <span className="os-titlebar-title" style={{ color: "#b03a3a" }}>CONFIRM LOGOUT</span>
          </div>
          <div className="flex items-center justify-between gap-3 px-3 py-2" style={{ background: "#fff" }}>
            <p className="text-sm" style={{ color: "#b03a3a" }}>Log out of <strong>{username}</strong>?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowLogoutConfirm(false)} className="retro-btn text-xs py-1 px-2">CANCEL</button>
              <button onClick={onLogout} className="retro-btn text-xs py-1 px-2" style={{ background: "#d64f4f", color: "#fff", borderColor: "#b03a3a" }}>LOG OUT</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 px-3 pb-2 flex-shrink-0 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="retro-btn flex-1 py-1.5 text-center whitespace-nowrap"
            style={activeTab === tab.id ? { background: "#5b9aba", color: "#fff", borderColor: "#3d7a98" } : { fontSize: "0.7rem" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Cards Owned", value: ownedCount, icon: "🃏", sub: `${CHARACTERS.length} total` },
                { label: "UR Cards", value: urCount, icon: "💎", sub: `${ssrCount} SSR` },
                { label: "Battle Wins", value: totalBattleWins, icon: "⚔️", sub: "all time" },
                { label: "Total Pulls", value: totalPulls, icon: "✨", sub: "all banners" },
                { label: "Achievements", value: `${earnedAchievements}/${ACHIEVEMENTS.length}`, icon: "🏆", sub: "unlocked" },
                { label: "Study Streak", value: `${streak} days`, icon: "🔥", sub: `Level ${level} Scholar` },
              ].map(s => (
                <div key={s.label} className="os-window">
                  <div className="os-titlebar py-1">
                    <span className="os-titlebar-title" style={{ fontSize: "0.7rem" }}>{s.label.toUpperCase()}</span>
                  </div>
                  <div className="p-3 text-center" style={{ background: "#fff" }}>
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="vt" style={{ fontSize: "1.4rem", color: "#1a3d52" }}>{s.value}</div>
                    <div className="mono-label" style={{ fontSize: "0.6rem" }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div className="os-window">
              <div className="os-titlebar">
                <div className="os-btn-green" />
                <span className="os-titlebar-title">STUDY HEATMAP</span>
              </div>
              <div className="p-3" style={{ background: "#fff" }}>
                <div className="flex flex-wrap gap-0.5">
                  {HEATMAP_DATA.slice(-91).map((d, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-sm"
                      style={{ background: heatmapIntensity(d.value) }}
                      title={`Day ${i}: ${d.value} sessions`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="mono-label" style={{ fontSize: "0.6rem" }}>13 WEEKS AGO</span>
                  <span className="mono-label" style={{ fontSize: "0.6rem" }}>TODAY</span>
                </div>
              </div>
            </div>

            {/* Expeditions */}
            <div className="os-window">
              <div className="os-titlebar">
                <div className="os-btn-yellow" />
                <span className="os-titlebar-title">🗺️ EXPEDITIONS</span>
                <button
                  className="retro-btn py-0 px-2 ml-1"
                  style={{ fontSize: "0.65rem", boxShadow: "none" }}
                  onClick={() => setExpeditionMsg(expeditionMsg ? null : "Expedition management coming soon!")}
                >
                  MANAGE
                </button>
              </div>
              <div className="p-3" style={{ background: "#fff" }}>
                {expeditionMsg && (
                  <div className="rounded px-3 py-2 mb-2 text-xs font-semibold border-2" style={{ background: "#ddeef6", borderColor: "#7ab2c8", color: "#1a3d52" }}>
                    {expeditionMsg}
                  </div>
                )}
                <div className="space-y-2">
                  {[
                    { name: "Yokohama Night Patrol", chars: ["🪄", "⚔️"], duration: "2h 15m", ready: false },
                    { name: "Port Mafia Intel Gather", chars: ["🎩", "🖤"], duration: "6h 00m", ready: true },
                  ].map((exp, i) => (
                    <div key={i} className="flex items-center justify-between rounded p-2.5 border-2" style={{ background: "#f0f8fc", borderColor: "#b0d0e2" }}>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#1a3d52" }}>{exp.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {exp.chars.map((e, j) => <span key={j} className="text-sm">{e}</span>)}
                        </div>
                      </div>
                      <div className="text-right">
                        {exp.ready && !collectedExpeditions.has(i) ? (
                          <button
                            className="retro-btn text-xs py-1"
                            style={{ background: "#4ade80", color: "#fff", borderColor: "#22c55e" }}
                            onClick={() => setCollectedExpeditions(prev => new Set([...prev, i]))}
                          >
                            COLLECT
                          </button>
                        ) : exp.ready && collectedExpeditions.has(i) ? (
                          <span className="vt text-xs" style={{ color: "#22c55e", fontSize: "0.85rem" }}>✓ COLLECTED</span>
                        ) : (
                          <span className="mono-label" style={{ fontSize: "0.65rem" }}>⏰ {exp.duration}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements */}
        {activeTab === "achievements" && (
          <div className="space-y-2">
            {ACHIEVEMENTS.map(ach => (
              <div key={ach.id} className="os-window" style={{ opacity: ach.earned ? 1 : 0.5 }}>
                <div className="os-titlebar py-1">
                  <span className="os-titlebar-title" style={{ fontSize: "0.7rem" }}>{ach.title.toUpperCase()}</span>
                  {ach.earned && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4ade80", marginLeft: "4px", border: "1.5px solid #22c55e" }} />}
                </div>
                <div className="flex items-center gap-3 p-3" style={{ background: "#fff" }}>
                  <div className="w-12 h-12 rounded flex items-center justify-center text-2xl flex-shrink-0 border-2" style={{ background: ach.earned ? "#fffbeb" : "#f0f8fc", borderColor: ach.earned ? "#fbbf24" : "#b0d0e2" }}>
                    {ach.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "#1a3d52" }}>{ach.title}</p>
                    <p className="text-xs" style={{ color: "#5a7d8a" }}>{ach.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap size={11} style={{ color: "#d97706" }} />
                      <span className="vt text-xs" style={{ color: "#d97706", fontSize: "0.85rem" }}>+{ach.xp} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buffs */}
        {activeTab === "buffs" && (
          <div className="space-y-2">
            <div className="rounded px-3 py-2 mb-2 border-2" style={{ background: "#ddeef6", borderColor: "#7ab2c8" }}>
              <p className="text-xs" style={{ color: "#2a5a70" }}>Spend Rare Drops to permanently boost your account. Rare Drops are obtained from SSR+ pulls and event rewards.</p>
            </div>
            {GLOBAL_BUFFS.map(buff => (
              <div key={buff.id} className="os-window">
                <div className="os-titlebar py-1">
                  <div className={buff.unlocked ? "os-btn-green" : "os-btn-yellow"} />
                  <span className="os-titlebar-title" style={{ fontSize: "0.75rem" }}>{buff.name.toUpperCase()}</span>
                  {buff.unlocked && (
                    <span className="retro-btn py-0 px-1.5 ml-1" style={{ background: "#4ade80", color: "#fff", borderColor: "#22c55e", fontSize: "0.6rem", boxShadow: "none" }}>ACTIVE</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-3" style={{ background: "#fff" }}>
                  <div className="flex-1">
                    <p className="text-xs" style={{ color: "#5a7d8a" }}>{buff.description}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="mono-label" style={{ fontSize: "0.65rem", color: "#dc2626" }}>💎 {buff.cost}</span>
                    </div>
                    {buffFeedback === buff.id && (
                      <p className="text-xs font-semibold mt-1" style={{ color: "#d97706" }}>
                        Not enough Rare Drops. Pull SSR+ cards to earn them!
                      </p>
                    )}
                  </div>
                  {!buff.unlocked && (
                    <button
                      className="retro-btn retro-btn-primary ml-3 text-xs py-1.5 px-2"
                      onClick={() => setBuffFeedback(buffFeedback === buff.id ? null : buff.id)}
                    >
                      UNLOCK
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legal */}
        {activeTab === "legal" && (
          <div className="os-window">
            <div className="os-titlebar">
              <div className="os-btn-green" />
              <span className="os-titlebar-title">⚖️ COPYRIGHT DISCLAIMER</span>
            </div>
            <div className="p-4 space-y-3" style={{ background: "#fff" }}>
              <p className="text-sm" style={{ color: "#2a5a70" }}>
                <span className="font-semibold" style={{ color: "#1a3d52" }}>StudyTales</span> is an independent, fan-made study application created purely for educational and entertainment purposes.
              </p>
              <div className="rounded p-3 border-2" style={{ background: "#fffbeb", borderColor: "#fbbf24" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "#92400e" }}>🎌 Bungou Stray Dogs</p>
                <p className="text-xs" style={{ color: "#78350f" }}>I do not own <em>Bungou Stray Dogs</em>, its characters, story, or any related content. All rights belong to <strong>Kafka Asagiri</strong> and <strong>Sango Harukawa</strong>, published by <strong>KADOKAWA Corporation</strong>. Anime produced by <strong>Bones Inc.</strong></p>
              </div>
              <div className="rounded p-3 border-2" style={{ background: "#f0f8fc", borderColor: "#7ab2c8" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "#1a3d52" }}>📚 Other Fandoms & Crossovers</p>
                <p className="text-xs" style={{ color: "#2a5a70" }}>This app references characters from other works strictly as fan-made AU content. All respective properties belong to their original creators.</p>
              </div>
              <div className="rounded p-3 border-2" style={{ background: "#f0f8fc", borderColor: "#b0d0e2" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "#1a3d52" }}>🖼️ Artwork</p>
                <p className="text-xs" style={{ color: "#5a7d8a" }}>All character images belong to their respective creators. No copyright infringement is intended.</p>
              </div>
              <div className="rounded p-3 border-2" style={{ background: "#f0f8fc", borderColor: "#b0d0e2" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "#1a3d52" }}>💼 No Commercial Use</p>
                <p className="text-xs" style={{ color: "#5a7d8a" }}>Non-commercial fan project. Not affiliated with or endorsed by any rights holders.</p>
              </div>
              <p className="text-center text-xs pt-2 vt" style={{ color: "#8aaab8", fontSize: "0.85rem", borderTop: "1px dashed #b0d0e2" }}>
                Made with ❤️ by a fan, for fans.
              </p>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === "leaderboard" && (
          <div className="space-y-2">
            <div className="flex gap-2 mb-3">
              {(["Global", "Friends", "Weekly"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setLeaderboardFilter(t)}
                  className="retro-btn flex-1 py-1.5 text-center text-xs"
                  style={leaderboardFilter === t ? { background: "#5b9aba", color: "#fff", borderColor: "#3d7a98" } : {}}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            {leaderboardFilter !== "Global" && (
              <div className="rounded p-3 text-center text-sm border-2 mb-2" style={{ background: "#ddeef6", borderColor: "#7ab2c8", color: "#5a7d8a" }}>
                {leaderboardFilter === "Friends"
                  ? "Add friends to see their rankings here!"
                  : "Weekly rankings reset every Monday."}
              </div>
            )}
            {fullLeaderboard.map(entry => (
              <div
                key={entry.rank}
                className="os-window"
                style={"isUser" in entry && entry.isUser ? { boxShadow: "0 0 0 2px #5b9aba, 2px 2px 0 #3d7a98" } : {}}
              >
                <div className="flex items-center gap-3 p-3" style={{ background: "isUser" in entry && entry.isUser ? "#f0f8fc" : "#fff" }}>
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm flex-shrink-0 vt"
                    style={{
                      background: entry.rank <= 3 ? "#fbbf24" : "#ddeef6",
                      color: entry.rank <= 3 ? "#fff" : "#5a7d8a",
                      border: "2px solid",
                      borderColor: entry.rank <= 3 ? "#e0b050" : "#b0d0e2",
                      fontSize: "1rem",
                    }}
                  >
                    {entry.rank}
                  </div>
                  <div className="text-xl">{entry.avatar}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "#1a3d52" }}>
                      {entry.name}{"isUser" in entry && entry.isUser ? " (You)" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Zap size={12} style={{ color: "#d97706" }} />
                      <span className="vt" style={{ fontSize: "1rem", color: "#1a3d52" }}>{entry.xp.toLocaleString()}</span>
                    </div>
                    <span className="mono-label" style={{ fontSize: "0.6rem" }}>XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
