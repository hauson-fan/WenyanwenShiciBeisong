// 游戏类型定义

export type GameMode = 'explore' | 'survival' | 'build' | 'court' | 'review';

export interface PlayerProgress {
  level: number;
  experience: number;
  totalScore: number;
  unlockedScenes: string[];
  masteredWords: string[];
  wordMastery: Record<string, number>; // 实词ID -> 掌握度 (0-100)
  lastReviewTime: Record<string, number>; // 实词ID -> 上次复习时间
  achievements: string[];
}

export interface GameState {
  currentMode: GameMode;
  currentScene: string | null;
  currentWord: string | null;
  score: number;
  streak: number;
  lives: number;
  timeLeft: number;
  isPaused: boolean;
}

export interface Question {
  word: string;
  wordId: string;
  context: string;
  sentence: string;
  source: string;
  correctAnswer: string;
  options: string[];
  etymology?: string;
}

export interface CourtCase {
  word: string;
  wordId: string;
  evidences: {
    text: string;
    source: string;
    meaning: string;
  }[];
}

export interface BuildTask {
  word: string;
  wordId: string;
  scenario: string;
  targetMeaning: string;
  availableChars: string[];
  hint: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: PlayerProgress) => boolean;
}

// 游戏事件
export type GameEvent = 
  | { type: 'CORRECT_ANSWER'; wordId: string; points: number }
  | { type: 'WRONG_ANSWER'; wordId: string }
  | { type: 'SCENE_COMPLETE'; sceneId: string }
  | { type: 'WORD_MASTERED'; wordId: string }
  | { type: 'ACHIEVEMENT_UNLOCKED'; achievementId: string };

// 初始玩家进度
export const initialProgress: PlayerProgress = {
  level: 1,
  experience: 0,
  totalScore: 0,
  unlockedScenes: ['xianqin'],
  masteredWords: [],
  wordMastery: {},
  lastReviewTime: {},
  achievements: []
};

// 成就列表
export const achievements: Achievement[] = [
  {
    id: 'first_step',
    name: '初窥门径',
    description: '完成第一个场景的学习',
    icon: '🎯',
    condition: (p) => p.unlockedScenes.length >= 2
  },
  {
    id: 'word_collector',
    name: '字海拾贝',
    description: '掌握10个实词',
    icon: '📚',
    condition: (p) => p.masteredWords.length >= 10
  },
  {
    id: 'streak_master',
    name: '连击大师',
    description: '连续答对10题',
    icon: '🔥',
    condition: () => false // 通过游戏状态检查
  },
  {
    id: 'scene_explorer',
    name: '时空漫游者',
    description: '解锁全部五个朝代场景',
    icon: '🌟',
    condition: (p) => p.unlockedScenes.length >= 5
  },
  {
    id: 'polysemy_expert',
    name: '一词之师',
    description: '掌握一个实词的所有义项',
    icon: '🏆',
    condition: (p) => Object.values(p.wordMastery).some(m => m >= 100)
  }
];
