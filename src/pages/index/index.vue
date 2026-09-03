
<template>
  <view class="page-container">
    <view class="vertical-deco">庄生晓梦迷蝴蝶，望帝春心托杜鹃</view>
    <view class="content-wrapper">
      
      <!-- 顶部 Header 品牌 -->
      <view class="hero-header">
        <view class="header-top-row">
          <text class="hero-title">梦源阁</text>
          
        </view>
        <text class="hero-sub">观落叶而知秋，入梦魇而观心</text>
      </view>

      <!-- 梦境输入主区域 (卷轴质感) -->
      <view class="glass-panel input-card">
        <view class="scroll-header">
          <text class="icon">✨</text>
          <text class="text">记述昨夜梦境</text>
        </view>
        
        <view class="corner top-left">⌜</view>
        <view class="corner bottom-right">⌟</view>
        <textarea
          v-model="dreamText"
          class="dream-textarea"
          placeholder="昨晚梦见了什么？例如：走在一条水墨长廊，尽头是一扇无门的红墙..."
          placeholder-style="color: #8c8c8c;"
          maxlength="500"
        ></textarea>
        
        <view class="card-footer">
          <text class="word-count" :class="{ 'count-warn': dreamText.length >= 480 }">
            {{ dreamText.length }}/500
          </text>
          <view class="header-actions">
            <view class="action-btn" :class="{ active: isRecording }" @tap="handleToggleVoiceRecording">
              <text class="btn-icon">🎙️</text>
              <text class="btn-text">{{ isRecording ? '聆听中...' : '语音' }}</text>
            </view>
            <view class="action-btn" @tap="handleRandomPrompt">
              <text class="btn-icon">🎲</text>
              <text class="btn-text">灵感</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 人格解梦流派 -->
      <view class="section-box">
        <view class="section-title-row">
          <view class="title-left">
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
          <text class="sec-title">梦境基调</text>
        </view>
        <view class="mood-grid">
          <view
            v-for="m in MOODS"
            :key="m.id"
            class="mood-item"
            :class="{ active: selectedMoodId === m.id }"
            @tap="selectedMoodId = m.id"
          >
            <text class="mood-icon">{{ m.icon }}</text>
            <text class="mood-name">{{ m.name }}</text>
          </view>
        </view>
      </view>

      <!-- 意象标签 -->
      <view class="section-box">
        <view class="section-title-row">
          <text class="sec-title">核心意象</text>
          <text class="sec-desc">(最多选 4 项)</text>
        </view>
        <view class="tags-container">
          <view
            v-for="tag in ELEMENT_TAGS"
            :key="tag"
            class="cyber-tag"
            :class="{ active: selectedTags.includes(tag) }"
            @tap="toggleTag(tag)"
          >
            {{ tag }}
          </view>
        </view>
      </view>
    </view>

    <!-- 底部固定解码按钮 -->
    <view class="fixed-bottom-bar">
      <button class="decode-btn cyber-btn-primary" @tap="handleStartDecoding">
        <text class="btn-text">记录我的梦境</text>
        <text class="btn-icon">🔮</text>
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
import { PERSONAS, MOODS, ELEMENT_TAGS, RANDOM_DREAM_PROMPTS } from '../../api/dreamEngine.js';
import { useDreamStore } from '../../store/dreamStore.js';

const dreamStore = useDreamStore();

const dreamText = ref('');
const selectedPersonaId = ref('zhougong');
const selectedMoodId = ref('absurd');
const selectedTags = ref(['坠落失重', '时钟倒流']);

const isAnalyzing = ref(false);
const loadingStepText = ref('正在焚香，静候梦兆...');
const isRecording = ref(false);




