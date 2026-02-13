// 高中文言文高频实词数据库
export interface WordMeaning {
  sense: string;        // 义项
  example: string;      // 例句
  source: string;       // 出处
  context: string;      // 语境说明
  scene: string;        // 所属场景
}

export interface Word {
  id: string;
  word: string;         // 实词
  frequency: number;    // 考频
  meanings: WordMeaning[];
  etymology?: string;   // 字源说明
  commonMistakes?: string[]; // 常见错误
}

export interface Scene {
  id: string;
  name: string;
  era: string;
  description: string;
  bgColor: string;
  words: string[];
}

export const scenes: Scene[] = [
  {
    id: "xianqin",
    name: "先秦殿",
    era: "先秦",
    description: "诸子百家，思想的源头",
    bgColor: "from-amber-900 to-amber-700",
    words: ["说", "学", "仁", "义", "道", "德", "礼", "乐"]
  },
  {
    id: "qinhan",
    name: "秦汉宫",
    era: "秦汉",
    description: "帝国初兴，风云激荡",
    bgColor: "from-red-900 to-red-700",
    words: ["兵", "策", "制", "亡", "举", "族", "过", "爱"]
  },
  {
    id: "weijin",
    name: "魏晋亭",
    era: "魏晋南北朝",
    description: "风流名士，隐逸山林",
    bgColor: "from-emerald-900 to-emerald-700",
    words: ["志", "寻", "穷", "果", "将", "或", "适", "向"]
  },
  {
    id: "tangsong",
    name: "唐宋阁",
    era: "唐宋",
    description: "诗文鼎盛，贬谪与旷达",
    bgColor: "from-blue-900 to-blue-700",
    words: ["谪", "迁", "属", "望", "乘", "御", "胜", "赋"]
  },
  {
    id: "mingqing",
    name: "明清院",
    era: "明清",
    description: "小品文与家国情怀",
    bgColor: "from-purple-900 to-purple-700",
    words: ["归", "省", "适", "让", "延", "叩", "顾", "治"]
  }
];

