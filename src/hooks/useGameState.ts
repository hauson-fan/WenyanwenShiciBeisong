import { useState, useCallback, useEffect } from 'react';
import type { GameState, PlayerProgress, GameMode, Achievement } from '@/types/game';
import { initialProgress, achievements } from '@/types/game';

const PROGRESS_KEY = 'wenyan_game_progress';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    currentMode: 'explore',
    currentScene: null,
    currentWord: null,
    score: 0,
    streak: 0,
    lives: 3,
    timeLeft: 60,
    isPaused: false
  });

  const [progress, setProgress] = useState<PlayerProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialProgress;
        }
      }
    }
    return initialProgress;
  });

  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  // 保存进度到本地存储
  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  // 检查成就
  const checkAchievements = useCallback(() => {
    const newlyUnlocked: Achievement[] = [];
    
    achievements.forEach(achievement => {
      if (!progress.achievements.includes(achievement.id)) {
        if (achievement.condition(progress)) {
          newlyUnlocked.push(achievement);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      setNewAchievements(newlyUnlocked);
      setProgress(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newlyUnlocked.map(a => a.id)]
      }));
    }

    return newlyUnlocked;
  }, [progress]);

  // 更新实词掌握度
  const updateWordMastery = useCallback((wordId: string, delta: number) => {
    setProgress(prev => {
      const currentMastery = prev.wordMastery[wordId] || 0;
      const newMastery = Math.min(100, Math.max(0, currentMastery + delta));
      
      const newMasteredWords = newMastery >= 80 && currentMastery < 80
        ? [...prev.masteredWords, wordId]
        : prev.masteredWords;

      return {
        ...prev,
        wordMastery: {
          ...prev.wordMastery,
          [wordId]: newMastery
        },
        masteredWords: newMasteredWords
      };
    });
  }, []);

  // 增加经验值
  const addExperience = useCallback((amount: number) => {
    setProgress(prev => {
      const newExp = prev.experience + amount;
      const newLevel = Math.floor(newExp / 100) + 1;
      
      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        totalScore: prev.totalScore + amount
      };
    });
  }, []);

  // 解锁场景
  const unlockScene = useCallback((sceneId: string) => {
    setProgress(prev => {
      if (prev.unlockedScenes.includes(sceneId)) return prev;
      
      return {
        ...prev,
        unlockedScenes: [...prev.unlockedScenes, sceneId]
      };
    });
  }, []);

  // 更新上次复习时间
  const updateReviewTime = useCallback((wordId: string) => {
    setProgress(prev => ({
      ...prev,
      lastReviewTime: {
        ...prev.lastReviewTime,
        [wordId]: Date.now()
      }
    }));
  }, []);

  // 设置游戏模式
  const setGameMode = useCallback((mode: GameMode) => {
    setGameState(prev => ({
      ...prev,
      currentMode: mode,
      score: 0,
      streak: 0,
      lives: 3,
      timeLeft: mode === 'survival' ? 60 : 0,
      isPaused: false
    }));
  }, []);

  // 设置当前场景
  const setCurrentScene = useCallback((sceneId: string | null) => {
    setGameState(prev => ({
      ...prev,
      currentScene: sceneId
    }));
  }, []);

  // 设置当前实词
  const setCurrentWord = useCallback((wordId: string | null) => {
    setGameState(prev => ({
      ...prev,
      currentWord: wordId
    }));
  }, []);

  // 回答正确
  const handleCorrectAnswer = useCallback((wordId: string, points: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      streak: prev.streak + 1
    }));
    
    updateWordMastery(wordId, 10);
    addExperience(points);
    updateReviewTime(wordId);
    
    // 检查是否需要解锁新场景
    const masteryValues = Object.values(progress.wordMastery);
    const avgMastery = masteryValues.length > 0 
      ? masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length 
      : 0;
    
    if (avgMastery >= 60 && !progress.unlockedScenes.includes('qinhan')) {
      unlockScene('qinhan');
    }
    if (avgMastery >= 70 && !progress.unlockedScenes.includes('weijin')) {
      unlockScene('weijin');
    }
    if (avgMastery >= 80 && !progress.unlockedScenes.includes('tangsong')) {
      unlockScene('tangsong');
    }
    if (avgMastery >= 90 && !progress.unlockedScenes.includes('mingqing')) {
      unlockScene('mingqing');
    }
  }, [progress, updateWordMastery, addExperience, updateReviewTime, unlockScene]);

  // 回答错误
  const handleWrongAnswer = useCallback((wordId: string) => {
    setGameState(prev => ({
      ...prev,
      streak: 0,
      lives: prev.lives - 1
    }));
    
    updateWordMastery(wordId, -5);
  }, [updateWordMastery]);

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, []);

  // 重置当前游戏
  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      streak: 0,
      lives: 3,
      timeLeft: prev.currentMode === 'survival' ? 60 : 0,
      isPaused: false
    }));
  }, []);

  // 清除新成就通知
  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  // 获取需要复习的实词
  const getWordsNeedingReview = useCallback(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    return Object.entries(progress.lastReviewTime)
      .filter(([_, time]) => now - time > oneDay)
      .map(([wordId]) => wordId);
  }, [progress.lastReviewTime]);

  return {
    gameState,
    progress,
    newAchievements,
    setGameMode,
    setCurrentScene,
    setCurrentWord,
    handleCorrectAnswer,
    handleWrongAnswer,
    togglePause,
    resetGame,
    checkAchievements,
    clearNewAchievements,
    getWordsNeedingReview,
    unlockScene
  };
}
