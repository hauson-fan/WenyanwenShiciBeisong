import { Lock, CheckCircle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Scene } from '@/data/words';

interface SceneCardProps {
  scene: Scene;
  isUnlocked: boolean;
  isCompleted: boolean;
  masteryPercent: number;
  onClick: () => void;
}

export function SceneCard({ 
  scene, 
  isUnlocked, 
  isCompleted, 
  masteryPercent, 
  onClick 
}: SceneCardProps) {
  return (
    <div
      onClick={isUnlocked ? onClick : undefined}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "border-2",
        isUnlocked 
          ? "cursor-pointer hover:scale-105 hover:shadow-xl border-transparent" 
          : "cursor-not-allowed opacity-70 border-gray-300",
        "bg-gradient-to-br",
        scene.bgColor
      )}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 text-6xl font-bold text-white">
          {scene.era.charAt(0)}
        </div>
      </div>

      {/* 锁定图标 */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
          <Lock className="w-12 h-12 text-white/80" />
        </div>
      )}

      {/* 完成标记 */}
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
      )}

      <div className="relative z-0">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-white/80" />
          <span className="text-white/80 text-sm">{scene.era}</span>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">{scene.name}</h3>
        <p className="text-white/70 text-sm mb-4">{scene.description}</p>
        
        {/* 掌握度进度条 */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/70">
            <span>掌握度</span>
            <span>{masteryPercent}%</span>
          </div>
          <div className="h-2 bg-black/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/80 rounded-full transition-all duration-500"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
        </div>

        {/* 实词数量 */}
        <div className="mt-4 flex items-center gap-2">
          <span className="px-2 py-1 bg-white/20 rounded text-xs text-white">
            {scene.words.length} 个实词
          </span>
        </div>
      </div>
    </div>
  );
}
