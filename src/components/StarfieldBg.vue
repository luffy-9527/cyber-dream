<template>
  <view class="starfield-container">
    <!-- 赛博流光网格与星云 -->
    <view class="nebula-blob nebula-cyan"></view>
    <view class="nebula-blob nebula-pink"></view>
    <view class="nebula-blob nebula-purple"></view>
    
    <!-- 动态微粒粒子 -->
    <view class="stars-layer">
      <view v-for="i in 15" :key="i" class="star" :style="getStarStyle(i)"></view>
    </view>
    
    <!-- 赛博横纹扫描线 -->
    <view class="grid-overlay"></view>
  </view>
</template>

<script setup>
function getStarStyle(index) {
  const top = (index * 7 + 3) % 95;
  const left = (index * 13 + 5) % 95;
  const size = (index % 3) + 2;
  const duration = (index % 4) + 2;
  const delay = (index % 3) * 0.7;
  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  };
}
</script>

<style lang="scss" scoped>
.starfield-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.nebula-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
  pointer-events: none;
}

.nebula-cyan {
  width: 500rpx;
  height: 500rpx;
  background: radial-gradient(circle, #00f2fe 0%, transparent 70%);
  top: -100rpx;
  right: -100rpx;
}

.nebula-pink {
  width: 600rpx;
  height: 600rpx;
  background: radial-gradient(circle, #ff2a85 0%, transparent 70%);
  bottom: 10%;
  left: -200rpx;
}

.nebula-purple {
  width: 700rpx;
  height: 700rpx;
  background: radial-gradient(circle, #7928ca 0%, transparent 70%);
  top: 35%;
  right: -150rpx;
}

.stars-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 8rpx #00f2fe;
  animation: starTwinkle infinite ease-in-out;
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.3);
  }
}

.grid-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 60rpx 60rpx;
  opacity: 0.4;
}
</style>
