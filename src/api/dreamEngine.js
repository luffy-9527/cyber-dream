/**
 * CyberDream AI 梦境解析引擎
 * 核心逻辑：
 * 1. 动态特征提取 (关键词组合匹配算法)
 * 2. 多维雷达指数计算 (根据情感和词频波动)
 * 3. 动态组合流派长文模板 (基于组合哈希的千人千面)
 * 4. 预留大模型真实 API (Gemini / DeepSeek / OpenAI)
 */

export const PERSONAS = {
  zhougong: {
    id: 'zhougong',
    name: '赛博周公',
    title: '量子八卦 · 潜意识算力解卦',
    tag: '玄学与算法',
    avatar: '👴',
    color: '#5c8984',
    desc: '以传统易学为骨架，结合神经元算力重新推演你的运势与潜意识吉凶。'
  },
  freud: {
    id: 'freud',
    name: '硬核弗洛伊德',
    title: '精神分析 · 潜意识深层解构',
    tag: '欲望与本能',
    avatar: '🧠',
    color: '#bc312c',
    desc: '绝对理性的精神分析，撕开梦境伪装，直指你清醒时被压抑的真实欲望。'
  },
  jung: {
    id: 'jung',
    name: '荣格神话',
    title: '集体无意识 · 心灵原型召唤',
    tag: '神话与原型',
    avatar: '🌌',
    color: '#4a4e69',
    desc: '将你的梦境放逐于人类集体无意识之海，寻找失落的心灵碎片与神圣指引。'
  },
  roast: {
    id: 'roast',
    name: '毒舌嘴替',
    title: '临床级防PUA · 当代打工人神魂鉴定',
    tag: '爆笑毒舌',
    avatar: '😈',
    color: '#cca26c',
    desc: '拒绝心灵鸡汤，用最犀利的幽默解构你的离谱梦境与当代焦虑。'
  }
};

export const MOODS = [
  { id: 'absurd', name: '荒诞离奇', icon: '🪐', color: '#cca26c' },
  { id: 'anxiety', name: '压力焦虑', icon: '⚡', color: '#bc312c' },
  { id: 'healing', name: '温暖治愈', icon: '🌸', color: '#5c8984' },
  { id: 'cyber', name: '赛博异界', icon: '🤖', color: '#4a4e69' },
  { id: 'funny', name: '搞怪中二', icon: '🎭', color: '#cca26c' },
  { id: 'nostalgia', name: '怀旧重演', icon: '🕯️', color: '#8c2020' }
];

export const ELEMENT_TAGS = [
  '坠落失重', '凌空飞行', '被巨物追赶', '迷宫与楼梯', '深海与鲸',
  '考试与迟到', '时钟倒流', '机械与义体', '故人相聚', '星际与黑洞',
  '猫咪与灵兽', '牙齿脱落', '浮空岛屿', '火光与烈焰', '无限电梯'
];

