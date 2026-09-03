const fs = require('fs');

// 1. Update dreamStore.js
let storeCode = fs.readFileSync('E:/gemini/cyber-dream-app/src/store/dreamStore.js', 'utf8');
storeCode = storeCode.replace(
  /let settings = \{ apiKey: '', autoPlaySound: true \};/,
  "let settings = { apiKey: '', apiUrl: 'https://api.deepseek.com/v1/chat/completions', apiModel: 'deepseek-chat', autoPlaySound: true };"
);
fs.writeFileSync('E:/gemini/cyber-dream-app/src/store/dreamStore.js', storeCode, 'utf8');

// 2. Update archive.vue
let archiveCode = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/archive/archive.vue', 'utf8');

// Replace the old configApiKey method with a new one that toggles a custom modal
archiveCode = archiveCode.replace(
  /function configApiKey\(\) \{[\s\S]*?\}\n\nconst topMoodName/,
  `const showApiConfig = ref(false);
const configForm = ref({ apiKey: '', apiUrl: '', apiModel: '' });

function configApiKey() {
  configForm.value = {
    apiKey: dreamStore.settings?.apiKey || '',
    apiUrl: dreamStore.settings?.apiUrl || 'https://api.deepseek.com/v1/chat/completions',
    apiModel: dreamStore.settings?.apiModel || 'deepseek-chat'
  };
  showApiConfig.value = true;
}

function saveApiConfig() {
  dreamStore.updateSettings({
    apiKey: configForm.value.apiKey.trim(),
    apiUrl: configForm.value.apiUrl.trim() || 'https://api.deepseek.com/v1/chat/completions',
    apiModel: configForm.value.apiModel.trim() || 'deepseek-chat'
  });
  showApiConfig.value = false;
  uni.showToast({ title: '配置已保存', icon: 'success' });
}

function closeApiConfig() {
  showApiConfig.value = false;
}

const topMoodName`
);

// Add import ref if missing (it should be there)
if (!archiveCode.includes('const showApiConfig = ref(false);')) {
  console.log("Regex replace failed for archive.vue script");
}

// Add the custom modal to the template
const modalTemplate = `
    <!-- API 配置弹窗 -->
    <view class="modal-mask" v-if="showApiConfig" @tap="closeApiConfig">
      <view class="modal-content" @tap.stop>
        <text class="modal-title">全网大模型配置 (白嫖版)</text>
        
        <view class="form-group">
          <text class="form-label">接口地址 (Base URL)</text>
          <input class="form-input" v-model="configForm.apiUrl" placeholder="例如: https://api.siliconflow.cn/v1/chat/completions" />
          <text class="form-hint">推荐: https://api.siliconflow.cn/v1/chat/completions</text>
        </view>

        <view class="form-group">
          <text class="form-label">模型名称 (Model ID)</text>
          <input class="form-input" v-model="configForm.apiModel" placeholder="例如: Qwen/Qwen2.5-7B-Instruct" />
          <text class="form-hint">推荐免费模型: Qwen/Qwen2.5-7B-Instruct</text>
        </view>

        <view class="form-group">
          <text class="form-label">API Key</text>
          <input class="form-input" v-model="configForm.apiKey" placeholder="输入您的 API Key" />
        </view>

        <view class="modal-actions">
          <button class="btn-cancel" @tap="closeApiConfig">取消</button>
          <button class="btn-save" @tap="saveApiConfig">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>
`;
archiveCode = archiveCode.replace(/\s*<\/view>\s*<\/template>/, modalTemplate);

// Add styles for the modal
const modalStyle = `
.modal-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  width: 85%;
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
}
.modal-title {
  font-size: 34rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40rpx;
  display: block;
  color: #333;
}
.form-group {
  margin-bottom: 30rpx;
}
.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}
.form-input {
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  font-size: 26rpx;
  color: #333;
}
.form-hint {
  font-size: 22rpx;
  color: #888;
  margin-top: 8rpx;
  display: block;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 50rpx;
}
.btn-cancel {
  width: 45%;
  background: #f0f0f0;
  color: #666;
  font-size: 28rpx;
  border-radius: 40rpx;
}
.btn-cancel::after { display: none; }
.btn-save {
  width: 45%;
  background: linear-gradient(135deg, #bc312c, #8a1f1b);
  color: #fff;
  font-size: 28rpx;
  border-radius: 40rpx;
}
.btn-save::after { display: none; }
</style>
`;
archiveCode = archiveCode.replace(/<\/style>/, modalStyle);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/archive/archive.vue', archiveCode, 'utf8');
