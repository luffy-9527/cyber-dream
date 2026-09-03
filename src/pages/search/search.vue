
<template>
  <view class="search-container">
    <view class="search-header">
      <view class="search-box">
        <uni-icons type="search" size="18" color="#8c8c8c"></uni-icons>
        <input 
          class="search-input" 
          v-model="searchQuery" 
          placeholder="输入梦境关键词，快速查询" 
          placeholder-style="color:#a8a8a8;"
          @confirm="onSearch"
          
        />
        <text v-if="searchQuery" class="clear-btn" @click="clearSearch">✕</text>
        <button class="search-btn" @click="onSearch">搜索</button>
      </view>
    </view>

    <view class="content-area">
      <view class="section-title" v-if="!hasSearched">
        <text class="title-icon">✧</text>
        <text>精选内容</text>
      </view>
      <view class="section-title" v-else>
        <text class="title-icon">🔍</text>
        <text>搜索结果 ({{ allSearchItems.length }})</text>
      </view>

      <view class="dict-list">
        <view 
          class="dict-item" 
          v-for="(item, idx) in displayedList" 
          :key="idx"
          @click="goToDetail(item)"
        >
          <text class="item-title">{{ item.title }}</text>
          <uni-icons type="right" size="16" color="#d3d3d3"></uni-icons>
        </view>
        
        
      
        <view class="load-more-btn" v-if="hasMore" @click="loadMore">
          <text>下一页</text>
        </view>
        

      </view>
    </view>
  
    <view class="disclaimer-footer">
      <text>内容仅供个人娱乐，禁止作为任何参考</text>
    </view>
</view>
</template>

<script setup>

import { ref, computed, onMounted, watch } from 'vue';
import { getLocalDreamDict, saveToCustomDb, dreamSearchIndex } from '@/store/dictData';
import { useDreamStore } from '@/store/dreamStore';

const dreamStore = useDreamStore();
const searchQuery = ref('');
const hasSearched = ref(false);
const localDb = ref(getLocalDreamDict());

const allSearchItems = ref([]); // items
const currentPage = ref(1);
const pageSize = 10;

// list
const displayedList = computed(() => {
  return allSearchItems.value.slice(0, currentPage.value * pageSize);
});

const hasMore = computed(() => {
  if (!searchQuery.value.trim()) return false;
  return displayedList.value.length < allSearchItems.value.length;
});

function loadMore() {
  if (hasMore.value) {
    currentPage.value++;
  }
}


function initFeatured() {
  hasSearched.value = false;
  const allAvailable = [
    ...localDb.value.map(d => ({ title: d.title, id: d.id, hasDetail: true })),
    ...dreamSearchIndex.map(t => ({ title: t, id: null, hasDetail: false }))
  ];
  const shuffled = allAvailable.sort(() => 0.5 - Math.random());
  allSearchItems.value = deduplicate(shuffled.slice(0, 15));
  currentPage.value = 1;
}

onMounted(() => {
  initFeatured();
});

watch(searchQuery, (newVal) => {
  if (!newVal.trim()) {
    initFeatured();
  }
});



function clearSearch() {
  searchQuery.value = '';
  initFeatured();
}

