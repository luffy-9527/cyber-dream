const fs = require('fs');
let code = fs.readFileSync('src/api/dreamEngine.js', 'utf8');

// Find the start of MOODS and the start of generateDynamicDreamTitle
const startMoods = code.indexOf('export const MOODS =');
const startGenTitle = code.indexOf('function generateDynamicDreamTitle');

if (startMoods !== -1 && startGenTitle !== -1) {
  const newSection = `export const MOODS = [
  { id: 'absurd', name: '荒诞离奇', icon: '🪐', color: '#00f2fe' },
  { id: 'anxiety', name: '压力焦虑', icon: '⚡', color: '#ff2a85' },
  { id: 'healing', name: '温暖治愈', icon: '🌸', color: '#06d6a0' },
  { id: 'cyber', name: '赛博异界', icon: '🤖', color: '#a855f7' },
  { id: 'funny', name: '搞怪中二', icon: '🎭', color: '#ffd166' },
  { id: 'nostalgia', name: '怀旧重演', icon: '🕯️', color: '#f77f00' }
];

export const ELEMENT_TAGS = [
  '坠落失重', '凌空飞行', '被巨物追赶', '迷宫与楼梯', '深海与鲸',
  '考试与迟到', '时钟倒流', '机械与义体', '故人相聚', '星际与黑洞',
  '猫咪与灵兽', '牙齿脱落', '浮空岛屿', '火光与烈焰', '无限电梯'
];

// 高清插画库
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

`;

  code = code.substring(0, startMoods) + newSection + code.substring(startGenTitle);
  fs.writeFileSync('src/api/dreamEngine.js', code, 'utf8');
}
