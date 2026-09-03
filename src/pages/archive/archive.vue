<template>
  <view class="archive-page">
    

    <view class="content-wrapper">
      <!-- 顶部统计概览 -->
      <view class="glass-panel-glow stats-card">
        <view class="stats-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <view style="display: flex; align-items: center;">
            <text class="stats-title neon-text-cyan">🌌 潜意识档案库</text>
          </view>
          
          <text class="stats-badge">已记录 {{ dreamStore.totalDreamsCount }} 个梦境</text>
        </view>

        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-num neon-text-cyan">{{ dreamStore.totalDreamsCount }}</text>
            <text class="stat-label">总入梦频次</text>
          </view>
          <view class="stat-item">
            <text class="stat-num neon-text-pink">{{ dreamStore.favoriteIds.length }}</text>
            <text class="stat-label">星标典藏</text>
          </view>
          <view class="stat-item">
            <text class="stat-num neon-text-gold">{{ topMoodName }}</text>
            <text class="stat-label">高频潜意识</text>
          </view>
        </view>
      </view>

      <!-- 搜索与筛选 Tab -->
      <view class="filter-section">
        <view class="search-bar glass-panel">
          <text class="search-icon">🔍</text>
          <input
            v-model="searchKeyword"
            placeholder="搜索梦境关键词、象征物..."
            placeholder-class="input-placeholder"
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
            全部梦境 ({{ dreamStore.historyList.length }})
          </view>
          <view
            class="tab-chip"
            :class="{ active: currentTab === 'fav' }"
            @tap="currentTab = 'fav'"
          >
            ❤️ 收藏夹 ({{ dreamStore.favoriteIds.length }})
          </view>
        </view>
      </view>

      <!-- 梦境时间轴列表 -->
      <view v-if="filteredList.length > 0" class="timeline-list">
        <view
          v-for="item in filteredList"
          :key="item.id"
          class="dream-history-item glass-panel"
          @tap="handleViewDream(item)"
        >
          <!-- 顶部信息 -->
          <view class="item-header">
            <view class="persona-tag-mini" :style="{ borderColor: item.colorTheme || '#457b9d' }">
              <text class="p-emoji">{{ item.persona?.avatar || '👴' }}</text>
              <text class="p-name">{{ item.persona?.name || '赛博周公' }}</text>
            </view>
            <text class="item-date">{{ item.date }}</text>
          </view>

          <!-- 标题与预览图 -->
          <view class="item-body">
            <view class="item-text-col">
              <text class="item-title">{{ item.title }}</text>
              <text class="item-summary">{{ item.summary }}</text>

              <!-- 象征物标签 -->
              <view class="item-tags">
                <view
                  v-for="(sym, idx) in (item.symbols || []).slice(0, 3)"
                  :key="idx"
                  class="sym-chip"
                >
                  {{ sym.icon }} {{ sym.name }}
                </view>
              </view>
            </view>

            <image
              :src="item.illustrationUrl"
              mode="aspectFill"
              class="item-thumb"
            />
          </view>

          <!-- 底部操作按钮 -->
          <view class="item-footer" @tap.stop>
            <view class="mood-badge">
              <text>{{ item.mood?.icon || '🪐' }} {{ item.mood?.name || '离奇' }}</text>
            </view>

            <view class="item-actions">
              <button class="mini-action-btn" @tap="handleToggleFav(item.id)">
                {{ dreamStore.favoriteIds.includes(item.id) ? '❤️' : '🤍' }}
              </button>
              <button class="mini-action-btn" @tap="handleOpenPoster(item)">
                🖼️ 海报
              </button>
              <button class="mini-action-btn delete-btn" @tap="handleDelete(item.id)">
                🗑️
              </button>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-box">
        <text class="empty-icon">📭</text>
        <text class="empty-title">暂无符合条件的梦境记录</text>
        <text class="empty-desc">去首页记录昨夜的奇幻潜意识吧！</text>
        <button class="cyber-btn-primary go-dream-btn" @tap="goHome">
          🚀 立即入梦
        </button>
      </view>
    </view>

    <!-- 海报模态框 -->
    <DreamPosterModal
      v-if="selectedPosterDream"
      v-model:visible="showPoster"
      :dream="selectedPosterDream"
    />
    <!-- API 配置弹窗 -->
    <view class="modal-mask" v-if="showApiConfig" @tap="closeApiConfig">
      <view class="modal-content" @tap.stop>
        <text class="modal-title">全网大模型配置 (白嫖版)</text>
        
        <view class="form-group">
          <text class="form-label">接口地址 (Base URL)</text>
          <input class="form-input" v-model="configForm.apiUrl" placeholder="例如: https://api.siliconflow.cn/v1/chat/completions" />
          <text class="form-hint">推荐: https://api.siliconflow.cn/v1/chat/completions</text>
        </view>

        <view class="form-group">
          <text class="form-label">模型名称 (Model ID)</text>
          <input class="form-input" v-model="configForm.apiModel" placeholder="例如: Qwen/Qwen2.5-7B-Instruct" />
          <text class="form-hint">推荐免费模型: Qwen/Qwen2.5-7B-Instruct</text>
        </view>

        <view class="form-group">
          <text class="form-label">API Key</text>
          <input class="form-input" v-model="configForm.apiKey" placeholder="输入您的 API Key" />
        </view>

        <view class="modal-actions">
          <button class="btn-cancel" @tap="closeApiConfig">取消</button>
          <button class="btn-save" @tap="saveApiConfig">保存</button>
        </view>
      </view>
    </view>
  
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

