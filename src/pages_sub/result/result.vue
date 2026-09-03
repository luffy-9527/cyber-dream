<template>
  <view class="result-page">
    

    <view v-if="currentDream" class="content-scroll">
      <!-- 顶部插画视界 -->
      <view class="art-banner-box">
        <image
          :src="currentDream.illustrationUrl"
          mode="aspectFill"
          class="art-image"
          @tap="previewImage"
        />
        <view class="art-overlay"></view>

        <!-- 悬浮流派气泡 -->
        <view class="persona-float-badge" :style="{ borderColor: currentDream.colorTheme || '#457b9d' }">
          <text class="persona-emoji">{{ currentDream.persona?.avatar || '👴' }}</text>
          <view class="persona-text-col">
            <text class="p-name">{{ currentDream.persona?.name || '赛博周公' }}</text>
            <text class="p-title">{{ currentDream.persona?.tag || '量子易经流' }}</text>
          </view>
        </view>

        <view class="dream-title-wrap">
          <text class="dream-codename neon-text-cyan">{{ currentDream.title }}</text>
          <text class="dream-date-label">DATETIME: {{ currentDream.date }} · 潜意识深度观测</text>
        </view>
      </view>

      <!-- 核心解析板块 -->
      <view class="details-body">
        <!-- 1. 潜意识密语与核心定论 -->
        <view class="glass-panel-glow quote-card">
          <view class="quote-header">
            <text class="quote-symbol">❝</text>
            <text class="quote-text">{{ currentDream.quote }}</text>
          </view>
          <view class="summary-line">
            <text class="summary-tag">核心定论</text>
            <text class="summary-desc">{{ currentDream.summary }}</text>
          </view>
        </view>

        <!-- 2. 深度潜意识解码长文 -->
        <view class="glass-panel info-card">
          <view class="card-title-row">
            <view class="title-left">
              <text class="icon">🧠</text>
              <text class="title">潜意识深度解码</text>
            </view>
            <text class="sub-hint">PSYCHOANALYSIS</text>
          </view>
          <view class="analysis-text-content">
            {{ currentDream.analysis }}
          </view>
        </view>

        <!-- 3. 意象象征图谱 -->
        <view class="glass-panel info-card">
          <view class="card-title-row">
            <view class="title-left">
              <text class="icon">🔮</text>
              <text class="title">意象象征图谱</text>
            </view>
            <text class="sub-hint">SYMBOL MATRIX</text>
          </view>

          <view class="symbols-list">
            <view
              v-for="(sym, idx) in currentDream.symbols"
              :key="idx"
              class="symbol-item"
            >
              <view class="sym-icon-box">
                <text class="sym-icon">{{ sym.icon }}</text>
              </view>
              <view class="sym-content">
                <text class="sym-name">{{ sym.name }}</text>
                <text class="sym-meaning">{{ sym.meaning }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 4. 潜意识多维雷达 -->
        <view class="glass-panel info-card">
          <view class="card-title-row">
            <view class="title-left">
              <text class="icon">📊</text>
              <text class="title">潜意识多维脑波雷达</text>
            </view>
            <text class="sub-hint">NEURAL RADAR</text>
          </view>
          <CyberRadar :stats="currentDream.radar" />
        </view>

        <!-- 4.5. 生物学神经递质模拟参数 -->
        <view class="glass-panel info-card" v-if="currentDream.neurotransmitters">
          <view class="card-title-row">
            <view class="title-left">
              <text class="icon">🧬</text>
              <text class="title">生物学神经递质模拟参数</text>
            </view>
            <text class="sub-hint">NEUROTRANSMITTERS</text>
          </view>
          
          <view class="neuro-list">
            <view class="neuro-item">
              <view class="neuro-label-row">
                <text class="neuro-name">多巴胺 (Dopamine)</text>
                <text class="neuro-val" style="color: #c2956e;">{{ currentDream.neurotransmitters.dopamine }}%</text>
              </view>
              <view class="neuro-track"><view class="neuro-bar neuro-bar-striped" :style="{ width: currentDream.neurotransmitters.dopamine + '%', backgroundColor: '#c2956e' }"></view></view>
            </view>
            
            <view class="neuro-item">
              <view class="neuro-label-row">
                <text class="neuro-name">血清素 (Serotonin)</text>
                <text class="neuro-val" style="color: #5c8984;">{{ currentDream.neurotransmitters.serotonin }}%</text>
              </view>
              <view class="neuro-track"><view class="neuro-bar neuro-bar-striped" :style="{ width: currentDream.neurotransmitters.serotonin + '%', backgroundColor: '#5c8984' }"></view></view>
            </view>

            <view class="neuro-item">
              <view class="neuro-label-row">
                <text class="neuro-name">皮质醇 (Cortisol)</text>
                <text class="neuro-val" style="color: #bc312c;">{{ currentDream.neurotransmitters.cortisol }}%</text>
              </view>
              <view class="neuro-track"><view class="neuro-bar neuro-bar-striped" :style="{ width: currentDream.neurotransmitters.cortisol + '%', backgroundColor: '#bc312c' }"></view></view>
            </view>

            <view class="neuro-item">
              <view class="neuro-label-row">
                <text class="neuro-name">内啡肽 (Endorphin)</text>
                <text class="neuro-val" style="color: #4a4e69;">{{ currentDream.neurotransmitters.endorphin }}%</text>
              </view>
              <view class="neuro-track"><view class="neuro-bar neuro-bar-striped" :style="{ width: currentDream.neurotransmitters.endorphin + '%', backgroundColor: '#4a4e69' }"></view></view>
            </view>
            
            <view class="neuro-item">
              <view class="neuro-label-row">
                <text class="neuro-name">乙酰胆碱 (Acetylcholine)</text>
                <text class="neuro-val" style="color: #457b9d;">{{ currentDream.neurotransmitters.acetylcholine }}%</text>
              </view>
              <view class="neuro-track"><view class="neuro-bar neuro-bar-striped" :style="{ width: currentDream.neurotransmitters.acetylcholine + '%', backgroundColor: '#457b9d' }"></view></view>
            </view>
          </view>
        </view>

        <!-- 5. 赛博气运与宜忌 -->
        <view class="glass-panel info-card fortune-card">
          <view class="card-title-row">
            <view class="title-left">
              <text class="icon">⚡</text>
              <text class="title">赛博气运与终端指引</text>
            </view>
            <text class="code-badge">{{ currentDream.fortune?.code || 'CYBER-7728' }}</text>
          </view>

          <view class="fortune-row lucky">
            <text class="f-tag lucky-tag">宜</text>
            <text class="f-text">{{ currentDream.fortune?.lucky }}</text>
          </view>

          <view class="fortune-row taboo">
            <text class="f-tag taboo-tag">忌</text>
            <text class="f-text">{{ currentDream.fortune?.taboo }}</text>
          </view>
        </view>

        <!-- 原梦境折叠查看 -->
        <view class="glass-panel raw-dream-card" @tap="showRawDream = !showRawDream">
          <view class="raw-header">
            <text class="raw-title">📝 原始梦境记录</text>
            <text class="raw-toggle">{{ showRawDream ? '收起 ▲' : '展开 ▼' }}</text>
          </view>
          <view class="raw-content" v-if="showRawDream">
            <text user-select>{{ currentDream.dreamText }}</text>
          </view>
        </view>

        </view>

        <!-- 知网级深度学术解析模块 -->
        <view class="deep-analysis-card glass-panel" id="deep-section">
          <view class="section-header">
            <text class="section-title">⚡ 深度学术解构网络</text>
            <text class="badge">PRO</text>
          </view>

          <!-- 未解锁 / 模糊状态 -->
          <view class="locked-container" v-if="!deepAnalysisResult">
            <view class="blur-overlay">
              <text class="blur-text-mock">《基于认知神经科学的潜意识投射分析》</text>
              <text class="blur-text-mock">摘要：本案主诉梦境呈现出高度的结构化失序。大脑在努力将清醒期的未决情绪进行重组...</text>
              <text class="blur-text-mock">【临床意象解构】根据连续性假说...</text>
            </view>
            <view class="unlock-overlay">
              <text class="unlock-title">潜意识核心权限已锁定</text>
              <text class="unlock-sub">免费解锁「知网期刊级」深度学术解析报告</text>
              <button 
                class="cyber-btn-primary unlock-btn" 
                @tap="handleUnlockDeepAnalysis"
                :loading="isUnlockingDeepAnalysis"
                :disabled="isUnlockingDeepAnalysis"
              >
                🔍 免费一键深度解析
              </button>
            </view>
          </view>

          <!-- 已解锁状态 -->
          <view class="unlocked-container" v-else>
            <text class="academic-title">{{ deepAnalysisResult.title }}</text>
            
            <view class="academic-tags">
              <text class="academic-tag" v-for="kw in deepAnalysisResult.keywords" :key="kw">{{ kw }}</text>
            </view>

            <view class="academic-block">
              <text class="academic-block-title">【文献回顾与理论溯源】</text>
              <text class="academic-text">{{ deepAnalysisResult.literature }}</text>
            </view>

            <view class="academic-block">
              <text class="academic-block-title">【临床意象解构】</text>
              <text class="academic-text">{{ deepAnalysisResult.analysis }}</text>
            </view>

            <view class="academic-block highlight-block">
              <text class="academic-block-title">【专业干预建议】</text>
              <text class="academic-text">{{ deepAnalysisResult.advice }}</text>
            </view>
          </view>
        </view>

        <!-- 底部固定悬浮操作栏 -->
        <view class="bottom-action-bar">
        <button class="action-btn fav-btn" @tap="handleToggleFavorite">
          <text class="btn-icon">{{ isFavorited ? '❤️' : '🤍' }}</text>
          <text class="btn-label">{{ isFavorited ? '已收藏' : '收藏' }}</text>
        </button>

        <button class="cyber-btn-secondary action-btn-flex" @tap="handleSwitchPersona">
          <text class="btn-icon">🔄</text> 换流派重解
        </button>

        <button class="cyber-btn-primary action-btn-flex poster-btn" @tap="showPoster = true">
          <text class="btn-icon">🖼️</text> 生成海报
        </button>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <text class="empty-icon">🪐</text>
      <text class="empty-text">暂无解析数据，请先录入梦境</text>
      <button class="cyber-btn-primary" @tap="goHome">返回梦境终端</button>
    </view>

    <!-- 海报模态框 -->
    <DreamPosterModal
      v-if="currentDream"
      v-model:visible="showPoster"
      :dream="currentDream"
    />
  
    <view class="disclaimer-footer">
      <text>内容仅供个人娱乐，禁止作为任何参考</text>
    </view>
</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDreamStore } from '@/store/dreamStore';


