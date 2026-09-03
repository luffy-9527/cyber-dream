const fs = require('fs');

let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

// Replace the entire script section to implement manual search and pagination
const newScript = `
import { ref, computed } from 'vue';
import { getLocalDreamDict, saveToCustomDb, dreamSearchIndex } from '@/store/dictData';
import { useDreamStore } from '@/store/dreamStore';

const dreamStore = useDreamStore();
const searchQuery = ref('');
const localDb = ref(getLocalDreamDict());

const allSearchItems = ref([]); // 存储本次搜索的所有结果（本地+AI）
const currentPage = ref(1);
const pageSize = 10;

// 当前页面展示的列表
const displayedList = computed(() => {
  return allSearchItems.value.slice(0, currentPage.value * pageSize);
});

const hasMore = computed(() => {
  return displayedList.value.length < allSearchItems.value.length;
});

function loadMore() {
  if (hasMore.value) {
    currentPage.value++;
  }
}

function onInput() {
  // 不做任何实时联想，保持界面安静
}

async function onSearch() {
  if (!searchQuery.value) return;
  const q = searchQuery.value.trim();
  const target = q.startsWith('梦见') ? q.replace('梦见', '') : q;
  
  currentPage.value = 1;
  allSearchItems.value = [];
  
  uni.showLoading({ title: 'AI 搜索中...' });
  const apiKey = dreamStore.settings?.apiKey;
  
  // 先把本地和索引里匹配的找出来
  const localTitles = localDb.value.map(d => d.title);
  const indexTitles = dreamSearchIndex.filter(t => !localTitles.includes(t));
  let localItems = [
    ...localDb.value.map(d => ({ title: d.title, id: d.id, hasDetail: true })),
    ...indexTitles.map(t => ({ title: t, id: null, hasDetail: false }))
  ];
  let matched = localItems.filter(item => item.title.includes(q));
  
  if (!apiKey || apiKey.trim().length < 10) {
    uni.hideLoading();
    uni.showToast({ title: '未配置大模型，当前为本地数据', icon: 'none', duration: 2500 });
    
    // 离线Mock数据填充满
    let mockList = [];
    for (let i = 1; i <= 30; i++) {
      mockList.push(\`梦见\${target}的第\${i}种可能\`);
    }
    const targetTitle = q.startsWith('梦见') ? q : '梦见' + q;
    if (!matched.find(i => i.title === targetTitle)) {
      matched.unshift({ title: targetTitle, id: null, hasDetail: false });
    }
    mockList.forEach(t => matched.push({ title: t, id: null, hasDetail: false }));
    allSearchItems.value = deduplicate(matched);
    return;
  }
  
  const prompt = \`请列出30个关于“\${target}”的具体梦境搜索词，必须以“梦见”开头。请仅返回逗号分隔的词语，不要任何其他文字。示例：梦见\${target},梦见很多\${target},梦见买\${target}\`;
  
  uni.request({
    url: dreamStore.settings?.apiUrl || 'https://api.deepseek.com/v1/chat/completions',
    method: 'POST',
    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    data: {
      model: dreamStore.settings?.apiModel || 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }]
    },
    complete: () => { setTimeout(() => uni.hideLoading(), 500); },
    success: (res) => {
      let aiList = [];
      if (res.data && res.data.choices && res.data.choices.length > 0) {
        try {
          const content = res.data.choices[0].message.content;
          // 解析逗号分隔或换行分隔的数据
          const items = content.split(/[,，\\n]/).map(i => i.trim().replace(/[\\[\\]"']/g, '')).filter(i => i && i.startsWith('梦见'));
          aiList = items.map(t => ({ title: t, id: null, hasDetail: false }));
        } catch(e) {
          console.error('AI解析失败', e);
        }
      }
      
      const targetTitle = q.startsWith('梦见') ? q : '梦见' + q;
      if (!matched.find(i => i.title === targetTitle)) {
        matched.unshift({ title: targetTitle, id: null, hasDetail: false });
      }
      
      allSearchItems.value = deduplicate([...matched, ...aiList]);
    }
  });
}

function deduplicate(list) {
  const unique = [];
  const set = new Set();
  for (const item of list) {
    if (!set.has(item.title)) {
      set.add(item.title);
      unique.push(item);
    }
  }
  return unique;
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
    setTimeout(() => uni.hideLoading(), 500);
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
    url: dreamStore.settings?.apiUrl || 'https://api.deepseek.com/v1/chat/completions',
    method: 'POST',
    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    data: {
      model: dreamStore.settings?.apiModel || 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }]
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
`;

content = content.replace(/<script setup>[\s\S]*?<\/script>/, `<script setup>\n${newScript}\n</script>`);

// Update the template to include the "Next Page" button
const loadMoreBtn = `
        <view class="load-more-btn" v-if="hasMore" @click="loadMore">
          <text>下一页</text>
        </view>
        <view class="no-more" v-else-if="allSearchItems.length > 0">
          <text>内容仅供个人娱乐，禁止作为任何参考</text>
        </view>
`;

content = content.replace(/<\/view>\s*<\/view>\s*<\/view>\s*<\/template>/, `${loadMoreBtn}\n      </view>\n    </view>\n  </view>\n</template>`);

// Add the styles for pagination
const newStyles = `
.load-more-btn {
  margin: 30rpx auto;
  width: 80%;
  height: 80rpx;
  background: #f0f0f0;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 28rpx;
}
.no-more {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin: 40rpx 0;
}
</style>
`;
content = content.replace(/<\/style>/, newStyles);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');