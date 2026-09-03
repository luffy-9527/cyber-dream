<template>
  <view class="radar-card-inner">
    <!-- 顶部极简模式切换 -->
    <view class="view-switch-row">
      <text class="spectrum-label">PSYCHE SPECTRUM</text>
      <view class="tab-pill-group">
        <view
          class="pill-tab"
          :class="{ active: viewMode === 'radar' }"
          @tap="switchMode('radar')"
        >
          🕸️ 脑波星盘
        </view>
        <view
          class="pill-tab"
          :class="{ active: viewMode === 'bars' }"
          @tap="switchMode('bars')"
        >
          📊 能量量表
        </view>
      </view>
    </view>

    <!-- 1. 紧凑型 Canvas 雷达星盘视图 -->
    <view v-show="viewMode === 'radar'" class="compact-canvas-wrap">
      <canvas
        canvas-id="radarCanvas"
        id="radarCanvas"
        class="radar-canvas"
      ></canvas>
    </view>

    <!-- 2. 紧凑型五维能量进度条视图 -->
    <view v-show="viewMode === 'bars'" class="compact-dimension-bars">
      <view
        v-for="item in dimensionList"
        :key="item.key"
        class="compact-dim-row"
      >
        <view class="dim-info-left">
          <text class="dim-dot" :style="{ background: item.color, boxShadow: `0 0 10rpx ${item.color}` }"></text>
          <text class="dim-title">{{ item.name }}</text>
        </view>

        <view class="dim-progress-track">
          <view
            class="dim-progress-fill"
            :style="{
              width: `${item.value}%`,
              background: `linear-gradient(90deg, ${item.color}44, ${item.color})`,
              boxShadow: `0 0 12rpx ${item.color}88`
            }"
          ></view>
        </view>

        <text class="dim-value-text" :style="{ color: item.color }">{{ item.value }}</text>
      </view>
    </view>

    <!-- 底部五维极简胶囊总结 (无论哪种模式均常驻在底部，紧凑不占空间) -->
    <view class="mini-metrics-row">
      <view
        v-for="item in dimensionList"
        :key="item.key"
        class="mini-metric-chip"
        :style="{ borderColor: `${item.color}33`, background: `${item.color}11` }"
      >
        <text class="chip-name">{{ item.name }}</text>
        <text class="chip-val" :style="{ color: item.color }">{{ item.value }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, getCurrentInstance } from 'vue';

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      absurdity: 80,
      awakening: 85,
      clarity: 65,
      anxiety: 40,
      romance: 60
    })
  }
});

const instance = getCurrentInstance();
const viewMode = ref('radar'); // 'radar' | 'bars'

const dimensionDefs = [
  { key: 'absurdity', name: '荒诞度', color: '#00f2fe' },
  { key: 'awakening', name: '觉醒度', color: '#a855f7' },
  { key: 'clarity', name: '清醒值', color: '#06d6a0' },
  { key: 'anxiety', name: '压力感', color: '#ff2a85' },
  { key: 'romance', name: '治愈值', color: '#ffd166' }
];

const dimensionList = computed(() => {
  return dimensionDefs.map(d => ({
    ...d,
    value: props.stats ? (props.stats[d.key] ?? 60) : 60
  }));
});

function switchMode(mode) {
  viewMode.value = mode;
  if (mode === 'radar') {
    nextTick(() => {
      setTimeout(drawRadar, 80);
    });
  }
}

