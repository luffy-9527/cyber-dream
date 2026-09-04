<template>
  <view class="search-page-container">
    <view class="vertical-deco">格物索微 · 潜心穷理</view>

    <!-- 顶部 Header 品牌索隐典阁 -->
    <view class="hero-header">
      <view class="top-aesthetic-bar">
        <text class="cloud-icon">༄</text>
        <view class="time-stamp">
          <text class="bar-title">周天象纬 · 潜意识万象索隐</text>
        </view>
        <text class="cloud-icon flip">༄</text>
      </view>

      <view class="header-top-row">
        <text class="hero-title">解梦辞典</text>
        <text class="header-seal">典藏</text>
      </view>
      <text class="hero-sub">录存周公典籍、心理学原型与千古梦兆释义</text>
    </view>

    <!-- 搜索输入框: 文房砚水·朱砂索隐 -->
    <view class="search-section">
      <view class="oriental-search-box">
        <text class="search-prefix">❖</text>
        <input 
          :key="inputKey"
          class="search-input" 
          :value="searchQuery"
          @input="onInput"
          placeholder="输入梦象关键词，如：掉牙、蛇、飞翔..." 
          placeholder-style="color: #a6988c; font-family: 'STKaiti', serif;"
          @confirm="onSearch"
        />
        <text v-if="searchQuery" class="clear-btn" @click="clearSearch">✕</text>
        <button class="search-btn" @click="onSearch">
          <text class="btn-glyph">✦</text>
          <text>索隐</text>
        </button>
      </view>
    </view>

    <!-- 部类云签横向滚动 (周天部类) -->
    <scroll-view class="category-scroll" scroll-x="true" show-scrollbar="false">
      <view class="category-list">
        <view 
          v-for="cat in CATEGORIES" 
          :key="cat.id"
          class="category-chip"
          :class="{ active: currentCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <text class="cat-icon">{{ cat.icon }}</text>
          <text class="cat-name">{{ cat.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 热索梦象词云 (仅在未主动搜索且在全部部类时展示) -->
    <view class="hot-tags-section" v-if="!hasSearched && currentCategory === 'all'">
      <view class="hot-title-row">
        <text class="hot-dot">✦</text>
        <text class="hot-title">热索梦兆</text>
      </view>
      <view class="hot-tags-wrap">
        <view 
          class="hot-tag" 
          v-for="(tag, idx) in HOT_TAGS" 
          :key="idx"
          @click="quickSearch(tag)"
        >
          <text class="hot-tag-text">{{ tag }}</text>
        </view>
      </view>
    </view>

    <!-- 主体列表区域 -->
    <view class="content-area">
      <view class="section-title-row">
        <view class="title-left">
          <text class="sec-symbol">❖</text>
          <text class="sec-title" v-if="!hasSearched">
            {{ currentCategoryName }} ({{ allSearchItems.length }})
          </text>
          <text class="sec-title" v-else>
            索隐结果 ({{ allSearchItems.length }})
          </text>
        </view>
        <text class="count-tag">{{ displayedList.length }}/{{ allSearchItems.length }} 签</text>
      </view>

      <!-- 词条卡片列表 (太虚锦签) -->
      <view class="dict-list" v-if="displayedList.length > 0">
        <view 
          class="dict-card" 
          v-for="(item, idx) in displayedList" 
          :key="idx"
          @click="goToDetail(item)"
        >
          <view class="card-spine"></view>
          <view class="card-main">
            <view class="card-top-row">
              <text class="item-title">{{ item.title }}</text>
              <text class="item-badge" :class="item.hasDetail ? 'badge-local' : 'badge-ai'">
                {{ item.hasDetail ? '周公典藏' : '意象溯源' }}
              </text>
            </view>
            <text class="item-desc">
              {{ item.summary ? item.summary : '周公云：心之所向，皆为梦兆 · 点击开启专属推演' }}
            </text>
          </view>
          <view class="card-action">
            <text class="action-text">详析</text>
            <text class="action-arrow">➔</text>
          </view>
        </view>

        <!-- 翻阅下一卷 / 加载更多 -->
        <view class="load-more-box" v-if="hasMore" @click="loadMore">
          <text class="more-icon">📜</text>
          <text class="more-text">翻阅下一卷 (已阅 {{ displayedList.length }} / 共 {{ allSearchItems.length }})</text>
          <text class="more-arrow">➔</text>
        </view>
        <view class="no-more-box" v-else-if="allSearchItems.length > 0">
          <text class="no-more-line"></text>
          <text class="no-more-text">~ 已阅毕本卷 ~</text>
          <text class="no-more-line"></text>
        </view>
      </view>

      <!-- 空结果状态 & AI深度推演入口 -->
      <view class="empty-state" v-else>
        <text class="empty-glyph">🪐</text>
        <text class="empty-title">典阁中未寻得“{{ searchQuery }}”之定本</text>
        <text class="empty-sub">太虚万象，梦境千变。可由 AI 宗师为您即刻开坛推演释义。</text>
        <button class="ai-deduce-btn" @click="goToAiDetail(searchQuery)">
          <text class="btn-glyph">✦</text>
          <text>开启 AI 宗师深度推演</text>
        </button>
      </view>
    </view>

    <!-- 底部免责声明 -->
    <view class="disclaimer-footer">
      <text>内容仅供个人娱乐，禁止作为任何参考</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getLocalDreamDict, saveToCustomDb, dreamSearchIndex } from '@/store/dictData';
import { useDreamStore } from '@/store/dreamStore';

const dreamStore = useDreamStore();
const searchQuery = ref('');
const inputKey = ref(1);
const hasSearched = ref(false);
const localDb = ref(getLocalDreamDict());

const allSearchItems = ref([]);
const currentPage = ref(1);
const pageSize = 12;

const CATEGORIES = [
  { id: 'all', name: '全部锦签', icon: '🏮' },
  { id: 'animal', name: '灵兽生灵', icon: '🐾', keywords: ['虎', '蛇', '狗', '猫', '鱼', '鸟', '鹰', '乌鸦', '蝴蝶', '蜜蜂', '蜘蛛', '蟑螂', '蚂蚁', '老鼠', '蝎子', '马', '牛', '猪', '羊', '兔', '龙', '凤', '恐龙'] },
  { id: 'nature', name: '天文山水', icon: '🌊', keywords: ['水', '雨', '雪', '雷', '电', '地震', '海啸', '风', '火', '日', '太阳', '月', '星', '彩虹', '云', '海', '河', '山', '树', '花', '草', '桃', '果'] },
  { id: 'items', name: '财宝百工', icon: '🪙', keywords: ['金', '钱', '戒指', '钻石', '车', '房', '棺', '坟', '刀', '枪', '镜', '钥匙', '衣', '鞋', '船', '飞机', '手机'] },
  { id: 'body', name: '身体神魂', icon: '👁️', keywords: ['牙', '发', '血', '伤', '病', '孕', '疼', '吐', '飞', '坠', '死', '鬼', '僵尸'] },
  { id: 'events', name: '人事际遇', icon: '⛩️', keywords: ['考', '学', '婚', '恋', '亲人', '爸', '妈', '朋', '同', '追', '杀', '吵', '哭', '笑', '走', '班', '工', '迷路', '厕所'] }
];

const HOT_TAGS = [
  '梦见掉牙', '梦见蛇', '梦见捡到黄金戒指', '梦见飞翔', '梦见大水',
  '梦见死人', '梦见老虎', '梦见下雨', '梦见黑猫', '梦见考试'
];

const currentCategory = ref('all');

const currentCategoryName = computed(() => {
  const cat = CATEGORIES.find(c => c.id === currentCategory.value);
  return cat ? cat.name : '精选典藏';
});

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

function selectCategory(catId) {
  currentCategory.value = catId;
  searchQuery.value = '';
  initCategoryItems();
}

function initCategoryItems() {
  hasSearched.value = false;
  const localMap = new Map();
  localDb.value.forEach(d => {
    localMap.set(d.title, { title: d.title, id: d.id, hasDetail: true, summary: d.summary || '' });
  });

  const combined = [...localDb.value.map(d => ({ title: d.title, id: d.id, hasDetail: true, summary: d.summary || '' }))];
  dreamSearchIndex.forEach(t => {
    if (!localMap.has(t)) {
      combined.push({ title: t, id: null, hasDetail: false, summary: '' });
    }
  });

  let list = deduplicate(combined);
  if (currentCategory.value !== 'all') {
    const cat = CATEGORIES.find(c => c.id === currentCategory.value);
    if (cat && cat.keywords) {
      list = list.filter(item => cat.keywords.some(k => item.title.includes(k)));
    }
  } else {
    // 默认乱序以展示多部类的精彩梦象
    list = list.sort(() => 0.5 - Math.random());
  }

  allSearchItems.value = list;
  currentPage.value = 1;
}

function onInput(e) {
  searchQuery.value = e.detail?.value || '';
}

onShow(() => {
  // 每次进入/返回到解梦辞典页面，重置原生输入组件并清空搜索栏文本
  searchQuery.value = '';
  hasSearched.value = false;
  inputKey.value = Date.now();
  localDb.value = getLocalDreamDict();
  initCategoryItems();
});

onMounted(() => {
  initCategoryItems();
});

watch(searchQuery, (newVal) => {
  if (!newVal.trim()) {
    initCategoryItems();
  }
});

function clearSearch() {
  searchQuery.value = '';
  hasSearched.value = false;
  inputKey.value = Date.now();
  initCategoryItems();
}

function quickSearch(tag) {
  searchQuery.value = tag;
  inputKey.value = Date.now();
  onSearch();
}

async function onSearch() {
  if (!searchQuery.value) return;
  const q = searchQuery.value.trim();
  const target = q.startsWith('梦见') ? q.replace('梦见', '') : q;
  
  currentPage.value = 1;
  allSearchItems.value = [];
  hasSearched.value = true;
  
  uni.showLoading({ title: '索隐推演中...' });
  const apiKey = dreamStore.settings?.apiKey;
  
  const localMap = new Map();
  localDb.value.forEach(d => {
    localMap.set(d.title, { title: d.title, id: d.id, hasDetail: true, summary: d.summary || '' });
  });

  let localItems = [...localDb.value.map(d => ({ title: d.title, id: d.id, hasDetail: true, summary: d.summary || '' }))];
  dreamSearchIndex.forEach(t => {
    if (!localMap.has(t)) {
      localItems.push({ title: t, id: null, hasDetail: false, summary: '' });
    }
  });

  let matched = localItems.filter(item => item.title.includes(q));
  
  if (!apiKey || apiKey.trim().length < 10) {
    uni.hideLoading();
    
    let mockList = [];
    for (let i = 1; i <= 20; i++) {
      mockList.push(`梦见${target}的第${i}种机缘`);
    }
    const targetTitle = q.startsWith('梦见') ? q : '梦见' + q;
    if (!matched.find(i => i.title === targetTitle)) {
      matched.unshift({ title: targetTitle, id: null, hasDetail: false, summary: '' });
    }
    mockList.forEach(t => matched.push({ title: t, id: null, hasDetail: false, summary: '' }));
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
    complete: () => { setTimeout(() => uni.hideLoading(), 400); },
    success: (res) => {
      let aiList = [];
      if (res.data && res.data.choices && res.data.choices.length > 0) {
        try {
          const content = res.data.choices[0].message.content;
          const items = content.split(/[,，\n]/).map(i => i.trim().replace(/^[0-9.、\s-]+/, '').replace(/[\[\]"']/g, '')).filter(i => i && i.includes('梦见')).map(i => '梦见' + i.split('梦见')[1]);
          aiList = items.map(t => ({ title: t, id: null, hasDetail: false, summary: '' }));
        } catch(e) {
          console.error('AI解析失败', e);
        }
      }
      
      const targetTitle = q.startsWith('梦见') ? q : '梦见' + q;
      if (!matched.find(i => i.title === targetTitle)) {
        matched.unshift({ title: targetTitle, id: null, hasDetail: false, summary: '' });
      }
      
      allSearchItems.value = deduplicate([...matched, ...aiList]);
    },
    fail: () => {
      const targetTitle = q.startsWith('梦见') ? q : '梦见' + q;
      if (!matched.find(i => i.title === targetTitle)) {
        matched.unshift({ title: targetTitle, id: null, hasDetail: false, summary: '' });
      }
      allSearchItems.value = deduplicate(matched);
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
  uni.showLoading({ title: 'AI 宗师推演中...' });
  const apiKey = dreamStore.settings?.apiKey;
  const q = query;
  const fullTitle = q.startsWith('梦见') ? q : '梦见' + q;

  const saveAndGo = (aiData) => {
    setTimeout(() => uni.hideLoading(), 400);
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
    setTimeout(() => saveAndGo({}), 1200);
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

<style lang="scss" scoped>
.search-page-container {
  min-height: 100vh;
  background: radial-gradient(circle at 50% 0%, #ffffff 0%, #f4eee6 60%, #e6dfd3 100%) no-repeat;
  background-attachment: fixed;
  padding: 30rpx 28rpx 20rpx;
  position: relative;
  box-sizing: border-box;
}

/* 竖排古典诗号装饰 */
.vertical-deco {
  position: absolute;
  top: 40rpx;
  right: 16rpx;
  font-size: 26rpx;
  color: rgba(188, 49, 44, 0.28);
  font-family: "STKaiti", "KaiTi", serif;
  letter-spacing: 12rpx;
  writing-mode: vertical-rl;
  z-index: 2;
  pointer-events: none;
}

/* 顶部 Header 品牌 */
.hero-header {
  text-align: center;
  margin-bottom: 28rpx;
  position: relative;
  z-index: 3;

  .top-aesthetic-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 14rpx;

    .cloud-icon {
      font-size: 24rpx;
      color: #c2956e;
      font-weight: 300;

      &.flip {
        transform: scaleX(-1);
        display: inline-block;
      }
    }

    .time-stamp {
      display: flex;
      align-items: center;
      padding: 4rpx 18rpx;
      border: 1px solid rgba(194, 149, 110, 0.35);
      border-radius: 6rpx;
      background: rgba(194, 149, 110, 0.05);

      .bar-title {
        font-size: 20rpx;
        color: #8a7369;
        font-family: "STKaiti", "KaiTi", serif;
        letter-spacing: 2rpx;
      }
    }
  }

  .header-top-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14rpx;
    margin-bottom: 10rpx;

    .hero-title {
      font-size: 52rpx;
      font-weight: 900;
      color: #261c15;
      letter-spacing: 10rpx;
      font-family: "STZhongsong", "SimSun", serif;
      text-shadow: 0 4rpx 12rpx rgba(194, 149, 110, 0.15);
    }

    .header-seal {
      font-size: 18rpx;
      color: #bc312c;
      border: 1.5rpx solid #bc312c;
      background: rgba(188, 49, 44, 0.08);
      padding: 2rpx 8rpx;
      border-radius: 4rpx;
      font-family: "STKaiti", "KaiTi", serif;
      font-weight: bold;
      transform: rotate(-4deg);
      letter-spacing: 2rpx;
    }
  }

  .hero-sub {
    font-size: 24rpx;
    color: #6c635e;
    letter-spacing: 3rpx;
    font-family: "STKaiti", "KaiTi", serif;
  }
}

/* 搜索框 (文房砚水·朱砂索隐) */
.search-section {
  position: relative;
  z-index: 5;
  margin-bottom: 24rpx;

  .oriental-search-box {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-radius: 44rpx;
    padding: 10rpx 12rpx 10rpx 28rpx;
    border: 1.5rpx solid rgba(194, 149, 110, 0.4);
    box-shadow: 0 8rpx 28rpx rgba(120, 90, 60, 0.06), inset 0 0 0 1rpx rgba(255, 255, 255, 0.8);
    transition: all 0.3s;

    .search-prefix {
      font-size: 24rpx;
      color: #b88651;
      margin-right: 12rpx;
    }

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #261c15;
      font-family: "STKaiti", "KaiTi", sans-serif;
    }

    .clear-btn {
      font-size: 26rpx;
      color: #9c8e84;
      padding: 0 16rpx;
    }

    .search-btn {
      background: linear-gradient(135deg, #c2956e 0%, #a67b45 100%);
      color: #ffffff;
      font-size: 26rpx;
      font-family: "STZhongsong", "STKaiti", serif;
      letter-spacing: 2rpx;
      border-radius: 36rpx;
      padding: 0 32rpx;
      height: 68rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      box-shadow: 0 4rpx 16rpx rgba(194, 149, 110, 0.35);
      border: none;
      margin: 0;
      line-height: 1;

      &:active {
        transform: scale(0.96);
        box-shadow: 0 2rpx 8rpx rgba(194, 149, 110, 0.25);
      }

      .btn-glyph {
        font-size: 20rpx;
        color: #fff6e8;
      }
    }
  }
}

/* 部类云签横向滚动 */
.category-scroll {
  white-space: nowrap;
  margin-bottom: 24rpx;

  .category-list {
    display: inline-flex;
    gap: 16rpx;
    padding: 4rpx 2rpx;

    .category-chip {
      display: flex;
      align-items: center;
      gap: 10rpx;
      background: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1.5rpx solid rgba(194, 149, 110, 0.28);
      border-radius: 32rpx;
      padding: 12rpx 24rpx;
      box-shadow: 0 4rpx 12rpx rgba(110, 85, 60, 0.04);
      transition: all 0.25s;

      .cat-icon {
        font-size: 24rpx;
      }

      .cat-name {
        font-size: 24rpx;
        color: #5a4e44;
        font-family: "STKaiti", "KaiTi", serif;
        font-weight: 600;
        letter-spacing: 1rpx;
      }

      &.active {
        background: linear-gradient(135deg, #bc312c 0%, #a12b26 100%);
        border-color: #a12b26;
        box-shadow: 0 6rpx 20rpx rgba(188, 49, 44, 0.28);
        transform: translateY(-2rpx);

        .cat-name {
          color: #ffffff;
          font-weight: bold;
        }
      }
    }
  }
}

/* 热索梦象 */
.hot-tags-section {
  margin-bottom: 24rpx;
  padding: 0 6rpx;

  .hot-title-row {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 14rpx;

    .hot-dot {
      font-size: 20rpx;
      color: #bc312c;
    }

    .hot-title {
      font-size: 22rpx;
      color: #8a7369;
      font-family: "STKaiti", "KaiTi", serif;
      letter-spacing: 2rpx;
    }
  }

  .hot-tags-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .hot-tag {
      background: rgba(255, 255, 255, 0.65);
      border: 1rpx solid rgba(194, 149, 110, 0.25);
      border-radius: 24rpx;
      padding: 8rpx 20rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.02);
      transition: all 0.2s;

      .hot-tag-text {
        font-size: 22rpx;
        color: #6b584a;
        font-family: "STKaiti", "KaiTi", serif;
      }

      &:active {
        background: rgba(188, 49, 44, 0.08);
        border-color: #bc312c;
        .hot-tag-text {
          color: #bc312c;
        }
      }
    }
  }
}

/* 主体列表区域 (太虚画卷底衬) */
.content-area {
  background: rgba(254, 251, 246, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 24rpx;
  padding: 30rpx 24rpx;
  border: 1.5rpx solid rgba(194, 149, 110, 0.35);
  box-shadow: 0 8rpx 32rpx rgba(120, 90, 60, 0.05), inset 0 0 0 1rpx rgba(255, 255, 255, 0.9);

  .section-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    padding-bottom: 16rpx;
    border-bottom: 1px dashed rgba(184, 134, 81, 0.22);

    .title-left {
      display: flex;
      align-items: center;
      gap: 10rpx;

      .sec-symbol {
        font-size: 22rpx;
        color: #b58252;
      }

      .sec-title {
        font-size: 30rpx;
        font-weight: 900;
        color: #261c15;
        letter-spacing: 2rpx;
        font-family: "STZhongsong", "SimSun", serif;
      }
    }

    .count-tag {
      font-size: 20rpx;
      color: #9c8e84;
      font-family: "STKaiti", "KaiTi", serif;
    }
  }
}

/* 词条卡片列表 (太虚锦签) */
.dict-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;

  .dict-card {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.78);
    border-radius: 16rpx;
    border: 1.5rpx solid rgba(194, 149, 110, 0.25);
    box-shadow: 0 4rpx 14rpx rgba(130, 100, 75, 0.04);
    position: relative;
    overflow: hidden;
    transition: all 0.2s;
    padding: 22rpx 20rpx 22rpx 26rpx;

    &:active {
      transform: translateY(1rpx);
      background: rgba(255, 255, 255, 0.95);
      border-color: rgba(188, 49, 44, 0.4);
    }

    .card-spine {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 8rpx;
      background: linear-gradient(to bottom, #c2956e, #bc312c);
    }

    .card-main {
      flex: 1;
      margin-right: 16rpx;

      .card-top-row {
        display: flex;
        align-items: center;
        gap: 12rpx;
        margin-bottom: 8rpx;

        .item-title {
          font-size: 30rpx;
          font-weight: 900;
          color: #261c15;
          letter-spacing: 2rpx;
          font-family: "STZhongsong", "SimSun", serif;
        }

        .item-badge {
          font-size: 18rpx;
          padding: 2rpx 10rpx;
          border-radius: 4rpx;
          font-family: "STKaiti", "KaiTi", serif;
          font-weight: 600;
          letter-spacing: 1rpx;

          &.badge-local {
            color: #bc312c;
            background: rgba(188, 49, 44, 0.08);
            border: 1rpx solid rgba(188, 49, 44, 0.35);
          }

          &.badge-ai {
            color: #936838;
            background: rgba(194, 149, 110, 0.1);
            border: 1rpx solid rgba(194, 149, 110, 0.35);
          }
        }
      }

      .item-desc {
        font-size: 22rpx;
        color: #82756c;
        line-height: 1.5;
        font-family: "STKaiti", "KaiTi", serif;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    .card-action {
      display: flex;
      align-items: center;
      gap: 4rpx;
      color: #b88651;
      flex-shrink: 0;

      .action-text {
        font-size: 22rpx;
        font-family: "STKaiti", "KaiTi", serif;
        font-weight: 600;
      }

      .action-arrow {
        font-size: 20rpx;
      }
    }
  }
}

/* 翻阅下一卷 */
.load-more-box {
  margin-top: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  background: rgba(246, 239, 226, 0.85);
  border: 1.5rpx solid rgba(194, 149, 110, 0.4);
  border-radius: 40rpx;
  padding: 20rpx 0;
  box-shadow: 0 4rpx 12rpx rgba(120, 90, 60, 0.05);
  transition: all 0.2s;

  &:active {
    background: rgba(238, 228, 211, 0.95);
    transform: scale(0.98);
  }

  .more-icon {
    font-size: 26rpx;
  }

  .more-text {
    font-size: 24rpx;
    color: #5a493b;
    font-family: "STKaiti", "KaiTi", serif;
    font-weight: 600;
    letter-spacing: 1rpx;
  }

  .more-arrow {
    font-size: 22rpx;
    color: #b88651;
  }
}

.no-more-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-top: 28rpx;
  margin-bottom: 8rpx;

  .no-more-line {
    width: 80rpx;
    height: 1rpx;
    background: rgba(184, 134, 81, 0.3);
  }

  .no-more-text {
    font-size: 22rpx;
    color: #a6988c;
    font-family: "STKaiti", "KaiTi", serif;
    letter-spacing: 2rpx;
  }
}

/* 空结果状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 20rpx;
  text-align: center;

  .empty-glyph {
    font-size: 72rpx;
    margin-bottom: 20rpx;
    opacity: 0.75;
  }

  .empty-title {
    font-size: 28rpx;
    font-weight: 900;
    color: #261c15;
    font-family: "STZhongsong", "SimSun", serif;
    margin-bottom: 12rpx;
  }

  .empty-sub {
    font-size: 24rpx;
    color: #82756c;
    font-family: "STKaiti", "KaiTi", serif;
    line-height: 1.6;
    margin-bottom: 36rpx;
    max-width: 520rpx;
  }

  .ai-deduce-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    background: linear-gradient(135deg, #bc312c 0%, #8c2020 100%);
    color: #ffffff;
    border-radius: 40rpx;
    padding: 0 44rpx;
    height: 76rpx;
    font-size: 26rpx;
    font-family: "STKaiti", "KaiTi", serif;
    font-weight: bold;
    letter-spacing: 2rpx;
    box-shadow: 0 6rpx 20rpx rgba(188, 49, 44, 0.3);
    border: none;
    margin: 0;

    &:active {
      transform: scale(0.96);
      box-shadow: 0 2rpx 8rpx rgba(188, 49, 44, 0.2);
    }

    .btn-glyph {
      font-size: 22rpx;
    }
  }
}

/* 底部免责声明 */
.disclaimer-footer {
  text-align: center;
  font-size: 22rpx;
  color: #a6988c;
  font-family: "STKaiti", "KaiTi", serif;
  letter-spacing: 1rpx;
  padding: 16rpx 0 20rpx;
  width: 100%;
}
</style>


