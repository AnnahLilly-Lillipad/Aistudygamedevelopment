import { useState, useEffect, useCallback } from "react";
import type { OwnedCard } from "../data/characters";

export interface UserProfile {
  username: string;
  avatar: string;
  createdAt: number;
}

export interface DailyStats {
  date: string;
  studyMinutes: number;
  quizAnswers: number;
  battleWins: number;
  gachaPulls: number;
}

export interface GameState {
  coins: number;
  ownedCards: OwnedCard[];
  pityCount: number;
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string;
  claimedQuests: number[];
  lastQuestReset: string;
  totalBattleWins: number;
  totalPulls: number;
  ownedFrames: string[];
  equippedFrame: string;
  dailyStats: DailyStats;
  unlockedBuffIds: number[];
}

const STARTER_CARDS: OwnedCard[] = [
  { characterId: 1,  id: "init-1",  level: 15, limitBreak: 0, awakened: false, obtainedAt: new Date() },
  { characterId: 2,  id: "init-2",  level: 8,  limitBreak: 0, awakened: false, obtainedAt: new Date() },
  { characterId: 5,  id: "init-5",  level: 12, limitBreak: 1, awakened: false, obtainedAt: new Date() },
  { characterId: 10, id: "init-10", level: 10, limitBreak: 0, awakened: false, obtainedAt: new Date() },
  { characterId: 11, id: "init-11", level: 20, limitBreak: 2, awakened: false, obtainedAt: new Date() },
];

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function xpToNextLevel(level: number): number {
  return level * 1000;
}

function freshDailyStats(): DailyStats {
  return { date: todayStr(), studyMinutes: 0, quizAnswers: 0, battleWins: 0, gachaPulls: 0 };
}

function makeInitialState(): GameState {
  return {
    coins: 3200,
    ownedCards: STARTER_CARDS,
    pityCount: 0,
    xp: 2450,
    level: 12,
    streak: 7,
    lastActivityDate: todayStr(),
    claimedQuests: [1, 3],
    lastQuestReset: todayStr(),
    totalBattleWins: 0,
    totalPulls: 0,
    ownedFrames: ["standard"],
    equippedFrame: "standard",
    dailyStats: freshDailyStats(),
    unlockedBuffIds: [1, 2],
  };
}

function hydrateCards(raw: OwnedCard[]): OwnedCard[] {
  return raw.map(c => ({ ...c, obtainedAt: new Date(c.obtainedAt) }));
}

function ensureDailyStats(stats: DailyStats | undefined): DailyStats {
  if (!stats || stats.date !== todayStr()) return freshDailyStats();
  return stats;
}

function loadUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem("studytales_user");
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch { return null; }
}

function loadGameState(username: string): GameState {
  try {
    const raw = localStorage.getItem(`studytales_${username}_state`);
    if (!raw) return makeInitialState();
    const parsed = JSON.parse(raw) as GameState;
    parsed.ownedCards = hydrateCards(parsed.ownedCards);
    if (!parsed.ownedFrames) parsed.ownedFrames = ["standard"];
    if (!parsed.equippedFrame) parsed.equippedFrame = "standard";
    if (!parsed.unlockedBuffIds) parsed.unlockedBuffIds = [1, 2];
    parsed.dailyStats = ensureDailyStats(parsed.dailyStats);
    return parsed;
  } catch { return makeInitialState(); }
}

