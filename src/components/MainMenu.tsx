import { useState } from 'react';
import { 
  BookOpen, 
  Sword, 
  Scale, 
  Trophy, 
  User,
  Star,
  Clock,
  Flame,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { GameMode, PlayerProgress } from '@/types/game';
import { achievements } from '@/types/game';
import { scenes, getAllWords } from '@/data/words';

interface MainMenuProps {
  progress: PlayerProgress;
  onSelectMode: (mode: GameMode) => void;
  onSelectScene: (sceneId: string) => void;
}

const gameModes = [
  {
    id: 'explore' as GameMode,
    name: '语境探案',
    description: '穿越历史场景，在语境中推断实词含义',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    unlocked: true
  },
  {
    id: 'survival' as GameMode,
    name: '实词生存战',
    description: '限时挑战，连续答对获得连击加分',
    icon: Sword,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    unlocked: true
  },
  {
    id: 'court' as GameMode,
    name: '古今法庭',
    description: '辨析一词多义，匹配证据与义项',
    icon: Scale,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    unlocked: true
  },
  {
    id: 'review' as GameMode,
    name: '记忆强化',
    description: '根据遗忘曲线复习即将遗忘的实词',
    icon: Clock,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    unlocked: true
  }
];

export function MainMenu({ progress, onSelectMode, onSelectScene }: MainMenuProps) {
  const [showScenes, setShowScenes] = useState(false);
  const [, setSelectedMode] = useState<GameMode | null>(null);

  const handleModeSelect = (mode: GameMode) => {
    if (mode === 'explore') {
      setSelectedMode(mode);
      setShowScenes(true);
    } else {
      onSelectMode(mode);
    }
  };

  const handleSceneSelect = (sceneId: string) => {
    onSelectScene(sceneId);
    setShowScenes(false);
  };

  // 计算总体掌握度
  const allWords = getAllWords();
  const masteryValues = Object.values(progress.wordMastery);
  const avgMastery = masteryValues.length > 0
    ? Math.round(masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length)
    : 0;

  // 计算需要复习的实词数量
  const wordsNeedingReview = Object.entries(progress.lastReviewTime).filter(([_, time]) => {
    const daysSinceReview = (Date.now() - time) / (1000 * 60 * 60 * 24);
    return daysSinceReview > 1;
  }).length;

  // 获取已解锁的成就
  const unlockedAchievements = achievements.filter(a => 
    progress.achievements.includes(a.id)
  );

  if (showScenes) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">选择时空场景</h2>
            <p className="text-gray-600">每个场景都包含该朝代的高频实词</p>
          </div>
          <Button variant="outline" onClick={() => setShowScenes(false)}>
            返回
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenes.map((scene) => {
            const isUnlocked = progress.unlockedScenes.includes(scene.id);
            const sceneWords = allWords.filter(w => 
              w.meanings.some(m => m.scene === scene.id)
            );
            const sceneMastery = sceneWords.length > 0
              ? Math.round(
                  sceneWords.reduce((sum, w) => 
                    sum + (progress.wordMastery[w.id] || 0), 0
                  ) / sceneWords.length
                )
              : 0;

            return (
              <Card
                key={scene.id}
                onClick={() => isUnlocked && handleSceneSelect(scene.id)}
                className={cn(
                  "relative overflow-hidden p-6 transition-all duration-300",
                  isUnlocked 
                    ? "cursor-pointer hover:shadow-xl hover:scale-105" 
                    : "opacity-60 cursor-not-allowed"
                )}
              >
                {/* 背景渐变 */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-90",
                  scene.bgColor
                )} />
                
                {/* 锁定遮罩 */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">🔒</div>
                      <p>掌握度达到要求后解锁</p>
                    </div>
                  </div>
                )}

                <div className="relative z-0 text-white">
                  <div className="text-sm opacity-80 mb-1">{scene.era}</div>
                  <h3 className="text-2xl font-bold mb-2">{scene.name}</h3>
                  <p className="text-sm opacity-80 mb-4">{scene.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>掌握度</span>
                      <span>{sceneMastery}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all"
                        style={{ width: `${sceneMastery}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-2 py-1 bg-white/20 rounded text-xs">
                      {scene.words.length} 个实词
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 顶部用户信息栏 */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">时空书院学员</h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-amber-300">Lv.{progress.level}</span>
                <span className="text-white/60">|</span>
                <span className="text-white/80">{progress.totalScore} 总积分</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{progress.masteredWords.length}</div>
              <div className="text-xs text-white/60">已掌握</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{avgMastery}%</div>
              <div className="text-xs text-white/60">总掌握度</div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-center hover:opacity-80 transition-opacity">
                  <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
                  <div className="text-xs text-white/60">成就</div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    我的成就
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  {achievements.map((achievement) => {
                    const isUnlocked = progress.achievements.includes(achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={cn(
                          "p-4 rounded-lg border flex items-center gap-3",
                          isUnlocked 
                            ? "bg-amber-50 border-amber-200" 
                            : "bg-gray-50 border-gray-200 opacity-60"
                        )}
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className={cn(
                            "font-bold",
                            isUnlocked ? "text-amber-900" : "text-gray-700"
                          )}>
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {achievement.description}
                          </p>
                        </div>
                        {isUnlocked && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 经验条 */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>经验值</span>
            <span>{progress.experience % 100} / 100</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${(progress.experience % 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 游戏模式选择 */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">选择游戏模式</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameModes.map((mode) => {
            const Icon = mode.icon;
            const isReviewMode = mode.id === 'review';
            const reviewCount = wordsNeedingReview;
            
            return (
              <Card
                key={mode.id}
                onClick={() => mode.unlocked && handleModeSelect(mode.id)}
                className={cn(
                  "p-6 transition-all cursor-pointer hover:shadow-lg",
                  !mode.unlocked && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center text-white bg-gradient-to-br",
                    mode.color
                  )}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-gray-800">{mode.name}</h4>
                      {isReviewMode && reviewCount > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          {reviewCount} 个待复习
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{mode.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 学习统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{allWords.length}</div>
              <div className="text-sm text-gray-600">实词总数</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{progress.masteredWords.length}</div>
              <div className="text-sm text-gray-600">已掌握</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{progress.unlockedScenes.length}</div>
              <div className="text-sm text-gray-600">已解锁场景</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