export const RANDOM_DREAM_PROMPTS = [
  '梦见自己变成一只在霓虹大厦间穿梭的黑猫，尾巴能带电。',
  '梦见高考突然改考插秧，监考老师是一台会弹钢琴的复古电视机。',
  '我一直被僵尸追，跑进电梯却直达天台，推开门发现是一片粉色海滩。',
  '在三十楼的阳台，把自己的心脏打包递给了一个没有脸的快递员。',
  '梦见重力突然失效，城市的街道和高楼全部被拆解成漫天漂浮的碎片。',
  '走进一条没有尽头的长廊，两旁的墙壁装满了防弹玻璃，里面全是我自己的雕像。',
  '梦见自己变成一段代码，在一个极其庞大的机械迷城里躲避杀毒软件的追杀。',
  '熟悉的街道上，路人的脸全部变成了镜子，映出的却是不同年龄的我。',
  '梦见天空突然裂开一条巨大的缝隙，里面掉下来无数本写着我名字的日记。',
  '梦见和死去的亲人一起吃了一顿火锅，锅里煮着的是发光的蓝色石头。',
  '突然发现自己在一列没有司机的绿皮火车上，窗外是不断倒退的星系和星云。',
  '梦见牙齿碎了一嘴，吐出来的时候全都变成了金灿灿的硬币，但我却高兴不起来。',
  '梦见和喜欢的人在一个废弃的游乐园里坐摩天轮，结果摩天轮滚落下来一直在城市里滚动。',
  '去参加一场婚礼，发现新郎和新娘都是我自己，台下坐着几十个冷漠的观众。',
  '梦见自己的身体被无数透明的丝线提着，像提线木偶一样在舞台上表演，却发不出声音。',
  '在一个永远下着暴雨的城市，每个人都撑着一把黑伞，只有我拿着一朵快要枯萎的向日葵。',
  '梦见打开家门，外面不是走廊，而是一片深不见底的原始森林，树上长满了眼睛。',
  '梦见自己潜入深海，却发现海底有一座繁华的现代都市，红绿灯还在闪烁。',
  '我在梦里一直找厕所，好不容易找到一个，打开门里面却是一个正在开会的会议室。',
  '梦见自己长出了一双巨大的黑色翅膀，但却因为太重而怎么也飞不起来。',
  '回到小学课堂，老师在黑板上写的都是甲骨文，同桌变成了一只戴眼镜的橘猫。',
  '梦见手机怎么也打不开，屏幕里长出了藤蔓，一直缠绕到我的手腕上。',
  '在一座巨大的图书馆里迷路，所有的书本都是空白的，只有翻开时会传出奇怪的低语声。',
  '梦见整个世界都被冰封了，只有我一个人在冰面上滑行，追逐一束红色的极光。',
  '发现自己身处一部黑白默片电影里，只能靠夸张的肢体动作来表达，周围的人都在大笑。',
  '梦见参加一场考试，卷子是用火烤才能显现文字的羊皮纸，但我手边只有一块冰。',
  '在一个悬崖边的咖啡馆喝茶，云层里突然钻出一条巨大的机械龙。',
  '梦见自己的影子脱离了身体，它站在不远处嘲笑我，然后转身走进了墙里。',
  '乘坐电梯时按了最高层，结果电梯直接冲破楼顶，飞向了深邃的太空。',
  '梦见所有的树叶都变成了绿色的蝴蝶，风一吹，整座森林都在天空中飞舞。'
];

// 高清超现实赛博/治愈梦境插画库
const DREAM_ILLUSTRATIONS = [
  {
    theme: 'space',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
    title: '量子星云与星穹之门'
  },
  {
    theme: 'cyber',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80',
    title: '霓虹深渊与数据脉络'
  },
  {
    theme: 'ocean',
    url: 'https://images.unsplash.com/photo-1682687982501-1e5898cb8ff4?auto=format&fit=crop&w=1000&q=80',
    title: '沉睡的海沟与光海'
  },
  {
    theme: 'surreal',
    url: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1000&q=80',
    title: '重力裂痕与记忆迷宫'
  },
  {
    theme: 'nature',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    title: '生命之树与微光之森'
  }
];

export async function analyzeDreamText(arg1, arg2, arg3, arg4, arg5) {
  let dreamText, personaId, moodId, selectedTags, settings;
  
  if (typeof arg1 === 'object' && arg1 !== null) {
    ({ dreamText, personaId, moodId, selectedTags, apiKey: settings } = arg1); // Handle old cache
  } else {
    dreamText = arg1;
    personaId = arg2;
    moodId = arg3;
    selectedTags = arg4;
    settings = arg5;
  }

  dreamText = String(dreamText || '');
  const persona = PERSONAS[personaId] || PERSONAS.zhougong;
  const mood = MOODS.find(m => m.id === moodId) || MOODS[0];


  const apiKey = (typeof settings === 'string') ? settings : (settings?.apiKey || '');
  const apiUrl = settings?.apiUrl || 'https://api.deepseek.com/v1/chat/completions';
  const apiModel = settings?.apiModel || 'deepseek-chat';

  if (apiKey && apiKey.trim().length > 10) {
    const apiResult = await callLlmApi({ dreamText, personaId, persona, moodId, mood, selectedTags, apiKey, apiUrl, apiModel });
    if (apiResult) return apiResult;
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const offlineResult = generateDynamicDreamAnalysis(dreamText, personaId, persona, moodId, mood, selectedTags);
      resolve(offlineResult);
    }, 1500);
  });
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateDynamicDreamAnalysis(dreamText, personaId, persona, moodId, mood, selectedTags) {
  const seed = simpleHash(dreamText + personaId);
  const semantic = extractSemanticFeatures(dreamText, seed);
  const radar = calculateRadarStats(dreamText, moodId, semantic, seed);
  const neurotransmitters = calculateNeurotransmitters(dreamText, moodId, semantic, seed);
  const title = generateDynamicDreamTitle(dreamText, semantic, seed);
  const { analysis, summary, quote, fortune } = generateDynamicPersonaReport(personaId, dreamText, semantic, mood, seed);
  const illustration = DREAM_ILLUSTRATIONS[seed % DREAM_ILLUSTRATIONS.length];
  const visualPrompt = `Cyberpunk surrealism, ${semantic.symbols.map(s => s.name).join(', ')}, ${semantic.sceneName}, neon fog atmosphere, 8k digital artwork`;

  return {
    id: 'DREAM_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
    title,
    date: formatCurrentDate(),
    timestamp: Date.now(),
    dreamText,
    personaId,
    persona,
    moodId,
    mood,
    selectedTags,
    summary,
    analysis,
    symbols: semantic.symbols,
    radar,
    neurotransmitters,
    fortune,
    quote,
    visualPrompt,
    illustrationUrl: illustration.url,
    illustrationTitle: illustration.title,
    colorTheme: persona.color
  };
}

