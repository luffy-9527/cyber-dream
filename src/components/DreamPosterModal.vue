<template>
  <view v-if="visible" class="modal-mask" @touchmove.stop.prevent>
    <view class="modal-container glass-panel-glow">
      <!-- 关闭按钮 -->
      <view class="close-btn" @tap="handleClose">✕</view>

      <view class="modal-header">
        <text class="modal-title neon-text-cyan">✨ 梦境拍立得生成器</text>
        <text class="modal-subtitle">长按可保存海报或点击下方按钮</text>
      </view>

      <!-- 海报预览区域 -->
      <view class="poster-preview-card" id="posterCard">
        <!-- 顶部插画 -->
        <view class="poster-img-box">
          <image :src="dream.illustrationUrl" mode="aspectFill" class="poster-img" />
          <view class="poster-badge" :style="{ background: dream.colorTheme || '#00f2fe' }">
            {{ dream.persona?.name || '赛博周公' }}
          </view>
        </view>

        <!-- 梦境标题与代号 -->
        <view class="poster-body">
          <view class="poster-title">{{ dream.title }}</view>
          <view class="poster-date">{{ dream.date }} · 潜意识深度观测</view>
          
          <view class="poster-quote">
            {{ dream.quote || '“一切未至之境，早已在午夜的脑波中完成推演。”' }}
          </view>

          <!-- 象征物标签 -->
          <view class="poster-tags">
            <view v-for="(sym, idx) in (dream.symbols || []).slice(0, 3)" :key="idx" class="poster-tag">
              {{ sym.icon }} {{ sym.name }}
            </view>
          </view>

          <!-- 底部小程序码与品牌 -->
          <view class="poster-footer">
            <view class="brand-info">
              <text class="brand-name neon-text-cyan">CyberDream · 梦源阁</text>
              <text class="brand-slogan">探索人类潜意识的高维视界</text>
            </view>
            <view class="qrcode-mock">
              <view class="qr-grid">
                <text class="qr-icon">🪐</text>
              </view>
              <text class="qr-tip">扫码入梦</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 离屏 Canvas (用于真实导出图片) -->
      <canvas
        canvas-id="shareCanvas"
        id="shareCanvas"
        class="hidden-canvas"
        style="width: 375px; height: 600px; position: fixed; left: -9999px; top: -9999px;"
      ></canvas>

      <!-- 底部操作按钮 -->
      <view class="action-btns">
        <button class="cyber-btn-secondary btn-item" @tap="handleShareFriend">
          <text class="btn-icon">💬</text> 转发给好友
        </button>
        <button class="cyber-btn-primary btn-item" :loading="isSaving" @tap="handleSaveImage">
          <text class="btn-icon">📥</text> 保存到相册
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  dream: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:visible', 'close']);
const isSaving = ref(false);

function handleClose() {
  emit('update:visible', false);
  emit('close');
}

function handleShareFriend() {
  uni.showToast({
    title: '点击右上角【...】可直接分享给好友',
    icon: 'none',
    duration: 2500
  });
}

/**
 * 绘制并保存海报
 */
