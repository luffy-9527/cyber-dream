<template>
  <view v-if="visible" class="modal-mask" @touchmove.stop.prevent>
    <view class="modal-container">
      <!-- 关闭按钮 -->
      <view class="close-btn" @tap="handleClose">✕</view>

      <view class="modal-header">
        <text class="modal-title">❖ 梦境画轴 · 题诗锦图</text>
        <text class="modal-subtitle">长按可保存海报或点击下方按钮</text>
      </view>

      <!-- 海报预览区域 -->
      <view class="poster-preview-card" id="posterCard">
        <!-- 顶部插画 -->
        <view class="poster-img-box">
          <image :src="dream.illustrationUrl" mode="aspectFill" class="poster-img" />
          <view class="poster-badge">
            {{ dream.persona?.name || '赛博周公' }}
          </view>
        </view>

        <!-- 梦境标题与代号 -->
        <view class="poster-body">
          <view class="poster-title-row">
            <text class="poster-title">{{ dream.title }}</text>
            <text class="poster-seal">梦兆</text>
          </view>
          <view class="poster-date">观星纪候：{{ dream.date }} · 潜意识深度观测</view>
          
          <view class="poster-quote">
            {{ dream.quote || '“一切未至之境，早已在午夜的脑波中完成推演。”' }}
          </view>

          <!-- 象征物标签 (竹简词签风格) -->
          <view class="poster-tags">
            <view v-for="(sym, idx) in (dream.symbols || []).slice(0, 3)" :key="idx" class="poster-tag">
              {{ sym.icon }} {{ sym.name }}
            </view>
          </view>

          <!-- 底部小程序码与品牌 -->
          <view class="poster-footer">
            <view class="brand-info">
              <text class="brand-name">CyberDream · 梦源阁</text>
              <text class="brand-slogan">探索人类潜意识的高维视界</text>
            </view>
            <view class="qrcode-mock">
              <view class="qr-grid">
                <text class="qr-icon">印</text>
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
        style="width: 375px; height: 620px; position: fixed; left: 100vw; top: 0; z-index: -99; pointer-events: none;"
      ></canvas>

      <!-- 底部操作按钮 -->
      <view class="action-btns">
        <button class="cyber-btn-secondary btn-item" open-type="share">
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
import { ref, getCurrentInstance } from 'vue';

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
const instance = getCurrentInstance();

function handleClose() {
  emit('update:visible', false);
  emit('close');
}

/**
 * 尝试获取图片本地临时路径 (支持超时保护)
 */
async function getImageLocalPath(url) {
  if (!url) return null;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return url;
  }
  return new Promise(resolve => {
    const timer = setTimeout(() => {
      console.warn('Get image info timeout, skipping image download');
      resolve(null);
    }, 2000);

    uni.getImageInfo({
      src: url,
      success: res => {
        clearTimeout(timer);
        resolve(res.path);
      },
      fail: err => {
        clearTimeout(timer);
        console.warn('Get image info failed:', err);
        resolve(null);
      }
    });
  });
}

/**
 * 绘制并保存海报 (古典宣纸画轴)
 */