// 过滤后的梦境列表
const filteredList = computed(() => {
  let list = currentTab.value === 'fav'
    ? dreamStore.favoriteDreams
    : dreamStore.historyList;

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase();
    list = list.filter(item => {
      const matchTitle = item.title?.toLowerCase().includes(kw);
      const matchText = item.dreamText?.toLowerCase().includes(kw);
      const matchSummary = item.summary?.toLowerCase().includes(kw);
      const matchSymbols = (item.symbols || []).some(s => s.name?.toLowerCase().includes(kw));
      return matchTitle || matchText || matchSummary || matchSymbols;
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
.archive-page {
  min-height: 100vh;
  padding-bottom: 120rpx;
  position: relative;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 30rpx;
}

.stats-card {
  padding: 30rpx;
  margin-bottom: 30rpx;

  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;

    .stats-title {
      font-size: 32rpx;
      font-weight: bold;
    }

    .stats-badge {
      font-size: 20rpx;
      color: #595959;
      background: rgba(255, 255, 255, 0.08);
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
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

      .stat-num {
        font-size: 38rpx;
        font-weight: 900;
      }

      .stat-label {
        font-size: 20rpx;
        color: #8c8c8c;
        margin-top: 6rpx;
      }
    }
  }
}

  .privacy-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(69, 123, 157, 0.05);
    border: 1px solid rgba(69, 123, 157, 0.15);
    padding: 16rpx 20rpx;
    border-radius: 12rpx;
    margin-bottom: 30rpx;

    .privacy-text {
      display: flex;
      align-items: center;
      gap: 10rpx;
      flex: 1;
      .icon { font-size: 24rpx; }
      .text { font-size: 20rpx; color: #7a9da8; }
    }

    .clear-action {
      display: flex;
      align-items: center;
      gap: 6rpx;
      padding: 8rpx 16rpx;
      background: rgba(188, 49, 44, 0.1);
      border-radius: 8rpx;
      .icon { font-size: 22rpx; }
      .text { font-size: 20rpx; color: #bc312c; font-weight: bold; }
    }
  }

  .filter-section {
  margin-bottom: 30rpx;

  .search-bar {
    display: flex;
    align-items: center;
    padding: 16rpx 24rpx;
    margin-bottom: 20rpx;

    .search-icon {
      font-size: 28rpx;
      margin-right: 12rpx;
    }

    .search-input {
      flex: 1;
      font-size: 26rpx;
      color: #2b2b2b;
    }

    .clear-btn {
      font-size: 26rpx;
      color: #595959;
      padding: 6rpx;
    }
  }

  .tab-chips {
    display: flex;
    gap: 16rpx;

    .tab-chip {
      padding: 12rpx 28rpx;
      font-size: 24rpx;
      color: #595959;
      background: rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 30rpx;
      transition: all 0.2s ease;

      &.active {
        background: rgba(0, 242, 254, 0.15);
        border-color: #457b9d;
        color: #457b9d;
        font-weight: bold;
      }
    }
  }
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;

  .dream-history-item {
    padding: 24rpx;
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.99);
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;

      .persona-tag-mini {
        display: flex;
        align-items: center;
        gap: 8rpx;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid;
        padding: 4rpx 14rpx;
        border-radius: 20rpx;

        .p-emoji {
          font-size: 20rpx;
        }

        .p-name {
          font-size: 20rpx;
          color: #e2e8f0;
        }
      }

      .item-date {
        font-size: 20rpx;
        color: #8c8c8c;
        font-family: monospace;
      }
    }

    .item-body {
      display: flex;
      gap: 20rpx;

      .item-text-col {
        flex: 1;

        .item-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #2b2b2b;
          display: block;
        }

        .item-summary {
          font-size: 22rpx;
          color: #595959;
          line-height: 1.5;
          margin-top: 8rpx;
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
            font-size: 18rpx;
            color: #457b9d;
            background: rgba(0, 242, 254, 0.1);
            padding: 4rpx 12rpx;
            border-radius: 12rpx;
          }
        }
      }

      .item-thumb {
        width: 140rpx;
        height: 140rpx;
        border-radius: 16rpx;
        flex-shrink: 0;
      }
    }

    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;
      padding-top: 16rpx;
      border-top: 1px dashed rgba(255, 255, 255, 0.08);

      .mood-badge {
        font-size: 20rpx;
        color: #2b2b2b;
      }

      .item-actions {
        display: flex;
        gap: 12rpx;

        .mini-action-btn {
          height: 52rpx;
          padding: 0 18rpx;
          font-size: 20rpx;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #2b2b2b;
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          &.delete-btn {
            &:active {
              background: rgba(239, 71, 111, 0.2);
              border-color: #ef476f;
            }
          }
        }
      }
    }
  }
}

