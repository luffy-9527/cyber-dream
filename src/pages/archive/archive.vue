<template>
  <view class="archive-page-container" :class="{ 'is-empty-page': filteredList.length === 0 }">
    <view class="content-wrapper">
      <!-- 顶部品牌题跋 -->
      <view class="hero-header">
        <!-- 竖排古典题跋装饰（双行古典引首题跋，避免过长被卡片遮挡） -->
        <view class="vertical-deco">
          <text class="deco-col">千秋大梦</text>
          <text class="deco-col">尽归卷牒</text>
        </view>

        <view class="top-aesthetic-bar">
          <text class="cloud-icon">༄</text>
          <view class="time-stamp">
            <text class="bar-title">太虚灵牒 · 潜意识万象编年史</text>
          </view>
          <text class="cloud-icon flip">༄</text>
        </view>

        <view class="header-top-row">
          <text class="hero-title">梦境档案</text>
          <text class="header-seal">秘卷</text>
        </view>
        <text class="hero-sub">观诸相幻化，记往昔神魂之遨游</text>
      </view>

      <!-- 梦阁玑衡 · 潜意识数据盘 (三才星衡) -->
      <view class="stats-card">
        <view class="corner top-left"></view>
        <view class="corner top-right"></view>
        <view class="corner bottom-left"></view>
        <view class="corner bottom-right"></view>

        <view class="stats-header">
          <view class="header-left">
            <text class="sec-glyph">❖</text>
            <text class="stats-title">灵犀星衡</text>
          </view>
          <text class="stats-badge">已载录 {{ dreamStore.totalDreamsCount }} 卷梦兆</text>
        </view>

        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-num">{{ dreamStore.totalDreamsCount }}</text>
            <text class="stat-label">总入梦历</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num num-fav">{{ dreamStore.favoriteIds.length }}</text>
            <text class="stat-label">星标锦藏</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num num-mood">{{ topMoodName }}</text>
            <text class="stat-label">主运心境</text>
          </view>
        </view>
      </view>

      <!-- 隐私箴言木牌与清空操作 -->
      <view class="privacy-banner">
        <view class="privacy-text">
          <text class="icon">🔒</text>
          <text class="text">梦蝶无痕：全部记录仅加密锁存本地，不渡外尘。</text>
        </view>
        <view class="clear-action" @tap="handleClearAll">
          <text class="icon">🗑️</text>
          <text class="text">焚卷清除</text>
        </view>
      </view>

      <!-- 搜索与筛选分栏 -->
      <view class="filter-section">
        <view class="oriental-search-box">
          <text class="search-prefix">❖</text>
          <input
            v-model="searchKeyword"
            placeholder="搜索输入的梦境内容、关键词..."
            placeholder-style="color: #a6988c; font-family: 'STKaiti', serif;"
            class="search-input"
          />
          <text v-if="searchKeyword" class="clear-btn" @tap="searchKeyword = ''">✕</text>
        </view>

        <view class="tab-chips">
          <view
            class="tab-chip"
            :class="{ active: currentTab === 'all' }"
            @tap="currentTab = 'all'"
          >
            <text class="chip-icon">🏮</text>
            <text>历练梦牒 ({{ dreamStore.historyList.length }})</text>
          </view>
          <view
            class="tab-chip"
            :class="{ active: currentTab === 'fav' }"
            @tap="currentTab = 'fav'"
          >
            <text class="chip-icon">❤️</text>
            <text>星标典藏 ({{ dreamStore.favoriteIds.length }})</text>
          </view>
        </view>
      </view>

      <!-- 梦境编年纪事列表 -->
      <view v-if="filteredList.length > 0" class="timeline-list">
        <view
          v-for="item in filteredList"
          :key="item.id"
          class="dream-card"
          @tap="handleViewDream(item)"
        >
          <!-- 左侧书脊彩条 -->
          <view class="card-spine" :style="{ background: item.colorTheme ? `linear-gradient(to bottom, #c2956e, ${item.colorTheme})` : 'linear-gradient(to bottom, #c2956e, #bc312c)' }"></view>

          <!-- 顶部宗师标签与入梦纪年 -->
          <view class="item-header">
            <view class="persona-badge">
              <text class="p-emoji">{{ item.persona?.avatar || '👴' }}</text>
              <text class="p-name">{{ item.persona?.name || '周公' }}推演</text>
            </view>
            <text class="item-date">{{ item.date }}</text>
          </view>

          <!-- 标题与图文内容 -->
          <view class="item-body">
            <view class="item-text-col">
              <text class="item-title">{{ item.title }}</text>
              <text class="item-summary">{{ item.dreamText || item.summary }}</text>

              <!-- 象征意象微签 -->
              <view class="item-tags" v-if="item.symbols && item.symbols.length">
                <view
                  v-for="(sym, idx) in item.symbols.slice(0, 3)"
                  :key="idx"
                  class="sym-chip"
                >
                  <text class="sym-icon">{{ sym.icon }}</text>
                  <text class="sym-name">{{ sym.name }}</text>
                </view>
              </view>
            </view>

            <!-- 梦境插画装裱 -->
            <view class="thumb-wrapper" v-if="item.illustrationUrl">
              <image
                :src="item.illustrationUrl"
                mode="aspectFill"
                class="item-thumb"
              />
              <view class="thumb-border"></view>
            </view>
          </view>

          <!-- 底部心绪小标与文房操作栏 -->
          <view class="item-footer" @tap.stop>
            <view class="mood-badge">
              <text class="mood-glyph">{{ item.mood?.icon || '🪐' }}</text>
              <text class="mood-name">{{ item.mood?.name || '离奇' }}</text>
            </view>

            <view class="item-actions">
              <button class="action-btn" :class="{ 'fav-active': dreamStore.favoriteIds.includes(item.id) }" @tap="handleToggleFav(item.id)">
                <text class="btn-icon">{{ dreamStore.favoriteIds.includes(item.id) ? '❤️' : '🤍' }}</text>
                <text class="btn-text">典藏</text>
              </button>
              <button class="action-btn" @tap="handleOpenPoster(item)">
                <text class="btn-icon">🖼️</text>
                <text class="btn-text">梦卷</text>
              </button>
              <button class="action-btn delete-btn" @tap="handleDelete(item.id)">
                <text class="btn-icon">🗑️</text>
                <text class="btn-text">抹除</text>
              </button>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-box">
        <view class="empty-illustration">
          <view class="halo-ring"></view>
          <text class="empty-glyph">📜</text>
        </view>
        <text class="empty-title">太虚初开 · 尚未落笔</text>
        <text class="empty-desc">庄生晓梦迷蝴蝶，去首页记述昨夜梦兆吧</text>
        <button class="go-dream-btn" @tap="goHome">
          <text class="btn-glyph">✦</text>
          <text class="btn-text">步入太虚 · 启梦</text>
        </button>
      </view>
    </view>

    <!-- 海报模态框 -->
    <DreamPosterModal
      v-if="selectedPosterDream"
      v-model:visible="showPoster"
      :dream="selectedPosterDream"
    />

    <!-- 底部免责声明 -->
    <view class="disclaimer-footer">
      <text>内容仅供个人娱乐，禁止作为任何参考</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import DreamPosterModal from '../../components/DreamPosterModal.vue';