async function handleSaveImage() {
  if (isSaving.value) return;
  isSaving.value = true;
  uni.showLoading({ title: '正在题跋绘卷...' });

  const safetyTimer = setTimeout(() => {
    if (isSaving.value) {
      isSaving.value = false;
      uni.hideLoading();
      uni.showToast({ title: '生成海报超时，请重试', icon: 'none' });
    }
  }, 8000);

  try {
    const localImg = await getImageLocalPath(props.dream?.illustrationUrl);
    const ctx = uni.createCanvasContext('shareCanvas', instance?.proxy);
    const width = 375;
    const height = 620;

    // 1. 绘制温润宣纸背景
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#fcfaf5');
    grad.addColorStop(1, '#f3ede0');
    ctx.setFillStyle(grad);
    ctx.fillRect(0, 0, width, height);

    // 外圈双线装裱框
    ctx.setStrokeStyle('rgba(184, 134, 81, 0.45)');
    ctx.setLineWidth(1.5);
    ctx.strokeRect(12, 12, width - 24, height - 24);
    ctx.setStrokeStyle('rgba(184, 134, 81, 0.2)');
    ctx.setLineWidth(1);
    ctx.strokeRect(16, 16, width - 32, height - 32);

    let currentY = 24;

    // 2. 插画绘制 (若获取到本地路径则绘制图，否则绘制优雅留白中堂框)
    if (localImg) {
      ctx.drawImage(localImg, 24, currentY, width - 48, 165);
      // 插画金色边框
      ctx.setStrokeStyle('rgba(184, 134, 81, 0.35)');
      ctx.setLineWidth(1);
      ctx.strokeRect(24, currentY, width - 48, 165);
      currentY += 180;
    } else {
      // 优雅替代框
      ctx.setFillStyle('rgba(184, 134, 81, 0.06)');
      ctx.fillRect(24, currentY, width - 48, 48);
      ctx.setStrokeStyle('rgba(184, 134, 81, 0.3)');
      ctx.strokeRect(24, currentY, width - 48, 48);
      ctx.setFillStyle('#8e6238');
      ctx.setFontSize(14);
      ctx.fillText('❖ 梦源阁 · 太虚画卷', 36, currentY + 30);
      currentY += 65;
    }

    // 3. 梦境标题
    ctx.setFillStyle('#261c15');
    ctx.setFontSize(20);
    const titleText = props.dream?.title || '「潜意识奇幻异界」';
    ctx.fillText(titleText, 26, currentY + 18);

    // 日期
    ctx.setFillStyle('#8c7a6e');
    ctx.setFontSize(12);
    ctx.fillText(`观星纪候：${props.dream?.date || '2026.09.04'} | 解梦宗师: ${props.dream?.persona?.name || '赛博周公'}`, 26, currentY + 40);

    currentY += 56;

    // 4. 绘制金句引用框 (朱批水墨)
    ctx.setFillStyle('rgba(184, 134, 81, 0.08)');
    ctx.fillRect(24, currentY, width - 48, 68);
    ctx.setStrokeStyle('#bc312c');
    ctx.setLineWidth(3);
    ctx.beginPath();
    ctx.moveTo(24, currentY);
    ctx.lineTo(24, currentY + 68);
    ctx.stroke();

    ctx.setFillStyle('#2b1f16');
    ctx.setFontSize(12);
    const quote = props.dream?.quote || '一切未至之境，早已在午夜的脑波中完成推演。';
    if (quote.length > 24) {
      ctx.fillText(quote.substring(0, 24), 36, currentY + 28);
      ctx.fillText(quote.substring(24, 48), 36, currentY + 48);
    } else {
      ctx.fillText(quote, 36, currentY + 38);
    }

    currentY += 82;

    // 5. 核心定论
    ctx.setFillStyle('#bc312c');
    ctx.setFontSize(12);
    ctx.fillText('【天机定论】', 26, currentY + 14);

    ctx.setFillStyle('#4a3d35');
    ctx.setFontSize(12);
    const summary = props.dream?.summary || '潜意识正在打破现存束缚，重构高维自性。';
    if (summary.length > 25) {
      ctx.fillText(summary.substring(0, 25), 26, currentY + 34);
      ctx.fillText(summary.substring(25, 50), 26, currentY + 52);
    } else {
      ctx.fillText(summary, 26, currentY + 36);
    }

    currentY += 72;

    // 6. 绘制象征物竹简签
    let tagX = 26;
    const symbols = (props.dream?.symbols || []).slice(0, 3);
    symbols.forEach(sym => {
      ctx.setFillStyle('#ffffff');
      ctx.fillRect(tagX, currentY, 96, 26);
      ctx.setStrokeStyle('rgba(184, 134, 81, 0.45)');
      ctx.setLineWidth(1);
      ctx.strokeRect(tagX, currentY, 96, 26);
      // 上下暗木边
      ctx.setStrokeStyle('#8e6238');
      ctx.setLineWidth(2);
      ctx.beginPath();
      ctx.moveTo(tagX, currentY);
      ctx.lineTo(tagX + 96, currentY);
      ctx.moveTo(tagX, currentY + 26);
      ctx.lineTo(tagX + 96, currentY + 26);
      ctx.stroke();

      ctx.setFillStyle('#382c24');
      ctx.setFontSize(11);
      ctx.fillText(`${sym.name}`, tagX + 12, currentY + 17);
      tagX += 106;
    });

    // 7. 底部品牌与印章
    const footerY = height - 76;
    ctx.setFillStyle('rgba(184, 134, 81, 0.08)');
    ctx.fillRect(24, footerY, width - 48, 54);
    ctx.setStrokeStyle('rgba(184, 134, 81, 0.3)');
    ctx.setLineWidth(1);
    ctx.strokeRect(24, footerY, width - 48, 54);

    ctx.setFillStyle('#261c15');
    ctx.setFontSize(14);
    ctx.fillText('CyberDream · 梦源阁', 38, footerY + 24);
    ctx.setFillStyle('#8c7a6e');
    ctx.setFontSize(10);
    ctx.fillText('微信小程序搜索「梦源阁」记录你的梦', 38, footerY + 42);

    // 印章方印
    ctx.setFillStyle('#bc312c');
    ctx.setStrokeStyle('#bc312c');
    ctx.strokeRect(width - 66, footerY + 11, 32, 32);
    ctx.setFontSize(16);
    ctx.fillText('印', width - 57, footerY + 33);

    // 绘制并导出
    ctx.draw(false);

    // 延时等待绘制完成，避免微信小程序的 draw 回调不触发问题
    setTimeout(() => {
      uni.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        destWidth: 750,
        destHeight: 1240,
        fileType: 'png',
        quality: 1,
        success: res => {
          clearTimeout(safetyTimer);
          // 保存至相册
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              uni.hideLoading();
              isSaving.value = false;
              uni.showToast({ title: '已成功题跋存入相册！', icon: 'success' });
            },
            fail: albumErr => {
              uni.hideLoading();
              isSaving.value = false;
              console.warn('saveImageToPhotosAlbum fail:', albumErr);
              if (albumErr.errMsg && (albumErr.errMsg.includes('auth') || albumErr.errMsg.includes('deny'))) {
                uni.showModal({
                  title: '需要相册权限',
                  content: '请在设置中开启相册权限以保存画轴海报',
                  confirmText: '去开启',
                  success: mRes => {
                    if (mRes.confirm) uni.openSetting();
                  }
                });
              } else {
                uni.showToast({ title: '保存已取消或未授权', icon: 'none' });
              }
            }
          });
        },
        fail: err => {
          clearTimeout(safetyTimer);
          uni.hideLoading();
          isSaving.value = false;
          console.error('canvasToTempFilePath failed:', err);
          uni.showToast({ title: '海报导出失败，请重试', icon: 'none' });
        }
      }, instance?.proxy);
    }, 400);

  } catch (err) {
    clearTimeout(safetyTimer);
    uni.hideLoading();
    isSaving.value = false;
    console.error('handleSaveImage error:', err);
    uni.showToast({ title: '渲染发生错误', icon: 'none' });
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(20, 16, 12, 0.78);
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
  padding: 36rpx 28rpx 32rpx 28rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  background: rgba(250, 246, 240, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5rpx solid rgba(194, 149, 110, 0.4);
  border-radius: 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(70, 50, 30, 0.28);
}

.close-btn {
  position: absolute;
  top: 20rpx;
  right: 24rpx;
  font-size: 34rpx;
  color: #8c7a6e;
  padding: 10rpx;
  z-index: 10;
}

.modal-header {
  text-align: center;
  margin-bottom: 24rpx;

  .modal-title {
    font-size: 32rpx;
    font-weight: 900;
    color: #261c15;
    font-family: "STZhongsong", "SimSun", serif;
    letter-spacing: 2rpx;
    display: block;
  }

  .modal-subtitle {
    font-size: 22rpx;
    color: #8c7a6e;
    font-family: "STKaiti", "KaiTi", serif;
    margin-top: 6rpx;
    display: block;
  }
}

.poster-preview-card {
  width: 100%;
  background: #faf6f0;
  border: 1.5rpx solid rgba(194, 149, 110, 0.45);
  border-radius: 18rpx;
  overflow: hidden;
  box-shadow: 
    inset 0 0 0 4rpx #faf6f0,
    inset 0 0 0 6rpx rgba(184, 134, 81, 0.3),
    0 12rpx 36rpx rgba(110, 80, 50, 0.12);
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
    color: #261c15;
    background: rgba(255, 255, 255, 0.9);
    border: 1.5rpx solid rgba(194, 149, 110, 0.5);
    font-family: "STKaiti", "KaiTi", serif;
    font-weight: bold;
    padding: 6rpx 18rpx;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(110, 80, 50, 0.15);
  }
}