function generateDynamicDreamTitle(text, semantic, seed) {
  const prefixes = ['高维', '赛博', '深网', '量子', '虚空', '霓虹', '发条', '失重', '矩阵'];
  const suffixes = ['之境', '碎片', '脉冲', '漫游', '投影', '悖论', '狂想', '代码', '残响'];
  const p = prefixes[seed % prefixes.length];
  const s = suffixes[(seed >> 1) % suffixes.length];
  const core = semantic.symbols.length > 0 ? semantic.symbols[0].name.replace('的', '') : '潜意识';
  return `${p}·${core}${s}`;
}

function extractSemanticFeatures(text, seed) {
  const localSeed = simpleHash(text);
  
  let sceneName = '';
  let detectedAction = '';
  let symbols = [];
  let detectedTrait = '隐性焦虑与渴望';

  const FALLBACK_SCENES = ['灰度无边界走廊', '失重潜意识浮岛', '发条迷雾之城', '赛博霓虹废墟', '量子交错时空', '深海记忆裂谷'];
  const FALLBACK_ACTIONS = ['逻辑失序', '虚空对抗', '边缘试探', '记忆重组', '本能挣脱', '逆向漂流'];
  const FALLBACK_SYMBOLS = [
    { name: '无名黑匣', icon: '⬛' },
    { name: '折叠光影', icon: '✨' },
    { name: '代码碎片', icon: '🧩' },
    { name: '无源之水', icon: '💧' },
    { name: '失语飞鸟', icon: '🦅' },
    { name: '生锈齿轮', icon: '⚙️' },
    { name: '静止钟摆', icon: '⏳' },
    { name: '反光晶体', icon: '💎' }
  ];

  if (text.includes('飞') || text.includes('天') || text.includes('掉')) {
    sceneName = '反重力平流层'; detectedAction = '失控坠落/升空'; detectedTrait = '对失控感的恐惧与挣脱重力的渴望';
    symbols.push({ name: '逆向重力场', icon: '🌌' }, { name: '自由落体', icon: '☄️' }, { name: '气流漩涡', icon: '🌪️' });
  } else if (text.includes('追') || text.includes('跑') || text.includes('杀')) {
    sceneName = '莫比乌斯环迷宫'; detectedAction = '无限逃亡'; detectedTrait = '深层生存焦虑与未解决的冲突';
    symbols.push({ name: '无脸追击者', icon: '👤' }, { name: '死胡同', icon: '🧱' }, { name: '心跳回音', icon: '💓' });
  } else if (text.includes('水') || text.includes('海') || text.includes('沉')) {
    sceneName = '幽蓝深海母体'; detectedAction = '下潜窒息'; detectedTrait = '情绪淹没与潜意识底层探索';
    symbols.push({ name: '失语深渊', icon: '🌊' }, { name: '发光水母', icon: '🪼' }, { name: '深海余音', icon: '🫧' });
  } else if (text.includes('考') || text.includes('学校') || text.includes('迟到')) {
    sceneName = '绝对规则矩阵'; detectedAction = '打破系统倒计时'; detectedTrait = '被社会评价体系规训的创伤后遗症';
    symbols.push({ name: '空白试卷', icon: '📝' }, { name: '融化时钟', icon: '⏰' }, { name: '冷漠监考官', icon: '👁️' });
  } else {
    sceneName = FALLBACK_SCENES[localSeed % FALLBACK_SCENES.length];
    detectedAction = FALLBACK_ACTIONS[(localSeed >> 1) % FALLBACK_ACTIONS.length];
    
    symbols.push(FALLBACK_SYMBOLS[localSeed % FALLBACK_SYMBOLS.length]);
    symbols.push(FALLBACK_SYMBOLS[(localSeed + 1) % FALLBACK_SYMBOLS.length]);
    symbols.push(FALLBACK_SYMBOLS[(localSeed + 2) % FALLBACK_SYMBOLS.length]);
  }

  let textSnippet = text.length > 8 ? text.substring(0, 8) + '...' : text;
  
  return { sceneName, detectedAction, detectedTrait, symbols, textSnippet };
}

