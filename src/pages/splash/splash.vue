<template>
  <view class="splash-page">
    <!-- 顶部跳过按钮 -->
    <view class="skip-btn" @tap="skipSplash">
      跳过 {{ countdown }}s
    </view>

    <!-- Logo 与 品牌露出 -->
    <view class="brand-container">
      <view class="cyber-logo">🔮</view>
      <text class="brand-title neon-text-cyan">梦源阁</text>
      <text class="brand-sub">潜意识深度解构网络</text>
    </view>

    <!-- 广告位预留容器 -->
    <view class="ad-container">
      <!-- 等开通流量主后，将此处替换为微信官方的 <ad> 或 <ad-custom> 组件 -->
      <!-- <ad unit-id="你的广告位ID"></ad> -->
      
      <view class="ad-placeholder">
        <text class="ad-mock-icon">💸</text>
        <text class="ad-mock-text">原生模板广告预留位</text>
        <text class="ad-mock-sub">达到 1000 UV 开通流量主后即可接入</text>
      </view>
    </view>
    
    <view class="bottom-footer">
      <text>内容仅供个人娱乐，禁止作为任何参考</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const countdown = ref(3);
let timer = null;

onMounted(() => {
  // 启动倒计时
  timer = setInterval(() => {
    if (countdown.value > 1) {
      countdown.value--;
    } else {
      skipSplash();
    }
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function skipSplash() {
  if (timer) clearInterval(timer);
  // 跳转到首页 (不能用 navigateTo，必须用 reLaunch 彻底销毁开屏页)
  uni.reLaunch({
    url: '/pages/index/index'
  });
}
</script>

<style lang="scss">
.splash-page {
  width: 100vw;
  height: 100vh;
  background: #090a16;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.skip-btn {
  position: absolute;
  top: env(safe-area-inset-top, 40rpx);
  margin-top: 40rpx;
  right: 40rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 24rpx;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  backdrop-filter: blur(10px);
  z-index: 100;
}

.brand-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;

  .cyber-logo {
    font-size: 100rpx;
    margin-bottom: 20rpx;
    animation: float 3s ease-in-out infinite;
  }
  .brand-title {
    font-size: 50rpx;
    font-weight: 900;
    letter-spacing: 4rpx;
    margin-bottom: 10rpx;
  }
  .brand-sub {
    font-size: 24rpx;
    color: #457b9d;
    letter-spacing: 8rpx;
  }
}

.ad-container {
  width: 600rpx;
  height: 400rpx;
  background: rgba(69, 123, 157, 0.05);
  border: 2rpx dashed rgba(69, 123, 157, 0.3);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .ad-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;

    .ad-mock-icon {
      font-size: 60rpx;
    }
    .ad-mock-text {
      color: #7a9da8;
      font-size: 28rpx;
      font-weight: bold;
    }
    .ad-mock-sub {
      color: #595959;
      font-size: 20rpx;
    }
  }
}

.bottom-footer {
  position: absolute;
  bottom: env(safe-area-inset-bottom, 40rpx);
  margin-bottom: 40rpx;
  color: rgba(255, 255, 255, 0.2);
  font-size: 20rpx;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
  100% { transform: translateY(0); }
}

.neon-text-cyan {
  color: #fff;
  text-shadow: 0 0 10rpx #457b9d, 0 0 20rpx #457b9d, 0 0 30rpx #457b9d;
}
</style>