.poster-body {
  padding: 24rpx;
}

.poster-title-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.poster-title {
  font-size: 32rpx;
  font-weight: 900;
  color: #261c15;
  font-family: "STZhongsong", "SimSun", serif;
  letter-spacing: 1.5rpx;
}

.poster-seal {
  font-size: 16rpx;
  color: #bc312c;
  border: 1.5rpx solid #bc312c;
  background: rgba(188, 49, 44, 0.08);
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
  font-family: "STKaiti", serif;
  font-weight: bold;
  transform: rotate(-4deg);
}

.poster-date {
  font-size: 22rpx;
  color: #8c7a6e;
  font-family: "STKaiti", "KaiTi", serif;
  margin-top: 6rpx;
}

.poster-quote {
  margin-top: 18rpx;
  padding: 16rpx 18rpx;
  background: rgba(184, 134, 81, 0.08);
  border-left: 5rpx solid #bc312c;
  font-size: 24rpx;
  color: #3d2f26;
  font-family: "STKaiti", "KaiTi", serif;
  line-height: 1.55;
  font-style: normal;
}

.poster-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 20rpx;

  .poster-tag {
    font-size: 21rpx;
    padding: 6rpx 16rpx;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(194, 149, 110, 0.35);
    border-top: 2rpx solid rgba(184, 134, 81, 0.5);
    border-bottom: 2rpx solid rgba(184, 134, 81, 0.5);
    border-radius: 4rpx;
    color: #3d2f26;
    font-family: "STKaiti", "KaiTi", serif;
    font-weight: 700;
  }
}