export const words: Word[] = [
  {
    id: "bing",
    word: "兵",
    frequency: 5,
    etymology: "《说文》：兵，械也。从廾持斤，并力之皃。本义为兵器，后引申为士兵、战争。",
    meanings: [
      {
        sense: "兵器，武器",
        example: "收天下之兵，聚之咸阳",
        source: "《过秦论》",
        context: "秦始皇统一六国后，收缴天下兵器铸成十二金人",
        scene: "qinhan"
      },
      {
        sense: "士兵，军队",
        example: "起视四境，而秦兵又至矣",
        source: "《六国论》",
        context: "待起来一看四方边境，秦国的军队又到了",
        scene: "xianqin"
      },
      {
        sense: "战争，军事行动",
        example: "废池乔木，犹厌言兵",
        source: "《扬州慢》",
        context: "战后的扬州，至今还厌恶谈到战争",
        scene: "tangsong"
      }
    ]
  },
  {
    id: "zou",
    word: "走",
    frequency: 5,
    etymology: "《说文》：走，趋也。从夭从止。像人摆动双臂奔跑之形。古义为跑，今义为行走。",
    meanings: [
      {
        sense: "跑，奔跑",
        example: "双兔傍地走，安能辨我是雄雌",
        source: "《木兰辞》",
        context: "两只兔子一起贴近地面跑，怎能辨别各自的雄雌",
        scene: "weijin"
      },
      {
        sense: "逃跑，逃走",
        example: "老翁逾墙走，老妇出门看",
        source: "《石壕吏》",
        context: "老翁为躲避征兵而逃走",
        scene: "tangsong"
      },
      {
        sense: "趋向，走向",
        example: "骊山北构而西折，直走咸阳",
        source: "《阿房宫赋》",
        context: "阿房宫从骊山向北建造，向西曲折延伸通向咸阳",
        scene: "qinhan"
      }
    ]
  },
  {
    id: "wang",
    word: "亡",
    frequency: 4,
    etymology: "《说文》：亡，逃也。从入从乚。像人隐藏在角落之形。本义为逃亡，后引申为死亡、灭亡、失去。",
    meanings: [
      {
        sense: "逃亡，逃跑",
        example: "今亡亦死，举大计亦死",
        source: "《陈涉世家》",
        context: "陈涉分析起义前的处境：逃跑也是死，起义也是死",
        scene: "qinhan"
      },
      {
        sense: "死亡",
        example: "此诚危急存亡之秋也",
        source: "《出师表》",
        context: "诸葛亮告诫后主，这是国家生死存亡的关键时刻",
        scene: "weijin"
      },
      {
        sense: "灭亡，消亡",
        example: "吞二周而亡诸侯",
        source: "《过秦论》",
        context: "秦国吞并东周西周，使诸侯国灭亡",
        scene: "qinhan"
      },
      {
        sense: "失去，丢失",
        example: "亡羊补牢，未为迟也",
        source: "《战国策》",
        context: "羊丢失了再去修补羊圈，还不算晚",
        scene: "xianqin"
      }
    ]
  },
  {
    id: "shu",
    word: "属",
    frequency: 4,
    etymology: "《说文》：属，连也。从尾蜀声。本义为连接，引申为归属、类属、嘱托等义。",
    meanings: [
      {
        sense: "连接，撰写（文字）",
        example: "衡少善属文",
        source: "《张衡传》",
        context: "张衡年轻时就擅长写文章",
        scene: "weijin"
      },
      {
        sense: "嘱托，吩咐",
        example: "属予作文以记之",
        source: "《岳阳楼记》",
        context: "滕子京嘱托范仲淹写文章记述重修岳阳楼",
        scene: "tangsong"
      },
      {
        sense: "类，辈",
        example: "吾属今为之虏矣",
        source: "《鸿门宴》",
        context: "范增感叹：我们这些人现在要被他俘虏了",
        scene: "qinhan"
      },
      {
        sense: "掌管，管辖",
        example: "司命之所属，无奈何也",
        source: "《扁鹊见蔡桓公》",
        context: "病在骨髓，是掌管生命的神所管辖的",
        scene: "xianqin"
      }
    ]
  },
  {
    id: "yi",
    word: "诣",
    frequency: 3,
    etymology: "《说文》：诣，候至也。从言旨声。本义为前往拜访，特指到尊长那里去。",
    meanings: [
      {
        sense: "到……去，拜访",
        example: "乃强起扶杖，执图诣寺后",
        source: "《促织》",
        context: "成名拿着蟋蟀图到寺庙后面寻找",
        scene: "mingqing"
      },
      {
        sense: "（学业、技术）达到的水平",
        example: "诸葛孔明者，卧龙也，将军岂愿见之乎？",
        source: "《隆中对》",
        context: "刘备三顾茅庐拜访诸葛亮",
        scene: "weijin"
      }
    ]
  },
  {
    id: "xie",
    word: "谢",
    frequency: 4,
    etymology: "《说文》：谢，辞去也。从言射声。本义为辞谢、拒绝，引申为道歉、感谢、衰亡等义。",
    meanings: [
      {
        sense: "道歉，谢罪",
        example: "旦日不可不蚤自来谢项王",
        source: "《鸿门宴》",
        context: "刘邦第二天必须早点来向项羽道歉",
        scene: "qinhan"
      },
      {
        sense: "辞谢，推辞",
        example: "阿母谢媒人",
        source: "《孔雀东南飞》",
        context: "焦仲卿的母亲辞谢媒人",
        scene: "weijin"
      },
      {
        sense: "感谢",
        example: "哙拜谢，起，立而饮之",
        source: "《鸿门宴》",
        context: "樊哙拜谢后站起来喝了酒",
        scene: "qinhan"
      },
      {
        sense: "凋谢，衰亡",
        example: "及花之谢，亦可告无罪于主人矣",
        source: "《芙蕖》",
        context: "等到荷花凋谢，也可以对主人说没有白占了",
        scene: "mingqing"
      }
    ]
  },
  {
    id: "zhe",
    word: "谪",
    frequency: 3,
    etymology: "《说文》：谪，罚也。从言啇声。本义为谴责、处罚，特指官吏因罪被降职或流放。",
    meanings: [
      {
        sense: "贬官，降职外放",
        example: "滕子京谪守巴陵郡",
        source: "《岳阳楼记》",
        context: "滕子京被贬官到巴陵郡做太守",
        scene: "tangsong"
      },
      {
        sense: "谴责，责备",
        example: "公输盘之攻械尽，子墨子之守圉有余，公输盘诎，而曰：吾知所以距子矣，吾不言",
        source: "《公输》",
        context: "公输盘被墨子驳倒，受到道义上的谴责",
        scene: "xianqin"
      }
    ]
  },
  {
    id: "qian",
    word: "迁",
    frequency: 4,
    etymology: "《说文》：迁，登也。从辵瞢声。本义为向高处移动，引申为升官、贬谪、迁移等义。",
    meanings: [
      {
        sense: "升官，晋升",
        example: "安帝雅闻衡善术学，公车特征拜郎中，再迁为太史令",
        source: "《张衡传》",
        context: "张衡被征召为郎中，又晋升为太史令",
        scene: "weijin"
      },
      {
        sense: "贬谪，流放",
        example: "是夕始觉有迁谪意",
        source: "《琵琶行》",
        context: "白居易听琵琶女弹奏，才感觉到被贬谪的凄凉",
        scene: "tangsong"
      },
      {
        sense: "迁移，搬迁",
        example: "时北兵已迫修门外，战、守、迁皆不及施",
        source: "《指南录后序》",
        context: "元军已逼近都城，战、守、迁都来不及实施",
        scene: "tangsong"
      }
    ]
  },
  {
    id: "shi",
    word: "适",
    frequency: 3,
    etymology: "《说文》：适，之也。从辵啻声。本义为往、到……去，引申为出嫁、适合、恰好等义。",
    meanings: [
      {
        sense: "到……去，往",
        example: "余自齐安舟行适临汝",
        source: "《石钟山记》",
        context: "我从齐安坐船到临汝去",
        scene: "tangsong"
      },
      {
        sense: "出嫁",
        example: "贫贱有此女，始适还家门",
        source: "《孔雀东南飞》",
        context: "刘兰芝刚出嫁不久就被休回娘家",
        scene: "weijin"
      },
      {
        sense: "恰好，正好",
        example: "从上观之，适与地平",
        source: "《梦溪笔谈》",
        context: "从上面看，恰好与地面平齐",
        scene: "tangsong"
      }
    ]
  },
  {
    id: "rang",
    word: "让",
    frequency: 3,
    etymology: "《说文》：让，相责让也。从言襄声。本义为责备，引申为谦让、礼让、让给等义。",
    meanings: [
      {
        sense: "责备，责怪",
        example: "如惠语以让单于",
        source: "《苏武传》",
        context: "按照常惠的话来责备单于",
        scene: "qinhan"
      },
      {
        sense: "谦让，礼让",
        example: "为国以礼，其言不让，是故哂之",
        source: "《论语·先进》",
        context: "孔子说子路说话不谦让，所以笑他",
        scene: "xianqin"
      },
      {
        sense: "让给，让位",
        example: "尧让天下于许由",
        source: "《庄子·逍遥游》",
        context: "尧帝把天下让给许由",
        scene: "xianqin"
      }
    ]
  }
];

