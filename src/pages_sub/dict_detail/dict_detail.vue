<template>
  <view class="detail-page-container">
    <view class="vertical-deco">万象由心 · 梦兆有因</view>

    <!-- 琅嬛玉册 · 主卡卷轴 -->
    <view v-if="item" class="scroll-card">
      <!-- 古典四角回纹回角 -->
      <view class="corner top-left"></view>
      <view class="corner top-right"></view>
      <view class="corner bottom-left"></view>
      <view class="corner bottom-right"></view>

      <!-- 卷首题引 Header -->
      <view class="detail-header">
        <view class="top-aesthetic-bar">
          <text class="cloud-icon">༄</text>
          <text class="bar-title">太虚古卷 · 周公灵犀释义</text>
          <text class="cloud-icon flip">༄</text>
        </view>

        <view class="title-row">
          <text class="detail-title">{{ item.title }}</text>
          <text class="header-seal">详释</text>
        </view>

        <view class="resonance-badge">
          <text class="badge-icon">❖</text>
          <text class="badge-text">近日太虚界已有 <text class="highlight">{{ item.count }}</text> 人同感此梦</text>
        </view>
      </view>

      <!-- 释梦长卷正文区 (支持折叠展开) -->
      <view class="interpretation-section" :class="{ 'collapsed': !isExpanded }">
        <!-- 提纲挈领·素笺总论 -->
        <view class="summary-box">
          <text class="summary-tag">【总纲】</text>
          <text class="summary-content">{{ item.summary }}</text>
        </view>

        <!-- 原版周公解梦考据 -->
        <view class="section-block zhougong-block" v-if="item.zhougong">
          <view class="block-title">
            <text class="block-icon">📜</text>
            <text class="title-text">《原版周公解梦》考据</text>
            <text class="stamp-badge">古籍</text>
          </view>
          <text class="paragraph">{{ item.zhougong }}</text>
        </view>

        <!-- 现代心理学潜意识原型 -->
        <view class="section-block psychology-block" v-if="item.psychology">
          <view class="block-title">
            <text class="block-icon">🧠</text>
            <text class="title-text">现代心理学原型解构</text>
            <text class="stamp-badge badge-psy">潜意识</text>
          </view>
          <text class="paragraph">{{ item.psychology }}</text>
        </view>

        <!-- 周天化象 · 多维象限 Tabs 切换 -->
        <view class="dimension-section" v-if="(item.groups && item.groups.length) || (item.timePeriods && item.timePeriods.length) || (item.ages && item.ages.length)">
          <view class="dimension-header">
            <text class="sec-glyph">❖</text>
            <text class="dimension-main-title">周天化象 · 多维精详推演</text>
          </view>

          <!-- 象限切换分栏胶囊 -->
          <view class="dimension-tabs">
            <view 
              v-if="item.groups && item.groups.length"
              class="tab-btn" 
              :class="{ active: activeTab === 'groups' }"
              @click="activeTab = 'groups'"
            >
              <text class="tab-icon">👥</text>
              <text>各方众生</text>
            </view>
            <view 
              v-if="item.timePeriods && item.timePeriods.length"
              class="tab-btn" 
              :class="{ active: activeTab === 'timePeriods' }"
              @click="activeTab = 'timePeriods'"
            >
              <text class="tab-icon">⏳</text>
              <text>子午时序</text>
            </view>
            <view 
              v-if="item.ages && item.ages.length"
              class="tab-btn" 
              :class="{ active: activeTab === 'ages' }"
              @click="activeTab = 'ages'"
            >
              <text class="tab-icon">👤</text>
              <text>流年岁序</text>
            </view>
          </view>

          <!-- Tab 1: 各方众生 (人群) -->
          <view class="tab-panel" v-if="activeTab === 'groups' && item.groups">
            <view class="slip-card" v-for="(g, idx) in item.groups" :key="'g'+idx">
              <view class="slip-spine"></view>
              <view class="slip-body">
                <view class="slip-header">
                  <text class="slip-title">{{ g.name }}梦见{{ shortTitle }}</text>
                  <text class="slip-seal">验兆</text>
                </view>
                <text class="slip-content">{{ g.content }}</text>
              </view>
            </view>
          </view>

          <!-- Tab 2: 子午时序 (时段) -->
          <view class="tab-panel" v-if="activeTab === 'timePeriods' && item.timePeriods">
            <view class="slip-card" v-for="(t, idx) in item.timePeriods" :key="'t'+idx">
              <view class="slip-spine spine-time"></view>
              <view class="slip-body">
                <view class="slip-header">
                  <text class="slip-title title-time">{{ t.name }}梦见{{ shortTitle }}</text>
                  <text class="slip-seal seal-time">时辰</text>
                </view>
                <text class="slip-content">{{ t.content }}</text>
              </view>
            </view>
          </view>

          <!-- Tab 3: 流年岁序 (年龄) -->
          <view class="tab-panel" v-if="activeTab === 'ages' && item.ages">
            <view class="slip-card" v-for="(a, idx) in item.ages" :key="'a'+idx">
              <view class="slip-spine spine-age"></view>
              <view class="slip-body">
                <view class="slip-header">
                  <text class="slip-title title-age">{{ a.name }}梦见{{ shortTitle }}</text>
                  <text class="slip-seal seal-age">流年</text>
                </view>
                <text class="slip-content">{{ a.content }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 柔光渐变遮罩 (收起时显示) -->
        <view v-if="!isExpanded" class="fade-mask"></view>
      </view>

      <!-- 展卷 / 束卷 按钮 -->
      <view class="expand-btn-wrap" @click="isExpanded = !isExpanded">
        <view class="expand-btn">
          <text class="expand-icon">{{ isExpanded ? '▲' : '▼' }}</text>
          <text class="expand-text">{{ isExpanded ? '束卷归匣 · 收起详释' : '展卷详阅 · 解构全部时辰与化象' }}</text>
        </view>
      </view>
    </view>

    <!-- 太虚机缘 · 相关梦象推荐 -->
    <view v-if="item && recommendations.length > 0" class="recommend-section">
      <view class="rec-header">
        <text class="sec-glyph">❖</text>
        <text class="rec-title-text">太虚机缘 · 相关梦象推荐</text>
      </view>
      <view class="recommend-list">
        <view 
          class="recommend-card" 
          v-for="rec in recommendations" 
          :key="rec.id"
          @click="goToDetail(rec.id)"
        >
          <view class="rec-left">
            <text class="rec-spine"></text>
            <text class="rec-name">{{ rec.title }}</text>
          </view>
          <view class="rec-right">
            <text class="rec-btn-text">探寻</text>
            <text class="rec-arrow">➔</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部免责声明 -->
    <view class="disclaimer-footer">
      <text>内容仅供个人娱乐，禁止作为任何参考</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getLocalDreamDict } from '@/store/dictData';