import { useDreamStore } from '../../store/dreamStore.js';
import { MOODS } from '../../api/dreamEngine.js';

const dreamStore = useDreamStore();

const searchKeyword = ref('');
const currentTab = ref('all'); // 'all' | 'fav'
function handleClearAll() {
  uni.showModal({
    title: '⚠️ 危险操作',
    content: '是否彻底清除所有本地梦境记录？此操作不可恢复。',
    confirmText: '彻底清除',
    confirmColor: '#bc312c',
    cancelText: '保留',
    success: (res) => {
      if (res.confirm) {
        dreamStore.clearAllDreams();
        uni.showToast({ title: '记忆已消除', icon: 'success' });
      }
    }
  });
}

const showPoster = ref(false);
const selectedPosterDream = ref(null);

// 计算最高频的情绪
const topMoodName = computed(() => {
  const stats = dreamStore.moodStats;
  let topId = '';
  let maxCount = 0;
  for (const [id, count] of Object.entries(stats)) {
    if (count > maxCount) {
      maxCount = count;
      topId = id;
    }
  }
  const mood = MOODS.find(m => m.id === topId);
  return mood ? mood.name : '多元探索';
});

// 过滤后的梦境列表（按用户输入的真实梦境原文及标题检索，避免固定意象和总结套话导致的重复）
const filteredList = computed(() => {
  let list = currentTab.value === 'fav'
    ? dreamStore.favoriteDreams
    : dreamStore.historyList;

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase();
    list = list.filter(item => {
      const dreamText = (item.dreamText || '').toLowerCase();
      const title = (item.title || '').toLowerCase();
      return dreamText.includes(kw) || title.includes(kw);
    });
  }

  return list;
});