function handleSaveImage() {
  isSaving.value = true;
  uni.showLoading({ title: '正在渲染海报...' });

  const ctx = uni.createCanvasContext('shareCanvas');
  const width = 375;
  const height = 600;

  // 1. 绘制深色背景
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#0c0e23');
  grad.addColorStop(1, '#060711');
  ctx.setFillStyle(grad);
  ctx.fillRect(0, 0, width, height);

  // 2. 绘制顶部赛博发光流线
  ctx.setStrokeStyle('#00f2fe');
  ctx.setLineWidth(2);
  ctx.beginPath();
  ctx.moveTo(20, 20);
  ctx.lineTo(width - 20, 20);
  ctx.stroke();

  // 3. 绘制文字信息
  ctx.setFillStyle('#00f2fe');
  ctx.setFontSize(18);
  ctx.fillText('CYBER DREAM · 梦境档案', 24, 55);

  ctx.setFillStyle('#f8fafc');
  ctx.setFontSize(22);
  const titleText = props.dream.title || '「潜意识奇幻异界」';
  ctx.fillText(titleText, 24, 100);

  ctx.setFillStyle('#94a3b8');
  ctx.setFontSize(12);
  ctx.fillText(`${props.dream.date || '2026.08.31'} | 解梦师: ${props.dream.persona?.name || '赛博周公'}`, 24, 125);

  // 4. 绘制金句引用框
  ctx.setFillStyle('rgba(255, 255, 255, 0.06)');
  ctx.fillRect(20, 145, width - 40, 80);
  ctx.setStrokeStyle('rgba(0, 242, 254, 0.3)');
  ctx.strokeRect(20, 145, width - 40, 80);

  ctx.setFillStyle('#e2e8f0');
  ctx.setFontSize(13);
  const quote = props.dream.quote || '一切未至之境，早已在午夜的脑波中完成推演。';
  // 简易换行绘制
  if (quote.length > 22) {
    ctx.fillText(quote.substring(0, 22), 32, 175);
    ctx.fillText(quote.substring(22, 44), 32, 198);
  } else {
    ctx.fillText(quote, 32, 185);
  }

  // 5. 绘制梦境解析核心
  ctx.setFillStyle('#94a3b8');
  ctx.setFontSize(13);
  ctx.fillText('【潜意识解码】', 24, 255);

  ctx.setFillStyle('#cbd5e1');
  const summary = props.dream.summary || '潜意识正在打破现存束缚，重构高维自性。';
  if (summary.length > 24) {
    ctx.fillText(summary.substring(0, 24), 24, 280);
    ctx.fillText(summary.substring(24, 48), 24, 302);
  } else {
    ctx.fillText(summary, 24, 280);
  }

  // 6. 绘制象征物胶囊
  let tagX = 24;
  const symbols = (props.dream.symbols || []).slice(0, 3);
  symbols.forEach(sym => {
    ctx.setFillStyle('rgba(0, 242, 254, 0.15)');
    ctx.fillRect(tagX, 330, 95, 28);
    ctx.setStrokeStyle('#00f2fe');
    ctx.strokeRect(tagX, 330, 95, 28);
    ctx.setFillStyle('#00f2fe');
    ctx.setFontSize(11);
    ctx.fillText(`${sym.name}`, tagX + 10, 348);
    tagX += 105;
  });

  // 7. 绘制底部品牌与二维码
  ctx.setFillStyle('rgba(255, 255, 255, 0.1)');
  ctx.fillRect(20, 480, width - 40, 90);

  ctx.setFillStyle('#00f2fe');
  ctx.setFontSize(15);
  ctx.fillText('CyberDream · 梦源阁', 36, 518);
  ctx.setFillStyle('#64748b');
  ctx.setFontSize(11);
  ctx.fillText('微信小程序搜索「梦源阁」记录你的梦', 36, 545);

  ctx.draw(false, () => {
    setTimeout(() => {
      uni.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        success: res => {
          uni.hideLoading();
          isSaving.value = false;
          // 保存到相册
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              uni.showToast({ title: '已成功保存至相册！', icon: 'success' });
            },
            fail: () => {
              uni.showToast({ title: '保存失败或未授权相册权限', icon: 'none' });
            }
          });
        },
        fail: err => {
          uni.hideLoading();
          isSaving.value = false;
          console.error('Canvas export error:', err);
          uni.showToast({ title: '海报导出失败', icon: 'none' });
        }
      });
    }, 200);
  });
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(4, 6, 15, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx;
}

.modal-container {
  width: 100%;
  max-width: 660rpx;
  max-height: 92vh;
  padding: 36rpx 28rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 20rpx;
  right: 24rpx;
  font-size: 36rpx;
  color: #94a3b8;
  padding: 10rpx;
  z-index: 10;
}

.modal-header {
  text-align: center;
  margin-bottom: 24rpx;

  .modal-title {
    font-size: 34rpx;
    font-weight: bold;
    display: block;
  }

  .modal-subtitle {
    font-size: 22rpx;
    color: #64748b;
    margin-top: 6rpx;
    display: block;
  }
}

.poster-preview-card {
  width: 100%;
  background: #0f1124;
  border: 1px solid rgba(0, 242, 254, 0.35);
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.6);
}

.poster-img-box {
  position: relative;
  width: 100%;
  height: 320rpx;

  .poster-img {
    width: 100%;
    height: 100%;
  }

  .poster-badge {
    position: absolute;
    top: 18rpx;
    right: 18rpx;
    font-size: 20rpx;
    color: #0b0c1b;
    font-weight: bold;
    padding: 6rpx 18rpx;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.4);
  }
}

.poster-body {
  padding: 24rpx;
}

.poster-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #f8fafc;
}

.poster-date {
  font-size: 22rpx;
  color: #00f2fe;
  margin-top: 6rpx;
}

.poster-quote {
  margin-top: 18rpx;
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.04);
  border-left: 4rpx solid #00f2fe;
  font-size: 24rpx;
  color: #cbd5e1;
  line-height: 1.5;
  font-style: italic;
}

.poster-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 20rpx;

  .poster-tag {
    font-size: 20rpx;
    padding: 6rpx 16rpx;
    background: rgba(0, 242, 254, 0.1);
    border: 1px solid rgba(0, 242, 254, 0.3);
    border-radius: 16rpx;
    color: #00f2fe;
  }
}

.poster-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 26rpx;
  padding-top: 20rpx;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);

  .brand-info {
    .brand-name {
      font-size: 24rpx;
      font-weight: bold;
      display: block;
    }
    .brand-slogan {
      font-size: 18rpx;
      color: #64748b;
      margin-top: 4rpx;
      display: block;
    }
  }

  .qrcode-mock {
    display: flex;
    flex-direction: column;
    align-items: center;

    .qr-grid {
      width: 70rpx;
      height: 70rpx;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(0, 242, 254, 0.4);
      border-radius: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
    }

    .qr-tip {
      font-size: 16rpx;
      color: #94a3b8;
      margin-top: 4rpx;
    }
  }
}

.action-btns {
  display: flex;
  gap: 20rpx;
  width: 100%;
  margin-top: 28rpx;

  .btn-item {
    flex: 1;
    height: 76rpx;
    font-size: 26rpx;
  }

  .btn-icon {
    margin-right: 8rpx;
  }
}
</style>
