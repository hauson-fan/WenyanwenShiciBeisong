import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Brain, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Word } from '@/data/words';
import { getWordById, generateDistractors } from '@/data/words';

interface ReviewModeProps {
  onExit: () => void;
  onCorrect: (wordId: string, points: number) => void;
  onWrong: (wordId: string) => void;
  wordsNeedingReview: string[];
  wordMastery: Record<string, number>;
}

interface ReviewQuestion {
  word: Word;
  meaningIndex: number;
  options: string[];
  daysSinceReview: number;
}

export function ReviewMode({ 
  onExit, 
  onCorrect, 
  onWrong,
  wordsNeedingReview,
  wordMastery
}: ReviewModeProps) {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // 生成复习题目
  useEffect(() => {
    const reviewQuestions: ReviewQuestion[] = wordsNeedingReview
      .slice(0, 10) // 最多复习10个
      .map(wordId => {
        const word = getWordById(wordId);
        if (!word) return null;
        
        const meaningIndex = Math.floor(Math.random() * word.meanings.length);
        const meaning = word.meanings[meaningIndex];
        const distractors = generateDistractors(word, meaning.sense, 3);
        const options = [...distractors, meaning.sense].sort(() => Math.random() - 0.5);
        
        return {
          word,
          meaningIndex,
          options,
          daysSinceReview: Math.floor(Math.random() * 3) + 1 // 模拟1-3天未复习
        };
      })
      .filter((q): q is ReviewQuestion => q !== null);
    
    setQuestions(reviewQuestions);
  }, [wordsNeedingReview]);

  // 当前题目
  const currentQuestion = questions[currentIndex];

  // 处理答案选择
  const handleSelect = (answer: string) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const correctAnswer = currentQuestion.word.meanings[currentQuestion.meaningIndex].sense;
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
      const points = 15 + currentQuestion.daysSinceReview * 5;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      onCorrect(currentQuestion.word.id, points);
    } else {
      onWrong(currentQuestion.word.id);
    }
  };

  // 下一题
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  // 重新开始
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCorrectCount(0);
    setCompleted(false);
  };

  // 如果没有需要复习的实词
  if (wordsNeedingReview.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">太棒了！</h2>
          <p className="text-gray-600 mb-6">暂时没有需要复习的实词，你的记忆保持得很好！</p>
          <Button onClick={onExit}>返回主界面</Button>
        </Card>
      </div>
    );
  }

  // 完成界面
  if (completed) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">{percentage >= 80 ? '🌟' : percentage >= 60 ? '👍' : '💪'}</div>
          <h2 className="text-2xl font-bold mb-2">复习完成！</h2>
          <p className="text-gray-600 mb-6">根据艾宾浩斯遗忘曲线，及时复习有助于长期记忆</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{score}</div>
              <div className="text-sm text-gray-600">总得分</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{correctCount}/{questions.length}</div>
              <div className="text-sm text-gray-600">正确率</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
              <div className="text-sm text-gray-600">掌握程度</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleRestart}>
              <RefreshCw className="w-4 h-4 mr-2" />
              再次复习
            </Button>
            <Button onClick={onExit}>返回主界面</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">加载中...</div>
      </div>
    );
  }

  const currentMeaning = currentQuestion.word.meanings[currentQuestion.meaningIndex];
  const isCorrect = selectedAnswer === currentMeaning.sense;

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
            复习 {currentIndex + 1} / {questions.length}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            得分: {score}
          </span>
        </div>
      </div>

      {/* 复习提示 */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 mb-6 text-white">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6" />
          <div>
            <h3 className="font-bold">记忆强化模式</h3>
            <p className="text-sm text-white/80">根据遗忘曲线，这些实词需要及时复习</p>
          </div>
        </div>
      </div>

      {/* 实词信息卡片 */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-amber-700">
              {currentQuestion.word.word}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold">{currentQuestion.word.word}</h3>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded">
                考频 {currentQuestion.word.frequency}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>已 {currentQuestion.daysSinceReview} 天未复习</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">当前掌握度</div>
            <div className="text-2xl font-bold text-amber-600">
              {wordMastery[currentQuestion.word.id] || 0}%
            </div>
          </div>
        </div>

        {/* 掌握度进度条 */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all"
            style={{ width: `${wordMastery[currentQuestion.word.id] || 0}%` }}
          />
        </div>
      </Card>

      {/* 题目卡片 */}
      <Card className="p-6">
        {/* 语境说明 */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{currentMeaning.context}</p>
        </div>

        {/* 文言文句子 */}
        <div className="mb-6 p-4 bg-amber-50 rounded-lg">
          <div className="text-lg leading-relaxed text-gray-800 font-medium text-center">
            {currentMeaning.example.split(currentQuestion.word.word).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 mx-1 bg-amber-200 text-amber-900 rounded font-bold">
                    {currentQuestion.word.word}
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
            "<span className="font-bold text-amber-700">{currentQuestion.word.word}</span>"在此处的意思是：
          </p>
        </div>

        {/* 选项 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentQuestion.options.map((option, index) => {
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
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 结果反馈 */}
        {showResult && (
          <div className={cn(
            "mt-6 p-4 rounded-lg",
            isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          )}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={cn(
                "font-bold",
                isCorrect ? "text-green-700" : "text-red-700"
              )}>
                {isCorrect ? `+${15 + currentQuestion.daysSinceReview * 5} 分！` : "回答错误"}
              </span>
            </div>
            
            {!isCorrect && (
              <p className="text-gray-700">
                正确答案是：<span className="font-bold text-green-700">{currentMeaning.sense}</span>
              </p>
            )}

            {/* 所有义项 */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">"{currentQuestion.word.word}"的所有义项：</p>
              <div className="flex flex-wrap gap-2">
                {currentQuestion.word.meanings.map((m, i) => (
                  <span 
                    key={i}
                    className={cn(
                      "px-2 py-1 rounded text-sm",
                      m.sense === currentMeaning.sense
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {m.sense}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 下一题按钮 */}
        {showResult && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleNext}>
              {currentIndex < questions.length - 1 ? '下一题' : '完成复习'}
            </Button>
          </div>
        )}
      </Card>

      {/* 复习提示 */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>💡 提示：间隔重复是记忆的最佳策略，及时复习可以巩固长期记忆</p>
      </div>
    </div>
  );
}