function drawRadar() {
  // 必须传入当前组件实例 instance，以便微信小程序组件内正确寻址
  const ctx = uni.createCanvasContext('radarCanvas', instance);
  const width = 280;
  const height = 180;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 54;
  const total = dimensionDefs.length;

  ctx.clearRect(0, 0, width, height);

  // 1. 绘制多层五边形背景网格
  const levels = [1, 0.66, 0.33];
  levels.forEach(scale => {
    ctx.beginPath();
    for (let i = 0; i < total; i++) {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius * scale;
      const y = cy + Math.sin(angle) * radius * scale;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.setStrokeStyle('rgba(255, 255, 255, 0.12)');
    ctx.setLineWidth(1);
    ctx.stroke();
  });

  // 2. 绘制 5 根辐射轴线 & 紧凑标签
  for (let i = 0; i < total; i++) {
    const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.setStrokeStyle('rgba(255, 255, 255, 0.16)');
    ctx.stroke();

    // 绘制顶点标签文字 (紧凑距离)
    const labelX = cx + Math.cos(angle) * (radius + 20);
    const labelY = cy + Math.sin(angle) * (radius + 12);
    const item = dimensionList.value[i];

    ctx.setFontSize(10);
    ctx.setFillStyle(item.color);
    ctx.setTextAlign('center');
    ctx.setTextBaseline('middle');
    ctx.fillText(`${item.name}`, labelX, labelY);
  }

  // 3. 绘制数据多边形
  ctx.beginPath();
  const points = [];
  for (let i = 0; i < total; i++) {
    const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
    const val = dimensionList.value[i].value;
    const scale = Math.max(0.18, Math.min(1, val / 100));
    const x = cx + Math.cos(angle) * radius * scale;
    const y = cy + Math.sin(angle) * radius * scale;
    points.push({ x, y });
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();

  // 半透明霓虹填充
  ctx.setFillStyle('rgba(0, 242, 254, 0.35)');
  ctx.fill();

  ctx.setStrokeStyle('#00f2fe');
  ctx.setLineWidth(2);
  ctx.stroke();

  // 4. 绘制顶点高亮发光节点
  points.forEach((pt, idx) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
    ctx.setFillStyle('#ffffff');
    ctx.fill();
    ctx.setStrokeStyle(dimensionList.value[idx].color);
    ctx.setLineWidth(2);
    ctx.stroke();
  });

  ctx.draw();
}

onMounted(() => {
  nextTick(() => {
    setTimeout(drawRadar, 150);
  });
});

watch(() => props.stats, () => {
  nextTick(() => {
    setTimeout(drawRadar, 100);
  });
}, { deep: true });
</script>

<style lang="scss" scoped>
.radar-card-inner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view-switch-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;

  .spectrum-label {
    font-size: 18rpx;
    color: #64748b;
    font-family: monospace;
    letter-spacing: 1.5rpx;
  }

  .tab-pill-group {
    display: flex;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 20rpx;
    padding: 4rpx;
    gap: 4rpx;

    .pill-tab {
      padding: 4rpx 16rpx;
      font-size: 20rpx;
      color: #94a3b8;
      border-radius: 16rpx;
      transition: all 0.2s ease;

      &.active {
        background: rgba(0, 242, 254, 0.2);
        color: #00f2fe;
        font-weight: bold;
      }
    }
  }
}

.compact-canvas-wrap {
  width: 280px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.radar-canvas {
  width: 280px;
  height: 180px;
}

.compact-dimension-bars {
  width: 100%;
  padding: 10rpx 0;
  display: flex;
  flex-direction: column;
  gap: 14rpx;

  .compact-dim-row {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .dim-info-left {
      width: 120rpx;
      display: flex;
      align-items: center;
      gap: 10rpx;
      flex-shrink: 0;

      .dim-dot {
        width: 10rpx;
        height: 10rpx;
        border-radius: 50%;
      }

      .dim-title {
        font-size: 22rpx;
        color: #cbd5e1;
      }
    }

    .dim-progress-track {
      flex: 1;
      height: 12rpx;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 6rpx;
      overflow: hidden;

      .dim-progress-fill {
        height: 100%;
        border-radius: 6rpx;
        transition: width 0.5s ease;
      }
    }

    .dim-value-text {
      width: 50rpx;
      text-align: right;
      font-size: 22rpx;
      font-family: monospace;
      font-weight: bold;
      flex-shrink: 0;
    }
  }
}

.mini-metrics-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 8rpx;
  margin-top: 14rpx;
  padding-top: 14rpx;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);

  .mini-metric-chip {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8rpx 2rpx;
    border-radius: 12rpx;
    border: 1px solid;

    .chip-name {
      font-size: 18rpx;
      color: #94a3b8;
    }

    .chip-val {
      font-size: 22rpx;
      font-family: monospace;
      font-weight: bold;
      margin-top: 2rpx;
    }
  }
}
</style>
