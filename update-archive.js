const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/archive/archive.vue', 'utf8');

// Insert a button into the stats-header
content = content.replace(
  /<view class="stats-header">\s*<text class="stats-title neon-text-cyan">🌌 潜意识档案库<\/text>/,
  `<view class="stats-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <view style="display: flex; align-items: center;">
            <text class="stats-title neon-text-cyan">🌌 潜意识档案库</text>
          </view>
          <text class="api-btn" @tap="configApiKey">⚙️ AI配置</text>`
);

// Add the configApiKey method to script setup
content = content.replace(
  /const topMoodName = computed\(\(\) => \{/,
  `function configApiKey() {
  uni.showModal({
    title: '配置 DeepSeek API Key',
    content: dreamStore.settings?.apiKey || '',
    editable: true,
    placeholderText: '请输入您的 DeepSeek API Key',
    success: (res) => {
      if (res.confirm && res.content) {
        dreamStore.updateSettings({ apiKey: res.content.trim() });
        uni.showToast({ title: '配置已保存', icon: 'success' });
      }
    }
  });
}

const topMoodName = computed(() => {`
);

// Add some style for the button
content = content.replace(
  /<\/style>/,
  `
.api-btn {
  font-size: 24rpx;
  color: #a8a8a8;
  background: rgba(255, 255, 255, 0.1);
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>`
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/archive/archive.vue', content, 'utf8');