export function useGameState() {
  const [user, setUser] = useState<UserProfile | null>(loadUser);
  const [state, setState] = useState<GameState>(() => {
    const u = loadUser();
    return u ? loadGameState(u.username) : makeInitialState();
  });

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem("studytales_user", JSON.stringify(user));
      localStorage.setItem(`studytales_${user.username}_state`, JSON.stringify(state));
    } catch {}
  }, [user, state]);

  const login = useCallback((profile: UserProfile) => {
    localStorage.setItem("studytales_user", JSON.stringify(profile));
    const gs = loadGameState(profile.username);
    setState(gs);
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("studytales_user");
    setUser(null);
    setState(makeInitialState());
  }, []);

  const updateActivity = useCallback(() => {
    setState(prev => {
      const today = todayStr();
      if (prev.lastActivityDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const newStreak = prev.lastActivityDate === yesterday ? prev.streak + 1 : 1;
      return { ...prev, lastActivityDate: today, streak: newStreak };
    });
  }, []);

  const earnCoins = useCallback((amount: number) => {
    setState(prev => {
      const xpGain = Math.ceil(amount / 5);
      const newXp = prev.xp + xpGain;
      const needed = xpToNextLevel(prev.level);
      const leveled = newXp >= needed;
      return {
        ...prev,
        coins: prev.coins + amount,
        xp: newXp,
        level: leveled ? prev.level + 1 : prev.level,
      };
    });
  }, []);

  const spendCoins = useCallback((amount: number) => {
    setState(prev => ({ ...prev, coins: Math.max(0, prev.coins - amount) }));
  }, []);

  const earnXp = useCallback((amount: number) => {
    setState(prev => {
      const newXp = prev.xp + amount;
      const needed = xpToNextLevel(prev.level);
      const leveled = newXp >= needed;
      return { ...prev, xp: newXp, level: leveled ? prev.level + 1 : prev.level };
    });
    updateActivity();
  }, [updateActivity]);

  const gainCards = useCallback((cards: OwnedCard[]) => {
    setState(prev => {
      const merged = new Map<number, OwnedCard>(prev.ownedCards.map(c => [c.characterId, c]));
      cards.forEach(card => {
        if (merged.has(card.characterId)) {
          const ex = merged.get(card.characterId)!;
          merged.set(card.characterId, { ...ex, limitBreak: Math.min(ex.limitBreak + 1, 5) });
        } else {
          merged.set(card.characterId, { ...card, awakened: false });
        }
      });
      const today = todayStr();
      const ds = prev.dailyStats.date === today ? prev.dailyStats : freshDailyStats();
      return {
        ...prev,
        ownedCards: Array.from(merged.values()),
        totalPulls: prev.totalPulls + cards.length,
        dailyStats: { ...ds, gachaPulls: ds.gachaPulls + cards.length },
      };
    });
  }, []);

  const awakenCard = useCallback((characterId: number) => {
    setState(prev => ({
      ...prev,
      ownedCards: prev.ownedCards.map(c =>
        c.characterId === characterId ? { ...c, awakened: true } : c
      ),
    }));
  }, []);

  const setPityCount = useCallback((updater: number | ((prev: number) => number)) => {
    setState(prev => ({
      ...prev,
      pityCount: typeof updater === "function" ? updater(prev.pityCount) : updater,
    }));
  }, []);

  const recordBattleWin = useCallback(() => {
    setState(prev => {
      const today = todayStr();
      const ds = prev.dailyStats.date === today ? prev.dailyStats : freshDailyStats();
      return {
        ...prev,
        totalBattleWins: prev.totalBattleWins + 1,
        dailyStats: { ...ds, battleWins: ds.battleWins + 1 },
      };
    });
    updateActivity();
  }, [updateActivity]);

  const claimQuest = useCallback((questId: number) => {
    setState(prev => {
      const today = todayStr();
      const baseClaimed = prev.lastQuestReset === today ? prev.claimedQuests : [];
      return { ...prev, claimedQuests: [...baseClaimed, questId], lastQuestReset: today };
    });
  }, []);

  const getClaimedQuests = useCallback((): number[] => {
    const today = todayStr();
    return state.lastQuestReset === today ? state.claimedQuests : [];
  }, [state.claimedQuests, state.lastQuestReset]);

  const trackStudyMinutes = useCallback((minutes: number) => {
    setState(prev => {
      const today = todayStr();
      const ds = prev.dailyStats.date === today ? prev.dailyStats : freshDailyStats();
      return { ...prev, dailyStats: { ...ds, studyMinutes: ds.studyMinutes + minutes } };
    });
    updateActivity();
  }, [updateActivity]);

  const trackQuizAnswer = useCallback(() => {
    setState(prev => {
      const today = todayStr();
      const ds = prev.dailyStats.date === today ? prev.dailyStats : freshDailyStats();
      return { ...prev, dailyStats: { ...ds, quizAnswers: ds.quizAnswers + 1 } };
    });
  }, []);

  const buyFrame = useCallback((frameId: string, price: number): boolean => {
    let success = false;
    setState(prev => {
      if (prev.coins < price || prev.ownedFrames.includes(frameId)) return prev;
      success = true;
      return {
        ...prev,
        coins: prev.coins - price,
        ownedFrames: [...prev.ownedFrames, frameId],
        equippedFrame: frameId,
      };
    });
    return success;
  }, []);

  const equipFrame = useCallback((frameId: string) => {
    setState(prev => ({ ...prev, equippedFrame: frameId }));
  }, []);

  const unlockBuff = useCallback((buffId: number, cost: number): boolean => {
    let success = false;
    setState(prev => {
      if (prev.coins < cost || prev.unlockedBuffIds.includes(buffId)) return prev;
      success = true;
      return {
        ...prev,
        coins: prev.coins - cost,
        unlockedBuffIds: [...prev.unlockedBuffIds, buffId],
      };
    });
    return success;
  }, []);

  return {
    user,
    state,
    login,
    logout,
    earnCoins,
    spendCoins,
    earnXp,
    gainCards,
    awakenCard,
    setPityCount,
    recordBattleWin,
    claimQuest,
    getClaimedQuests,
    updateActivity,
    xpToNextLevel,
    buyFrame,
    equipFrame,
    trackStudyMinutes,
    trackQuizAnswer,
    unlockBuff,
  };
}
