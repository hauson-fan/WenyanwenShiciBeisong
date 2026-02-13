import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, BookOpen, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Word, WordMeaning } from '@/data/words';
import { getWordsByScene, generateDistractors, scenes } from '@/data/words';

interface ExploreModeProps {
  sceneId: string;
  onExit: () => void;
  onCorrect: (wordId: string, points: number) => void;
  onWrong: (wordId: string) => void;
  wordMastery: Record<string, number>;
}

interface CurrentQuestion {
  word: Word;
  meaning: WordMeaning;
  options: string[];
}

export function ExploreMode({ 
  sceneId, 
  onExit, 
  onCorrect, 
  onWrong,
  wordMastery 
}: ExploreModeProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState<CurrentQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showEtymology, setShowEtymology] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scene = scenes.find(s => s.id === sceneId);

  // 初始化题目
  useEffect(() => {
    const sceneWords = getWordsByScene(sceneId);
    // 如果没有该场景的专属实词，使用通用实词
    const wordsToUse = sceneWords.length > 0 ? sceneWords : getWordsByScene('qinhan');
    setWords(wordsToUse);
    
    if (wordsToUse.length > 0) {
      generateQuestion(wordsToUse[0]);
    }
  }, [sceneId]);

  // 生成题目
  const generateQuestion = useCallback((word: Word) => {
    const meaning = word.meanings[Math.floor(Math.random() * word.meanings.length)];
    const distractors = generateDistractors(word, meaning.sense, 3);
    const options = [...distractors, meaning.sense].sort(() => Math.random() - 0.5);
    
    setQuestion({
      word,
      meaning,
      options
    });
    setSelectedAnswer(null);
    setShowResult(false);
    setShowEtymology(false);
  }, []);

  // 处理答案选择
  const handleSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === question?.meaning.sense;
    
    if (isCorrect) {
      const points = 10 + streak * 2;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      onCorrect(question!.word.id, points);
    } else {
      setStreak(0);
      onWrong(question!.word.id);
    }
  };

  // 下一题
  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      generateQuestion(words[nextIndex]);
    } else {
      setCompleted(true);
    }
  };

  // 重新开始
  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setCompleted(false);
    generateQuestion(words[0]);
  };

  if (!scene || !question) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">加载中...</div>
      </div>
    );
  }

  // 完成界面
  if (completed) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">场景探索完成！</h2>
          <p className="text-gray-600 mb-6">你已完成 {scene.name} 的所有实词学习</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{score}</div>
              <div className="text-sm text-gray-600">总得分</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{words.length}</div>
              <div className="text-sm text-gray-600">学习实词</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(score / (words.length * 14) * 100)}%
              </div>
              <div className="text-sm text-gray-600">正确率</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleRestart}>
              重新学习
            </Button>
            <Button onClick={onExit}>
              返回主界面
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isCorrect = selectedAnswer === question.meaning.sense;

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
            题目 {currentIndex + 1} / {words.length}
          </span>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
            得分: {score}
          </span>
          {streak > 0 && (
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              🔥 {streak} 连击
            </span>
          )}
        </div>
      </div>

      {/* 场景标题 */}
      <div className={cn(
        "rounded-xl p-4 mb-6 text-white bg-gradient-to-r",
        scene.bgColor
      )}>
        <h2 className="text-xl font-bold">{scene.name}</h2>
        <p className="text-white/80 text-sm">{scene.description}</p>
      </div>

      {/* 题目卡片 */}
      <Card className="p-6 mb-6">
        {/* 语境说明 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">语境背景</span>
          </div>
          <p className="text-gray-700">{question.meaning.context}</p>
        </div>

        {/* 文言文句子 */}
        <div className="mb-6">
          <div className="text-lg leading-relaxed text-gray-800 font-medium">
            {question.meaning.example.split(question.word.word).map((part, i, arr) => (
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
          <div className="mt-2 text-sm text-gray-500">
            —— {question.meaning.source}
          </div>
        </div>

        {/* 问题 */}
        <div className="mb-4">
          <p className="text-gray-700">
            句中"<span className="font-bold text-amber-700">{question.word.word}</span>"的意思是：
          </p>
        </div>

        {/* 选项 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === question.meaning.sense;
            
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
                {isCorrect ? "回答正确！" : "回答错误"}
              </span>
            </div>
            
            {!isCorrect && (
              <p className="text-gray-700 mb-2">
                正确答案是：<span className="font-bold text-green-700">{question.meaning.sense}</span>
              </p>
            )}

            {/* 字源按钮 */}
            {question.word.etymology && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEtymology(true)}
                className="mt-2"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                查看字源
              </Button>
            )}
          </div>
        )}

        {/* 下一题按钮 */}
        {showResult && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleNext}>
              {currentIndex < words.length - 1 ? '下一题' : '完成学习'}
            </Button>
          </div>
        )}
      </Card>

      {/* 掌握度显示 */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>当前实词掌握度:</span>
        <div className="flex-1 max-w-xs">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${wordMastery[question.word.id] || 0}%` }}
            />
          </div>
        </div>
        <span>{wordMastery[question.word.id] || 0}%</span>
      </div>

      {/* 字源弹窗 */}
      <Dialog open={showEtymology} onOpenChange={setShowEtymology}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              "{question.word.word}" 字源解析
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-700 leading-relaxed">{question.word.etymology}</p>
            
            {/* 所有义项 */}
            <div className="mt-4">
              <h4 className="font-bold text-gray-800 mb-2">所有义项：</h4>
              <ul className="space-y-2">
                {question.word.meanings.map((m, i) => (
                  <li 
                    key={i} 
                    className={cn(
                      "p-2 rounded",
                      m.sense === question.meaning.sense 
                        ? "bg-amber-100 text-amber-900" 
                        : "bg-gray-50 text-gray-700"
                    )}
                  >
                    <span className="font-medium">{i + 1}. {m.sense}</span>
                    <span className="text-sm text-gray-500 ml-2">— {m.source}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