.poster-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 26rpx;
  padding-top: 20rpx;
  border-top: 1px dashed rgba(184, 134, 81, 0.25);

  .brand-info {
    .brand-name {
      font-size: 25rpx;
      font-weight: 900;
      color: #261c15;
      font-family: "STZhongsong", "SimSun", serif;
      display: block;
    }
    .brand-slogan {
      font-size: 19rpx;
      color: #8c7a6e;
      font-family: "STKaiti", "KaiTi", serif;
      margin-top: 4rpx;
      display: block;
    }
  }

  .qrcode-mock {
    display: flex;
    flex-direction: column;
    align-items: center;

    .qr-grid {
      width: 68rpx;
      height: 68rpx;
      background: rgba(184, 134, 81, 0.08);
      border: 1.5rpx solid rgba(194, 149, 110, 0.45);
      border-radius: 12rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      .qr-icon {
        font-size: 28rpx;
        color: #bc312c;
        font-family: "STKaiti", serif;
        font-weight: bold;
      }
    }

    .qr-tip {
      font-size: 16rpx;
      color: #8c7a6e;
      font-family: "STKaiti", "KaiTi", serif;
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
    height: 80rpx;
    font-size: 26rpx;
    font-family: "STKaiti", "KaiTi", serif;
    font-weight: 700;
  }

  .btn-icon {
    margin-right: 8rpx;
  }
}
</style>