async function onSearch() {
  if (!searchQuery.value) return;
  const q = searchQuery.value.trim();
  const target = q.startsWith('梦见') ? q.replace('梦见', '') : q;
  
  currentPage.value = 1;
  allSearchItems.value = [];
  hasSearched.value = true;
  
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
      mockList.push(`梦见${target}的第${i}种可能`);
    }
    const targetTitle = q.startsWith('梦见') ? q : '梦见' + q;
    if (!matched.find(i => i.title === targetTitle)) {
      matched.unshift({ title: targetTitle, id: null, hasDetail: false });
    }
    mockList.forEach(t => matched.push({ title: t, id: null, hasDetail: false }));
    allSearchItems.value = deduplicate(matched);
    return;
  }
  
  const prompt = `请列出30个关于“${target}”的具体梦境搜索词，必须以“梦见”开头。请仅返回逗号分隔的词语，不要任何其他文字。示例：梦见${target},梦见很多${target},梦见买${target}`;
  
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
          const items = content.split(/[,，\n]/).map(i => i.trim().replace(/^[0-9.、\s-]+/, '').replace(/[\[\]"']/g, '')).filter(i => i && i.includes('梦见')).map(i => '梦见' + i.split('梦见')[1]);
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
    uni.navigateTo({ url: `/pages_sub/dict_detail/dict_detail?id=${item.id}` });
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
      summary: aiData.summary || `${fullTitle}，通常暗示着你近期在现实生活中对该事物有着潜意识的投射。这可能代表着某种未解决的情绪或即将到来的小变动。`,
      zhougong: aiData.zhougong || `《原版周公解梦》：${fullTitle}，吉凶参半。主心思不定，需防口舌。若是梦中景象祥和，则有意外之喜。`,
      psychology: aiData.psychology || `心理学认为，${fullTitle}在你梦中出现，象征着你内心深处某种被压抑的渴望或恐惧。大脑通过这种意象，试图平衡你白天的认知失调。`,
      groups: aiData.groups || [
        { name: '👩 孕妇', content: `孕妇${fullTitle}，通常与胎儿的健康和未来发展有关，是潜意识对新生命的期待和保护本能的体现。` },
        { name: '💼 商人', content: `商人${fullTitle}，预示着近期生意场上可能会出现新的变数，需要灵活应对，把握商机。` },
        { name: '🎓 学生', content: `学生${fullTitle}，暗示近期学业压力较大，建议劳逸结合，保持良好的学习节奏。` },
        { name: '💕 恋爱中的人', content: `恋爱中的人${fullTitle}，反映了你对感情关系中某些不确定因素的在意，建议多与伴侣坦诚沟通。` },
        { name: '👨 男性', content: `男性${fullTitle}，可能与事业发展或社会角色的压力有关，暗示近期需要更加果断地做出决策。` },
        { name: '👩 女性', content: `女性${fullTitle}，反映了近期对感情或家庭生活的某种期待，建议保持顺其自然的心态。` }
      ],
      timePeriods: aiData.timePeriods || [
        { name: '前半夜', content: `前半夜${fullTitle}，预示你对明天即将面对的事情有所期待或担忧，是日间情绪的延续。` },
        { name: '后半夜', content: `后半夜${fullTitle}，反映了你潜意识深处对某件事的真实态度，值得认真思考。` },
        { name: '上午', content: `上午${fullTitle}，意味着今天可能会遇到与梦境相关的事物或场景，注意留心观察。` },
        { name: '午睡', content: `午睡${fullTitle}，通常是大脑对上午信息的快速整理，不必过于解读。` },
        { name: '下午', content: `下午${fullTitle}，预示近期你的直觉会比较敏锐，适合做重要决定。` }
      ],
      ages: aiData.ages || [
        { name: '年轻人', content: `年轻人${fullTitle}，象征着对新事物的好奇和探索欲，是积极的心理信号。` },
        { name: '中年人', content: `中年人${fullTitle}，可能与家庭责任或事业瓶颈有关，建议适当放松自己。` },
        { name: '老年人', content: `老年人${fullTitle}，多与生活经验的回顾和内心的平静有关，保持乐观心态即可。` }
      ]
    };
    saveToCustomDb(newEntry);
    localDb.value = getLocalDreamDict();
    uni.navigateTo({ url: `/pages_sub/dict_detail/dict_detail?id=${newEntry.id}` });
  };

  if (!apiKey || apiKey.trim().length < 10) {
    setTimeout(() => saveAndGo({}), 1500);
    return;
  }

  const prompt = `请作为一个解梦大师，用绝对结构化的JSON格式解析“${fullTitle}”。必须返回以下JSON格式（不要返回任何其他内容）：
{
  "summary": "1-2句话概括",
  "zhougong": "用古文风格伪造或引用一句《原版周公解梦》并简释",
  "psychology": "从现代心理学角度深度剖析",
  "groups": [{"name": "👩 孕妇", "content": "..."},{"name": "💼 商人", "content": "..."},{"name": "💕 恋爱中的人", "content": "..."}],
  "timePeriods": [{"name": "前半夜", "content": "..."},{"name": "后半夜", "content": "..."},{"name": "午睡", "content": "..."}],
  "ages": [{"name": "年轻人", "content": "..."},{"name": "中年人", "content": "..."},{"name": "老年人", "content": "..."}]
}`;

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

</script>

<style scoped>
.search-container {
  min-height: 100vh;
  background-color: #f9f6f0;
  padding: 30rpx;
  box-sizing: border-box;
}

.search-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(249, 246, 240, 0.95);
  backdrop-filter: blur(10px);
  padding-bottom: 20rpx;
}

.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 40rpx;
  padding: 10rpx 10rpx 10rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(188, 49, 44, 0.1);
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #1d3557;
  margin: 0 20rpx;
}

.clear-btn {
  color: #aaa;
  font-size: 28rpx;
  padding: 0 16rpx;
}

.search-btn {
  background: linear-gradient(135deg, #bc312c, #8a1f1b);
  color: #fff;
  font-size: 28rpx;
  border-radius: 30rpx;
  padding: 0 40rpx;
  margin: 0;
  line-height: 60rpx;
  border: none;
}
.search-btn::after {
  display: none;
}

.content-area {
  margin-top: 30rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.02);
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #1d3557;
  margin-bottom: 30rpx;
}

.title-icon {
  color: #bc312c;
  margin-right: 10rpx;
  font-size: 36rpx;
}

.dict-list {
  display: flex;
  flex-direction: column;
}

.dict-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dict-item:last-child {
  border-bottom: none;
}

.item-title {
  font-size: 30rpx;
  color: #333;
}

.empty-state {
  padding: 60rpx 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-text {
  color: #8c8c8c;
  font-size: 26rpx;
  margin-bottom: 30rpx;
}

.ai-btn {
  background: rgba(188, 49, 44, 0.1);
  color: #bc312c;
  font-size: 26rpx;
  border-radius: 30rpx;
  padding: 0 40rpx;
  line-height: 60rpx;
  border: 1px solid rgba(188, 49, 44, 0.2);
}
.ai-btn::after {
  display: none;
}

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

.disclaimer-footer {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  padding: 40rpx 0;
  width: 100%;
}
</style>