const item = ref(null);
const isExpanded = ref(false);
const activeTab = ref('groups');

const shortTitle = computed(() => {
  if (!item.value) return '';
  return item.value.title.replace('梦见', '');
});

const recommendations = computed(() => {
  if (!item.value) return [];
  const db = getLocalDreamDict();
  return db.filter(d => d.id !== item.value.id).slice(0, 4);
});

onLoad((options) => {
  const db = getLocalDreamDict();
  if (options.id) {
    const id = isNaN(parseInt(options.id)) ? options.id : parseInt(options.id);
    item.value = db.find(d => d.id === id) || db[0];
  } else {
    item.value = db[0];
  }
  
  if (item.value) {
    if (item.value.groups && item.value.groups.length) {
      activeTab.value = 'groups';
    } else if (item.value.timePeriods && item.value.timePeriods.length) {
      activeTab.value = 'timePeriods';
    } else if (item.value.ages && item.value.ages.length) {
      activeTab.value = 'ages';
    }
  }
});

function goToDetail(id) {
  uni.redirectTo({
    url: `/pages_sub/dict_detail/dict_detail?id=${id}`
  });
}
</script>

<style lang="scss" scoped>
.detail-page-container {
  min-height: 100vh;
  background: radial-gradient(circle at 50% 0%, #ffffff 0%, #f4eee6 60%, #e6dfd3 100%) no-repeat;
  background-attachment: fixed;
  padding: 36rpx 28rpx 30rpx;
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

/* 琅嬛玉册 · 主卡卷轴 */
.scroll-card {
  background: rgba(254, 251, 246, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5rpx solid rgba(194, 149, 110, 0.38);
  border-radius: 20rpx;
  padding: 36rpx 26rpx 28rpx;
  box-shadow: 0 10rpx 36rpx rgba(120, 90, 60, 0.06), inset 0 0 0 1rpx rgba(255, 255, 255, 0.9);
  position: relative;
  margin-bottom: 32rpx;

  /* 古典四角回纹回角 */
  .corner {
    position: absolute;
    width: 16rpx;
    height: 16rpx;
    border-color: rgba(184, 134, 81, 0.6);
    pointer-events: none;
    
    &.top-left {
      top: 12rpx;
      left: 12rpx;
      border-top: 2rpx solid;
      border-left: 2rpx solid;
    }
    &.top-right {
      top: 12rpx;
      right: 12rpx;
      border-top: 2rpx solid;
      border-right: 2rpx solid;
    }
    &.bottom-left {
      bottom: 12rpx;
      left: 12rpx;
      border-bottom: 2rpx solid;
      border-left: 2rpx solid;
    }
    &.bottom-right {
      bottom: 12rpx;
      right: 12rpx;
      border-bottom: 2rpx solid;
      border-right: 2rpx solid;
    }
  }
}

/* 卷首题引 Header */
.detail-header {
  text-align: center;
  position: relative;
  z-index: 3;
  margin-bottom: 28rpx;

  .top-aesthetic-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14rpx;
    margin-bottom: 16rpx;

    .cloud-icon {
      font-size: 24rpx;
      color: #c2956e;
      font-weight: 300;

      &.flip {
        transform: scaleX(-1);
        display: inline-block;
      }
    }

    .bar-title {
      font-size: 20rpx;
      color: #8a7369;
      font-family: "STKaiti", "KaiTi", serif;
      letter-spacing: 2rpx;
    }
  }

  .title-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14rpx;
    margin-bottom: 16rpx;

    .detail-title {
      font-size: 48rpx;
      font-weight: 900;
      color: #261c15;
      letter-spacing: 6rpx;
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

  .resonance-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 10rpx;
    background: rgba(194, 149, 110, 0.08);
    border: 1rpx solid rgba(194, 149, 110, 0.3);
    border-radius: 30rpx;
    padding: 6rpx 20rpx;

    .badge-icon {
      font-size: 18rpx;
      color: #b88651;
    }

    .badge-text {
      font-size: 22rpx;
      color: #7d6b5e;
      font-family: "STKaiti", "KaiTi", serif;
      letter-spacing: 1rpx;

      .highlight {
        color: #bc312c;
        font-weight: bold;
        margin: 0 4rpx;
      }
    }
  }
}

/* 释梦长卷正文区 */
.interpretation-section {
  position: relative;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);

  &.collapsed {
    max-height: 520rpx;
  }

  .fade-mask {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 180rpx;
    background: linear-gradient(to bottom, rgba(254, 251, 246, 0), rgba(254, 251, 246, 1) 90%);
    pointer-events: none;
    z-index: 5;
  }
}

/* 提纲挈领·素笺总论 */
.summary-box {
  background: rgba(255, 255, 255, 0.78);
  border: 1.5rpx dashed rgba(194, 149, 110, 0.38);
  border-radius: 14rpx;
  padding: 22rpx 20rpx;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;

  .summary-tag {
    font-size: 24rpx;
    font-weight: bold;
    color: #b88651;
    font-family: "STZhongsong", "SimSun", serif;
    letter-spacing: 2rpx;
  }

  .summary-content {
    font-size: 26rpx;
    color: #3b2e25;
    line-height: 1.75;
    font-family: "STKaiti", "KaiTi", serif;
    letter-spacing: 1rpx;
  }
}

/* 考据锦盒 (原版周公与现代心理学) */
.section-block {
  padding: 24rpx 22rpx;
  border-radius: 14rpx;
  margin-bottom: 24rpx;
  position: relative;

  .block-title {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 12rpx;

    .block-icon {
      font-size: 28rpx;
    }

    .title-text {
      font-size: 28rpx;
      font-weight: 900;
      color: #261c15;
      font-family: "STZhongsong", "SimSun", serif;
      letter-spacing: 2rpx;
    }

    .stamp-badge {
      font-size: 18rpx;
      padding: 2rpx 8rpx;
      border-radius: 4rpx;
      font-family: "STKaiti", "KaiTi", serif;
      font-weight: bold;
      transform: rotate(-3deg);
    }
  }

  .paragraph {
    font-size: 26rpx;
    line-height: 1.75;
    font-family: "STKaiti", "KaiTi", serif;
    letter-spacing: 1rpx;
    display: block;
  }

  &.zhougong-block {
    background: rgba(188, 49, 44, 0.04);
    border-left: 6rpx solid #bc312c;
    border-top: 1rpx solid rgba(188, 49, 44, 0.12);
    border-right: 1rpx solid rgba(188, 49, 44, 0.12);
    border-bottom: 1rpx solid rgba(188, 49, 44, 0.12);

    .stamp-badge {
      color: #bc312c;
      background: rgba(188, 49, 44, 0.08);
      border: 1rpx solid rgba(188, 49, 44, 0.4);
    }

    .paragraph {
      color: #4a2826;
    }
  }

  &.psychology-block {
    background: rgba(92, 137, 132, 0.05);
    border-left: 6rpx solid #5c8984;
    border-top: 1rpx solid rgba(92, 137, 132, 0.15);
    border-right: 1rpx solid rgba(92, 137, 132, 0.15);
    border-bottom: 1rpx solid rgba(92, 137, 132, 0.15);

    .stamp-badge.badge-psy {
      color: #3b6c67;
      background: rgba(92, 137, 132, 0.1);
      border: 1rpx solid rgba(92, 137, 132, 0.4);
    }

    .paragraph {
      color: #2b3a38;
    }
  }
}

/* 周天化象 · 多维象限 Tabs */
.dimension-section {
  margin-top: 28rpx;
  padding-top: 24rpx;
  border-top: 1px dashed rgba(184, 134, 81, 0.28);

  .dimension-header {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 20rpx;

    .sec-glyph {
      font-size: 20rpx;
      color: #b88651;
    }

    .dimension-main-title {
      font-size: 28rpx;
      font-weight: 900;
      color: #261c15;
      font-family: "STZhongsong", "SimSun", serif;
      letter-spacing: 2rpx;
    }
  }

  .dimension-tabs {
    display: flex;
    gap: 14rpx;
    margin-bottom: 20rpx;

    .tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      background: rgba(255, 255, 255, 0.72);
      border: 1.5rpx solid rgba(194, 149, 110, 0.3);
      border-radius: 30rpx;
      padding: 12rpx 0;
      font-size: 24rpx;
      font-family: "STKaiti", "KaiTi", serif;
      color: #6b5545;
      font-weight: 600;
      transition: all 0.2s;

      .tab-icon {
        font-size: 22rpx;
      }

      &.active {
        background: linear-gradient(135deg, #bc312c 0%, #a12b26 100%);
        color: #ffffff;
        border-color: #a12b26;
        box-shadow: 0 4rpx 14rpx rgba(188, 49, 44, 0.25);
      }
    }
  }

  .tab-panel {
    display: flex;
    flex-direction: column;
    gap: 14rpx;

    .slip-card {
      display: flex;
      align-items: stretch;
      background: rgba(255, 255, 255, 0.82);
      border: 1.5rpx solid rgba(194, 149, 110, 0.24);
      border-radius: 12rpx;
      overflow: hidden;
      box-shadow: 0 3rpx 10rpx rgba(110, 85, 60, 0.03);

      .slip-spine {
        width: 6rpx;
        background: linear-gradient(to bottom, #c2956e, #bc312c);
        flex-shrink: 0;

        &.spine-time {
          background: linear-gradient(to bottom, #c2956e, #5c8984);
        }

        &.spine-age {
          background: linear-gradient(to bottom, #d3ac8b, #a67b45);
        }
      }

      .slip-body {
        flex: 1;
        padding: 16rpx 18rpx;

        .slip-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8rpx;

          .slip-title {
            font-size: 26rpx;
            font-weight: bold;
            color: #bc312c;
            font-family: "STZhongsong", "SimSun", serif;
            letter-spacing: 1rpx;

            &.title-time {
              color: #4a7571;
            }

            &.title-age {
              color: #8f6233;
            }
          }

          .slip-seal {
            font-size: 16rpx;
            color: #bc312c;
            border: 1rpx solid #bc312c;
            padding: 1rpx 6rpx;
            border-radius: 3rpx;
            font-family: "STKaiti", "KaiTi", serif;

            &.seal-time {
              color: #5c8984;
              border-color: #5c8984;
            }

            &.seal-age {
              color: #a67b45;
              border-color: #a67b45;
            }
          }
        }

        .slip-content {
          font-size: 24rpx;
          color: #4e4036;
          line-height: 1.65;
          font-family: "STKaiti", "KaiTi", serif;
        }
      }
    }
  }
}

/* 展卷 / 束卷 按钮 */
.expand-btn-wrap {
  padding-top: 20rpx;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 6;

  .expand-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    background: rgba(246, 239, 226, 0.9);
    border: 1.5rpx solid rgba(194, 149, 110, 0.4);
    border-radius: 36rpx;
    padding: 12rpx 36rpx;
    box-shadow: 0 4rpx 12rpx rgba(120, 90, 60, 0.05);
    transition: all 0.2s;

    &:active {
      background: rgba(238, 228, 211, 0.98);
      transform: scale(0.98);
    }

    .expand-icon {
      font-size: 20rpx;
      color: #b88651;
    }

    .expand-text {
      font-size: 24rpx;
      color: #5a493b;
      font-family: "STKaiti", "KaiTi", serif;
      font-weight: 600;
      letter-spacing: 1rpx;
    }
  }
}

/* 太虚机缘 · 相关梦象推荐 */
.recommend-section {
  background: rgba(254, 251, 246, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 20rpx;
  padding: 28rpx 24rpx;
  border: 1.5rpx solid rgba(194, 149, 110, 0.35);
  box-shadow: 0 8rpx 28rpx rgba(120, 90, 60, 0.05);
  margin-bottom: 24rpx;

  .rec-header {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 18rpx;
    padding-bottom: 14rpx;
    border-bottom: 1px dashed rgba(184, 134, 81, 0.22);

    .sec-glyph {
      font-size: 20rpx;
      color: #b88651;
    }

    .rec-title-text {
      font-size: 28rpx;
      font-weight: 900;
      color: #261c15;
      font-family: "STZhongsong", "SimSun", serif;
      letter-spacing: 2rpx;
    }
  }

  .recommend-list {
    display: flex;
    flex-direction: column;
    gap: 14rpx;

    .recommend-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.78);
      border: 1.5rpx solid rgba(194, 149, 110, 0.24);
      border-radius: 12rpx;
      padding: 18rpx 20rpx;
      transition: all 0.2s;

      &:active {
        background: rgba(255, 255, 255, 0.95);
        border-color: rgba(188, 49, 44, 0.4);
      }

      .rec-left {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .rec-spine {
          width: 6rpx;
          height: 26rpx;
          background: linear-gradient(to bottom, #c2956e, #bc312c);
          border-radius: 2rpx;
        }

        .rec-name {
          font-size: 28rpx;
          color: #261c15;
          font-family: "STZhongsong", "SimSun", serif;
          letter-spacing: 1rpx;
        }
      }

      .rec-right {
        display: flex;
        align-items: center;
        gap: 6rpx;
        color: #b88651;

        .rec-btn-text {
          font-size: 22rpx;
          font-family: "STKaiti", "KaiTi", serif;
          font-weight: 600;
        }

        .rec-arrow {
          font-size: 20rpx;
        }
      }
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
  padding: 16rpx 0 24rpx;
  width: 100%;
}
</style>