.empty-box {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40rpx;

  .empty-icon {
    font-size: 90rpx;
    margin-bottom: 20rpx;
  }

  .empty-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #2b2b2b;
  }

  .empty-desc {
    font-size: 22rpx;
    color: #8c8c8c;
    margin-top: 8rpx;
    margin-bottom: 36rpx;
  }

  .go-dream-btn {
    width: 320rpx;
    height: 80rpx;
    font-size: 28rpx;
  }
}

.api-btn {
  font-size: 24rpx;
  color: #a8a8a8;
  background: rgba(255, 255, 255, 0.1);
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  width: 85%;
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
}
.modal-title {
  font-size: 34rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40rpx;
  display: block;
  color: #333;
}
.form-group {
  margin-bottom: 30rpx;
}
.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}
.form-input {
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  font-size: 26rpx;
  color: #333;
}
.form-hint {
  font-size: 22rpx;
  color: #888;
  margin-top: 8rpx;
  display: block;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 50rpx;
}
.btn-cancel {
  width: 45%;
  background: #f0f0f0;
  color: #666;
  font-size: 28rpx;
  border-radius: 40rpx;
}
.btn-cancel::after { display: none; }
.btn-save {
  width: 45%;
  background: linear-gradient(135deg, #bc312c, #8a1f1b);
  color: #fff;
  font-size: 28rpx;
  border-radius: 40rpx;
}
.btn-save::after { display: none; }

.disclaimer-footer {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  padding: 40rpx 0;
  width: 100%;
}
</style>