function handleViewDream(item) {
  dreamStore.setCurrentDream(item);
  uni.navigateTo({
    url: '/pages_sub/result/result'
  });
}

function handleToggleFav(id) {
  dreamStore.toggleFavorite(id);
}

function handleOpenPoster(item) {
  selectedPosterDream.value = item;
  showPoster.value = true;
}

function handleDelete(id) {
  uni.showModal({
    title: '确认抹除此条脑波记录？',
    content: '删除后梦境数据将永久从档案馆消除。',
    confirmColor: '#ef476f',
    success: res => {
      if (res.confirm) {
        dreamStore.deleteDream(id);
        uni.showToast({ title: '已消除记录', icon: 'none' });
      }
    }
  });
}


function goHome() {
  uni.switchTab({ url: '/pages/index/index' });
}
</script>

<style lang="scss" scoped>
.archive-page-container {
  min-height: 100vh;
  background: radial-gradient(circle at 50% 0%, #ffffff 0%, #f4eee6 60%, #e6dfd3 100%) no-repeat;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;

  &.is-empty-page {
    height: 100vh;
    overflow: hidden;
  }
}

.content-wrapper {
  position: relative;
  z-index: 3;
  padding: 24rpx 28rpx 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 顶部 Header 品牌 */
.hero-header {
  text-align: center;
  margin-bottom: 18rpx;
  position: relative;

  /* 竖排古典题跋装饰（双行古典引首题跋，避免过长被卡片遮挡） */
  .vertical-deco {
    position: absolute;
    top: 6rpx;
    right: 8rpx;
    display: flex;
    flex-direction: row-reverse;
    gap: 10rpx;
    z-index: 5;
    pointer-events: none;

    .deco-col {
      font-size: 22rpx;
      color: rgba(188, 49, 44, 0.38);
      font-family: "STKaiti", "KaiTi", serif;
      letter-spacing: 6rpx;
      writing-mode: vertical-rl;
      line-height: 1.1;
    }
  }

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

/* 梦阁玑衡 · 潜意识数据盘 (三才星衡) */
.stats-card {
  background: rgba(254, 251, 246, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5rpx solid rgba(194, 149, 110, 0.38);
  border-radius: 20rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(120, 90, 60, 0.06), inset 0 0 0 1rpx rgba(255, 255, 255, 0.9);
  position: relative;
  margin-bottom: 18rpx;

  /* 古典四角回纹回角 */
  .corner {
    position: absolute;
    width: 16rpx;
    height: 16rpx;
    border-color: rgba(184, 134, 81, 0.6);
    pointer-events: none;
    
    &.top-left {
      top: 10rpx;
      left: 10rpx;
      border-top: 2rpx solid;
      border-left: 2rpx solid;
    }
    &.top-right {
      top: 10rpx;
      right: 10rpx;
      border-top: 2rpx solid;
      border-right: 2rpx solid;
    }
    &.bottom-left {
      bottom: 10rpx;
      left: 10rpx;
      border-bottom: 2rpx solid;
      border-left: 2rpx solid;
    }
    &.bottom-right {
      bottom: 10rpx;
      right: 10rpx;
      border-bottom: 2rpx solid;
      border-right: 2rpx solid;
    }
  }

  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22rpx;
    padding-bottom: 14rpx;
    border-bottom: 1px dashed rgba(184, 134, 81, 0.24);

    .header-left {
      display: flex;
      align-items: center;
      gap: 10rpx;

      .sec-glyph {
        font-size: 20rpx;
        color: #b88651;
      }

      .stats-title {
        font-size: 28rpx;
        font-weight: 900;
        color: #261c15;
        font-family: "STZhongsong", "SimSun", serif;
        letter-spacing: 2rpx;
      }
    }

    .stats-badge {
      font-size: 20rpx;
      color: #8a7369;
      background: rgba(194, 149, 110, 0.08);
      border: 1rpx solid rgba(194, 149, 110, 0.28);
      padding: 4rpx 14rpx;
      border-radius: 20rpx;
      font-family: "STKaiti", "KaiTi", serif;
    }
  }

  .stats-grid {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      .stat-num {
        font-size: 38rpx;
        font-weight: 900;
        color: #261c15;
        font-family: "STZhongsong", "SimSun", serif;
        line-height: 1.2;

        &.num-fav {
          color: #bc312c;
        }

        &.num-mood {
          font-size: 30rpx;
          color: #936838;
          max-width: 160rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .stat-label {
        font-size: 20rpx;
        color: #8c827a;
        margin-top: 8rpx;
        font-family: "STKaiti", "KaiTi", serif;
        letter-spacing: 1rpx;
      }
    }

    .stat-divider {
      width: 1rpx;
      height: 48rpx;
      background: rgba(184, 134, 81, 0.22);
    }
  }
}

/* 隐私木牌 */
.privacy-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  border: 1.5rpx solid rgba(194, 149, 110, 0.28);
  padding: 12rpx 20rpx;
  border-radius: 14rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(120, 90, 60, 0.03);

  .privacy-text {
    display: flex;
    align-items: center;
    gap: 10rpx;
    flex: 1;

    .icon {
      font-size: 22rpx;
    }

    .text {
      font-size: 20rpx;
      color: #8a7369;
      font-family: "STKaiti", "KaiTi", serif;
      letter-spacing: 1rpx;
    }
  }

  .clear-action {
    display: flex;
    align-items: center;
    gap: 6rpx;
    padding: 6rpx 16rpx;
    background: rgba(188, 49, 44, 0.08);
    border: 1rpx solid rgba(188, 49, 44, 0.25);
    border-radius: 20rpx;
    transition: all 0.2s;

    &:active {
      background: rgba(188, 49, 44, 0.15);
    }

    .icon {
      font-size: 20rpx;
    }

    .text {
      font-size: 20rpx;
      color: #bc312c;
      font-family: "STKaiti", serif;
      font-weight: bold;
    }
  }
}

/* 搜索与筛选分栏 */
.filter-section {
  margin-bottom: 16rpx;

  .oriental-search-box {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 36rpx;
    padding: 10rpx 20rpx 10rpx 24rpx;
    border: 1.5rpx solid rgba(194, 149, 110, 0.35);
    box-shadow: 0 6rpx 20rpx rgba(120, 90, 60, 0.05);
    margin-bottom: 14rpx;

    .search-prefix {
      font-size: 22rpx;
      color: #b88651;
      margin-right: 12rpx;
    }

    .search-input {
      flex: 1;
      font-size: 26rpx;
      color: #261c15;
      font-family: "STKaiti", "KaiTi", sans-serif;
    }

    .clear-btn {
      font-size: 24rpx;
      color: #9c8e84;
      padding: 0 12rpx;
    }
  }

  .tab-chips {
    display: flex;
    gap: 16rpx;

    .tab-chip {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 12rpx 28rpx;
      font-size: 24rpx;
      color: #6b584a;
      background: rgba(255, 255, 255, 0.72);
      border: 1.5rpx solid rgba(194, 149, 110, 0.28);
      border-radius: 32rpx;
      box-shadow: 0 4rpx 12rpx rgba(110, 85, 60, 0.04);
      font-family: "STKaiti", "KaiTi", serif;
      font-weight: 600;
      transition: all 0.2s ease;

      .chip-icon {
        font-size: 22rpx;
      }

      &.active {
        background: linear-gradient(135deg, #bc312c 0%, #a12b26 100%);
        border-color: #a12b26;
        color: #ffffff;
        box-shadow: 0 6rpx 20rpx rgba(188, 49, 44, 0.28);
        transform: translateY(-2rpx);
        font-weight: bold;
      }
    }
  }
}

/* 梦境时间轴列表 (太虚画卷卡片) */
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .dream-card {
    background: rgba(254, 251, 246, 0.88);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1.5rpx solid rgba(194, 149, 110, 0.3);
    border-radius: 18rpx;
    padding: 22rpx 20rpx 20rpx 26rpx;
    box-shadow: 0 6rpx 20rpx rgba(120, 90, 60, 0.05);
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease;

    &:active {
      transform: translateY(1rpx);
      background: rgba(255, 255, 255, 0.95);
      border-color: rgba(188, 49, 44, 0.35);
    }

    .card-spine {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 8rpx;
      border-radius: 4rpx 0 0 4rpx;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14rpx;

      .persona-badge {
        display: flex;
        align-items: center;
        gap: 8rpx;
        background: rgba(194, 149, 110, 0.08);
        border: 1rpx solid rgba(194, 149, 110, 0.35);
        padding: 4rpx 14rpx;
        border-radius: 20rpx;

        .p-emoji {
          font-size: 22rpx;
        }

        .p-name {
          font-size: 20rpx;
          color: #7d6b5e;
          font-family: "STKaiti", "KaiTi", serif;
          font-weight: 600;
        }
      }

      .item-date {
        font-size: 22rpx;
        color: #9c8e84;
        font-family: "STKaiti", "KaiTi", serif;
      }
    }

    .item-body {
      display: flex;
      gap: 18rpx;

      .item-text-col {
        flex: 1;

        .item-title {
          font-size: 30rpx;
          font-weight: 900;
          color: #261c15;
          letter-spacing: 2rpx;
          font-family: "STZhongsong", "SimSun", serif;
          display: block;
        }

        .item-summary {
          font-size: 22rpx;
          color: #6c635e;
          line-height: 1.6;
          margin-top: 8rpx;
          font-family: "STKaiti", "KaiTi", serif;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10rpx;
          margin-top: 14rpx;

          .sym-chip {
            display: flex;
            align-items: center;
            gap: 6rpx;
            font-size: 20rpx;
            color: #936838;
            background: rgba(194, 149, 110, 0.1);
            border: 1rpx solid rgba(194, 149, 110, 0.3);
            padding: 3rpx 12rpx;
            border-radius: 16rpx;
            font-family: "STKaiti", "KaiTi", serif;

            .sym-icon {
              font-size: 20rpx;
            }

            .sym-name {
              font-size: 20rpx;
            }
          }
        }
      }

      .thumb-wrapper {
        position: relative;
        width: 140rpx;
        height: 140rpx;
        border-radius: 14rpx;
        overflow: hidden;
        flex-shrink: 0;
        box-shadow: 0 4rpx 12rpx rgba(120, 90, 60, 0.08);

        .item-thumb {
          width: 100%;
          height: 100%;
          border-radius: 14rpx;
        }

        .thumb-border {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border: 1.5rpx solid rgba(194, 149, 110, 0.35);
          border-radius: 14rpx;
          pointer-events: none;
        }
      }
    }

    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18rpx;
      padding-top: 14rpx;
      border-top: 1px dashed rgba(184, 134, 81, 0.22);

      .mood-badge {
        display: flex;
        align-items: center;
        gap: 6rpx;
        font-size: 22rpx;
        color: #7d6b5e;
        font-family: "STKaiti", "KaiTi", serif;

        .mood-glyph {
          font-size: 22rpx;
        }

        .mood-name {
          font-size: 22rpx;
        }
      }

      .item-actions {
        display: flex;
        gap: 10rpx;

        .action-btn {
          height: 52rpx;
          padding: 0 16rpx;
          background: rgba(255, 255, 255, 0.85);
          border: 1rpx solid rgba(194, 149, 110, 0.3);
          border-radius: 24rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6rpx;
          box-shadow: 0 2rpx 6rpx rgba(110, 85, 60, 0.03);
          margin: 0;
          line-height: 1;

          .btn-icon {
            font-size: 20rpx;
          }

          .btn-text {
            font-size: 20rpx;
            color: #5a493b;
            font-family: "STKaiti", "KaiTi", serif;
            font-weight: 600;
          }

          &.fav-active {
            background: rgba(188, 49, 44, 0.08);
            border-color: rgba(188, 49, 44, 0.4);
            .btn-text {
              color: #bc312c;
              font-weight: bold;
            }
          }

          &.delete-btn {
            &:active {
              background: rgba(188, 49, 44, 0.15);
              border-color: #bc312c;
            }
          }
        }
      }
    }
  }
}

/* 空状态：太虚古卷 · 素笺待题 (舒朗雅致排版，居中呼吸感，无滚动条) */
.empty-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20rpx 40rpx 40rpx;
  position: relative;

  .empty-illustration {
    position: relative;
    width: 132rpx;
    height: 132rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 28rpx;

    .halo-ring {
      position: absolute;
      width: 126rpx;
      height: 126rpx;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(188, 49, 44, 0.08) 0%, rgba(184, 134, 81, 0.05) 70%, transparent 100%);
      border: 1rpx dashed rgba(184, 134, 81, 0.35);
      animation: slowRotate 24s linear infinite;
    }

    .empty-glyph {
      font-size: 70rpx;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 4rpx 10rpx rgba(184, 134, 81, 0.22));
    }
  }

  .empty-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #261c15;
    font-family: "STZhongsong", "SimSun", serif;
    letter-spacing: 4rpx;
    margin-bottom: 14rpx;
  }

  .empty-desc {
    font-size: 25rpx;
    color: #8c786a;
    font-family: "STKaiti", "KaiTi", serif;
    letter-spacing: 2rpx;
    line-height: 1.55;
    margin-bottom: 42rpx;
    max-width: 520rpx;
  }

  .go-dream-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 82rpx;
    line-height: 82rpx;
    padding: 0 52rpx;
    min-width: 320rpx;
    box-sizing: border-box;
    background: linear-gradient(135deg, #c74c3c 0%, #9e2a1b 100%);
    color: #ffffff;
    border-radius: 41rpx;
    box-shadow: 0 8rpx 22rpx rgba(188, 49, 44, 0.3), 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
    border: 1rpx solid rgba(255, 230, 200, 0.4);
    margin: 0 auto;
    white-space: nowrap;

    &::after {
      border: none;
    }

    &:active {
      transform: scale(0.97);
      box-shadow: 0 4rpx 12rpx rgba(188, 49, 44, 0.25);
    }

    .btn-glyph {
      font-size: 22rpx;
      margin-right: 12rpx;
      color: #ffd9a8;
      line-height: 1;
    }

    .btn-text {
      font-size: 28rpx;
      font-family: "STZhongsong", "STKaiti", serif;
      font-weight: 700;
      letter-spacing: 3rpx;
      color: #ffffff;
      line-height: 1;
      white-space: nowrap;
    }
  }
}

@keyframes slowRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 底部免责声明 */
.disclaimer-footer {
  text-align: center;
  font-size: 20rpx;
  color: #a6988c;
  font-family: "STKaiti", "KaiTi", serif;
  letter-spacing: 1rpx;
  padding: 16rpx 0 24rpx;
  width: 100%;
}
</style>
