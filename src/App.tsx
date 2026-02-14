import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainMenu } from '@/components/MainMenu';
import { ExploreMode } from '@/components/ExploreMode';
import { SurvivalMode } from '@/components/SurvivalMode';
import { CourtMode } from '@/components/CourtMode';
import { ReviewMode } from '@/components/ReviewMode';
import { useGameState } from '@/hooks/useGameState';
import type { GameMode, Achievement } from '@/types/game';
import './App.css';

function App() {
  const {
    gameState,
    progress,

    setGameMode,
    setCurrentScene,
    handleCorrectAnswer,
    handleWrongAnswer,
    resetGame,
    checkAchievements,
    clearNewAchievements,
    getWordsNeedingReview
  } = useGameState();

  const [view, setView] = useState<'menu' | 'game'>('menu');

  // 检查成就
  useEffect(() => {
    const unlocked = checkAchievements();
    if (unlocked.length > 0) {
      unlocked.forEach((achievement: Achievement) => {
        toast.success(
          <div className="flex items-center gap-3">
            <span className="text-3xl">{achievement.icon}</span>
            <div>
              <div className="font-bold">解锁成就：{achievement.name}</div>
              <div className="text-sm text-gray-600">{achievement.description}</div>
            </div>
          </div>,
          { duration: 5000 }
        );
      });
      clearNewAchievements();
    }
  }, [progress, checkAchievements, clearNewAchievements]);

  // 处理模式选择
  const handleSelectMode = useCallback((mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'review') {
      const wordsNeedingReview = getWordsNeedingReview();
      if (wordsNeedingReview.length === 0) {
        toast.info('暂时没有需要复习的实词，你的记忆保持得很好！');
        return;
      }
    }
    setView('game');
  }, [setGameMode, getWordsNeedingReview]);

  // 处理场景选择
  const handleSelectScene = useCallback((sceneId: string) => {
    setCurrentScene(sceneId);
    setView('game');
  }, [setCurrentScene]);

  // 处理正确答案
  const onCorrect = useCallback((wordId: string, points: number) => {
    handleCorrectAnswer(wordId, points);
    
    // 显示得分提示
    const bonusTexts: string[] = [];
    if (gameState.streak >= 3) bonusTexts.push(`${gameState.streak}连击！`);
    
    toast.success(
      <div>
        <div className="font-bold">+{points} 分！</div>
        {bonusTexts.length > 0 && (
          <div className="text-sm text-amber-600">{bonusTexts.join(' ')}</div>
        )}
      </div>,
      { duration: 1500 }
    );
  }, [handleCorrectAnswer, gameState.streak]);

  // 处理错误答案
  const onWrong = useCallback((wordId: string) => {
    handleWrongAnswer(wordId);
    toast.error('回答错误，掌握度下降', { duration: 1500 });
  }, [handleWrongAnswer]);

  // 返回主菜单
  const handleExit = useCallback(() => {
    setView('menu');
    resetGame();
  }, [resetGame]);

  // 渲染游戏内容
  const renderGameContent = () => {
    switch (gameState.currentMode) {
      case 'explore':
        if (!gameState.currentScene) {
          return (
            <div className="flex flex-col items-center justify-center h-96">
              <p className="text-gray-600 mb-4">请先选择一个场景</p>
              <Button onClick={handleExit}>返回主菜单</Button>
            </div>
          );
        }
        return (
          <ExploreMode
            sceneId={gameState.currentScene}
            onExit={handleExit}
            onCorrect={onCorrect}
            onWrong={onWrong}
            wordMastery={progress.wordMastery}
          />
        );
      
      case 'survival':
        return (
          <SurvivalMode
            onExit={handleExit}
            onCorrect={onCorrect}
            onWrong={onWrong}
          />
        );
      
      case 'court':
        return (
          <CourtMode
            onExit={handleExit}
            onCorrect={onCorrect}
            onWrong={onWrong}
          />
        );
      
      case 'review':
        return (
          <ReviewMode
            onExit={handleExit}
            onCorrect={onCorrect}
            onWrong={onWrong}
            wordsNeedingReview={getWordsNeedingReview()}
            wordMastery={progress.wordMastery}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster position="top-center" richColors />
      
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setView('menu')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">文言文实词时空书院</h1>
              <p className="text-xs text-gray-500">在语境中高效记忆高中文言文实词</p>
            </div>
          </div>
          
          {view === 'game' && (
            <Button variant="ghost" onClick={handleExit}>
              返回主菜单
            </Button>
          )}
        </div>
      </header>

      {/* 主内容区 */}
      <main className="py-6">
        {view === 'menu' ? (
          <MainMenu
            progress={progress}
            onSelectMode={handleSelectMode}
            onSelectScene={handleSelectScene}
          />
        ) : (
          renderGameContent()
        )}
      </main>

      {/* 底部信息 */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>© 2026 文言文实词时空书院 - 让文言文学习更有趣</p>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <span>已掌握: {progress.masteredWords.length} 个实词</span>
              <span>等级: Lv.{progress.level}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