onMounted(() => {
  
  

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

function toggleTag(tag) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    if (selectedTags.value.length >= 4) {
      uni.showToast({ title: '最多选择4个意象标签', icon: 'none' });
      return;
    }
    selectedTags.value.push(tag);
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
      selectedTags: selectedTags.value
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
  padding-bottom: 160rpx;
  position: relative;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 40rpx 30rpx;
}

.vertical-deco {
  position: absolute;
  top: 140rpx;
  right: 20rpx;
  width: 50rpx;
  font-size: 32rpx;
  color: rgba(188, 49, 44, 0.1);
  font-family: "STKaiti", "KaiTi", serif;
  letter-spacing: 24rpx;
  writing-mode: vertical-rl;
  z-index: 0;
  pointer-events: none;
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

/* Input Card */
.input-card {
  padding: 40rpx;
  margin-bottom: 50rpx;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(194, 149, 110, 0.2);
  border-radius: 4rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.04);
  position: relative;

  .corner {
    position: absolute;
    font-size: 40rpx;
    color: #c2956e;
    opacity: 0.6;
    pointer-events: none;
    font-family: serif;
    
    &.top-left {
      top: 10rpx;
      left: 16rpx;
    }
    &.bottom-right {
      bottom: 110rpx;
      right: 16rpx;
    }
  }

  .scroll-header {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 20rpx;
    
    .icon { font-size: 30rpx; }
    .text {
      font-size: 28rpx;
      font-weight: bold;
      color: #2b2b2b;
    }
  }

  .dream-textarea {
    width: 100%;
    height: 240rpx;
    background: transparent;
    padding: 0;
    font-size: 28rpx;
    color: #2b2b2b;
    line-height: 1.6;
    margin-bottom: 20rpx;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px dashed rgba(0, 0, 0, 0.1);
    padding-top: 20rpx;

    .word-count {
      font-size: 22rpx;
      color: #8c8c8c;
      &.count-warn { color: #bc312c; }
    }

    .header-actions {
      display: flex;
      gap: 16rpx;

      .action-btn {
        display: flex;
        align-items: center;
        gap: 8rpx;
        background: rgba(0, 0, 0, 0.03);
        border: 1px solid rgba(0, 0, 0, 0.08);
        padding: 8rpx 20rpx;
        border-radius: 30rpx;
        transition: all 0.2s;

        .btn-icon { font-size: 24rpx; }
        .btn-text { font-size: 22rpx; color: #595959; }

        &.active {
          background: rgba(188, 49, 44, 0.1);
          border-color: #bc312c;
          .btn-text { color: #bc312c; }
        }
      }
    }
  }
}

/* Sections */
.section-box {
  margin-bottom: 40rpx;

  .section-title-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 24rpx;
    gap: 6rpx;

    .title-left {
      display: flex;
      align-items: center;
      gap: 16rpx;

      .sec-title {
        font-size: 34rpx;
        font-weight: bold;
        color: #2b2b2b;
        letter-spacing: 2rpx;
      }

      .stamp {
        font-size: 20rpx;
        color: #ffffff;
        background-color: #bc312c;
        border: 2rpx solid #a12b26;
        padding: 4rpx 10rpx;
        border-radius: 6rpx;
        font-weight: bold;
        font-family: "KaiTi", "STKaiti", serif;
        transform: rotate(-4deg);
        box-shadow: 4rpx 4rpx 0 rgba(188, 49, 44, 0.15);
        letter-spacing: 2rpx;
      }
    }

    .sec-desc {
      font-size: 22rpx;
      color: #8c8c8c;
    }
  }
}

/* Personas */
.persona-grid {
  display: flex;
  flex-direction: column;
  gap: 24rpx;

  .persona-card {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 24rpx;
    padding: 24rpx;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 20rpx;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 4rpx 16rpx rgba(110, 95, 85, 0.04);
    position: relative;
    overflow: hidden;

    .persona-watermark {
      position: absolute;
      right: -10rpx;
      bottom: -20rpx;
      font-size: 140rpx;
      color: rgba(194, 149, 110, 0.05);
      font-family: "STKaiti", "KaiTi", serif;
      z-index: 0;
      pointer-events: none;
    }

    .persona-avatar-box {
        width: 72rpx;
        height: 72rpx;
        border-radius: 50%;
        background: #ffffff;
        border: 2rpx solid rgba(255,255,255,1);
        box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        flex-shrink: 0;
        z-index: 1;

        .persona-avatar { font-size: 40rpx; }
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
        color: #332b26;
        font-family: "STZhongsong", "SimSun", serif;
        letter-spacing: 2rpx;
      }

      .persona-tag {
        font-size: 20rpx;
        font-weight: 600;
        border: 1px solid;
        padding: 2rpx 12rpx;
        border-radius: 100rpx;
      }

      .persona-divider {
        width: 32rpx;
        height: 4rpx;
        background: rgba(194, 149, 110, 0.3);
        border-radius: 4rpx;
        margin: 6rpx 0;
      }

      .persona-desc {
        font-size: 22rpx;
        color: #6c635e;
        line-height: 1.4;
        margin-bottom: 6rpx;
      }

      .persona-footer {
        display: flex;
        align-items: center;
        gap: 6rpx;
        font-size: 20rpx;
        font-weight: bold;
        opacity: 0.8;
      }
    }

    &.active {
      background: rgba(255, 255, 255, 0.9);
      border-color: #c2956e;
      box-shadow: 0 16rpx 40rpx rgba(194, 149, 110, 0.15);
      transform: translateY(-4rpx);
      
      .persona-avatar-box {
        box-shadow: 0 8rpx 20rpx rgba(194, 149, 110, 0.2);
      }
    }
  }
}

/* Moods */
.mood-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  justify-content: flex-start;
  padding: 10rpx 0;

  .mood-item {
    width: calc(33.33% - 14rpx);
    height: 140rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 24rpx;
    gap: 12rpx;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 4rpx 12rpx rgba(110, 95, 85, 0.04);
    box-sizing: border-box;

    .mood-icon { 
      font-size: 40rpx; 
      transition: transform 0.3s;
    }
    .mood-name { 
      font-size: 22rpx; 
      color: #6c635e; 
      font-weight: 500;
    }

    &.active {
      background: rgba(255, 255, 255, 0.95);
      border-color: #5c8984;
      box-shadow: 0 8rpx 24rpx rgba(92, 137, 132, 0.15);
      transform: translateY(-4rpx);
      
      .mood-icon { transform: scale(1.1); }
      .mood-name { font-weight: 800; color: #5c8984; }
    }
  }
}

/* Tags */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
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

.disclaimer-footer {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  padding: 40rpx 0;
  width: 100%;
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