// 获取场景中的所有实词
export function getWordsByScene(sceneId: string): Word[] {
  return words.filter(w => w.meanings.some(m => m.scene === sceneId));
}

// 获取指定ID的实词
export function getWordById(id: string): Word | undefined {
  return words.find(w => w.id === id);
}

// 获取指定字词的实词
export function getWordByChar(char: string): Word | undefined {
  return words.find(w => w.word === char);
}

// 获取所有实词（用于复习）
export function getAllWords(): Word[] {
  return words;
}

// 随机获取指定数量的实词
export function getRandomWords(count: number): Word[] {
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 获取实词的随机一个义项（用于测试）
export function getRandomMeaning(word: Word): WordMeaning {
  return word.meanings[Math.floor(Math.random() * word.meanings.length)];
}

// 生成干扰选项
export function generateDistractors(word: Word, correctSense: string, count: number = 3): string[] {
  const allSenses = words
    .filter(w => w.id !== word.id)
    .flatMap(w => w.meanings.map(m => m.sense));
  
  const shuffled = [...allSenses].sort(() => Math.random() - 0.5);
  const distractors = shuffled.slice(0, count);
  
  // 添加一些常见的现代义干扰
  const modernDistractors: Record<string, string[]> = {
    "兵": ["当兵的人", "战争", "象棋棋子"],
    "走": ["走路", "离开", "经过"],
    "亡": ["死亡", "逃跑", "失去"],
    "属": ["属于", "类别", "家属"],
    "诣": ["造诣", "到达", "拜访"],
    "谢": ["感谢", "凋谢", "拒绝"],
    "谪": ["贬官", "谴责", "惩罚"],
    "迁": ["迁移", "搬家", "改变"],
    "适": ["适合", "舒适", "恰好"],
    "让": ["让开", "允许", "转让"]
  };
  
  const specific = modernDistractors[word.word] || [];
  return [...distractors, ...specific].filter(d => d !== correctSense).slice(0, count);
}