function calculateRadarStats(text, moodId, semantic, seed) {
  let absurdity = 60 + (seed % 35);
  let clarity = 50 + ((seed >> 2) % 40);
  let anxiety = 40 + ((seed >> 4) % 45);
  let awakening = 55 + ((seed >> 6) % 40);
  let romance = 45 + ((seed >> 8) % 50);

  if (text.includes('死') || text.includes('鬼') || text.includes('怪物') || text.includes('杀')) {
    anxiety = Math.min(96, anxiety + 25);
  }
  if (text.includes('飞') || text.includes('光') || text.includes('星') || text.includes('神')) {
    awakening = Math.min(98, awakening + 22);
  }
  if (text.includes('猫') || text.includes('花') || text.includes('美') || text.includes('爱')) {
    romance = Math.min(99, romance + 25);
    anxiety = Math.max(15, anxiety - 20);
  }

  if (moodId === 'absurd') absurdity = Math.min(99, absurdity + 20);
  if (moodId === 'anxiety') anxiety = Math.min(95, anxiety + 25);
  if (moodId === 'healing') { romance = Math.min(98, romance + 25); anxiety = Math.max(10, anxiety - 30); }

  return {
    absurdity: Math.round(absurdity),
    clarity: Math.round(clarity),
    anxiety: Math.round(anxiety),
    awakening: Math.round(awakening),
    romance: Math.round(romance)
  };
}

function calculateNeurotransmitters(text, moodId, semantic, seed) {
  let dopamine = 50 + (seed % 45); 
  let cortisol = 30 + ((seed >> 2) % 60); 
  let serotonin = 40 + ((seed >> 4) % 50); 
  let endorphin = 30 + ((seed >> 6) % 55); 
  let acetylcholine = 60 + ((seed >> 8) % 35); 

  if (moodId === 'anxiety' || semantic.detectedAction === '惊惶奔逃') {
    cortisol = Math.min(98, cortisol + 30);
    serotonin = Math.max(10, serotonin - 20);
  }
  if (moodId === 'healing' || semantic.sceneName === '原始灵境') {
    serotonin = Math.min(95, serotonin + 30);
    cortisol = Math.max(5, cortisol - 35);
    endorphin = Math.min(95, endorphin + 20);
  }
  if (moodId === 'absurd' || semantic.sceneName === '赛博矩阵') {
    dopamine = Math.min(98, dopamine + 25);
    acetylcholine = Math.min(99, acetylcholine + 15);
  }

  return {
    dopamine: Math.round(dopamine),
    cortisol: Math.round(cortisol),
    serotonin: Math.round(serotonin),
    endorphin: Math.round(endorphin),
    acetylcholine: Math.round(acetylcholine)
  };
}