import DreamPosterModal from '@/components/DreamPosterModal.vue';
import CyberRadar from '@/components/CyberRadar.vue';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';

function showRewardedVideoAd(adUnitId = '') {
  return new Promise((resolve, reject) => {
    if (typeof wx !== 'undefined' && wx.createRewardedVideoAd && adUnitId) {
      const rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId });
      rewardedVideoAd.onError((err) => {
        uni.showToast({ title: '广告加载失败，为您放行', icon: 'none' });
        resolve(true);
      });
      rewardedVideoAd.onClose((res) => {
        if (res && res.isEnded) {
          resolve(true);
        } else {
          uni.showToast({ title: '需观看完毕才能解锁哦', icon: 'none' });
          resolve(false);
        }
      });
      rewardedVideoAd.show().catch(() => {
        rewardedVideoAd.load().then(() => rewardedVideoAd.show()).catch(err => {
          resolve(true);
        });
      });
    } else {
      uni.showLoading({ title: '模拟观看广告中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '模拟广告播放完毕', icon: 'success' });
        resolve(true);
      }, 2000);
    }
  });
}
async function callAcademicDeepAnalysis(dreamText, apiKey) {
    if (!apiKey || apiKey.trim().length < 10) {
    return new Promise(resolve => {
      setTimeout(() => {
        let hash = 0;
        for (let i = 0; i < dreamText.length; i++) hash = (hash << 5) - hash + dreamText.charCodeAt(i);
        hash = Math.abs(hash);

        const titles = [
          '《基于连续性假说的潜意识投射意象研究》',
          '《REM睡眠期海马体记忆巩固机制的个案分析》',
          '《集体无意识原型在现代心理防御机制中的异化》',
          '《认知失调与创伤后应激障碍的梦境表征》',
          '《边缘系统在睡眠周期中的情绪代偿与神经编码》'
        ];
        const keywordsPool = ['潜意识防御', '认知失调', '多巴胺补偿', '海马体抑制', '原型意象', '心理韧性', '阿尼玛/阿尼姆斯', '创伤修复', '神经噪点', '执行功能障碍'];
        const literatures = [
          '根据霍布森(J.A. Hobson)的激活-整合理论(Activation-Synthesis Theory)，梦境是大脑皮层对脑干随机神经脉冲的意义建构尝试。',
          '荣格(Carl Jung)在《分析心理学》中指出，梦是对个体心理不平衡状态的自发性补偿，具有内在的客观目的性。',
          '依据《Nature Neuroscience》关于睡眠纺锤波的最新研究，荒诞的梦境意象是前额叶皮层离线状态下，情绪记忆进行重组的副产物。',
          '弗洛伊德《梦的解析》中的“凝缩”与“移置”机制，在现代功能性核磁共振(fMRI)下，被证实为杏仁核过度激活的神经学表现。'
        ];
        const analyses = [
          '【临床意象解构】本案主诉梦境呈现出高度的结构化失序。大脑在努力将清醒期的未决情绪（Unfinished Business）进行重组。梦中荒诞的场景，本质上是海马体在记忆巩固过程中，对创伤或压力的防御性变形。',
          '【临床意象解构】文本分析显示，受测者的叙述中包含强烈的生存焦虑投射。神经递质模型推测，其血清素系统在日间处于长期透支状态，导致 REM 阶段杏仁核脱离前额叶的抑制，从而释放出具象化的恐惧意象。',
          '【临床意象解构】梦境要素中的时空错位，反映了受测者认知图式(Cognitive Schema)正在经历重构。这是大脑在安全环境下，对现实世界中不可控因素进行的“脱敏性演练(Desensitization Rehearsal)”。',
          '【临床意象解构】该梦境呈现出典型的补偿性心理机制。现实中压抑的攻击性或欲望，在多巴胺奖赏通路的代偿性激活下，转化为梦中的超现实体验，以维持心理结构的动态平衡。'
        ];
        const advices = [
          '【CBT认知行为干预建议】建议采用认知重评（Cognitive Reappraisal）技术，停止对不可控事件的反刍思考。睡前可进行 15 分钟的正念冥想（Mindfulness Meditation）以降低皮质醇水平。',
          '【精神分析动力学建议】尝试在清醒状态下与梦中的“阴影(Shadow)”部分进行积极想象对话。接受自身不完美的一面，可显著降低日间的心理内耗。',
          '【神经生物学干预建议】建议优化睡眠节律（Circadian Rhythm），避免睡前暴露于高频蓝光下。可适度补充富含色氨酸的食物，以支持血清素向褪黑素的正常转化。',
          '【DBT辩证行为干预建议】面对突如其来的负面情绪波动，建议使用“STOP技术”（停、退、观、效），建立情绪缓冲带，防止潜意识焦虑向现实躯体化转移。'
        ];
        let kw1 = keywordsPool[hash % keywordsPool.length];
        let kw2 = keywordsPool[(hash + 1) % keywordsPool.length];
        let kw3 = keywordsPool[(hash + 2) % keywordsPool.length];
        resolve({
          title: titles[hash % titles.length],
          keywords: [kw1, kw2, kw3],
          literature: literatures[hash % literatures.length],
          analysis: analyses[hash % analyses.length],
          advice: advices[hash % advices.length]
        });
      }, 2000);
    });
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: dreamStore.settings?.apiUrl || 'https://api.deepseek.com/v1/chat/completions',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      data: {
        model: dreamStore.settings?.apiModel || 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一位顶级的心理学与认知神经科学专家。请以《心理学报》等核心期刊的学术论文风格，对用户的梦境进行深度解码。返回严格的JSON格式，包含以下字段：title(学术风格的论文标题), keywords(3个学术关键词组成的数组), literature(文献回顾与理论溯源，需引用真实心理学理论), analysis(临床意象解构正文，极其专业严谨), advice(CBT认知行为或精神分析的专业干预建议)。不要输出任何markdown标记或额外解释，只输出纯JSON对象。' },
          { role: 'user', content: dreamText }
        ]
      },
      success: (res) => {
        try {
          const content = res.data.choices[0].message.content;
          const parsed = JSON.parse(content);
          resolve(parsed);
        } catch (e) {
          console.error('JSON解析失败', e);
          reject(e);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

const dreamStore = useDreamStore();
const currentDream = computed(() => dreamStore.currentDream);
const deepAnalysisResult = computed(() => dreamStore.deepAnalysisResult);

const showPoster = ref(false);
const showRawDream = ref(false);
const isUnlockingDeepAnalysis = ref(false);

const isFavorited = computed(() => {
  if (!currentDream.value) return false;
  return dreamStore.favoriteIds.includes(currentDream.value.id);
});


onMounted(() => {
  if (currentDream.value && !deepAnalysisResult.value) {
    handleUnlockDeepAnalysis();
  }
});

async function handleUnlockDeepAnalysis() {
  if (isUnlockingDeepAnalysis.value) return;
  
  isUnlockingDeepAnalysis.value = true;
  try {
    const result = await callAcademicDeepAnalysis(currentDream.value.dreamText, dreamStore.settings.apiKey);
    dreamStore.setDeepAnalysisResult(result);
    uni.showToast({ title: '深度解析完毕', icon: 'success' });
  } catch (e) {
    uni.showToast({ title: '神经网络波动，请重试', icon: 'none' });
  } finally {
    isUnlockingDeepAnalysis.value = false;
  }
}

function previewImage() {
  if (currentDream.value?.illustrationUrl) {
    uni.previewImage({
      urls: [currentDream.value.illustrationUrl]
    });
  }
}

function handleToggleFavorite() {
  if (currentDream.value) {
    dreamStore.toggleFavorite(currentDream.value.id);
    uni.showToast({
      title: isFavorited.value ? '已加入梦境收藏' : '已取消收藏',
      icon: 'none'
    });
  }
}

function handleSwitchPersona() {
  uni.showActionSheet({
    itemList: ['👴 赛博周公 (量子八卦)', '🧠 弗洛伊德 (精神分析)', '🌌 荣格神话 (原型意象)', '😈 毒舌嘴替 (人间清醒)'],
    success: async res => {
      const pKeys = ['zhougong', 'freud', 'jung', 'roast'];
      const nextP = pKeys[res.tapIndex];
      if (currentDream.value) {
        uni.showLoading({ title: '正在切换人格重新解析...' });
        await dreamStore.decodeDream({
          dreamText: currentDream.value.dreamText,
          personaId: nextP,
          moodId: currentDream.value.moodId,
          selectedTags: currentDream.value.selectedTags || []
        });
        uni.hideLoading();
      }
    }
  });
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' });
}

// 微信分享卡片配置
onShareAppMessage(() => {
  return {
    title: `✨ 我在赛博解梦局解码了梦境：${currentDream.value?.title || '神秘梦境'}`,
    path: '/pages/index/index',
    imageUrl: currentDream.value?.illustrationUrl
  };
});

onShareTimeline(() => {
  return {
    title: `✨ 赛博解梦局：${currentDream.value?.title || '梦境解析报告'}`,
    query: `id=${currentDream.value?.id}`,
    imageUrl: currentDream.value?.illustrationUrl
  };
});
</script>

<style lang="scss" scoped>
.result-page {
  min-height: 100vh;
  padding-bottom: 200rpx;
  position: relative;
}

.content-scroll {
  position: relative;
  z-index: 1;
}

.art-banner-box {
  position: relative;
  width: 100%;
  height: 480rpx;
  overflow: hidden;

  .art-image {
    width: 100%;
    height: 100%;
  }

  .art-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(9, 10, 22, 0.1) 0%, rgba(9, 10, 22, 0.7) 60%, rgba(9, 10, 22, 0.98) 100%);
  }

  .persona-float-badge {
    position: absolute;
    top: 30rpx;
    right: 30rpx;
    display: flex;
    align-items: center;
    gap: 12rpx;
    background: rgba(15, 17, 36, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid;
    padding: 8rpx 20rpx;
    border-radius: 40rpx;
    box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.5);

    .persona-emoji {
      font-size: 32rpx;
    }

    .persona-text-col {
      display: flex;
      flex-direction: column;

      .p-name {
        font-size: 22rpx;
        font-weight: bold;
        color: #f8f9fa;
      }
      .p-title {
        font-size: 16rpx;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }

  .dream-title-wrap {
    position: absolute;
    bottom: 24rpx;
    left: 30rpx;
    right: 30rpx;

    .dream-codename {
      font-size: 42rpx;
      font-weight: 900;
      display: block;
      letter-spacing: 1rpx;
    }

    .dream-date-label {
      font-size: 20rpx;
      color: #595959;
      margin-top: 6rpx;
      display: block;
      font-family: monospace;
      letter-spacing: 1rpx;
    }
  }
}

.details-body {
  padding: 18rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.quote-card {
  padding: 22rpx 24rpx;

  .quote-header {
    display: flex;
    gap: 12rpx;

    .quote-symbol {
      font-size: 46rpx;
      color: #457b9d;
      line-height: 1;
    }

    .quote-text {
      font-size: 26rpx;
      color: #2b2b2b;
      font-style: italic;
      line-height: 1.5;
      font-weight: 500;
    }
  }

  .summary-line {
    margin-top: 14rpx;
    padding-top: 14rpx;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: flex-start;
    gap: 12rpx;

    .summary-tag {
      font-size: 18rpx;
      color: #bc312c;
      border: 1px solid rgba(188, 49, 44, 0.4);
      background: rgba(188, 49, 44, 0.12);
      padding: 2rpx 10rpx;
      border-radius: 8rpx;
      white-space: nowrap;
      margin-top: 2rpx;
      font-weight: bold;
    }

    .summary-desc {
      font-size: 22rpx;
      color: #2b2b2b;
      line-height: 1.4;
    }
  }
}

.info-card {
  padding: 22rpx 24rpx;

  .card-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
    padding-bottom: 12rpx;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    .title-left {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .icon {
        font-size: 32rpx;
      }

      .title {
        font-size: 30rpx;
        font-weight: bold;
        color: #2b2b2b;
      }
    }

    .sub-hint {
      font-size: 18rpx;
      color: #8c8c8c;
      font-family: monospace;
      letter-spacing: 2rpx;
    }

    .code-badge {
      font-size: 18rpx;
      color: #457b9d;
      background: rgba(69, 123, 157, 0.12);
      padding: 4rpx 14rpx;
      border-radius: 8rpx;
      font-family: monospace;
      border: 1px solid rgba(69, 123, 157, 0.3);
    }
  }

  .analysis-text-content {
    font-size: 28rpx;
    color: #2b2b2b;
    line-height: 1.85;
    letter-spacing: 1rpx;
  }
}

.symbols-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;

  .symbol-item {
    display: flex;
    gap: 18rpx;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 18rpx;
    padding: 20rpx;

    .sym-icon-box {
      width: 72rpx;
      height: 72rpx;
      border-radius: 16rpx;
      background: rgba(69, 123, 157, 0.1);
      border: 1px solid rgba(69, 123, 157, 0.25);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;

      .sym-icon {
        font-size: 36rpx;
      }
    }

    .sym-content {
      display: flex;
      flex-direction: column;
      gap: 6rpx;

      .sym-name {
        font-size: 26rpx;
        font-weight: bold;
        color: #457b9d;
      }

      .sym-meaning {
        font-size: 22rpx;
        color: #595959;
        line-height: 1.5;
      }
    }
  }
}

.fortune-card {
  .fortune-row {
    display: flex;
    align-items: center;
    gap: 18rpx;
    padding: 16rpx 20rpx;
    border-radius: 16rpx;
    margin-bottom: 14rpx;

    .f-tag {
      width: 48rpx;
      height: 48rpx;
      border-radius: 12rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 26rpx;
      font-weight: bold;
      flex-shrink: 0;
    }

    .f-text {
      font-size: 24rpx;
      color: #2b2b2b;
      line-height: 1.4;
    }

    &.lucky {
      background: rgba(6, 214, 160, 0.08);
      border: 1px solid rgba(6, 214, 160, 0.2);
      .lucky-tag {
        background: #5c8984;
        color: #0b0c1b;
      }
    }

    &.taboo {
      background: rgba(239, 71, 111, 0.08);
      border: 1px solid rgba(239, 71, 111, 0.2);
      .taboo-tag {
        background: #ef476f;
        color: #ffffff;
      }
    }
  }
}

.raw-dream-card {
  padding: 24rpx;

  .raw-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .raw-title {
      font-size: 26rpx;
      color: #595959;
    }

    .raw-toggle {
      font-size: 22rpx;
      color: #457b9d;
    }
  }

  .raw-content {
    margin-top: 16rpx;
    padding-top: 14rpx;
    border-top: 1px dashed rgba(0, 0, 0, 0.08);
    font-size: 24rpx;
    color: #8c8c8c;
    line-height: 1.6;
    display: block;
  }
}

.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 120rpx;
  box-sizing: border-box;
  padding: 18rpx 30rpx calc(18rpx + env(safe-area-inset-bottom));
  background: rgba(249, 246, 240, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16rpx;
  z-index: 100;

  .fav-btn {
    width: 100rpx;
    height: 84rpx;
    margin: 0;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);

    .btn-icon {
      font-size: 32rpx;
      line-height: 1;
      color: #6c635e;
    }

    .btn-label {
      font-size: 18rpx;
      color: #6c635e;
      margin-top: 4rpx;
    }
  }

  .action-btn-flex {
    flex: 1;
    margin: 0;
    height: 84rpx;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-icon {
      margin-right: 8rpx;
    }
  }

  .poster-btn {
    flex: 1.3;
  }
}

