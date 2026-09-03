const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

// Replace script section
const newScript = `
import { ref, computed } from 'vue';
import { getLocalDreamDict, saveToCustomDb, dreamSearchIndex } from '@/store/dictData';
import { useDreamStore } from '@/store/dreamStore';

const dreamStore = useDreamStore();
const searchQuery = ref('');
const localDb = ref(getLocalDreamDict());
const aiRelatedList = ref([]); // AI生成的关联列表

const allTitles = computed(() => {
  const localTitles = localDb.value.map(d => d.title);
  const indexTitles = dreamSearchIndex.filter(t => !localTitles.includes(t));
  let allItems = [
    ...localDb.value.map(d => ({ title: d.title, id: d.id, hasDetail: true })),
    ...indexTitles.map(t => ({ title: t, id: null, hasDetail: false })),
    ...aiRelatedList.value.map(t => ({ title: t, id: null, hasDetail: false }))
  ];
  
  // 去重
  const uniqueItems = [];
  const titlesSet = new Set();
  for (const item of allItems) {
    if (!titlesSet.has(item.title)) {
      titlesSet.add(item.title);
      uniqueItems.push(item);
    }
  }
  return uniqueItems;
});

const filteredList = computed(() => {
  const q = searchQuery.value.trim();
  if (!q) {
    return allTitles.value.filter(item => item.hasDetail);
  }
  
  let matched = allTitles.value.filter(item => item.title.includes(q));
  const targetTitle = q.startsWith('梦见') ? q : '梦见' + q;
  const exactMatch = matched.find(item => item.title === targetTitle);
  
  if (!exactMatch) {
    matched.unshift({ title: targetTitle, id: null, hasDetail: false });
  }
  
  return matched;
});

function onInput() {
  // 输入时清空之前的AI结果，保持体验一致
  // aiRelatedList.value = [];
}

async function onSearch() {
  if (!searchQuery.value) return;
  const q = searchQuery.value.trim();
  const target = q.startsWith('梦见') ? q.replace('梦见', '') : q;
  
  uni.showLoading({ title: 'AI 联想中...' });
  const apiKey = dreamStore.settings?.apiKey;
  
  if (!apiKey || apiKey.trim().length < 10) {
    // 离线Mock关联
    setTimeout(() => {
      uni.hideLoading();
      aiRelatedList.value = [
        \`梦见\${target}\`,
        \`梦见\${target}相关\`,
        \`梦见很多\${target}\`,
        \`梦见天空出现\${target}\`,
        \`梦见\${target}说话\`
      ];
    }, 800);
    return;
  }
  
  const prompt = \`请列出10个关于“\${target}”的具体梦境搜索词，必须以“梦见”开头。仅返回纯JSON数组格式，不要任何其他文字。示例：["梦见\${target}","梦见很多\${target}"]\`;
  
  uni.request({
    url: 'https://api.deepseek.com/v1/chat/completions',
    method: 'POST',
    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    data: {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' } // deepseek某些版本可能需要特殊处理，但普通数组最好不要用json_object限制，或者限制返回 {"list": []}
    },
    success: (res) => {
      uni.hideLoading();
      if (res.data && res.data.choices && res.data.choices.length > 0) {
        try {
          const content = res.data.choices[0].message.content;
          const match = content.match(/\\[.*?\\]/s);
          if (match) {
             aiRelatedList.value = JSON.parse(match[0]);
          } else {
             // 尝试解析 {"list": []}
             const obj = JSON.parse(content);
             if (obj.list) aiRelatedList.value = obj.list;
          }
        } catch(e) {
          console.error('AI关联解析失败', e);
        }
      }
    },
    fail: () => {
      uni.hideLoading();
    }
  });
}

function goToDetail(item) {
  if (item.hasDetail && item.id) {
    uni.navigateTo({ url: \`/pages_sub/dict_detail/dict_detail?id=\${item.id}\` });
  } else {
    goToAiDetail(item.title.replace('梦见', ''));
  }
}

async function goToAiDetail(query) {
  if (!query) return;
  uni.showLoading({ title: 'AI 深度解析中...' });
  const apiKey = dreamStore.settings?.apiKey;
  const q = query;
  const fullTitle = q.startsWith('梦见') ? q : '梦见' + q;

  const saveAndGo = (aiData) => {
    uni.hideLoading();
    const newEntry = {
      id: 'ai_' + Date.now(),
      title: fullTitle,
      count: Math.floor(Math.random() * 5000) + 100,
      summary: aiData.summary || \`\${fullTitle}，通常暗示着你近期在现实生活中对该事物有着潜意识的投射。这可能代表着某种未解决的情绪或即将到来的小变动。\`,
      zhougong: aiData.zhougong || \`《原版周公解梦》：\${fullTitle}，吉凶参半。主心思不定，需防口舌。若是梦中景象祥和，则有意外之喜。\`,
      psychology: aiData.psychology || \`心理学认为，\${fullTitle}在你梦中出现，象征着你内心深处某种被压抑的渴望或恐惧。大脑通过这种意象，试图平衡你白天的认知失调。\`,
      groups: aiData.groups || [
        { name: '👩 孕妇', content: \`孕妇\${fullTitle}，通常与胎儿的健康和未来发展有关，是潜意识对新生命的期待和保护本能的体现。\` },
        { name: '💼 商人', content: \`商人\${fullTitle}，预示着近期生意场上可能会出现新的变数，需要灵活应对，把握商机。\` },
        { name: '🎓 学生', content: \`学生\${fullTitle}，暗示近期学业压力较大，建议劳逸结合，保持良好的学习节奏。\` },
        { name: '💕 恋爱中的人', content: \`恋爱中的人\${fullTitle}，反映了你对感情关系中某些不确定因素的在意，建议多与伴侣坦诚沟通。\` },
        { name: '👨 男性', content: \`男性\${fullTitle}，可能与事业发展或社会角色的压力有关，暗示近期需要更加果断地做出决策。\` },
        { name: '👩 女性', content: \`女性\${fullTitle}，反映了近期对感情或家庭生活的某种期待，建议保持顺其自然的心态。\` }
      ],
      timePeriods: aiData.timePeriods || [
        { name: '前半夜', content: \`前半夜\${fullTitle}，预示你对明天即将面对的事情有所期待或担忧，是日间情绪的延续。\` },
        { name: '后半夜', content: \`后半夜\${fullTitle}，反映了你潜意识深处对某件事的真实态度，值得认真思考。\` },
        { name: '上午', content: \`上午\${fullTitle}，意味着今天可能会遇到与梦境相关的事物或场景，注意留心观察。\` },
        { name: '午睡', content: \`午睡\${fullTitle}，通常是大脑对上午信息的快速整理，不必过于解读。\` },
        { name: '下午', content: \`下午\${fullTitle}，预示近期你的直觉会比较敏锐，适合做重要决定。\` }
      ],
      ages: aiData.ages || [
        { name: '年轻人', content: \`年轻人\${fullTitle}，象征着对新事物的好奇和探索欲，是积极的心理信号。\` },
        { name: '中年人', content: \`中年人\${fullTitle}，可能与家庭责任或事业瓶颈有关，建议适当放松自己。\` },
        { name: '老年人', content: \`老年人\${fullTitle}，多与生活经验的回顾和内心的平静有关，保持乐观心态即可。\` }
      ]
    };
    saveToCustomDb(newEntry);
    localDb.value = getLocalDreamDict();
    uni.navigateTo({ url: \`/pages_sub/dict_detail/dict_detail?id=\${newEntry.id}\` });
  };

  if (!apiKey || apiKey.trim().length < 10) {
    setTimeout(() => saveAndGo({}), 1500);
    return;
  }

  const prompt = \`请作为一个解梦大师，用绝对结构化的JSON格式解析“\${fullTitle}”。必须返回以下JSON格式（不要返回任何其他内容）：
{
  "summary": "1-2句话概括",
  "zhougong": "用古文风格伪造或引用一句《原版周公解梦》并简释",
  "psychology": "从现代心理学角度深度剖析",
  "groups": [{"name": "👩 孕妇", "content": "..."},{"name": "💼 商人", "content": "..."},{"name": "💕 恋爱中的人", "content": "..."}],
  "timePeriods": [{"name": "前半夜", "content": "..."},{"name": "后半夜", "content": "..."},{"name": "午睡", "content": "..."}],
  "ages": [{"name": "年轻人", "content": "..."},{"name": "中年人", "content": "..."},{"name": "老年人", "content": "..."}]
}\`;

  uni.request({
    url: 'https://api.deepseek.com/v1/chat/completions',
    method: 'POST',
    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    data: {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    },
    success: (res) => {
      if (res.data && res.data.choices && res.data.choices.length > 0) {
        try {
          const result = JSON.parse(res.data.choices[0].message.content);
          saveAndGo(result);
        } catch(e) {
          saveAndGo({});
        }
      } else {
        saveAndGo({});
      }
    },
    fail: () => {
      saveAndGo({});
    }
  });
}
`

content = content.replace(/<script setup>[\s\S]*?<\/script>/, `<script setup>\n${newScript}\n</script>`);
fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');