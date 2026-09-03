const fs = require('fs');

const scriptContent = `
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

const showSettings = ref(false);
const customApiKey = ref('');

onMounted(() => {
  customApiKey.value = dreamStore.settings.apiKey || '';
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

function handleSaveSettings() {
  dreamStore.updateSettings({ apiKey: customApiKey.value.trim() });
  showSettings.value = false;
  uni.showToast({ title: '天机引擎配置已更新', icon: 'success' });
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
`;

const templateContent = `
<template>
  <view class="page-container">
    <view class="content-wrapper">
      
      <!-- 顶部 Header 品牌 -->
      <view class="hero-header">
        <view class="header-top-row">
          <text class="hero-title">梦源阁</text>
          <view class="settings-btn" @tap="showSettings = true">
            <text class="settings-icon">⚙️</text>
          </view>
        </view>
        <text class="hero-sub">观落叶而知秋，入梦魇而观心</text>
      </view>

      <!-- 梦境输入主区域 (卷轴质感) -->
      <view class="glass-panel input-card">
        <view class="scroll-header">
          <text class="icon">✨</text>
          <text class="text">记述昨夜梦境</text>
        </view>
        
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
            <view class="persona-header">
              <text class="persona-name">{{ p.name }}</text>
              <view class="persona-avatar-box" :style="{ borderColor: selectedPersonaId === p.id ? p.color : '#e0e0e0' }">
                <text class="persona-avatar">{{ p.avatar }}</text>
              </view>
            </view>
            <text class="persona-tag" :style="{ color: p.color }">{{ p.tag }}</text>
            <text class="persona-desc">{{ p.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 情绪基调 -->
      <view class="section-box">
        <view class="section-title-row">
          <text class="sec-title">梦境基调</text>
        </view>
        <view class="mood-scroll">
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

    <!-- API 设置弹窗 -->
    <view class="modal-overlay" v-if="showSettings">
      <view class="glass-panel modal-card">
        <view class="modal-header">
          <text class="modal-title">天机引擎设置</text>
          <text class="close-btn" @tap="showSettings = false">×</text>
        </view>
        <view class="modal-body">
          <text class="modal-desc">此应用由 Gemini AI 强力驱动，你可以填入自己的 API Key 进行专属梦境推演。</text>
          <view class="form-group">
            <text class="form-label">Gemini API Key</text>
            <input
              v-model="customApiKey"
              type="text"
              class="cyber-input"
              placeholder="AIzaSy..."
              password
            />
          </view>
        </view>
        <view class="modal-footer">
          <button class="cyber-btn-secondary" @tap="showSettings = false">取消</button>
          <button class="cyber-btn-primary" @tap="handleSaveSettings">保存配置</button>
        </view>
      </view>
    </view>
  </view>
</template>
`;

const styleContent = `
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

/* Header */
.hero-header {
  margin-bottom: 40rpx;
  text-align: center;
  position: relative;

  .header-top-row {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12rpx;

    .hero-title {
      font-size: 52rpx;
      font-weight: bold;
      color: #2b2b2b;
      letter-spacing: 4rpx;
      font-family: "STZhongsong", "SimSun", serif;
    }

    .settings-btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      padding: 10rpx;
      
      .settings-icon {
        font-size: 32rpx;
      }
    }
  }

  .hero-sub {
    font-size: 24rpx;
    color: #595959;
    letter-spacing: 2rpx;
  }
}

/* Input Card */
.input-card {
  padding: 30rpx;
  margin-bottom: 40rpx;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);

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
        font-size: 18rpx;
        color: #bc312c;
        border: 1px solid #bc312c;
        padding: 2rpx 6rpx;
        border-radius: 4rpx;
        font-weight: bold;
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
  gap: 20rpx;

  .persona-card {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12rpx;
    padding: 24rpx;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 20rpx;
    transition: all 0.3s ease;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);

    .persona-avatar-box {
        width: 80rpx;
        height: 80rpx;
        border-radius: 8rpx;
        background: #fdfbf7;
        border: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        flex-shrink: 0;

        .persona-avatar { font-size: 40rpx; }
    }

    .persona-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;
      
      .persona-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #2b2b2b;
      }

      .persona-tag {
        font-size: 20rpx;
        font-weight: 500;
        border: 1px solid;
        padding: 2rpx 10rpx;
        border-radius: 4rpx;
        width: fit-content;
      }

      .persona-desc {
        font-size: 22rpx;
        color: #595959;
        line-height: 1.5;
        margin-top: 4rpx;
      }
    }

    &.active {
      background: #ffffff;
      border-color: #c2956e;
      box-shadow: 0 8rpx 24rpx rgba(194, 149, 110, 0.15);
      transform: translateY(-2rpx);
      
      .persona-avatar-box {
        background: rgba(194, 149, 110, 0.1);
      }
    }
  }
}

/* Moods */
.mood-scroll {
  display: flex;
  overflow-x: auto;
  gap: 20rpx;
  padding-bottom: 10rpx;

  &::-webkit-scrollbar { display: none; }

  .mood-item {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 130rpx;
    height: 130rpx;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 12rpx;
    gap: 12rpx;
    transition: all 0.3s;

    .mood-icon { font-size: 40rpx; }
    .mood-name { font-size: 24rpx; color: #595959; }

    &.active {
      background: #ffffff;
      border-color: #5c8984;
      .mood-name { font-weight: bold; color: #5c8984; }
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
  padding: 24rpx 40rpx calc(24rpx + env(safe-area-inset-bottom));
  background: rgba(249, 246, 240, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 100;

  .decode-btn {
    height: 88rpx;
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
</style>
`;

fs.writeFileSync('src/pages/index/index.vue', templateContent + '\n' + scriptContent + '\n' + styleContent, 'utf8');
console.log('Successfully wrote index.vue');