.empty-state {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20rpx;

  .empty-icon {
    font-size: 80rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #8c8c8c;
  }
}

/* 神经递质参数 CSS */
.neuro-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 10rpx;
}
.neuro-item {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.neuro-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.neuro-name {
  font-size: 26rpx;
  color: #6c635e;
  font-weight: 500;
}
.neuro-val {
  font-size: 26rpx;
  font-weight: bold;
}
.neuro-track {
  width: 100%;
  height: 8rpx;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 8rpx;
  overflow: hidden;
}
.neuro-bar {
  height: 100%;
  border-radius: 8rpx;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 深度解析解锁模块 CSS */
.deep-analysis-card {
  padding: 30rpx;
  margin-bottom: 40rpx;
  position: relative;
  overflow: hidden;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #332b26;
  }
  .badge {
    background: #ffbe0b;
    color: #fff;
    font-size: 20rpx;
    padding: 2rpx 10rpx;
    border-radius: 8rpx;
    margin-left: 10rpx;
    font-weight: bold;
  }
}

.locked-container {
  position: relative;
  height: 300rpx;
  
  .blur-overlay {
    position: absolute;
    inset: 0;
    filter: blur(6px);
    opacity: 0.5;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
    pointer-events: none;
  }
  .blur-text-mock {
    font-size: 24rpx;
    color: #8c8c8c;
  }
  
  .unlock-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16rpx;
    background: rgba(255,255,255,0.4);
    z-index: 2;
  }
  .unlock-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #332b26;
  }
  .unlock-sub {
    font-size: 24rpx;
    color: #6c635e;
  }
  .unlock-btn {
    padding: 0 40rpx;
    height: 72rpx;
    font-size: 26rpx;
    line-height: 72rpx;
    border-radius: 36rpx;
  }
}

.unlocked-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;

  .academic-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #332b26;
    text-align: center;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    padding-bottom: 20rpx;
  }
  .academic-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    justify-content: center;
  }
  .academic-tag {
    font-size: 20rpx;
    background: rgba(69, 123, 157, 0.1);
    color: #457b9d;
    padding: 4rpx 12rpx;
    border-radius: 6rpx;
  }
  .academic-block {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }
  .academic-block-title {
    font-size: 26rpx;
    font-weight: bold;
    color: #332b26;
  }
  .academic-text {
    font-size: 26rpx;
    color: #595959;
    line-height: 1.6;
    text-align: justify;
  }
  .highlight-block {
    background: rgba(255, 190, 11, 0.05);
    padding: 16rpx;
    border-radius: 12rpx;
    border-left: 6rpx solid #ffbe0b;
  }
}

.disclaimer-footer {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  padding: 40rpx 0;
  width: 100%;
}
</style>

