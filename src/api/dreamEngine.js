import { ENV } from '../config/env.js';

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
    avatar: '☯',
    color: '#3d6e68',
    desc: '以传统易学为骨架，结合神经元算力重新推演你的运势与潜意识吉凶。'
  },
  freud: {
    id: 'freud',
    name: '弗洛伊德',
    title: '精神分析 · 潜意识深层解构',
    tag: '欲望与本能',
    avatar: '👁',
    color: '#bc312c',
    desc: '绝对理性的精神分析，撕开梦境伪装，直指你清醒时被压抑的真实欲望。'
  },
  jung: {
    id: 'jung',
    name: '荣格神话',
    title: '集体无意识 · 心灵原型召唤',
    tag: '神话与原型',
    avatar: '✧',
    color: '#4a3f5a',
    desc: '将你的梦境放逐于人类集体无意识之海，寻找失落的心灵碎片与神圣指引。'
  },
  roast: {
    id: 'roast',
    name: '毒舌嘴替',
    title: '临床级防PUA · 当代打工人神魂鉴定',
    tag: '爆笑毒舌',
    avatar: '⚡',
    color: '#9c6f3d',
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
    url: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1000&q=80',
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


  
  const apiKey = (typeof settings === 'string' ? settings : settings?.apiKey) || ENV?.apiKey || '';
  const apiUrl = settings?.apiUrl || ENV?.apiUrl || 'https://api.deepseek.com/v1/chat/completions';
  const apiModel = settings?.apiModel || ENV?.apiModel || 'deepseek-chat';
  const difyKey = settings?.difyKey || ENV?.difyKey || '';
  const difyUrl = settings?.difyUrl || ENV?.difyUrl || 'https://api.dify.ai/v1/chat-messages';

  if (difyKey && difyKey.trim().length > 10) {
    const apiResult = await callDifyApi({ dreamText, personaId, persona, moodId, mood, selectedTags, difyKey, difyUrl });
    if (apiResult) return apiResult;
  } else if (apiKey && apiKey.trim().length > 10) {
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

export function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * 依据输入的梦境内容、提取的意象与情绪基调构建高质感、高匹配度的 AI 生图提示词
 * 将中文梦境实体精确映射为英文具象物体与场景，确保生图模型（Flux/SDXL）100%精准识别
 */
export function buildDynamicVisualPrompt(dreamText, semantic, mood) {
  let t = String(dreamText || '').toLowerCase();
  const subjects = [];
  const scenes = [];
  const actions = [];

  // ==================== 0. 高优先级复合情节实体 (针对高频情节深度匹配) ====================
  // 手机/屏幕 + 藤蔓/植物/花草 (用户典型梦境：手机屏幕长出藤蔓缠绕手腕)
  if ((t.includes('手机') || t.includes('屏幕') || t.includes('电话')) && 
      (t.includes('藤蔓') || t.includes('树藤') || t.includes('草') || t.includes('花') || t.includes('植物') || t.includes('枝') || t.includes('叶'))) {
    if (t.includes('手腕') || t.includes('手') || t.includes('缠绕') || t.includes('捆')) {
      subjects.push('vivid emerald botanical vines and creeping ivy tendrils bursting out from a glowing smartphone screen, tightly entangling and wrapping around a human hand and wrist');
    } else {
      subjects.push('lush green creeping vines and glowing botanical flora erupting and growing out from a luminous smartphone glass screen');
    }
    t = t.replace(/手机|屏幕|电话|藤蔓|树藤|植物/g, ' ');
  }

  // 手腕/手 + 缠绕/藤蔓/绳索
  if ((t.includes('手腕') || t.includes('手') || t.includes('臂')) && (t.includes('藤蔓') || t.includes('树藤') || t.includes('缠绕') || t.includes('红绳') || t.includes('丝线'))) {
    subjects.push('delicate human wrist and hand gracefully intertwined with glowing emerald botanical vines and luminous threads');
    t = t.replace(/手腕|缠绕/g, ' ');
  }

  // 1. 现代科技与数码物件 (手机、电脑、屏幕等)
  if (t.includes('手机') || t.includes('电话') || t.includes('iphone') || t.includes('刷手机')) {
    subjects.push('a sleek illuminated smartphone glowing with ethereal cyan and golden luminescence');
    t = t.replace(/手机|电话|iphone/g, ' ');
  }
  if (t.includes('电脑') || t.includes('笔记本') || t.includes('屏幕') || t.includes('显示器') || t.includes('键盘')) {
    subjects.push('a glowing holographic computer monitor emitting surreal volumetric data light');
    t = t.replace(/电脑|笔记本|屏幕|显示器|键盘/g, ' ');
  }
  if (t.includes('电视') || t.includes('广播') || t.includes('收音机')) {
    subjects.push('a vintage retro television set broadcasting starlight static and floating particles');
    t = t.replace(/电视|收音机/g, ' ');
  }

  // 2. 植物生态与微观自然 (藤蔓、树木、花卉、蘑菇)
  if (t.includes('藤蔓') || t.includes('树藤') || t.includes('爬山虎') || t.includes('青藤')) {
    subjects.push('lush wild creeping green ivy vines and twisting botanical tendrils');
    t = t.replace(/藤蔓|树藤|爬山虎|青藤/g, ' ');
  }
  if (t.includes('荷花') || t.includes('莲花') || t.includes('莲') || t.includes('荷')) {
    subjects.push('blooming radiant neon lotus flowers on pristine tranquil waters');
    t = t.replace(/荷花|莲花|莲|荷/g, ' ');
  } else if (t.includes('玫瑰') || t.includes('向日葵') || t.includes('樱花') || t.includes('百合') || t.includes('牡丹') || t.includes('花')) {
    subjects.push('surreal enchanting flowers in full bloom with glowing petals and shimmering pollen');
    t = t.replace(/玫瑰|向日葵|樱花|百合|牡丹|花/g, ' ');
  }
  if (t.includes('蘑菇') || t.includes('菌')) {
    subjects.push('giant bioluminescent mushrooms glowing with mystical teal and purple hues');
    t = t.replace(/蘑菇|菌/g, ' ');
  }
  if (t.includes('古树') || t.includes('大树') || t.includes('神树') || t.includes('森林') || t.includes('树林') || t.includes('树木') || t.includes('树')) {
    subjects.push('a colossal sacred tree of life with sprawling glowing roots and luminous canopy');
    t = t.replace(/古树|大树|神树|森林|树林|树木|树/g, ' ');
  }
  if (t.includes('竹') || t.includes('竹林')) {
    subjects.push('a serene emerald bamboo grove bathed in morning mist and god rays');
    t = t.replace(/竹|竹林/g, ' ');
  }

  // 3. 人体、具象部位与服饰
  if (t.includes('手腕') || t.includes('手掌') || t.includes('双手') || t.includes('手')) {
    subjects.push('a gentle human hand reaching out with soft ethereal aura');
    t = t.replace(/手腕|手掌|双手|手/g, ' ');
  }
  if (t.includes('眼') || t.includes('眸') || t.includes('瞳')) {
    subjects.push('a mystical glowing cosmic eye reflecting an entire starry galaxy');
    t = t.replace(/眼|眸|瞳/g, ' ');
  }
  if (t.includes('翅膀') || t.includes('羽翼') || t.includes('羽毛')) {
    subjects.push('a figure with magnificent glowing feathered angel wings');
    t = t.replace(/翅膀|羽翼|羽毛/g, ' ');
  }
  if (t.includes('牙') || t.includes('牙齿')) {
    subjects.push('translucent ivory crystal fragments drifting weightlessly like stardust');
    t = t.replace(/牙|牙齿/g, ' ');
  }
  if (t.includes('婚纱') || t.includes('新娘') || t.includes('婚礼')) {
    subjects.push('a surreal ethereal bride figure with flowing crystalline silk veil');
    t = t.replace(/婚纱|新娘|婚礼/g, ' ');
  }
  if (t.includes('面具') || t.includes('戏曲') || t.includes('脸谱')) {
    subjects.push('an ornate oriental opera mask with porcelain finish and crimson accents');
    t = t.replace(/面具|戏曲|脸谱/g, ' ');
  }

  // 4. 水生生物与神兽生灵
  if (t.includes('章鱼') || t.includes('八爪鱼')) {
    subjects.push('a colossal mythical octopus with glowing tentacles');
    t = t.replace(/章鱼|八爪鱼/g, ' ');
  }
  if (t.includes('水母')) {
    subjects.push('translucent bioluminescent jellyfish floating like glowing lanterns');
    t = t.replace(/水母/g, ' ');
  }
  if (t.includes('鲸')) {
    subjects.push('a colossal majestic blue whale soaring peacefully through starlight');
    t = t.replace(/鲸鱼|座头鲸|蓝鲸|抹香鲸|鲸/g, ' ');
  }
  if (t.includes('鲨鱼') || t.includes('白鲨')) {
    subjects.push('a sleek glowing phantom shark gliding through water');
    t = t.replace(/鲨鱼|白鲨/g, ' ');
  }
  if (t.includes('金鱼') || t.includes('锦鲤') || t.includes('鱼')) {
    subjects.push('iridescent glowing koi fish swimming gracefully through thin air');
    t = t.replace(/金鱼|锦鲤|鱼/g, ' ');
  }
  if (t.includes('黑猫')) {
    subjects.push('a mysterious sleek black cat with glowing amber eyes');
    t = t.replace(/黑猫/g, ' ');
  } else if (t.includes('白猫')) {
    subjects.push('an ethereal pure white cat with luminous blue eyes');
    t = t.replace(/白猫/g, ' ');
  } else if (t.includes('猫')) {
    subjects.push('a mysterious graceful cat with luminous glowing eyes');
    t = t.replace(/橘猫|猫咪|猫/g, ' ');
  }
  if (t.includes('狼')) {
    subjects.push('a mystical noble silver wolf under celestial moonlight');
    t = t.replace(/狼/g, ' ');
  } else if (t.includes('柴犬') || t.includes('小狗') || t.includes('狗') || t.includes('犬')) {
    subjects.push('a loyal cute dog bathed in warm golden magical light');
    t = t.replace(/柴犬|小狗|狗|犬/g, ' ');
  }
  if (t.includes('龙')) {
    subjects.push('a magnificent oriental celestial dragon coiled among glowing clouds');
    t = t.replace(/青龙|金龙|巨龙|龙/g, ' ');
  }
  if (t.includes('凤凰') || t.includes('凤')) {
    subjects.push('a radiant flaming phoenix with shimmering golden feathers');
    t = t.replace(/凤凰|凤/g, ' ');
  }
  if (t.includes('仙鹤') || t.includes('鹤') || t.includes('白鹤')) {
    subjects.push('ethereal white cranes with red crowns soaring through morning mist');
    t = t.replace(/仙鹤|白鹤|鹤/g, ' ');
  }
  if (t.includes('蝴蝶') || t.includes('蝶')) {
    subjects.push('swarms of luminous neon butterflies drifting in midair');
    t = t.replace(/蝴蝶|蝶/g, ' ');
  }
  if (t.includes('鹿')) {
    subjects.push('a sacred white celestial stag with glowing crystal antlers');
    t = t.replace(/鹿/g, ' ');
  }
  if (t.includes('兔')) {
    subjects.push('an ethereal cute rabbit glowing with soft moonlight');
    t = t.replace(/兔/g, ' ');
  }

  // 5. 关键器物与日常道具
  if (t.includes('镜子') || t.includes('镜')) {
    subjects.push('an ornate antique mirror reflecting an alternate starry reality');
    t = t.replace(/镜子|铜镜|镜/g, ' ');
  }
  if (t.includes('门') || t.includes('走道')) {
    subjects.push('a freestanding mysterious glowing doorway open to another dimension');
    t = t.replace(/门/g, ' ');
  }
  if (t.includes('窗') || t.includes('窗户')) {
    subjects.push('a sunlit vintage French window with sheer curtains billowing in wind');
    t = t.replace(/窗户|窗/g, ' ');
  }
  if (t.includes('时钟') || t.includes('沙漏') || t.includes('闹钟') || t.includes('钟表')) {
    subjects.push('surreal melting brass clocks and floating hourglasses');
    t = t.replace(/时钟|沙漏|闹钟|钟表/g, ' ');
  }
  if (t.includes('齿轮') || t.includes('发条') || t.includes('机械')) {
    subjects.push('intricate floating golden clockwork gears and steampunk mechanisms');
    t = t.replace(/齿轮|发条|机械/g, ' ');
  }
  if (t.includes('书') || t.includes('日记') || t.includes('本子') || t.includes('试卷') || t.includes('考')) {
    subjects.push('towering spirals of ancient floating books and glowing parchment pages');
    t = t.replace(/书|日记|本子|试卷|考/g, ' ');
  }
  if (t.includes('雨伞') || t.includes('伞')) {
    subjects.push('a glowing translucent umbrella shedding droplets of starlight');
    t = t.replace(/雨伞|伞/g, ' ');
  }
  if (t.includes('琴') || t.includes('吉他') || t.includes('钢琴') || t.includes('音乐')) {
    subjects.push('a grand classical piano floating in midair with glowing luminous keys');
    t = t.replace(/琴|吉他|钢琴|音乐/g, ' ');
  }
  if (t.includes('金币') || t.includes('硬币') || t.includes('钱') || t.includes('宝藏')) {
    subjects.push('floating glowing golden coins and iridescent gems drifting like snow');
    t = t.replace(/金币|硬币|钱|宝藏/g, ' ');
  }

  // 6. 载具与运输
  if (t.includes('摩天轮') || t.includes('游乐园')) {
    subjects.push('a towering glowing Ferris wheel in an ethereal twilight carnival');
    t = t.replace(/摩天轮|游乐园/g, ' ');
  }
  if (t.includes('火车') || t.includes('列车') || t.includes('高铁') || t.includes('绿皮车')) {
    subjects.push('a vintage retro passenger train gliding along floating golden tracks');
    t = t.replace(/火车|列车|高铁|绿皮车/g, ' ');
  }
  if (t.includes('飞机') || t.includes('航班') || t.includes('飞船') || t.includes('火箭')) {
    subjects.push('a majestic passenger aircraft gliding through surreal sunset clouds');
    t = t.replace(/飞机|航班|飞船|火箭/g, ' ');
  }
  if (t.includes('车') || t.includes('开车') || t.includes('单车') || t.includes('自行车')) {
    subjects.push('a sleek vintage automobile on an empty starlit road');
    t = t.replace(/车|开车|单车|自行车/g, ' ');
  }

  // 7. 场景与宏观环境
  if (t.includes('海') || t.includes('水') || t.includes('湖') || t.includes('河') || t.includes('沙滩')) {
    scenes.push('deep mystical ocean waters with turquoise god rays and coral reefs');
  }
  if (t.includes('太空') || t.includes('星') || t.includes('月') || t.includes('银河') || t.includes('宇宙')) {
    scenes.push('vast cosmic nebula with glowing crescent moon and infinite starfield');
  }
  if (t.includes('房') || t.includes('家') || t.includes('卧室') || t.includes('床') || t.includes('屋')) {
    scenes.push('a dreamy surreal cozy room with warm starlight streaming through open windows');
  }
  if (t.includes('城') || t.includes('楼') || t.includes('大厦') || t.includes('街') || t.includes('路')) {
    scenes.push('a sprawling cityscape with glowing neon reflections on rainy streets');
  }
  if (t.includes('雪') || t.includes('冰') || t.includes('寒冷')) {
    scenes.push('majestic snow-capped mountain peaks under glowing emerald aurora borealis');
  }
  if (t.includes('火') || t.includes('焰') || t.includes('燃')) {
    scenes.push('dramatic swirling crimson flames and glowing golden embers');
  }
  if (t.includes('迷宫') || t.includes('楼梯') || t.includes('梯')) {
    scenes.push('an impossible surreal labyrinth of endless floating spiral staircases');
  }
  if (t.includes('云') || t.includes('天') || t.includes('夕阳') || t.includes('晚霞')) {
    scenes.push('sea of endless pastel sunset clouds with golden rim lighting');
  }

  // 8. 动作与动态
  if (t.includes('缠绕') || t.includes('绑') || t.includes('包围')) {
    actions.push('entangled and wrapped in organic luminous creeping vines');
  } else if (t.includes('飞') || t.includes('浮') || t.includes('悬')) {
    actions.push('floating weightlessly in zero gravity');
  } else if (t.includes('坠') || t.includes('掉') || t.includes('跌')) {
    actions.push('falling gracefully through a boundless dream realm');
  } else if (t.includes('跑') || t.includes('追') || t.includes('逃')) {
    actions.push('dynamic kinetic motion through an ethereal landscape');
  } else if (t.includes('游')) {
    actions.push('swimming gracefully through luminous ethereal depths');
  }

  // 9. 智能兜底：若以上全无匹配，直接提取用户梦境中的名词与动词作为意象主体，绝不使用死板人物
  if (subjects.length === 0) {
    const cleanSnippet = dreamText.replace(/[我你他在做了一个梦见突然就了的一是不把被着过]/g, ' ').trim().slice(0, 20);
    subjects.push(`a surreal artistic manifestation of "${cleanSnippet || 'mystical dream realm'}"`);
  }

  // 10. 艺术风格与情绪渲染
  let moodStyle = 'oriental surrealism, ethereal dreamcore, poetic masterpiece';
  const mid = mood?.id || mood || '';
  if (mid === 'cyber') moodStyle = 'cyberpunk aesthetic, futuristic neon glow, volumetric haze';
  else if (mid === 'anxiety') moodStyle = 'moody dramatic noir surrealism, high contrast cinematic shadows';
  else if (mid === 'healing') moodStyle = 'Studio Ghibli inspired warmth, enchanted soothing sunlight, ethereal fairytale';
  else if (mid === 'funny') moodStyle = 'whimsical playful surrealism, vibrant saturated colors, dreamcore fantasy';
  else if (mid === 'nostalgia') moodStyle = 'warm vintage golden hour, nostalgic retro cinematic grain';

  const subjectStr = subjects.slice(0, 2).join(', ');
  const sceneStr = scenes.length > 0 ? scenes.slice(0, 2).join(', ') : 'breathtaking surreal dreamscape realm';
  const actionStr = actions.length > 0 ? actions[0] : 'surrounded by delicate glowing particles and soft atmospheric lighting';

  return `${subjectStr}, ${actionStr}, setting in ${sceneStr}, cinematic volumetric lighting, breathtaking composition, ${moodStyle}, 8k masterpiece digital art, highly detailed, no text, no watermark`;
}

export function generateDreamImageUrl(prompt, seed = 0) {
  const safeSeed = Math.abs(seed) || Math.floor(Math.random() * 100000);
  const encoded = encodeURIComponent((prompt || 'surreal dreamscape, oriental aesthetics').trim());
  return `https://image.pollinations.ai/prompt/${encoded}?width=960&height=600&model=flux&seed=${safeSeed}&nologo=true`;
}

/**
 * 获取兜底精美插画（网络异常或超时回退）
 */
export function getFallbackIllustration(seed = 0) {
  const s = Math.abs(seed) || 0;
  return DREAM_ILLUSTRATIONS[s % DREAM_ILLUSTRATIONS.length].url;
}

function generateDynamicDreamAnalysis(dreamText, personaId, persona, moodId, mood, selectedTags) {
  const seed = simpleHash(dreamText + personaId);
  const semantic = extractSemanticFeatures(dreamText, seed);
  const radar = calculateRadarStats(dreamText, moodId, semantic, seed);
  const neurotransmitters = calculateNeurotransmitters(dreamText, moodId, semantic, seed);
  const title = generateDynamicDreamTitle(dreamText, semantic, seed);
  const { analysis, summary, quote, fortune } = generateDynamicPersonaReport(personaId, dreamText, semantic, mood, seed);
  const visualPrompt = buildDynamicVisualPrompt(dreamText, semantic, mood);
  const illustrationUrl = generateDreamImageUrl(visualPrompt, seed);

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
    illustrationUrl,
    illustrationTitle: '太虚画境 · 梦象映真',
    colorTheme: persona.color
  };
}

function generateDynamicDreamTitle(text, semantic, seed) {
  const prefixes = ['太虚', '灵犀', '浮光', '幻真', '归墟', '玄枢', '神启', '洞天', '溯源', '紫霄', '微芒', '破界'];
  const suffixes = ['之境', '秘卷', '脉冲', '余韵', '残响', '奇境', '幻象', '漫游', '真诀', '清辉'];
  const p = prefixes[seed % prefixes.length];
  const s = suffixes[(seed >> 1) % suffixes.length];
  const core = semantic.symbols.length > 0 ? semantic.symbols[0].name.replace(/的/g, '') : '潜意识';
  return `${p}·${core}${s}`;
}

function extractSemanticFeatures(text, seed) {
  const localSeed = simpleHash(text);
  const t = String(text || '').toLowerCase();
  
  let sceneName = '';
  let detectedAction = '';
  let symbols = [];
  let detectedTrait = '隐性焦虑与渴望';

  // 0. 特殊核心梦境情节识别（高频梦境原型）
  // 0.1 找厕所 / 卫生间 / 开会 / 会议室
  if (t.includes('厕所') || t.includes('卫生间') || t.includes('洗手间') || t.includes('马桶') || t.includes('如厕') || (t.includes('开会') && t.includes('门'))) {
    sceneName = '严肃审判的会议室';
    detectedAction = '急寻排解却推门撞见众人';
    detectedTrait = '个人私密边界被职场与社会评价体系严重侵占';
    symbols.push({ name: '急寻之所', icon: '🚽', meaning: '渴望宣泄情绪积压与生理压力的私密安全感庇护所' });
    symbols.push({ name: '肃穆会场', icon: '👥', meaning: '现实中无处不在的职场规训、他人审视与绩效压力' });
    symbols.push({ name: '尴尬之门', icon: '🚪', meaning: '私密本我与公共面具发生戏剧性冲突的失控临界点' });
  }
  // 0.2 手机打不开 / 长出藤蔓 / 科技异化
  else if (t.includes('手机') && (t.includes('藤蔓') || t.includes('长出') || t.includes('打不开') || t.includes('屏幕') || t.includes('手腕'))) {
    sceneName = '荧屏蔓生之境';
    detectedAction = '草木疯长反向缠绕';
    detectedTrait = '信息过载焦虑与原始生命力反抗冰冷技术规训';
    symbols.push({ name: '疯长藤蔓', icon: '🌿', meaning: '深层生命本能的苏醒，冲破冰冷人造规则的束缚' });
    symbols.push({ name: '幽光手机', icon: '📱', meaning: '现代信息过载与科技依存带来的数字焦虑与失联恐慌' });
    symbols.push({ name: '执念之腕', icon: '✋', meaning: '对行动力、掌控感与现实抉择能力的深度审视' });
  }
  // 0.3 考试 / 迟到 / 准考证 / 试卷
  else if (t.includes('考') || t.includes('试卷') || t.includes('迟到') || t.includes('准考证') || t.includes('高考')) {
    sceneName = '绝对规则考场';
    detectedAction = '倒计时与提笔失语';
    detectedTrait = '面对外界评价体系的审判焦虑与冒充者综合征';
    symbols.push({ name: '空白试卷', icon: '📝', meaning: '对不可控外界标准的畏惧与自我认同的动摇' });
    symbols.push({ name: '融化钟表', icon: '⏰', meaning: '流逝时间催促下的压迫感与逃避惩戒心理' });
  }
  // 0.4 掉牙齿 / 牙齿全碎
  else if (t.includes('牙') || t.includes('门牙') || t.includes('掉牙')) {
    sceneName = '骨骼蜕变之间';
    detectedAction = '牙落无声';
    detectedTrait = '对失控感、衰老及言语表达受阻的深层恐慌';
    symbols.push({ name: '脱落牙齿', icon: '🦷', meaning: '成长转型期的防御剥离，难以言说的苦涩积郁' });
  }
  // 0.5 高空坠落 / 失重 / 掉下
  else if ((t.includes('坠') || t.includes('掉') || t.includes('摔') || t.includes('悬崖')) && !t.includes('牙')) {
    sceneName = '反重力虚空深渊';
    detectedAction = '无抓手自由落体';
    detectedTrait = '现实支持体系动摇时的失控惊恐与全然接纳';
    symbols.push({ name: '逆向重力场', icon: '🌌', meaning: '打破现实平衡、急需重新寻获安全锚点的危机警示' });
    symbols.push({ name: '虚空深渊', icon: '☄️', meaning: '面对重大不确定性时对未知的恐惧与试探' });
  }
  // 0.6 被追赶 / 逃跑 / 跑不动
  else if (t.includes('追') || t.includes('逃') || t.includes('跑不动') || t.includes('被抓') || t.includes('躲')) {
    sceneName = '无止境追逐回廊';
    detectedAction = '紧迫奔逃与脚步沉重';
    detectedTrait = '逃避现实冲突或最后期限时的紧迫内耗';
    symbols.push({ name: '无形追猎者', icon: '👤', meaning: '现实中被拖延的棘手任务、道德审判或冲突' });
    symbols.push({ name: '沉重双足', icon: '👣', meaning: '精力透支时身体与意识在梦中的沉滞抗议' });
  }
  // 0.7 飞翔 / 遨游
  else if (t.includes('飞') || t.includes('翱翔') || t.includes('浮空')) {
    sceneName = '九天太虚云海';
    detectedAction = '乘风御气翱翔';
    detectedTrait = '超越庸常困境、追求宏大格局与精神绝对自由';
    symbols.push({ name: '凌虚羽翼', icon: '🪽', meaning: '破除思维狭隘、渴望全局掌控的高维视野' });
  }
  // 0.8 迷路 / 找不到家 / 楼梯走不完
  else if (t.includes('迷路') || t.includes('找不到路') || t.includes('找不到家') || t.includes('走不出去') || t.includes('楼梯')) {
    sceneName = '莫比乌斯迷径';
    detectedAction = '辗转徘徊寻路';
    detectedTrait = '人生关键转折期的方向感迷失与选择困难';
    symbols.push({ name: '无尽转角', icon: '🔄', meaning: '复杂人际与职场规则中的无所适从与探寻' });
  }

  // 1. 现代物品补充
  if (symbols.length === 0) {
    if (t.includes('手机') || t.includes('电话')) {
      symbols.push({ name: '幽光手机', icon: '📱', meaning: '现代信息过载带来的数字焦虑与失联恐慌' });
    }
    if (t.includes('屏幕') || t.includes('电脑')) {
      symbols.push({ name: '荧幕幻光', icon: '💻', meaning: '人造视界与潜意识投射的交互窗口' });
    }
    if (t.includes('藤蔓') || t.includes('植物') || t.includes('花') || t.includes('草')) {
      symbols.push({ name: '疯长藤蔓', icon: '🌿', meaning: '原始生命潜能的爆发与破除僵化规训' });
    }
    if (t.includes('猫')) {
      symbols.push({ name: '灵性黑猫', icon: '🐈', meaning: '敏锐直觉、独立探索与夜行潜意识的指引' });
    }
    if (t.includes('狗') || t.includes('狼')) {
      symbols.push({ name: '忠诚灵兽', icon: '🐕', meaning: '情感依附、警觉防御与安全感守护' });
    }
    if (t.includes('鲸') || t.includes('鱼') || t.includes('水母')) {
      symbols.push({ name: '深渊巨鲸', icon: '🐋', meaning: '庞大而沉睡的深层潜意识与辽阔自性' });
    }
    if (t.includes('海') || t.includes('水')) {
      symbols.push({ name: '失语深渊', icon: '🌊', meaning: '情感母体深处涌动的隐秘心事' });
    }
    if (t.includes('镜')) {
      symbols.push({ name: '虚空双生镜', icon: '🪞', meaning: '自我认同审视、白日人格与深层本我的对视' });
    }
    if (t.includes('门')) {
      symbols.push({ name: '次元暗门', icon: '🚪', meaning: '关键转折点，通往未知心智维度的通道' });
    }
  }

  // 场景与动作的智能语义归纳（避免生硬的假场景词）
  if (!sceneName) {
    if (t.includes('海') || t.includes('水') || t.includes('湖')) sceneName = '水汽氤氲之域';
    else if (t.includes('星') || t.includes('太空') || t.includes('月')) sceneName = '浩渺星穹境遇';
    else if (t.includes('城') || t.includes('大厦') || t.includes('街')) sceneName = '错综都市街景';
    else if (t.includes('房') || t.includes('家') || t.includes('屋') || t.includes('室')) sceneName = '闭锁居所空间';
    else sceneName = '梦境所映之境';
  }

  if (!detectedAction) {
    if (t.includes('找') || t.includes('寻')) detectedAction = '焦灼探寻';
    else if (t.includes('开') || t.includes('推')) detectedAction = '开启触碰';
    else if (t.includes('跑') || t.includes('行') || t.includes('走')) detectedAction = '涉足游历';
    else detectedAction = '神识游弋';
  }

  // 兜底符号补齐
  const FALLBACK_SYMBOLS = [
    { name: '无名古匣', icon: '⬛', meaning: '未被言说的隐秘记忆与潜意识防御' },
    { name: '折叠微光', icon: '✨', meaning: '对理想自我的追寻与微光洞察' },
    { name: '灵犀素笺', icon: '📜', meaning: '重构现实心绪的自我倾听' },
    { name: '无源灵泉', icon: '💧', meaning: '深层情绪涌动与自我净化修复' }
  ];

  while (symbols.length < 2) {
    const candidate = FALLBACK_SYMBOLS[(localSeed + symbols.length) % FALLBACK_SYMBOLS.length];
    if (!symbols.some(s => s.name === candidate.name)) {
      symbols.push(candidate);
    }
  }

  symbols = symbols.slice(0, 3);
  let textSnippet = text.length > 12 ? text.substring(0, 12) + '...' : text;
  
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
  const t = String(text || '').toLowerCase();

  // ==================== 原型 1：如厕受阻、找厕所推门是会议室/众人开会 ====================
  if (t.includes('厕所') || t.includes('卫生间') || t.includes('洗手间') || t.includes('马桶') || (t.includes('开会') && t.includes('门'))) {
    if (personaId === 'roast') {
      return {
        summary: '【社死级心智暴击】：白天当牛做马开无效会议，晚上找个厕所都被领导围观！',
        analysis: '【反矫情达人评估报告】：笑死我了，这简直是当代打工人最真实的“社死巅峰”！白天在公司强颜欢笑开着又长又臭的会议，晚上潜意识好不容易想找个私密洗手间“排毒释压”，结果千辛万苦推开门——好家伙，一屋子领导同事正襟危坐瞪着你！大脑这波是在狂按警报：白天被职场KPI绑架就算了，连做梦找个独立私人空间都要被“公开处刑”？别琢磨了，你的心理边界感已经被现实的工作和人际压力严重侵蚀！赶紧下班关机，给自己留点不被打扰的喘息空间吧！',
        quote: '“现实里不敢对傻逼会议掀桌子，潜意识只好把会议室搬进厕所门口抗议。”',
        fortune: { lucky: '宜：下班准点踩点打卡、把工作群开启免打扰', taboo: '忌：周末秒回工作消息、过度讨好领导', code: 'ROAST-TOILET-404' }
      };
    }
    if (personaId === 'freud') {
      return {
        summary: '【本我与超我激烈冲突】：排泄宣泄本能遭遇严苛社会道德审判。',
        analysis: '从经典精神分析来看，这是教科书级的【本我（Id）与超我（Superego）】正面对撞。在潜意识语境中，“急寻如厕”代表个体迫切需要释放积压的生理冲动与隐秘情绪；而“推门是开会的会议室”，则是代表权威、评价与职业规训的【超我】在粗暴插手！你最隐秘、最脆弱的释放欲望被强行暴露在象征社会视线的公堂之上，直指你近期对“失去隐私边界”以及“被外界权威审判”的深层恐惧。',
        quote: '“被压抑的本能如果得不到私密出口，就会被超我押送到公堂之上受审。”',
        fortune: { lucky: '宜：寻找独处密闭空间静心、痛快宣泄压抑情绪', taboo: '忌：在众人面前强装体面、过度克制真实感受', code: 'FREUD-ID-SUPEREGO' }
      };
    }
    if (personaId === 'zhougong') {
      return {
        summary: '卦象显【水山蹇 · 坎上艮下】：寻浊道受阻，防公私界限失守与人际暗算。',
        analysis: '《断梦秘书》云：“梦寻溷（厕）而不得，主气滞血瘀，行事多窒碍。”如厕乃涤荡身心污秽之急，忽见公卿列席开会，此乃“私密入公堂，内外相冲”。卦象合【水山蹇】，蹇者难也，主近期职场人际关系紧绷，行事须防闲言碎语窥探隐私。同时《黄帝内经》提示下焦气机不调、水湿停聚，醒来当调理水道与脾胃之气，切忌强忍劳碌。',
        quote: '“内急生于腑脏，公堂显于心神；守身如玉者，必先严明公私之界。”',
        fortune: { lucky: '宜：喝一杯陈皮茯苓茶化湿、划清个人隐私红线', taboo: '忌：在单位妄议他人私事、熬夜憋尿忍耐', code: 'ZHOUGONG-HEX-39' }
      };
    }
    if (personaId === 'jung') {
      return {
        summary: '【面具与阴影的戏剧对峙】：职场社会面具过度吞噬真实本我的心灵警报。',
        analysis: '在分析心理学视角下，这场极具张力的梦境揭示了【人格面具（Persona）】与【内在阴影（Shadow）】的剧烈交锋。洗手间是退回原初、卸下面具的纯粹私域；而会议室则是集体意识所固化的职业面具角斗场。当这两者通过一扇门戏剧性连通时，自性（Self）正在通过极端荒诞的尴尬感唤醒你：你戴着职业与礼貌的面具太久太沉，以至于连心灵最基础的宣泄冲动都感受到了集体视线的审判。',
        quote: '“当你把整个人生都献给社会面具时，潜意识便会在你最私密之处敲响警钟。”',
        fortune: { lucky: '宜：摘下职场假笑面具、进行一次赤诚的情绪宣泄', taboo: '忌：过度融入集体意志、忽视个体内在本真需求', code: 'JUNG-SHADOW-PERSONA' }
      };
    }
  }

  // ==================== 原型 2：手机屏幕长出藤蔓/科技异化与缠绕 ====================
  if (t.includes('手机') && (t.includes('藤蔓') || t.includes('长出') || t.includes('打不开') || t.includes('手腕'))) {
    if (personaId === 'roast') {
      return {
        summary: '【赛博过载物理断网】：手机长藤蔓缠手腕，大自然强制给你防沉迷！',
        analysis: '【反矫情达人评估报告】：笑死，你的大脑皮层已经对手机成瘾和信息轰炸产生生理性反胃了！屏幕打不开还长出藤蔓把手腕缠住，这哪里是超现实大片，分明是潜意识在用大自然的力量强行给你“物理断网”！白天机不离手被各种微信消息、工作弹窗轰炸，手腕都快得腱鞘炎了，晚上大脑直接借植物之手把你手腕锁死：“别刷了！再刷连灵魂都被代码绑架了！”生活在现实里，别在手机屏幕里坐穿底线。',
        quote: '“现实里舍不得放下手机，梦里只好长出藤蔓把你手腕硬生生绑住。”',
        fortune: { lucky: '宜：开启手机勿扰模式、去户外摸一摸真实的树叶', taboo: '忌：睡前躺着刷短视频、离不开手机焦虑', code: 'ROAST-PHONE-VINE' }
      };
    }
    if (personaId === 'freud') {
      return {
        summary: '【科技异化与本能反噬】：冷酷技术工具遭遇原始生命力的破土复苏。',
        analysis: '手机在现代被视为人体的“外生器官”。梦中“手机打不开，反而长出藤蔓缠绕手腕”，象征着你在现实中对数字工具的过度依赖正转化为严重的异化焦虑。屏幕中的冰冷代码被具有原始繁衍力的“藤蔓”取而代之，并捆绑住你象征行动力的手腕，这代表你被压抑的本能生命力（Eros）在向冰冷的理性规训发起反抗，迫使你审视自己被技术所剥夺的真实生理感知。',
        quote: '“技术越是冰冷严密，潜意识便越会借由原始绿植的疯长来夺回控制权。”',
        fortune: { lucky: '宜：暂时切断网络拥抱真实肉身、进行手工劳作', taboo: '忌：将自我价值寄托于网络点赞、沉溺虚拟认同', code: 'FREUD-EROS-TECH' }
      };
    }
    if (personaId === 'zhougong') {
      return {
        summary: '卦象显【风地观 · 木出金匮】：金木相克，虚拟虚妄见灵木破土之兆。',
        analysis: '机枢者，金石之器也；藤蔓者，生发之木也。金器不通，木灵从内狂长缠腕，正应五行中“木旺克金，生机破土”。此梦揭示你近期心神多被外物虚妄所耗，灵台蒙尘。藤蔓缠腕，既是羁绊，亦是生机。提醒你切莫因追逐虚名实利而作茧自缚，当还虚入静，走出室内呼吸天地生生之气。',
        quote: '“机巧生于指尖，灵木发于腕上；万法归心，莫逐虚妄之电光。”',
        fortune: { lucky: '宜：漫步植物园、修剪室内盆栽、晨起深呼吸', taboo: '忌：久坐荧屏之前、沉溺虚拟游戏耗费心血', code: 'ZHOUGONG-WOOD-VINE' }
      };
    }
    if (personaId === 'jung') {
      return {
        summary: '【母体复苏与原型觉醒】：自性拒绝被机械规训吞噬的生态回归。',
        analysis: '在荣格看来，手机是现代文明极端理性化的外在造物，而狂长的藤蔓则是原始自然母体（Great Mother）与无意识生命力的古老象征。当绿色藤蔓从冰冷屏幕破壳而出缠绕手腕时，标志着沉睡的心灵原型拒绝被工业逻辑完全同化。你的潜意识正发动一场自发的生态自愈，敦促你从符号的迷宫中抽离，重新连接真实的土地、肉身与直觉。',
        quote: '“当人类的灵魂被冰冷的芯片绑架，大自然的原型便会在梦中破土疯长。”',
        fortune: { lucky: '宜：赤脚踩在草地上、静坐冥想、聆听林间风声', taboo: '忌：过度用理性衡量一切、漠视直觉与身体信号', code: 'JUNG-NATURE-ARCH' }
      };
    }
  }

  // ==================== 默认流派动态个性化生成（深度结合梦境内容） ====================
  if (personaId === 'zhougong') {
    const guaNames = ['【震为雷 · 动而破局】', '【坎为水 · 暗流蓄势】', '【离为火 · 灵光顿悟】', '【兑为泽 · 和悦逢源】', '【巽为风 · 乘势化形】', '【乾为天 · 龙越深渊】', '【坤为地 · 厚德载物】', '【艮为山 · 止损沉淀】'];
    const gua = guaNames[seed % guaNames.length];
    
    return {
      summary: `卦象显${gua}，此梦乃神魂照见“${textSnippet}”、破除现实羁绊之吉兆。`,
      analysis: `观此梦象，你在梦境“${textSnippet}”中所见所感，显化${symNames}之征兆。若以《黄帝内经·素问》的营卫之气推演，暗合量子八卦中的${gua}。近期你在现实中正面临${semantic.detectedTrait}的内在关口。梦中经历“${actionText}”，实则是心神气机正在自我调整，借由意象的震荡为你冲刷陈旧信息冗余。万物皆有回响，守住本心，七日内当见气机转机。`,
      quote: '“天下之象，莫不由心生；梦中之奇，皆为天地借形以相告。”',
      fortune: {
        lucky: '宜：整理案头杂物、顺应天时作息、记录瞬时灵感',
        taboo: '忌：陷入深夜反刍式内耗、执着于不可控细枝末节',
        code: `ZHOUGONG-HEX-${(seed % 899 + 100)}`
      }
    };
  }

  if (personaId === 'freud') {
    return {
      summary: `【本我欲望解构完成】：梦中“${textSnippet}”映射出未竟的情绪代偿。`,
      analysis: `基于经典精神分析理论，你在梦中“${textSnippet}”的情节，是典型【潜意识愿望达成（Wish Fulfillment）】与【防御机制】的运作表征。在现实生活里，由于【超我（Superego）】对你的严格规训，许多关于“${semantic.detectedTrait}”的情绪被强行压抑；而在夜间睡眠期，潜意识借由${symNames}等意象为你构筑了一场代偿性的心理剧场。这种看似荒谬的情节，恰恰反映了心理自我调节机制在高效运转。`,
      quote: '“未被表达的情绪永远不会消亡，终有一天会在梦里以奇迹破土。”',
      fortune: {
        lucky: '宜：痛快满足一次小口腹之欲、勇敢表达真实抗拒',
        taboo: '忌：强行扮演情绪稳定的大人、压抑内心微小呼唤',
        code: `FREUD-ID-${(seed % 899 + 100)}`
      }
    };
  }

  if (personaId === 'jung') {
    return {
      summary: `【自性化节点确认】：梦见“${textSnippet}”，内在原型正在呼唤整合。`,
      analysis: `在分析心理学的理论矩阵中，你的梦境“${textSnippet}”呈现出一场触及【集体无意识】的原型之旅。在此场景下，${symNames}化身为指引你心灵走向【个体化历程（Individuation）】的象征物。梦中经历“${actionText}”，昭示着你正在直面个人的【阴影（Shadow）】与未分化的潜能。潜意识正为你重组分裂的情绪碎片，谋求人格的完整（Wholeness）。`,
      quote: '“向外张望的人在做梦，向内审视的人才是清醒的。”',
      fortune: {
        lucky: '宜：接触大自然呼吸林风、独处冥想15分钟',
        taboo: '忌：过度顺从外部评价、压抑潜意识直觉灵感',
        code: `JUNG-ARCH-${(seed % 899 + 100)}`
      }
    };
  }

  // 默认 roast
  return {
    summary: `【赛博嘴替暴击】：梦里“${textSnippet}”，大脑发疯摸鱼实锤！`,
    analysis: `【反矫情达人评估报告】：啧啧啧，这梦离奇得像大脑皮层多巴胺异常放电！白天在现实里唯唯诺诺应付琐事，晚上跑到梦里搞出“${textSnippet}”这种大场面？又是${actionText}又是折腾${symNames}，剧情离谱得连编剧都不敢这么编！大脑都在替你呐喊：“老子白天干够了，晚上还不能在梦里放飞一下？”与其在这儿瞎琢磨，不如今天早点关机睡觉，少受点现实的窝囊气！`,
    quote: '“生活要是像你的梦一样敢想敢干就好了，至少梦里你敢于打破常规。”',
    fortune: {
      lucky: '宜：大胆拒绝无效社交、早点关灯上床睡觉',
      taboo: '忌：半夜思考宏大哲学、跟烂人烂事纠缠内耗',
      code: 'ROAST-404-LOL'
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

  const prompt = `你是一位顶级解梦大师与心理学学者。
【所选流派】：${persona.name}（${persona.title || ''} · ${persona.tag || ''}）
【流派定位与风格】：${persona.desc}

【用户记录的梦境】：
“${dreamText}”
【情绪基调】：${mood.name}。标签：${selectedTags && selectedTags.length ? selectedTags.join(', ') : '无'}。

【核心任务】：
请你首先深入分析该梦境中的核心情节矛盾、具体物象与潜在心理/现实隐喻；然后深度结合【${persona.name}】的核心理论与流派语言风格，给出极具深度、极其贴合该梦境真实细节的权威解码。严禁千篇一律的通用模板套话，必须精准呼应梦里出现的具体事物（如：找厕所、排泄受阻、推开门、严肃会议室、众人目光等）！

请必须严格按照以下 Markdown 格式输出内容（不要包含任何其他多余文本，严禁使用JSON）：

# 标题
（此处写贴合该梦境与流派风格的精炼标题，不超过10个字）

# 金句
（此处写一句契合该流派风格的核心定论金句）

# 概括
（此处用1-2句话高度凝练梦境的核心象征）

# 解析
（此处写300-500字的详细深度长文，分2-3段。必须第一深入剖析该梦境的核心意象与现实映射，第二彻底结合【${persona.name}】的流派理论与口吻风格，做到直击要害、深刻生动）

# 意象
1. [具体意象名称1]: [结合该梦境与流派理论，深度剖析该意象代表了什么]
2. [具体意象名称2]: [结合该梦境与流派理论，深度剖析该意象代表了什么]
3. [具体意象名称3]: [结合该梦境与流派理论，深度剖析该意象代表了什么]

# 画面描述
（纯英文 Pure English 编写生图提示词。必须精确具象地描绘该梦境中的代表性实体与关键场景，例如推开门看到会议室的情景，控制在40个英文单词内，严禁输出任何中文字符）

# 运势
宜：[契合流派风格的宜行之事]
忌：[契合流派风格的忌讳之事]
代码：[赛博风格代码，如 DRE-404, FREUD-01]
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

            // 健壮的多段落 Markdown 提取算法
            const extractSections = (text) => {
              const sections = {};
              const sectionHeaders = ['标题', '金句', '概括', '解析', '意象', '画面描述', '运势'];
              const regex = /(?:^|\n)#{1,3}\s*([^\n]+)/g;
              let matches = [];
              let m;
              while ((m = regex.exec(text)) !== null) {
                matches.push({ header: m[1].trim(), index: m.index, length: m[0].length });
              }

              for (let i = 0; i < matches.length; i++) {
                const cur = matches[i];
                const next = matches[i + 1];
                let rawContent = text.substring(cur.index + cur.length, next ? next.index : text.length).trim();

                for (const name of sectionHeaders) {
                  if (cur.header.includes(name)) {
                    if (name === '标题' && !rawContent && next && !sectionHeaders.some(k => next.header.includes(k))) {
                      rawContent = next.header.replace(/^#{1,3}\s*/, '').trim();
                    }
                    sections[name] = rawContent;
                    break;
                  }
                }
              }
              return sections;
            };

            const sections = extractSections(content);

            let title = sections['标题'] || '潜意识碎片';
            title = title.replace(/^#{1,3}\s*/, '').replace(/[「」]/g, '').trim();
            if (!title.startsWith('「') && title) {
              title = `「${title}」`;
            }

            const quote = sections['金句'] || '梦是心灵深处的无声倒影。';
            const summary = sections['概括'] || '一场触及潜意识核心冲突的心灵投射。';
            const analysis = sections['解析'] || '解析生成中出现了未知的量子扰动...';

            const rawSymbols = sections['意象'] || '';
            const symbols = [];
            const ICONS = ['✨', '🔮', '🌌', '🧩', '🚪', '🚽', '👥', '👁️', '🎭', '🌀', '🦋'];
            if (rawSymbols) {
              const lines = rawSymbols.split('\n');
              for (const line of lines) {
                const match = line.match(/^\d+[\.、\s]\s*\*?\*?\[?(.*?)\]?\*?\*?[:：]\s*(.*)$/) ||
                              line.match(/^[-*•]\s*\*?\*?\[?(.*?)\]?\*?\*?[:：]\s*(.*)$/);
                if (match) {
                  let name = match[1].replace(/\[|\]|\*|#|“|”/g, '').trim();
                  let desc = match[2].replace(/\[|\]|\*|#/g, '').trim();
                  if (name && desc) {
                    symbols.push({ name, meaning: desc, desc, icon: ICONS[symbols.length % ICONS.length] });
                  }
                }
              }
            }
            if (symbols.length === 0) symbols.push(...semantic.symbols);

            const rawVisualPrompt = sections['画面描述'] || '';
            let visualPrompt = '';
            if (rawVisualPrompt) {
              const cleanPrompt = rawVisualPrompt
                .replace(/^Prompt[:：]\s*/i, '')
                .replace(/["'`]/g, '')
                .trim();
              if (!/[\u4e00-\u9fa5]/.test(cleanPrompt) && cleanPrompt.length > 20) {
                visualPrompt = cleanPrompt;
              }
            }
            if (!visualPrompt) {
              visualPrompt = buildDynamicVisualPrompt(dreamText, semantic, mood);
            }
            const illustrationUrl = generateDreamImageUrl(visualPrompt, seed);

            const rawFortune = sections['运势'] || '';
            let lucky = '宜：静心冥想、顺从内在直觉';
            let taboo = '忌：过度苛求、陷入内耗焦虑';
            let code = 'SYS-OK-2026';
            if (rawFortune) {
              const lMatch = rawFortune.match(/宜[:：]\s*([^\n]+)/);
              const tMatch = rawFortune.match(/忌[:：]\s*([^\n]+)/);
              const cMatch = rawFortune.match(/代码[:：]\s*([^\n]+)/);
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
              visualPrompt,
              illustrationUrl,
              illustrationTitle: '太虚画境 · 梦象映真'
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


async function callDifyApi({ dreamText, personaId, persona, moodId, mood, selectedTags, difyKey, difyUrl }) {
  const seed = simpleHash(dreamText + personaId);
  const semantic = extractSemanticFeatures(dreamText, seed);
  const radar = calculateRadarStats(dreamText, moodId, semantic, seed);
  const neurotransmitters = calculateNeurotransmitters(dreamText, moodId, semantic, seed);
  const visualPrompt = buildDynamicVisualPrompt(dreamText, semantic, mood);
  const illustrationUrl = generateDreamImageUrl(visualPrompt, seed);

  const queryPrompt = `梦境内容：${dreamText}
当前情绪基调：${mood.name}。标签：${selectedTags.join(', ')}。

请必须严格按照以下 Markdown 格式返回你的解析内容（不要包含任何其他多余文本，不要使用JSON格式）：

# 标题
（此处写梦境的意境标题，不超过10个字）
# 金句
（此处写一句充满哲理的金句作为核心定论）
# 概括
（此处用1-2句话高度概括梦境的核心隐喻）
# 解析
（此处写至少300字的详细深度解析长文，分成2-3段落，语气要完全符合【${persona.name}】的流派设定（${persona.desc}），请务必结合你的知识库【周公解梦】进行专业解读）
# 意象
1. [意象名称1]: [深度解析该意象代表了什么]
2. [意象名称2]: [深度解析该意象代表了什么]
# 运势
宜：[此处写宜做什么]
忌：[此处写忌做什么]
代码：[此处写一个幸运代码，如 NEO-99, AWAKE-01]`;

  return new Promise((resolve) => {
    uni.request({
      url: difyUrl,
      method: 'POST',
      header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + difyKey },
      data: {
        inputs: {
          persona: persona.name,
          mood: mood.name
        },
        query: queryPrompt,
        response_mode: 'blocking',
        user: 'cyber-dream-user-' + Date.now()
      },
      success: (res) => {
        if (res.data && res.data.answer) {
          try {
            const content = res.data.answer;
            
            const getSection = (name) => {
              const regex = new RegExp(`# ${name}\\s*([\\s\\S]*?)(?=# |$)`);
              const match = content.match(regex);
              return match ? match[1].trim() : '';
            };

            const title = getSection('标题') || '潜意识碎片';
            const quote = getSection('金句') || '梦境是现实的倒影。';
            const summary = getSection('概括') || '这是一场意义深远的梦境...';
            const analysis = getSection('解析') || 'Dify 知识库解析生成中...';
            
            const rawSymbols = getSection('意象');
            const symbols = [];
            const ICONS = ['✨', '🔮', '🌌', '🧩', '👁️', '🎭', '🌀', '🦋'];
            if (rawSymbols) {
              const lines = rawSymbols.split('\n');
              for (const line of lines) {
                const match = line.match(/^\d+\.\s*\[(.*?)\]:\s*\[(.*?)\]$/) || line.match(/^\d+\.\s*([^:]+):\s*(.*)$/) || line.match(/^-?\s*\*?\*?([^:]+)\*?\*?:\s*(.*)$/);
                if (match) {
                  let name = match[1].replace(/\[|\]|\*|#/g, '').trim();
                  let desc = match[2].replace(/\[|\]|\*|#/g, '').trim();
                  if (name && desc) symbols.push({ name, desc, icon: ICONS[symbols.length % ICONS.length] });
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
              visualPrompt,
              illustrationUrl,
              illustrationTitle: '太虚画境 · 梦象映真'
            });
          } catch(e) {
            console.error('Dify解析梦境失败', e);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      },
      fail: (err) => {
        console.error('Dify请求失败', err);
        resolve(null);
      }
    });
  });
}
