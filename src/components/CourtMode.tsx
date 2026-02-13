import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Scale, Gavel, BookOpen, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Word } from '@/data/words';
import { getRandomWords } from '@/data/words';

interface CourtModeProps {
  onExit: () => void;
  onCorrect: (wordId: string, points: number) => void;
  onWrong: (wordId: string) => void;
}

interface CourtQuestion {
  word: Word;
  evidences: {
    text: string;
    source: string;
    meaning: string;
    matched: boolean;
  }[];
}

export function CourtMode({ onExit, onCorrect, onWrong }: CourtModeProps) {
  const [question, setQuestion] = useState<CourtQuestion | null>(null);
  const [selectedMatches, setSelectedMatches] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameComplete, setGameComplete] = useState(false);
  const totalRounds = 5;

  // 生成题目
  const generateQuestion = useCallback(() => {
    const words = getRandomWords(1);
    const word = words[0];
    
    // 为该词的每个义项创建一个证据
    const evidences = word.meanings.map(m => ({
      text: m.example,
      source: m.source,
      meaning: m.sense,
      matched: false
    }));
    
    // 打乱顺序
    const shuffledEvidences = [...evidences].sort(() => Math.random() - 0.5);
    
    setQuestion({
      word,
      evidences: shuffledEvidences
    });
    setSelectedMatches({});
    setShowResult(false);
  }, []);

  // 初始化
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  // 处理匹配选择
  const handleMatch = (evidenceIndex: number, meaning: string) => {
    if (showResult) return;
    
    setSelectedMatches(prev => ({
      ...prev,
      [evidenceIndex]: meaning
    }));
  };

  // 检查答案
  const checkAnswers = () => {
    if (!question) return;
    
    setShowResult(true);
    
    let correctCount = 0;
    question.evidences.forEach((evidence, index) => {
      if (selectedMatches[index] === evidence.meaning) {
        correctCount++;
      }
    });
    
    const points = correctCount * 20;
    setScore(prev => prev + points);
    
    if (correctCount === question.evidences.length) {
      onCorrect(question.word.id, points);
    } else {
      onWrong(question.word.id);
    }
  };

  // 下一题
  const handleNext = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      generateQuestion();
    } else {
      setGameComplete(true);
    }
  };

  // 重新开始
  const handleRestart = () => {
    setCurrentRound(1);
    setScore(0);
    setGameComplete(false);
    generateQuestion();
  };

  // 获取所有可用的义项选项（去重）
  const getMeaningOptions = () => {
    if (!question) return [];
    const meanings = question.word.meanings.map(m => m.sense);
    return [...new Set(meanings)];
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">加载中...</div>
      </div>
    );
  }

  // 游戏完成界面
  if (gameComplete) {
    const maxScore = totalRounds * question.word.meanings.length * 20;
    const percentage = Math.round((score / maxScore) * 100);
    
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">⚖️</div>
          <h2 className="text-2xl font-bold mb-2">庭审结束！</h2>
          <p className="text-gray-600 mb-6">你已完成古今法庭的所有案件</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{score}</div>
              <div className="text-sm text-gray-600">总得分</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalRounds}</div>
              <div className="text-sm text-gray-600">审理案件</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{percentage}%</div>
              <div className="text-sm text-gray-600">正确率</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleRestart}>
              <RefreshCw className="w-4 h-4 mr-2" />
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

  const meaningOptions = getMeaningOptions();
  const allMatched = question.evidences.every((_, index) => selectedMatches[index]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onExit}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            案件 {currentRound} / {totalRounds}
          </span>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
            得分: {score}
          </span>
        </div>
      </div>

      {/* 法庭标题 */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-bold">古今法庭</h2>
            <p className="text-white/70 text-sm">根据证据判断词义，还原文言真相</p>
          </div>
        </div>
      </div>

      {/* 被告信息 */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-amber-700">{question.word.word}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold">被告："{question.word.word}"字</h3>
            <p className="text-gray-600">涉嫌一词多义，请根据证据判定各义项</p>
          </div>
        </div>

        {question.word.etymology && (
          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <BookOpen className="w-4 h-4 inline mr-2" />
            {question.word.etymology}
          </div>
        )}
      </Card>

      {/* 证据列表 */}
      <div className="space-y-4 mb-6">
        <h4 className="font-bold text-gray-700 flex items-center gap-2">
          <Gavel className="w-5 h-5" />
          证据材料
        </h4>
        
        {question.evidences.map((evidence, index) => {
          const selectedMeaning = selectedMatches[index];
          const isCorrect = selectedMeaning === evidence.meaning;
          
          return (
            <Card 
              key={index} 
              className={cn(
                "p-4 transition-all",
                showResult && isCorrect && "border-green-500 bg-green-50",
                showResult && selectedMeaning && !isCorrect && "border-red-500 bg-red-50"
              )}
            >
              <div className="mb-3">
                <p className="text-gray-800 font-medium">"{evidence.text}"</p>
                <p className="text-sm text-gray-500">—— {evidence.source}</p>
              </div>
              
              {!showResult ? (
                <div className="flex flex-wrap gap-2">
                  {meaningOptions.map((meaning) => (
                    <button
                      key={meaning}
                      onClick={() => handleMatch(index, meaning)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm border transition-all",
                        selectedMeaning === meaning
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-white text-gray-700 border-gray-300 hover:border-amber-400"
                      )}
                    >
                      {meaning}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">
                        判定正确：{evidence.meaning}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-700">
                        你的判定：{selectedMeaning || "未选择"}
                      </span>
                      <span className="text-gray-500">→</span>
                      <span className="text-green-700 font-medium">
                        正确义项：{evidence.meaning}
                      </span>
                    </>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* 操作按钮 */}
      {!showResult ? (
        <div className="flex justify-center">
          <Button 
            onClick={checkAnswers}
            disabled={!allMatched}
            className="px-8"
          >
            <Gavel className="w-4 h-4 mr-2" />
            宣判结果
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button onClick={handleNext} className="px-8">
            {currentRound < totalRounds ? '下一案件' : '完成庭审'}
          </Button>
        </div>
      )}

      {/* 进度提示 */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>已匹配 {Object.keys(selectedMatches).length} / {question.evidences.length} 条证据</p>
      </div>
    </div>
  );
}
