# 文言文实词时空书院

在语境中高效记忆高中文言文实词的交互式学习平台

## 📚 项目简介

文言文实词时空书院是一个基于React + TypeScript + Vite开发的交互式学习应用，旨在通过游戏化的方式帮助学生在语境中高效记忆高中文言文高频实词。

### 核心功能

- **多场景学习**：按历史时代划分学习场景（先秦殿、秦汉宫、魏晋亭、唐宋阁、明清院）
- **四大游戏模式**：探索模式、生存模式、朝堂模式、复习模式
- **智能复习系统**：基于掌握度的个性化复习推荐
- **成就系统**：激励持续学习
- **语境记忆**：每个实词均配有经典例句和出处
- **字源解析**：提供实词的字源说明，帮助理解词义演变

## 🎮 游戏模式

### 1. 探索模式
在不同历史场景中探索学习，通过语境理解实词含义。

### 2. 生存模式
限时挑战，检验实词掌握程度，锻炼快速反应能力。

### 3. 朝堂模式
模拟古代朝堂场景，通过答题获取官职晋升。

### 4. 复习模式
智能识别需要复习的实词，针对性强化记忆。

## 🛠️ 技术栈

- **前端框架**：React 19.2.0 + TypeScript
- **构建工具**：Vite
- **样式方案**：Tailwind CSS
- **UI组件**：Radix UI + Shadcn
- **状态管理**：React Hooks
- **通知系统**：Sonner
- **图标库**：Lucide React

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── ui/             # UI组件
│   ├── CourtMode.tsx   # 朝堂模式
│   ├── ExploreMode.tsx # 探索模式
│   ├── MainMenu.tsx    # 主菜单
│   ├── ReviewMode.tsx  # 复习模式
│   ├── SceneCard.tsx   # 场景卡片
│   └── SurvivalMode.tsx # 生存模式
├── data/
│   └── words.ts        # 实词数据库
├── hooks/
│   ├── use-mobile.ts   # 移动端检测
│   └── useGameState.ts # 游戏状态管理
├── lib/
│   └── utils.ts        # 工具函数
├── types/
│   └── game.ts         # 游戏类型定义
├── App.tsx             # 应用主组件
└── main.tsx            # 应用入口
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd WenyanwenShiciBeisong
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **构建生产版本**
   ```bash
   npm run build
   ```

5. **预览生产构建**
   ```bash
   npm run preview
   ```

## 📊 数据结构

### 实词数据

```typescript
interface Word {
  id: string;           // 唯一标识
  word: string;         // 实词语符
  frequency: number;    // 考频
  meanings: WordMeaning[]; // 义项列表
  etymology?: string;   // 字源说明
  commonMistakes?: string[]; // 常见错误
}

interface WordMeaning {
  sense: string;        // 义项
  example: string;      // 例句
  source: string;       // 出处
  context: string;      // 语境说明
  scene: string;        // 所属场景
}
```

### 场景数据

```typescript
interface Scene {
  id: string;           // 场景ID
  name: string;         // 场景名称
  era: string;          // 历史时代
  description: string;  // 场景描述
  bgColor: string;      // 背景颜色
  words: string[];      // 包含的实词条目
}
```

## 🌟 特色功能

1. **语境记忆**：每个实词均配有经典例句和出处，帮助在语境中理解记忆
2. **智能复习**：基于掌握度自动推荐需要复习的实词
3. **游戏化学习**：通过多种游戏模式提高学习趣味性
4. **历史场景**：按历史时代划分学习场景，增强代入感
5. **成就系统**：完成学习任务解锁成就，激发学习动力
6. **字源解析**：了解实词的起源和演变，加深理解

## 🎯 学习目标

- 掌握高中文言文高频实词的多义项
- 提高文言文阅读理解能力
- 培养对传统文化的兴趣
- 为高考文言文阅读打下坚实基础

## 🤝 贡献指南

欢迎对项目提出建议和贡献！

1.  Fork 本仓库
2.  创建特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  打开 Pull Request

---

*让文言文学习更有趣，让传统文化活起来！* 🎉
