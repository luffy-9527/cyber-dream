<template>
  <view class="detail-container">
    <view v-if="item" class="content-card">
      <text class="title">{{ item.title }}</text>
      <view class="subtitle">
        <text class="subtitle-text">近日有 {{ item.count }} 人和你做了相同的梦</text>
      </view>

      <view class="interpretation-section" :class="{ 'collapsed': !isExpanded }">
        
        <text class="paragraph summary-text">{{ item.summary }}</text>
        
        <view class="section-block zhougong-block" v-if="item.zhougong">
          <view class="block-title">
            <text class="block-icon">📜</text>
            <text>原版周公解梦</text>
          </view>
          <text class="paragraph">{{ item.zhougong }}</text>
        </view>

        <view class="section-block psychology-block" v-if="item.psychology">
          <view class="block-title">
            <text class="block-icon">🧠</text>
            <text>心理学解梦</text>
          </view>
          <text class="paragraph">{{ item.psychology }}</text>
        </view>
        
        <view v-if="item.groups && item.groups.length > 0" class="groups-container">
          <view class="groups-header">
            <text class="block-icon">👥</text>
            <text class="groups-title">不同人群梦见{{ shortTitle }}的征兆</text>
          </view>
          <view class="group-block" v-for="(g, idx) in item.groups" :key="'g'+idx">
            <text class="gender-title">{{ g.name }}梦见</text>
            <text class="paragraph">{{ g.content }}</text>
          </view>
        </view>

        <view v-if="item.timePeriods && item.timePeriods.length > 0" class="groups-container">
          <view class="groups-header">
            <text class="block-icon">🕐</text>
            <text class="groups-title">不同时间段梦见{{ shortTitle }}的征兆</text>
          </view>
          <view class="group-block" v-for="(t, idx) in item.timePeriods" :key="'t'+idx">
            <text class="time-title">{{ t.name }}梦见{{ shortTitle }}</text>
            <text class="paragraph">{{ t.content }}</text>
          </view>
        </view>

        <view v-if="item.ages && item.ages.length > 0" class="groups-container">
          <view class="groups-header">
            <text class="block-icon">👤</text>
            <text class="groups-title">不同年龄阶段梦见{{ shortTitle }}的征兆</text>
          </view>
          <view class="group-block" v-for="(a, idx) in item.ages" :key="'a'+idx">
            <text class="age-title">{{ a.name }}梦见{{ shortTitle }}</text>
            <text class="paragraph">{{ a.content }}</text>
          </view>
        </view>
        
        <view v-if="!isExpanded" class="fade-mask"></view>
      </view>

      <view class="expand-btn" @click="isExpanded = !isExpanded">
        <text>{{ isExpanded ? '收起全文 ▲' : '展开全文 ▼' }}</text>
      </view>
    </view>
    
    <view v-if="item" class="recommend-section">
      <view class="section-title">
        <text class="title-icon">◎</text>
        <text>相关梦境推荐</text>
      </view>
      <view class="recommend-list">
        <view 
          class="recommend-item" 
          v-for="rec in recommendations" 
          :key="rec.id"
          @click="goToDetail(rec.id)"
        >
          <text class="rec-title">{{ rec.title }}</text>
          <uni-icons type="right" size="14" color="#d3d3d3"></uni-icons>
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
import { onLoad } from '@dcloudio/uni-app';
import { getLocalDreamDict } from '@/store/dictData';

const item = ref(null);
const isExpanded = ref(false);

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
});

function goToDetail(id) {
  uni.redirectTo({
    url: `/pages_sub/dict_detail/dict_detail?id=${id}`
  });
}
</script>

<style scoped>
.detail-container {
  min-height: 100vh;
  background-color: #f9f6f0;
  padding: 30rpx;
  box-sizing: border-box;
}

.content-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.02);
  margin-bottom: 30rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #1d3557;
  display: block;
  margin-bottom: 16rpx;
}

.subtitle {
  margin-bottom: 40rpx;
}
.subtitle-text {
  font-size: 24rpx;
  color: #8c8c8c;
}

.interpretation-section {
  position: relative;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.interpretation-section.collapsed {
  max-height: 500rpx;
}

.fade-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180rpx;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
  pointer-events: none;
}

.summary-text {
  font-size: 30rpx;
  color: #333;
  line-height: 1.8;
  font-weight: 500;
  margin-bottom: 30rpx;
  display: block;
}

.paragraph {
  font-size: 28rpx;
  color: #555;
  line-height: 1.8;
  display: block;
}

.section-block {
  margin-bottom: 30rpx;
  padding: 24rpx;
  border-radius: 16rpx;
}

.zhougong-block {
  background-color: rgba(188, 49, 44, 0.04);
  border-left: 6rpx solid #bc312c;
}

.psychology-block {
  background-color: rgba(69, 123, 157, 0.04);
  border-left: 6rpx solid #457b9d;
}

.block-title {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}
.block-title text {
  margin-left: 10rpx;
}
.block-icon {
  font-size: 32rpx;
}

.groups-container {
  margin-top: 30rpx;
  padding-top: 24rpx;
  border-top: 1px dashed rgba(0,0,0,0.08);
}

.groups-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.groups-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1d3557;
  margin-left: 10rpx;
}

.group-block {
  margin-bottom: 24rpx;
}

.gender-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #bc312c;
  display: block;
  margin-bottom: 10rpx;
}

.time-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #457b9d;
  display: block;
  margin-bottom: 10rpx;
}

.age-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #e76f51;
  display: block;
  margin-bottom: 10rpx;
}

.expand-btn {
  text-align: center;
  padding: 30rpx 0 10rpx;
  font-size: 26rpx;
  color: #8c8c8c;
}

.recommend-section {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.02);
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  font-weight: bold;
  color: #1d3557;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.title-icon {
  color: #bc312c;
  margin-right: 10rpx;
}

.recommend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.recommend-item:last-child {
  border-bottom: none;
}

.rec-title {
  font-size: 28rpx;
  color: #555;
}

.disclaimer-footer {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  padding: 40rpx 0;
  width: 100%;
}
</style>
