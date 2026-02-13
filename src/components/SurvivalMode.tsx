import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Clock, Heart, Zap, Trophy, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Word } from '@/data/words';
import { getRandomWords, generateDistractors } from '@/data/words';

interface SurvivalModeProps {
  onExit: () => void;
  onCorrect: (wordId: string, points: number) => void;
  onWrong: (wordId: string) => void;
}

interface SurvivalQuestion {
  word: Word;
  meaningIndex: number;
  options: string[];
}

export function SurvivalMode({ onExit, onCorrect, onWrong }: SurvivalModeProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [streak, setStreak] = useState(0);
  const [question, setQuestion] = useState<SurvivalQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('wenyan_survival_highscore') || '0');
    }
    return 0;
  });

  // 生成新题目
  const generateQuestion = useCallback(() => {
    const words = getRandomWords(1);
    const word = words[0];
    const meaningIndex = Math.floor(Math.random() * word.meanings.length);
    const meaning = word.meanings[meaningIndex];
    const distractors = generateDistractors(word, meaning.sense, 3);
    const options = [...distractors, meaning.sense].sort(() => Math.random() - 0.5);
    
    setQuestion({
      word,
      meaningIndex,
      options
    });
    setSelectedAnswer(null);
    setShowResult(false);
  }, []);

  // 初始化
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  // 倒计时
  useEffect(() => {
    if (isPaused || gameOver || showResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, gameOver, showResult]);

  // 处理答案选择
  const handleSelect = (answer: string) => {
    if (showResult || !question) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const correctAnswer = question.word.meanings[question.meaningIndex].sense;
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 10);
      const streakBonus = streak * 3;
      const points = 10 + timeBonus + streakBonus;
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setTimeLeft(prev => Math.min(60, prev + 5)); // 答对加5秒
      onCorrect(question.word.id, points);
    } else {
      setStreak(0);
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
        }
        return newLives;
      });
      onWrong(question.word.id);
    }

    // 延迟后下一题
    setTimeout(() => {
      if (!gameOver && lives > 0) {
        generateQuestion();
      }
    }, 1500);
  };

  // 游戏结束处理
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('wenyan_survival_highscore', score.toString());
    }
  }, [gameOver, score, highScore]);

  // 重新开始
  const handleRestart = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setStreak(0);
    setGameOver(false);
    setIsPaused(false);
    generateQuestion();
  };

  // 暂停/继续
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">加载中...</div>
      </div>
    );
  }

  // 游戏结束界面
  if (gameOver) {
    const isNewRecord = score > highScore || (score === highScore && score > 0);
    
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">{isNewRecord ? '🏆' : '🎮'}</div>
          <h2 className="text-2xl font-bold mb-2">
            {isNewRecord ? '新纪录！' : '游戏结束'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-amber-600">{score}</div>
              <div className="text-sm text-gray-600">本次得分</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{highScore}</div>
              <div className="text-sm text-gray-600">最高纪录</div>
            </div>
          </div>

          {isNewRecord && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">
                🎉 恭喜你打破了历史最高纪录！
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleRestart}>
              再来一局
            </Button>
            <Button onClick={onExit}>
              返回主界面
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentMeaning = question.word.meanings[question.meaningIndex];
  const isCorrect = selectedAnswer === currentMeaning.sense;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onExit}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          退出
        </Button>
        
        <div className="flex items-center gap-4">
          {/* 生命值 */}
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                className={cn(
                  "w-5 h-5",
                  i < lives ? "text-red-500 fill-red-500" : "text-gray-300"
                )}
              />
            ))}
          </div>
          
          {/* 倒计时 */}
          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full",
            timeLeft <= 10 ? "bg-red-100 text-red-700 animate-pulse" : "bg-blue-100 text-blue-700"
          )}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{timeLeft}s</span>
          </div>
          
          {/* 连击 */}
          {streak > 0 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
              <Zap className="w-4 h-4" />
              <span className="font-bold">{streak}</span>
            </div>
          )}
          
          {/* 暂停按钮 */}
          <Button variant="ghost" size="icon" onClick={togglePause}>
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* 得分显示 */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
          <Trophy className="w-5 h-5" />
          <span className="text-2xl font-bold">{score}</span>
        </div>
      </div>

      {/* 暂停遮罩 */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl text-center">
            <Pause className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold mb-4">游戏暂停</h3>
            <Button onClick={togglePause}>继续游戏</Button>
          </div>
        </div>
      )}

      {/* 题目卡片 */}
      <Card className="p-6">
        {/* 文言文句子 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-xl leading-relaxed text-gray-800 font-medium text-center">
            {currentMeaning.example.split(question.word.word).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 mx-1 bg-amber-200 text-amber-900 rounded font-bold">
                    {question.word.word}
                  </span>
                )}
              </span>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            —— {currentMeaning.source}
          </div>
        </div>

        {/* 问题 */}
        <div className="mb-4 text-center">
          <p className="text-gray-700">
            "<span className="font-bold text-amber-700">{question.word.word}</span>"的意思是：
          </p>
        </div>

        {/* 选项 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentMeaning.sense;
            
            let buttonClass = "border-2 p-4 rounded-lg text-left transition-all ";
            
            if (!showResult) {
              buttonClass += "border-gray-200 hover:border-amber-400 hover:bg-amber-50";
            } else if (isCorrectOption) {
              buttonClass += "border-green-500 bg-green-50";
            } else if (isSelected && !isCorrectOption) {
              buttonClass += "border-red-500 bg-red-50";
            } else {
              buttonClass += "border-gray-200 opacity-50";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                disabled={showResult}
                className={buttonClass}
              >
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {/* 结果反馈 */}
        {showResult && (
          <div className={cn(
            "mt-6 p-4 rounded-lg text-center",
            isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          )}>
            <span className={cn(
              "font-bold text-lg",
              isCorrect ? "text-green-700" : "text-red-700"
            )}>
              {isCorrect ? `+${10 + Math.floor(timeLeft / 10) + streak * 3} 分！` : "回答错误！"}
            </span>
            {!isCorrect && (
              <p className="text-gray-600 mt-1">
                正确答案是：{currentMeaning.sense}
              </p>
            )}
          </div>
        )}
      </Card>

      {/* 提示 */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>答对加5秒，连击有额外加分！</p>
      </div>
    </div>
  );
}
