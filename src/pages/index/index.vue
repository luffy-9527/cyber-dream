
<template>
  <view class="page-container">
    <view class="vertical-deco">庄生晓梦迷蝴蝶，望帝春心托杜鹃</view>
    <view class="content-wrapper">
      
      <!-- 顶部 Header 品牌 -->
      <view class="hero-header">
        
        <!-- 漂浮莲花 -->
        <view class="floating-lotus lotus-bg lotus-1"></view>
        <view class="floating-lotus lotus-bg lotus-2"></view>
        <view class="floating-lotus lotus-bg lotus-3"></view>
        <view class="floating-lotus lotus-bg lotus-4"></view>
        <view class="floating-lotus lotus-bg lotus-5"></view>
        <view class="floating-lotus lotus-bg lotus-6"></view>
        
        <!-- 动态时辰与祥云暗纹 -->
        <view class="top-aesthetic-bar">
          <text class="cloud-icon">༄</text>
          <view class="time-stamp">
            <text class="shichen">{{ currentShiChen }}</text>
            <text class="time-hint">{{ timeHint }}</text>
          </view>
          <text class="cloud-icon flip">༄</text>
        </view>
        
        <view class="header-top-row">
          <text class="hero-title">梦源阁</text>
          
        </view>
        <text class="hero-sub">观落叶而知秋，入梦魇而观心</text>
      </view>

      <!-- 梦境输入主区域 (文房画笺·记梦古素帖) -->
      <view class="glass-panel input-card">
        <view class="corner top-left"></view>
        <view class="corner top-right"></view>
        <view class="corner bottom-left"></view>
        <view class="corner bottom-right"></view>
        
        <view class="scroll-header">
          <text class="sec-symbol">❖</text>
          <text class="text">记述昨夜梦境</text>
          <text class="header-seal">素笺</text>
        </view>
        
        <textarea
          v-model="dreamText"
          class="dream-textarea"
          placeholder="昨宵何梦？例如：行于水墨回廊，尽头伫立一扇朱红暗门..."
          placeholder-style="color: #a6988c; font-family: 'STKaiti', serif;"
          maxlength="500"
        ></textarea>
        
        <view class="card-footer">
          <text class="word-count" :class="{ 'count-warn': dreamText.length >= 480 }">
            {{ dreamText.length }}/500
          </text>
          <view class="header-actions">
            <view class="action-btn" :class="{ active: isRecording }" @tap="handleToggleVoiceRecording">
              <text class="btn-icon">{{ isRecording ? '🌊' : '🎙' }}</text>
              <text class="btn-text">{{ isRecording ? '聆听中...' : '聆音' }}</text>
            </view>
            <view class="action-btn" @tap="handleRandomPrompt">
              <text class="btn-icon">✦</text>
              <text class="btn-text">梦兆</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 人格解梦流派 -->
      <view class="section-box">
        <view class="section-title-row">
          <view class="title-left">
            <text class="sec-symbol">❖</text>
            <text class="sec-title">今日解梦</text>
            <view class="stamp">解梦</view>
          </view>
          <text class="sec-desc">选择不同的解梦流派与心法</text>
        </view>

        <view class="persona-grid">
          <view
            v-for="p in Object.values(PERSONAS)"
            :key="p.id"
            class="persona-card"
            :class="{ active: selectedPersonaId === p.id }"
            @tap="selectedPersonaId = p.id"
          >
            <view class="persona-avatar-box">
              <text class="persona-avatar">{{ p.avatar }}</text>
            </view>
            
            <view class="persona-content">
              <view class="persona-name-row">
                <text class="persona-name">{{ p.name }}</text>
                <text class="persona-tag" :style="{ color: p.color, backgroundColor: p.color + '15' }">{{ p.tag }}</text>
              </view>
              
              <view class="persona-divider"></view>
              
              <text class="persona-desc">{{ p.desc }}</text>
              
              <view class="persona-footer" :style="{ color: p.color }">
                <text class="footer-text">✦ 启阵入梦</text>
                <text class="footer-icon">➔</text>
              </view>
            </view>
            
            <text class="persona-watermark">{{ p.name.substring(0, 1) }}</text>
          </view>
        </view>
      </view>

      <!-- 情绪基调 -->
      <view class="section-box">
        <view class="section-title-row">
          <view class="title-left">
            <text class="sec-symbol">❖</text>
            <text class="sec-title">梦境基调</text>
          </view>
        </view>
        <view class="mood-grid">
          <view
            v-for="m in MOODS"
            :key="m.id"
            class="mood-item"
            :class="{ active: selectedMoodId === m.id }"
            @tap="selectedMoodId = m.id"
          >
            <view class="mood-seal" v-if="selectedMoodId === m.id">契</view>
            <text class="mood-icon">{{ m.icon }}</text>
            <text class="mood-name">{{ m.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部固定解码按钮 -->
    <view class="fixed-bottom-bar">
      <button class="decode-btn cyber-btn-primary" @tap="handleStartDecoding">
        <text class="btn-text">记录我的梦境</text>
        <text class="btn-icon">🌙</text>
      </button>
    </view>

    <!-- 全局 Loading 遮罩 -->
    <view class="loading-overlay" v-if="isAnalyzing">
      <view class="loading-content">
        <view class="tai-chi-spinner"></view>
        <text class="loading-title">天机推演中</text>
        <text class="loading-sub">{{ loadingStepText }}</text>
      </view>
    </view>

    <view class="disclaimer-footer">
      <text>内容仅供个人娱乐，禁止作为任何参考</text>
    </view>
  </view>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { PERSONAS, MOODS, RANDOM_DREAM_PROMPTS } from '../../api/dreamEngine.js';
import { useDreamStore } from '../../store/dreamStore.js';

const dreamStore = useDreamStore();

const dreamText = ref('');
const selectedPersonaId = ref('zhougong');
const selectedMoodId = ref('absurd');

const isAnalyzing = ref(false);
const loadingStepText = ref('正在焚香，静候梦兆...');
const isRecording = ref(false);





const currentShiChen = ref('');
const timeHint = ref('');

function updateShiChen() {
  const hour = new Date().getHours();
  const shichenMap = [
    { name: '子时', hint: '夜半深沉 宜入梦', hours: [23, 0] },
    { name: '丑时', hint: '鸡鸣将至 忌思虑', hours: [1, 2] },
    { name: '寅时', hint: '平旦初醒 宜静心', hours: [3, 4] },
    { name: '卯时', hint: '日出破晓 宜清心', hours: [5, 6] },
    { name: '辰时', hint: '食时朝露 宜定神', hours: [7, 8] },
    { name: '巳时', hint: '隅中日升 宜行事', hours: [9, 10] },
    { name: '午时', hint: '日中当顶 宜小憩', hours: [11, 12] },
    { name: '未时', hint: '日跌偏西 宜安神', hours: [13, 14] },
    { name: '申时', hint: '晡时向晚 宜内观', hours: [15, 16] },
    { name: '酉时', hint: '日入黄昏 宜收心', hours: [17, 18] },
    { name: '戌时', hint: '黄昏华灯 宜冥想', hours: [19, 20] },
    { name: '亥时', hint: '人定夜阑 宜安息', hours: [21, 22] }
  ];
  let current = shichenMap.find(s => s.hours.includes(hour));
  if (!current) current = shichenMap[0];
  currentShiChen.value = current.name;
  timeHint.value = current.hint;
}

onMounted(() => {
  updateShiChen();
  
  

});

function handleRandomPrompt() {
  const index = Math.floor(Math.random() * RANDOM_DREAM_PROMPTS.length);
  dreamText.value = RANDOM_DREAM_PROMPTS[index];
}

function handleToggleVoiceRecording() {
  if (isRecording.value) {
    isRecording.value = false;
    uni.showToast({ title: '语音录入完成！', icon: 'success' });
    if (!dreamText.value.trim()) {
      dreamText.value = '今晨醒来前，梦见自己在一座发光的琉璃塔顶喝茶，脚下的云彩像极光一样缓缓变色。';
    }
  } else {
    isRecording.value = true;
    uni.showToast({ title: '开始聆听，请讲述你的梦境...', icon: 'none' });
  }
}



async function handleStartDecoding() {
  if (!dreamText.value.trim()) {
    uni.showToast({ title: '请先写下昨晚的梦境片段哦', icon: 'none' });
    return;
  }

  isAnalyzing.value = true;
  loadingStepText.value = '正在提取深层意象隐喻...';

  const timer1 = setTimeout(() => {
    loadingStepText.value = '构建多维潜意识雷达与气运推演...';
  }, 600);

  const timer2 = setTimeout(() => {
    loadingStepText.value = '生成超现实梦境插画与报告...';
  }, 1200);

  try {
    await dreamStore.decodeDream({
      dreamText: dreamText.value,
      personaId: selectedPersonaId.value,
      moodId: selectedMoodId.value,
      selectedTags: []
    });

    clearTimeout(timer1);
    clearTimeout(timer2);
    isAnalyzing.value = false;

    uni.navigateTo({
      url: '/pages_sub/result/result'
    });
  } catch (err) {
    isAnalyzing.value = false;
    uni.showToast({ title: '推演异常，请重试', icon: 'none' });
  }
}
</script>


<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  padding-bottom: 140rpx;
  position: relative;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 40rpx 30rpx 8rpx;
}

.vertical-deco {
  position: absolute;
  top: 40rpx;
  right: 15rpx;
  width: 50rpx;
  font-size: 32rpx;
  color: rgba(188, 49, 44, 0.35);
  font-family: "STKaiti", "KaiTi", serif;
  letter-spacing: 12rpx;
  writing-mode: vertical-rl;
  z-index: 10;
  pointer-events: none;
}


  /* 漂浮莲花与顶部装饰 */
  .floating-lotus {
    position: absolute;
    pointer-events: none;
    z-index: 1;
  }
  .lotus-bg {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23c2956e' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M32 50 C 32 50, 18 36, 32 10 C 46 36, 32 50, 32 50 Z' /%3E%3Cpath d='M32 50 C 32 50, 10 40, 14 22 C 22 28, 32 40, 32 40' /%3E%3Cpath d='M32 50 C 32 50, 54 40, 50 22 C 42 28, 32 40, 32 40' /%3E%3Cpath d='M30 48 C 30 48, -2 38, 4 28 C 12 36, 22 44, 22 44' /%3E%3Cpath d='M34 48 C 34 48, 66 38, 60 28 C 52 36, 42 44, 42 44' /%3E%3C/g%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  
  .lotus-1 {
    width: 80rpx; height: 80rpx; top: -20rpx; left: 40rpx;
    opacity: 0; --op: 0.45; animation: fallLotus 10s linear infinite;
  }
  .lotus-2 {
    width: 50rpx; height: 50rpx; top: -40rpx; right: 60rpx;
    opacity: 0; --op: 0.35; animation: fallLotus 12s linear infinite 2s;
  }
  .lotus-3 {
    width: 30rpx; height: 30rpx; top: 10rpx; left: 120rpx;
    opacity: 0; --op: 0.25; animation: fallLotus 14s linear infinite 5s;
  }
  .lotus-4 {
    width: 45rpx; height: 45rpx; top: -10rpx; right: 140rpx;
    opacity: 0; --op: 0.3; animation: fallLotus 11s linear infinite 1s;
  }
  .lotus-5 {
    width: 25rpx; height: 25rpx; top: 30rpx; left: 20rpx;
    opacity: 0; --op: 0.25; animation: fallLotus 13s linear infinite 7s;
  }
  .lotus-6 {
    width: 35rpx; height: 35rpx; top: -30rpx; right: 40rpx;
    opacity: 0; --op: 0.3; animation: fallLotus 15s linear infinite 4s;
  }
  
  @keyframes fallLotus {
    0% { transform: translate(0, -40rpx) rotate(-15deg); opacity: 0; }
    15% { opacity: var(--op); }
    85% { opacity: var(--op); }
    100% { transform: translate(30rpx, 220rpx) rotate(25deg); opacity: 0; }
  }

  .top-aesthetic-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 24rpx;
    opacity: 0.85;
  }
  .cloud-icon { font-size: 28rpx; color: #c2956e; font-weight: 300; }
  .cloud-icon.flip { transform: scaleX(-1); display: inline-block; }
  
  .time-stamp {
    display: flex; align-items: center; gap: 12rpx;
    padding: 6rpx 16rpx;
    border: 1px solid rgba(194, 149, 110, 0.3);
    border-radius: 6rpx; background: rgba(194, 149, 110, 0.03);
  }
  .shichen { font-size: 22rpx; color: #c2956e; font-weight: bold; letter-spacing: 4rpx; }
  .time-hint {
    font-size: 20rpx; color: #8c8c8c; border-left: 1px solid rgba(194, 149, 110, 0.3); padding-left: 12rpx;
  }

  /* Header */
.hero-header {
  margin-bottom: 50rpx;
  text-align: center;
  position: relative;
  padding-top: 30rpx;
  padding-bottom: 20rpx;

  .header-top-row {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20rpx;

    .hero-title {
      font-size: 68rpx;
      font-weight: 900;
      color: #1a1a1a;
      letter-spacing: 16rpx;
      font-family: "STZhongsong", "SimSun", serif;
      text-shadow: 0 4rpx 12rpx rgba(194, 149, 110, 0.15);
    }

    .settings-btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      padding: 20rpx;
      
      .settings-icon {
        font-size: 40rpx;
        color: #8a7369;
        opacity: 0.7;
        transition: opacity 0.3s;
      }
      &:active .settings-icon { opacity: 1; }
    }
  }

  .hero-sub {
    font-size: 26rpx;
    color: #6c635e;
    letter-spacing: 4rpx;
    font-family: "STKaiti", "KaiTi", serif;
  }
}

/* Input Card: 文房画笺·记梦古素帖 */
.input-card {
  padding: 36rpx 32rpx 30rpx 32rpx;
  margin-bottom: 48rpx;
  /* 素笺微透底色：温润米宣微透光质感 */
  background: rgba(254, 251, 246, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5rpx solid rgba(194, 149, 110, 0.38);
  border-radius: 12rpx;
  box-shadow: 0 8rpx 28rpx rgba(120, 90, 60, 0.05), inset 0 0 0 1rpx rgba(255, 255, 255, 0.9);
  position: relative;

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

  .scroll-header {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 20rpx;
    
    .sec-symbol {
      font-size: 22rpx;
      color: #b58252;
      font-weight: normal;
    }

    .text {
      font-size: 28rpx;
      font-weight: 900;
      color: #261c15;
      letter-spacing: 2rpx;
      font-family: "STZhongsong", "SimSun", "STKaiti", serif;
    }

    .header-seal {
      font-size: 16rpx;
      color: #bc312c;
      border: 1.5rpx solid #bc312c;
      background: rgba(188, 49, 44, 0.08);
      padding: 2rpx 8rpx;
      border-radius: 3rpx;
      font-family: "STKaiti", "KaiTi", serif;
      font-weight: bold;
      transform: rotate(-4deg);
      letter-spacing: 1rpx;
      margin-left: 6rpx;
    }
  }

  .dream-textarea {
    width: 100%;
    height: 220rpx;
    background: transparent;
    padding: 0;
    font-size: 28rpx;
    color: #261c15;
    line-height: 1.7;
    font-family: "STKaiti", "KaiTi", "SimSun", serif;
    margin-bottom: 16rpx;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px dashed rgba(184, 134, 81, 0.25);
    padding-top: 18rpx;

    .word-count {
      font-size: 22rpx;
      color: #9c8e84;
      font-family: "STKaiti", "KaiTi", serif;
      &.count-warn { color: #bc312c; }
    }

    .header-actions {
      display: flex;
      gap: 16rpx;

      .action-btn {
        display: flex;
        align-items: center;
        gap: 8rpx;
        background: rgba(246, 239, 226, 0.7);
        border: 1px solid rgba(194, 149, 110, 0.35);
        padding: 6rpx 20rpx;
        border-radius: 30rpx;
        box-shadow: 0 2rpx 6rpx rgba(110, 80, 50, 0.04);
        font-family: "STKaiti", "KaiTi", serif;
        transition: all 0.2s;

        .btn-icon { font-size: 22rpx; color: #6b5a4e; }
        .btn-text { font-size: 22rpx; color: #4a3d35; font-weight: 600; letter-spacing: 1rpx; }

        &.active {
          background: rgba(188, 49, 44, 0.08);
          border-color: #bc312c;
          .btn-icon, .btn-text { color: #bc312c; font-weight: bold; }
        }
      }
    }
  }
}

/* Sections */
.section-box {
  margin-bottom: 44rpx;

  &:last-child {
    margin-bottom: 12rpx;
  }

  .section-title-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 24rpx;
    gap: 8rpx;

    .title-left {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .sec-symbol {
        font-size: 24rpx;
        color: #b58252;
        font-weight: normal;
        line-height: 1;
      }

      .sec-title {
        font-size: 32rpx;
        font-weight: 900;
        color: #261c15;
        letter-spacing: 4rpx;
        font-family: "STZhongsong", "SimSun", "STKaiti", serif;
      }

      .stamp {
        font-size: 18rpx;
        color: #ffffff;
        background-color: #bc312c;
        border: 2rpx solid #a12b26;
        padding: 2rpx 10rpx;
        border-radius: 4rpx;
        font-weight: bold;
        font-family: "KaiTi", "STKaiti", serif;
        transform: rotate(-4deg);
        box-shadow: 2rpx 2rpx 0 rgba(188, 49, 44, 0.15);
        letter-spacing: 2rpx;
      }
    }

    .sec-desc {
      font-size: 22rpx;
      color: #8c827a;
      font-family: "STKaiti", "KaiTi", serif;
      letter-spacing: 1rpx;
      padding-left: 36rpx;
    }
  }
}

/* Personas: 宗师法门·问道秘卷 */
.persona-grid {
  display: flex;
  flex-direction: column;
  gap: 24rpx;

  .persona-card {
    background: rgba(255, 255, 255, 0.68);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1.5rpx solid rgba(194, 149, 110, 0.32);
    border-radius: 16rpx;
    padding: 26rpx;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 22rpx;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 4rpx 16rpx rgba(140, 110, 85, 0.04);
    position: relative;
    overflow: hidden;

    .persona-watermark {
      position: absolute;
      right: -6rpx;
      bottom: -18rpx;
      font-size: 150rpx;
      color: rgba(184, 134, 81, 0.06);
      font-family: "STKaiti", "KaiTi", "SimSun", serif;
      z-index: 0;
      pointer-events: none;
    }

    /* 古法玉印/铜徽头像框 */
    .persona-avatar-box {
      width: 78rpx;
      height: 78rpx;
      border-radius: 50%;
      background: radial-gradient(circle, #fcfaf5 0%, #efe4cf 100%);
      border: 2rpx solid rgba(194, 149, 110, 0.5);
      box-shadow: 0 3rpx 8rpx rgba(110, 80, 50, 0.08), inset 0 0 0 2rpx rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      flex-shrink: 0;
      z-index: 1;

      .persona-avatar {
        font-size: 38rpx;
        color: #2b1f16;
        font-weight: bold;
      }
    }

    .persona-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;
      z-index: 1;
      
      .persona-name-row {
        display: flex;
        align-items: center;
        gap: 16rpx;
      }

      .persona-name {
        font-size: 30rpx;
        font-weight: 900;
        color: #261c15;
        font-family: "STZhongsong", "SimSun", "STKaiti", serif;
        letter-spacing: 2rpx;
      }

      /* 古典长方小印牌 */
      .persona-tag {
        font-size: 20rpx;
        font-weight: 700;
        border: 1.5rpx solid;
        padding: 2rpx 12rpx;
        border-radius: 4rpx;
        font-family: "STKaiti", "KaiTi", serif;
        letter-spacing: 1rpx;
      }

      .persona-divider {
        width: 36rpx;
        height: 3rpx;
        background: rgba(184, 134, 81, 0.35);
        border-radius: 2rpx;
        margin: 6rpx 0;
      }

      .persona-desc {
        font-size: 23rpx;
        color: #5c5249;
        line-height: 1.5;
        font-family: "STKaiti", "KaiTi", serif;
        margin-bottom: 8rpx;
      }

      .persona-footer {
        display: flex;
        align-items: center;
        gap: 6rpx;
        font-size: 22rpx;
        font-weight: bold;
        font-family: "STKaiti", "KaiTi", serif;
        letter-spacing: 2rpx;
        opacity: 0.9;
      }
    }

    &.active {
      background: rgba(255, 255, 255, 0.94);
      border-color: rgba(184, 134, 81, 0.65);
      border-left: 6rpx solid #b88651;
      box-shadow: 0 10rpx 30rpx rgba(184, 134, 81, 0.15);
      transform: translateY(-3rpx);
      
      .persona-avatar-box {
        box-shadow: 0 4rpx 14rpx rgba(184, 134, 81, 0.25), inset 0 0 0 2rpx #fff;
        border-color: #b88651;
      }
    }
  }
}

/* Moods: 简单的古籍书封效果 (轻盈通透·与上方色调统一) */
.mood-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx 16rpx;
  padding: 10rpx 0;

  .mood-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 26rpx 8rpx 28rpx 12rpx;
    min-height: 196rpx;
    /* 与上方卡片一致的通透轻盈宣纸底色 */
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(194, 149, 110, 0.28);
    border-left: 6rpx solid rgba(184, 134, 81, 0.55); /* 柔和浅雅的书脊金线 */
    border-radius: 4rpx 10rpx 10rpx 4rpx;
    box-shadow: 
      inset 2rpx 0 0 rgba(184, 134, 81, 0.12),
      0 4rpx 14rpx rgba(120, 95, 70, 0.04);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;

    /* 图标：古籍封页墨拓 */
    .mood-icon {
      font-size: 42rpx;
      margin-bottom: 16rpx;
      filter: grayscale(0.85) sepia(0.6) brightness(0.65) contrast(1.2);
      opacity: 0.9;
      transition: all 0.3s ease;
      z-index: 1;
    }

    /* 字体：书封竖排题签小楷，陈年焦墨 */
    .mood-name {
      font-size: 24rpx;
      color: #2b1e15;
      font-family: "STKaiti", "KaiTi", "SimSun", serif;
      font-weight: 700;
      writing-mode: vertical-rl;
      letter-spacing: 12rpx;
      text-shadow: 0 0 1px rgba(43, 30, 21, 0.25);
      transition: color 0.3s;
      z-index: 1;
    }

    /* 倾斜朱砂小契印 */
    .mood-seal {
      position: absolute;
      right: 6rpx;
      top: 6rpx;
      width: 22rpx;
      height: 22rpx;
      border: 1.5rpx solid #bc312c;
      color: #bc312c;
      background: rgba(188, 49, 44, 0.08);
      font-size: 14rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "STKaiti", "KaiTi", serif;
      transform: rotate(-12deg);
      border-radius: 3rpx;
      z-index: 3;
    }

    /* 选中：书封微泛浅水红，书脊转为深朱砂红锦 */
    &.active {
      background: rgba(255, 255, 255, 0.94);
      border-color: rgba(188, 49, 44, 0.45);
      border-left: 6rpx solid #bc312c;
      box-shadow: 0 6rpx 20rpx rgba(188, 49, 44, 0.12);
      transform: translateY(-3rpx);

      .mood-icon {
        filter: sepia(1) saturate(4) hue-rotate(330deg) brightness(0.78);
        opacity: 1;
        transform: scale(1.08);
      }

      .mood-name {
        color: #8c1e18;
        font-weight: 900;
        text-shadow: 0 0 1px rgba(140, 30, 24, 0.35);
      }
    }
  }
}

/* Tags: 核心意象模块 (文房简匣托盘 · 温润玉竹签) */
.tags-container {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx 14rpx;
  padding: 24rpx 18rpx;
  box-sizing: border-box;
  /* 模块专属托盘背景：素雅轻透宣纸托盘 */
  background: rgba(255, 255, 255, 0.48);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5rpx solid rgba(194, 149, 110, 0.26);
  border-radius: 16rpx;
  box-shadow: 0 6rpx 20rpx rgba(120, 95, 70, 0.03), inset 0 0 0 1rpx rgba(255, 255, 255, 0.7);
  overflow: hidden;

  /* 背景隐约古典意象水墨水印 */
  &::before {
    content: '象';
    position: absolute;
    right: 8rpx;
    bottom: -28rpx;
    font-size: 190rpx;
    font-family: "STKaiti", "KaiTi", "SimSun", serif;
    color: rgba(184, 134, 81, 0.045);
    pointer-events: none;
    z-index: 0;
  }

  .cyber-tag {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64rpx;
    padding: 0 10rpx;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    /* 素雅玉竹微质感：清白素竹纹 */
    background: 
      repeating-linear-gradient(90deg, 
        rgba(184, 134, 81, 0.02) 0px, 
        rgba(184, 134, 81, 0.02) 1px, 
        transparent 1px, 
        transparent 5px
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(253, 249, 242, 0.88) 50%, rgba(247, 240, 230, 0.82) 100%);
    border: 1px solid rgba(194, 149, 110, 0.28);
    border-top: 2.5rpx solid rgba(184, 134, 81, 0.45); /* 柔和浅雅的竹简切口暗线 */
    border-bottom: 2.5rpx solid rgba(184, 134, 81, 0.45);
    border-radius: 4rpx;
    font-size: 24rpx;
    color: #382c24;
    font-family: "STKaiti", "KaiTi", serif;
    font-weight: 700;
    letter-spacing: 1.5rpx;
    text-shadow: 0 0 1px rgba(56, 44, 36, 0.18);
    box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.9), 0 2rpx 6rpx rgba(120, 95, 70, 0.04);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    &.active {
      background: linear-gradient(180deg, #ffffff 0%, #fdf2ee 50%, #fae6df 100%);
      border-color: rgba(188, 49, 44, 0.4);
      border-top: 2.5rpx solid #bc312c;
      border-bottom: 2.5rpx solid #bc312c;
      color: #8c1e18;
      font-weight: 900;
      text-shadow: 0 0 1px rgba(140, 30, 24, 0.35);
      box-shadow: inset 0 0 0 1rpx rgba(188, 49, 44, 0.15), 0 4rpx 14rpx rgba(188, 49, 44, 0.12);
      transform: translateY(-1rpx);
    }
  }
}

/* Fixed Bottom Bar */
.fixed-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 128rpx;
  box-sizing: border-box;
  padding: 20rpx 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(249, 246, 240, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 100;

  .decode-btn {
    width: 100%;
    margin: 0;
    padding: 0;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #c2956e, #a67b45);
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 44rpx;
    box-shadow: 0 8rpx 20rpx rgba(194, 149, 110, 0.3);
    
    .btn-icon { margin-left: 12rpx; }
  }
}

.disclaimer-footer {
  text-align: center;
  font-size: 22rpx;
  color: #a8988b;
  font-family: "STKaiti", "KaiTi", serif;
  padding: 8rpx 0 16rpx;
  margin-top: -12rpx;
  width: 100%;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(249, 246, 240, 0.95);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;

    .tai-chi-spinner {
      width: 80rpx;
      height: 80rpx;
      border: 4rpx solid #c2956e;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #2b2b2b;
      margin-top: 20rpx;
    }

    .loading-sub {
      font-size: 24rpx;
      color: #8c8c8c;
    }
  }
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;

  .modal-card {
    width: 100%;
    background: #fdfbf7;
    border-radius: 16rpx;
    padding: 40rpx;

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .modal-title { font-size: 32rpx; font-weight: bold; color: #2b2b2b; }
      .close-btn { font-size: 40rpx; color: #8c8c8c; padding: 10rpx; }
    }

    .modal-body {
      margin-bottom: 40rpx;

      .modal-desc {
        font-size: 24rpx;
        color: #595959;
        line-height: 1.5;
        margin-bottom: 30rpx;
        display: block;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 12rpx;

        .form-label { font-size: 24rpx; color: #2b2b2b; font-weight: bold; }
        .cyber-input {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          height: 80rpx;
          border-radius: 8rpx;
          padding: 0 20rpx;
          font-size: 28rpx;
          color: #2b2b2b;
        }
      }
    }

    .modal-footer {
      display: flex;
      gap: 20rpx;

      button {
        flex: 1;
        height: 80rpx;
        font-size: 28rpx;
      }
    }
  }
}



.settings-section {
  background: rgba(255, 255, 255, 0.03);
  padding: 20rpx;
  border-radius: 12rpx;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.section-heading {
  display: block;
  font-size: 26rpx;
  color: #cca26c;
  margin-bottom: 20rpx;
  font-weight: bold;
}
</style>