function generateDynamicPersonaReport(personaId, text, semantic, mood, seed) {
  const symNames = semantic.symbols.map(s => `【${s.name}】`).join('、');
  const actionText = semantic.detectedAction;
  const sceneText = semantic.sceneName;
  const textSnippet = semantic.textSnippet;

  if (personaId === 'zhougong') {
    const guaNames = ['【震为雷 · 动而破局】', '【坎为水 · 暗流蓄势】', '【离为火 · 灵光顿悟】', '【兑为泽 · 和悦逢源】', '【巽为风 · 乘势化形】', '【乾为天 · 龙越深渊】', '【坤为地 · 厚德载物】', '【艮为山 · 止损沉淀】'];
    const gua = guaNames[seed % guaNames.length];
    
    const intros = [
      `此梦以“${sceneText}”为局，显化${symNames}之象。若以《黄帝内经·素问》的营卫之气推演，暗合量子八卦中的${gua}。`,
      `观此梦象，你在“${textSnippet}”的情境下，五脏气血的波动已映射于脑波。古典易理与神经计算交汇，卦象直指${gua}。`,
      `紫微星盘与你的REM期脑电波发生共振。梦中的${sceneText}并非虚妄，而是《灵枢·淫邪发梦》中所述气机失衡在${gua}维度的显化。`
    ];
    const mids = [
      `近期你处于思维能量高度活跃的蓄力期，梦中${actionText}的行为，实则是潜意识在为你清理陈旧信息冗余。正如中医云：“魂神飞扬者，气有所并”。`,
      `你潜意识中对${semantic.detectedTrait}有着极其敏锐的警觉。身心正在主动调频，借由强烈的视觉冲击冲刷心智疲惫，完成一次微观的“阴阳交泰”。`,
      `表明你在现实里渴望打破某种隐形边界。借由意象的指引，潜意识为你构筑了一处不受现实规则约束的庇护所。此即道家所谓“心斋”之境。`,
      `你在现实中正面临关键的因果节点，梦境借由离奇的转折，提前为你推演了潜藏的机缘。五运六气运行至此，必有回响。`
    ];
    const outros = [
      `近期将有新的转机或灵感契机悄然破土，切勿因眼前迷局而裹足不前。`,
      `此行顺应天时，宜顺势而为，莫逆势强求，方能做到“形与神俱”。`,
      `静待时机，七日内必有气机反转，守住本心，涵养精气神即可。`,
      `万物皆有裂隙，那正是光照进来的地方，你的破局之道就在日常最微小的“调息”改变中。`
    ];
    
    const analysis = intros[seed % intros.length] + mids[(seed >> 1) % mids.length] + outros[(seed >> 2) % outros.length];

    const luckys = ['重构手头项目', '给老友发送问候', '换一条新通勤路线', '整理工作台面', '冲泡一杯手冲咖啡', '记录脑中瞬时灵感', '早起沐浴晨光'];
    const taboos = ['陷入深夜反刍式内耗', '执着于细枝末节', '盲目相信直觉外的杂音', '立无法兑现的Flag', '压抑情绪冷战', '睡前刷短视频超过一小时'];

    return {
      summary: `卦象显${gua}，此梦乃潜意识算力充盈、突破现实桎梏之吉兆。`,
      analysis: analysis,
      quote: [
        '“梦是灵魂的星盘，一切未至之境，早已在午夜的脑波中完成推演。”',
        '“风雷激荡之时，正是神识破壳之日。”',
        '“天下之象，莫不由心生；梦中之奇，皆为天地借形。”',
        '“算力即气运，梦境是宇宙给你的加密电报。”'
      ][seed % 4],
      fortune: {
        lucky: `宜：${luckys[seed % luckys.length]}、${luckys[(seed + 1) % luckys.length]}`,
        taboo: `忌：${taboos[seed % taboos.length]}、${taboos[(seed + 1) % taboos.length]}`,
        code: `ZHOUGONG-HEX-${(seed % 899 + 100)}`
      }
    };
  }

  if (personaId === 'freud') {
    const intros = [
      `基于经典精神分析理论与《梦的解析》文献框架，你在梦中“${textSnippet}”的经历，是典型【潜意识欲望达成（Wish Fulfillment）】的表象。`,
      `根据心理学临床文献中的【防御机制】模型：此梦清晰展现了梦的运作机制——【凝缩（Condensation）】与【置换（Displacement）】。`,
      `在现代心理物理学与精神分析的交叉视域下，梦境中${sceneText}的异样氛围，直接对应你近期在现实中被【超我（Superego）】严格压抑的情绪重现。`,
      `从学术角度考量，你的梦境经过了【二次润饰（Secondary Elaboration）】，将难以直视的深层焦虑伪装成了超现实的戏剧。`
    ];
    const mids = [
      `场景设在${sceneText}，并伴随${actionText}，这并非无意义的脑电波活动。学术研究表明，这是被压抑的【本我（Id）】冲动在REM（快速眼动）睡眠期寻找合法的代偿出口。`,
      `当你面对现实生活中的束缚与社会规训时，无意识通过${symNames}等意象投射出你未被完全表达的深层渴望或攻击性，以此维持心理稳态（Psychological Homeostasis）。`,
      `学术界普遍认为，${symNames}构成了潜意识剧场的核心“能指”，帮助你的【自我（Ego）】在安全的环境下提前演练对不确定性的承受阈值，这在临床上被称为“情绪安全阀效应”。`,
      `这种荒诞的情节，本质上是对你白日里被压抑的${semantic.detectedTrait}的极致释放。梦中的物理法则失效，恰恰反映了你内心对绝对控制权的防御性放弃。`
    ];
    const outros = [
      `学术建议：请不必为此感到羞耻或恐慌，梦境是精神结构在进行自我救赎与神经能量（Libido）的泄洪，它证明了你拥有强大的心理弹韧性。`,
      `临床视角的启示是：拥抱你的本我，试着在清醒时为这些潜伏的情绪找一个合理的升华（Sublimation）渠道，不要让其在潜意识底层发酵。`,
      `每一次看似离谱的梦境，都是大脑在努力维持你清醒时的理智与体面。它是心理健康防御机制仍在高效运转的绝佳证明。`,
      `根据现代【持续性假说（Continuity Hypothesis）】，梦是清醒生活的延续。你需要审视近期是否承受了过载的隐性压力，并给予大脑充分的宕机时间。`
    ];

    const analysis = intros[seed % intros.length] + mids[(seed >> 1) % mids.length] + outros[(seed >> 2) % outros.length];

    const luckys = ['痛快满足一次小口腹之欲', '勇敢拒绝一次无效社交', '接纳自己的任性', '写下一篇不公开的日记', '看一部不用动脑的喜剧片'];
    const taboos = ['过度追求理性完美', '强行扮演情绪稳定的大人', '压抑微小冲动', '对未发生的事过度焦虑', '向讨好型人格妥协'];

    return {
      summary: `【本我欲望解构完成】被压抑的本能正以象征之姿苏醒，精神结构正在重组。`,
      analysis: analysis,
      quote: [
        '“未被表达的情绪永远不会消亡，终有一天会在梦里以奇迹破土。”',
        '“梦是清醒时无法启齿的欲望，在夜间披上的最华丽伪装。”',
        '“潜意识是一座冰山，你所能记起的梦，只是它浮出水面的那一角。”',
        '“每一个荒诞的梦境，都是大脑在替你承受现实的重压。”'
      ][seed % 4],
      fortune: {
        lucky: `宜：${luckys[seed % luckys.length]}、${luckys[(seed + 1) % luckys.length]}`,
        taboo: `忌：${taboos[seed % taboos.length]}、${taboos[(seed + 1) % taboos.length]}`,
        code: `FREUD-ID-${(seed % 899 + 100)}`
      }
    };
  }

  if (personaId === 'jung') {
    const intros = [
      `在分析心理学（Analytical Psychology）的理论矩阵中，你的梦境呈现出一场跨越个体边界、触及【集体无意识（Collective Unconscious）】的原型之旅。`,
      `参照荣格在《寻求灵魂的现代人》中的论述，此梦具备强烈的【共时性（Synchronicity）】特征，即心理状态与客观梦象发生了非因果的意义联结。`,
      `这并非简单的记忆重播，在学术语境下，这场发生在${sceneText}中的梦境，是你心智走向【个体化历程（Individuation）】的关键蜕变节点。`,
      `通过文献中的【扩大法（Amplification）】解析你的梦境：“${textSnippet}”是一则来自灵魂深处的古老神话在现代社会的心理解构。`
    ];
    const mids = [
      `${sceneText}象征着你心灵深处尚未被意识同化的未知圣殿，而${symNames}化身为【智慧老人或向导原型（Archetype of the Guide）】。你在梦中经历${actionText}，是核心自性（Self）正在召唤你。`,
      `${symNames}不仅是物象，更是你内在【阿尼玛/阿尼姆斯（Anima/Animus）】能量觉醒的隐喻，潜意识正在为你重组分裂的情绪碎片，谋求人格的完整（Wholeness）。`,
      `${actionText}昭示着你即将告别旧有的心智模型。你正在直面个人的【阴影（Shadow）】——那些在清醒时被社会面具（Persona）所排斥的特质，正在寻求被接纳。`,
      `你正在经历一场内在的心理炼金术。那些在常理看来荒诞的景象，正是【情结（Complex）】被激活后，心灵自我调节机制（Self-Regulation of the Psyche）努力促成意识扩展的证明。`
    ];
    const outros = [
      `学术视角的最终导向是：请直面内在的光明与阴影，将这些未知的心理能量整合进意识，完成一次心智维度的跃升。`,
      `指引你从外在喧嚣回归内在本真。在心理咨询实践中，这种梦境常被视为个体心理承受力增强、即将突破情绪瓶颈的标志。`,
      `请信任梦中传递给你的震颤与宁静，那是内在神圣原型在为你重新校准生命航向。倾听它，而非用纯粹的理性去压抑它。`,
      `不要害怕未知的梦境，那是通往完整自我的必经之路。现代脑神经科学亦证实，这种梦境有助于大脑在REM期完成深度的高级认知整合。`
    ];

    const analysis = intros[seed % intros.length] + mids[(seed >> 1) % mids.length] + outros[(seed >> 2) % outros.length];

    const luckys = ['接触大自然', '阅读神话或童话', '在纸上涂鸦', '独处冥想15分钟', '记录今天的情绪波动'];
    const taboos = ['过度分析他人', '陷入集体狂欢', '压抑潜意识直觉', '盲目跟风', '忽视身体的疲惫信号'];

    return {
      summary: `【自性化节点确认】内在原型正在苏醒，阴影与光明正在完成整合。`,
      analysis: analysis,
      quote: [
        '“向外张望的人在做梦，向内审视的人才是清醒的。”',
        '“潜意识如果无法进入意识，就会被转化为命运。”',
        '“每一个梦，都是在用神话的语言，讲述你自己的故事。”',
        '“你不是被外界事件塑造的，你是被你的心灵深处的选择塑造的。”'
      ][seed % 4],
      fortune: {
        lucky: `宜：${luckys[seed % luckys.length]}、${luckys[(seed + 1) % luckys.length]}`,
        taboo: `忌：${taboos[seed % taboos.length]}、${taboos[(seed + 1) % taboos.length]}`,
        code: `JUNG-ARCH-${(seed % 899 + 100)}`
      }
    };
  }

  const intros = [
    `【临床级打工人神魂鉴定】：破案了！你这大脑分明是在现实里当够了窝囊废，晚上偷偷在潜意识里开挂搞【心理补偿（Psychological Compensation）】！`,
    `【当代内耗样本分析】：你最近是不是又一边疯狂想摆烂，一边又怕被卷死？在认知神经科学里，这叫典型的【认知失调（Cognitive Dissonance）】晚期！`,
    `【反矫情达人评估报告】：啧啧啧，这梦离奇得像大脑皮层多巴胺异常放电！居然跑到${sceneText}去折腾！`,
    `【精神状态评估】：笑死，白天唯唯诺诺，晚上跑到梦里重拳出击搞出这种“${textSnippet}”的大场面？你的【额叶皮质】估计已经放弃挣扎了。`
  ];
  const mids = [
    `又是${actionText}又是梦见${symNames}，剧情离谱得连横店编剧都不敢这么编。说到底，白天装得情绪稳定，晚上大脑直接发热发疯跑3A大作！在精神分析里这叫“严重防御机制过载”。`,
    `潜意识都在替你呐喊：“老子不干了！”可惜梦醒了还是得去挤早高峰。与其在梦里反抗重力，不如今天下班早半小时关机，切断无效的【信息过载（Information Overload）】。`,
    `你以为这是超现实主义大片？其实就是你白天想得太多、做得太少！潜意识无非是在提醒你：你的【内啡肽】余额已经不足以支撑深夜网抑云emo了。`,
    `大脑：白天你使劲使唤我干活，晚上我还得给你渲染这种${actionText}的特效？加钱！加算力！不然明天直接给你表演一个神经衰弱式的当机！`
  ];
  const outros = [
    `别在梦里拯救宇宙了，明天早上闹钟响了能按时爬起来不迟到才是维护【心身稳态（Homeostasis）】的硬道理！`,
    `少喝两杯奶茶，把那些内耗的人和事统统拉黑，比什么高级心理治疗都强！`,
    `生活要是真像你梦里这么敢想敢干，你早就财富自由了！洗洗睡吧，保护你仅存的【海马体】神经元！`,
    `与其在这儿琢磨梦的意思，不如去琢磨一下怎么反PUA，这才是真正的【自我实现（Self-actualization）】！`
  ];

  const analysis = intros[seed % intros.length] + mids[(seed >> 1) % mids.length] + outros[(seed >> 2) % outros.length];

  const luckys = ['喝一杯冰美式醒醒脑', '把讨厌的人静音屏蔽', '早点关灯睡觉', '大胆摸鱼半小时', '痛快吃一顿垃圾食品', '给自己买个无用但快乐的小玩具'];
  const taboos = ['半夜思考宏大哲学', '在朋友圈发无病呻吟小作文', '熬夜吃螺蛳粉', '跟烂人烂事纠缠', '过度共情不值得的人'];

  return {
    summary: `【赛博嘴替暴击】：白天唯唯诺诺，梦里重拳出击，大脑发疯摸鱼实锤！`,
    analysis: analysis,
    quote: [
      '“生活要是像你的梦一样离谱就好了，至少梦里你敢想敢干还不用交税。”',
      '“现实里连外卖超时都不敢催，梦里居然敢单挑宇宙黑洞，真有你的。”',
      '“醒醒吧打工人，梦里再牛逼，明天早八迟到还是要扣全勤奖。”',
      '“别让你的才华只停留在梦境渲染上。”'
    ][seed % 4],
    fortune: {
      lucky: `宜：${luckys[seed % luckys.length]}、${luckys[(seed + 1) % luckys.length]}`,
      taboo: `忌：${taboos[seed % taboos.length]}、${taboos[(seed + 1) % taboos.length]}`,
      code: `ROAST-404-LOL`
    }
  };
}

function formatCurrentDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}


async function callLlmApi({ dreamText, personaId, persona, moodId, mood, selectedTags, apiKey, apiUrl, apiModel }) {
  const seed = simpleHash(dreamText + personaId);
  const semantic = extractSemanticFeatures(dreamText, seed);
  const radar = calculateRadarStats(dreamText, moodId, semantic, seed);
  const neurotransmitters = calculateNeurotransmitters(dreamText, moodId, semantic, seed);
  const illustrationUrl = DREAM_ILLUSTRATIONS[seed % DREAM_ILLUSTRATIONS.length];

  const prompt = `作为一个极其专业的解梦大师（流派：${persona.name}，风格：${persona.desc}），请深度解析以下梦境：
“${dreamText}”
当前情绪基调：${mood.name}。标签：${selectedTags.join(', ')}。

请必须严格按照以下 Markdown 格式返回你的解析内容（不要包含任何其他多余文本，不要使用JSON格式）：

# 标题
（此处写梦境的赛博朋克风/意境标题，不超过10个字）

# 金句
（此处写一句毒舌或充满哲理的金句作为核心定论）

# 概括
（此处用1-2句话高度概括梦境的核心隐喻）

# 解析
（此处写至少300字的详细深度解析长文，分成2-3段落，语气要完全符合你的流派设定，一定要专业且深入，直戳痛点）

# 意象
1. [意象名称1]: [深度解析该意象代表了什么]
2. [意象名称2]: [深度解析该意象代表了什么]

# 运势
宜：[此处写宜做什么]
忌：[此处写忌做什么]
代码：[此处写一个赛博风格的幸运代码，如 NEO-99, AWAKE-01]
`;

  return new Promise((resolve) => {
    uni.request({
      url: apiUrl,
      method: 'POST',
      header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      data: {
        model: apiModel,
        messages: [{ role: 'user', content: prompt }]
      },
      success: (res) => {
        if (res.data && res.data.choices && res.data.choices.length > 0) {
          try {
            const content = res.data.choices[0].message.content;
            
            const getSection = (name) => {
              const regex = new RegExp(`# ${name}\\s*([\\s\\S]*?)(?=# |$)`);
              const match = content.match(regex);
              return match ? match[1].trim() : '';
            };

            const title = getSection('标题') || '潜意识碎片';
            const quote = getSection('金句') || '梦境是现实的倒影。';
            const summary = getSection('概括') || '这是一场意义深远的梦境...';
            const analysis = getSection('解析') || '解析生成中出现了未知的量子扰动...';
            
            const rawSymbols = getSection('意象');
            const symbols = [];
            if (rawSymbols) {
              const lines = rawSymbols.split('\n');
              for (const line of lines) {
                const match = line.match(/^\d+\.\s*\[(.*?)\]:\s*\[(.*?)\]$/) || line.match(/^\d+\.\s*([^:]+):\s*(.*)$/) || line.match(/^-?\s*\*?\*?([^:]+)\*?\*?:\s*(.*)$/);
                if (match) {
                  let name = match[1].replace(/\[|\]/g, '').trim();
                  let desc = match[2].replace(/\[|\]/g, '').trim();
                  if (name && desc) symbols.push({ name, desc });
                }
              }
            }
            if (symbols.length === 0) symbols.push(...semantic.symbols);

            const rawFortune = getSection('运势');
            let lucky = '宜：冥想';
            let taboo = '忌：焦虑';
            let code = 'SYS-OK';
            if (rawFortune) {
              const lMatch = rawFortune.match(/宜：(.*?)(?:\n|$)/);
              const tMatch = rawFortune.match(/忌：(.*?)(?:\n|$)/);
              const cMatch = rawFortune.match(/代码：(.*?)(?:\n|$)/);
              if (lMatch) lucky = '宜：' + lMatch[1].replace(/\[|\]/g, '').trim();
              if (tMatch) taboo = '忌：' + tMatch[1].replace(/\[|\]/g, '').trim();
              if (cMatch) code = cMatch[1].replace(/\[|\]/g, '').trim();
            }

            resolve({
              id: 'DREAM_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
              title,
              date: formatCurrentDate(),
              timestamp: Date.now(),
              dreamText,
              personaId,
              persona,
              moodId,
              mood,
              selectedTags,
              summary,
              analysis,
              symbols,
              radar,
              neurotransmitters,
              colorTheme: persona.color,
              quote,
              fortune: { lucky, taboo, code },
              illustrationUrl
            });
          } catch(e) {
            console.error('LLM解析梦境失败', e);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      },
      fail: (err) => {
        console.error('LLM请求失败', err);
        resolve(null);
      }
    });
  });
}
