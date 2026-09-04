<template>
  <view class="result-page">
    

    <view v-if="currentDream" class="content-scroll">
      <!-- 顶部插画视界 (太虚画境) -->
      <view class="art-banner-box">
        <!-- AI 绘卷加载骨架屏 -->
        <view v-if="isImageLoading" class="art-loading-placeholder">
          <view class="loading-spin-ring"></view>
          <text class="art-loading-txt">❖ 正在依梦象绘录太虚画卷...</text>
        </view>

        <image
          :src="currentDream.illustrationUrl"
          mode="aspectFill"
          class="art-image"
          @load="handleImageLoad"
          @tap="previewImage"
          @error="handleImageError"
        />
        <view class="art-overlay"></view>

        <!-- 悬浮 AI 意象微章与重绘按钮 -->
        <view class="ai-paint-tag" @tap.stop="handleRecreateImage">
          <text class="ai-tag-icon">✦</text>
          <text class="ai-tag-label">{{ isRecreatingImage ? '绘卷中...' : '意象生图' }}</text>
          <text class="ai-tag-redo" v-if="!isRecreatingImage">🔄</text>
        </view>

        <!-- 悬浮流派玉佩印牌 -->
        <view class="persona-float-badge" :style="{ borderColor: currentDream.colorTheme || '#b88651' }">
          <text class="persona-emoji">{{ currentDream.persona?.avatar || '☯' }}</text>
          <view class="persona-text-col">
            <text class="p-name">{{ currentDream.persona?.name || '赛博周公' }}</text>
            <text class="p-title">{{ currentDream.persona?.tag || '量子易经流' }}</text>
          </view>
        </view>

        <view class="dream-title-wrap">
          <view class="title-row">
            <text class="dream-codename">{{ currentDream.title }}</text>
            <text class="title-seal">梦兆</text>
          </view>
          <text class="dream-date-label">观星纪候：{{ currentDream.date }} · 潜意识深度推演</text>
        </view>
      </view>

      <!-- 核心解析板块 (太虚锦册) -->
      <view class="details-body">
        <!-- 1. 潜意识密语与核心定论 (天机密言与御批定论) -->
        <view class="glass-panel-glow quote-card">
          <view class="quote-header">
            <text class="quote-symbol">❖</text>
            <text class="quote-text">{{ currentDream.quote }}</text>
          </view>
          <view class="summary-line">
            <text class="summary-tag">【天机定论】</text>
            <text class="summary-desc">{{ currentDream.summary }}</text>
          </view>
        </view>

        <!-- 2. 深度潜意识解码长文 (玄机解构) -->
        <view class="glass-panel info-card">
          <view class="card-title-row">
            <view class="title-left">
              <text class="sec-symbol">❖</text>
              <text class="title">潜意识深度解码</text>
            </view>
            <text class="sub-hint">【玄机解构】</text>
          </view>
          <view class="analysis-text-content">
            {{ currentDream.analysis }}
          </view>
        </view>

        <!-- 3. 意象象征图谱 (物象归藏) -->
        <view class="glass-panel info-card">
          <view class="card-title-row">
            <view class="title-left">
              <text class="sec-symbol">❖</text>
              <text class="title">意象象征图谱</text>
            </view>
            <text class="sub-hint">【物象归藏】</text>
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

        <!-- 4. 潜意识多维雷达 (周天经纬) -->
        <view class="glass-panel info-card">
          <view class="card-title-row">
            <view class="title-left">
              <text class="sec-symbol">❖</text>
              <text class="title">潜意识多维脑波星盘</text>
            </view>
            <text class="sub-hint">【周天经纬】</text>
          </view>
          <CyberRadar :stats="currentDream.radar" />
        </view>

        <!-- 4.5. 生物学神经递质模拟参数 (心神灵息) -->
        <view class="glass-panel info-card" v-if="currentDream.neurotransmitters">
          <view class="card-title-row">
            <view class="title-left">
              <text class="sec-symbol">❖</text>
              <text class="title">心神灵息与神经拟象</text>
            </view>
            <text class="sub-hint">【七情脉理】</text>
          </view>
          
          <view class="neuro-list">
            <view class="neuro-item">
              <view class="neuro-label-row">
                <text class="neuro-name">多巴胺 (神动 / 喜悦)</text>
                <text class="neuro-val" style="color: #b88651;">{{ currentDream.neurotransmitters.dopamine }}%</text>
              </view>
              <view class="neuro-track"><view class="neuro-bar" :style="{ width: currentDream.neurotransmitters.dopamine + '%', backgroundColor: '#b88651' }"></view></view>
            </view>
            
            <view class="neuro-item">
              <view class="neuro-label-row">
                <text class="neuro-name">血清素 (气和 / 平静)</text>
                <text class="neuro-val" style="color: #4d7a70;">{{ currentDream.neurotransmitters.serotonin }}%</text>
              </view>
              <view class="neuro-track"><view class="neuro-bar" :style="{ width: currentDream.neurotransmitters.serotonin + '%', backgroundColor: '#4d7a70' }"></view></view>
            </view>

            <view class="neuro-item">
              <view class="neuro-label-row">
                <text class="neuro-name">皮质醇 (念乱 / 忧思)</text>
                <text class="neuro-val" style="color: #bc312c;">{{ currentDream.neurotransmitters.cortisol }}%</text>
              </view>
              <view class="neuro-track"><view class="neuro-bar" :style="{ width: currentDream.neurotransmitters.cortisol + '%', backgroundColor: '#bc312c' }"></view></view>
            </view>

            <view class="neuro-item">
              <view class="neuro-label-row">
                <text class="neuro-name">内啡肽 (魄宁 / 坚韧)</text>
                <text class="neuro-val" style="color: #5d4a66;">{{ currentDream.neurotransmitters.endorphin }}%</text>
              </view>
              <view class="neuro-track"><view class="neuro-bar" :style="{ width: currentDream.neurotransmitters.endorphin + '%', backgroundColor: '#5d4a66' }"></view></view>
            </view>
            
            <view class="neuro-item">
              <view class="neuro-label-row">
                <text class="neuro-name">乙酰胆碱 (灵犀 / 敏悟)</text>
                <text class="neuro-val" style="color: #4a6c82;">{{ currentDream.neurotransmitters.acetylcholine }}%</text>
              </view>
              <view class="neuro-track"><view class="neuro-bar" :style="{ width: currentDream.neurotransmitters.acetylcholine + '%', backgroundColor: '#4a6c82' }"></view></view>
            </view>
          </view>
        </view>

        <!-- 5. 赛博气运与宜忌 (天机行止) -->
        <view class="glass-panel info-card fortune-card">
          <view class="card-title-row">
            <view class="title-left">
              <text class="sec-symbol">❖</text>
              <text class="title">天机气运与行止指引</text>
            </view>
            <text class="code-badge">岁次甲辰</text>
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

        <!-- 原梦境折叠查看 (初录本章) -->
        <view class="glass-panel raw-dream-card" @tap="showRawDream = !showRawDream">
          <view class="raw-header">
            <text class="raw-title">❖ 梦主初录本章</text>
            <text class="raw-toggle">{{ showRawDream ? '收存 ▲' : '展阅 ▼' }}</text>
          </view>
          <view class="raw-content" v-if="showRawDream">
            <text user-select>{{ currentDream.dreamText }}</text>
          </view>
        </view>

        <!-- 知网级深度学术解析模块 (典籍考据) -->
        <view class="deep-analysis-card glass-panel" id="deep-section">
          <view class="section-header">
            <text class="sec-symbol">❖</text>
            <text class="section-title">典籍考据与深度解构</text>
            <text class="badge">典藏</text>
          </view>

          <!-- 未解锁 / 模糊状态 -->
          <!-- 加载中状态 -->
          <view class="loading-container" v-if="!deepAnalysisResult">
            <view class="loading-spinner"></view>
            <text class="loading-text">正在翻阅古今典籍解构心象...</text>
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
              <text class="academic-block-title">【修心理疗建议】</text>
              <text class="academic-text">{{ deepAnalysisResult.advice }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部固定悬浮操作栏 -->
      <view class="bottom-action-bar">
        <button class="action-btn fav-btn" @tap="handleToggleFavorite">
          <text class="btn-icon">{{ isFavorited ? '❤️' : '🤍' }}</text>
          <text class="btn-label">{{ isFavorited ? '已收藏' : '题印收藏' }}</text>
        </button>

        <button class="cyber-btn-secondary action-btn-flex" @tap="handleSwitchPersona">
          <text class="btn-icon">🔄</text> 换派重推
        </button>

        <button class="cyber-btn-primary action-btn-flex poster-btn" @tap="showPoster = true">
          <text class="btn-icon">📜</text> 绘录画轴
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
import { ref, computed, onMounted, watch } from 'vue';
import { useDreamStore } from '@/store/dreamStore';
import { ENV } from '@/config/env.js';
import { 
  generateDreamImageUrl, 
  buildDynamicVisualPrompt, 
  getFallbackIllustration, 
  simpleHash 
} from '@/api/dreamEngine.js';

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
function generateMockAcademicAnalysis(dreamText) {
  let hash = 0;
  for (let i = 0; i < dreamText.length; i++) hash = (hash << 5) - hash + dreamText.charCodeAt(i);
  hash = Math.abs(hash);
  const t = String(dreamText || '').toLowerCase();

  // 针对高频特定梦境原型定制深度学术考据
  if (t.includes('厕所') || t.includes('卫生间') || t.includes('洗手间') || t.includes('马桶') || (t.includes('开会') && t.includes('门'))) {
    return {
      title: '《个体隐私边界侵蚀与职场评价焦虑的潜意识投射个案分析》',
      keywords: ['隐私边界崩溃', '超我职场规训', '暴露羞耻感', '情绪生理代偿'],
      literature: '根据卡尔·霍妮(Karen Horney)的社会神经症理论，个体对私密空间受侵犯的梦境，本质是对职场权威与人际评价过度警觉的心理防御。',
      analysis: '【临床意象解构】本案主诉“找厕所推门是会议室”，系典型的私密排解需求遭遇严苛超我公开审判。如厕象征未受污染的本真私域，而会议室则是集体规训的高压场域。梦境呈现的荒诞“撞破”，直接映射出受测者在现实中个人生活与职业界限的严重混淆，其心理自主感（Autonomy）正遭受严重的隐性剥夺。',
      advice: '【CBT认知行为干预建议】建议建立物理与心理层面的“离职隔离区”，下班后切断工作即时通讯提醒。通过断联练习强化个人边界感，降低由于角色过载引发的慢性皮质醇应激。'
    };
  }

  if (t.includes('手机') && (t.includes('藤蔓') || t.includes('长出') || t.includes('打不开') || t.includes('手腕'))) {
    return {
      title: '《技术异化与现代数字生存焦虑的心理解析》',
      keywords: ['技术依赖异化', '自然生命力代偿', '数字戒断焦虑', '身心解离'],
      literature: '依据海德格尔与现代认知科学对“技术座架(Ge-stell)”的阐释，机械向植物形态的异化反噬，是意识对过度人工符号化的激烈防御。',
      analysis: '【临床意象解构】手机长出藤蔓缠绕手腕，反映了受测者对移动互联设备“既不可分离又深感被束缚”的双重矛盾心理。冰冷芯片与具有侵略性生长的绿色藤蔓结合，揭示其潜意识深层对真实自然生命力的强烈渴望与对虚拟信息茧房的恐惧。',
      advice: '【数字断舍离行为建议】设定每日2小时的“无屏幕时间”，接触实体自然植物或进行手工劳作，激活前额叶对真实三维世界的感知。'
    };
  }

  if (t.includes('考') || t.includes('试卷') || t.includes('迟到') || t.includes('准考证')) {
    return {
      title: '《成就动机与冒充者综合征的评价焦虑研究》',
      keywords: ['评价焦虑', '冒充者综合征', '超我惩戒', '时间紧迫感'],
      literature: '依据克莱因(Melanie Klein)关于偏执-分裂心位的论述，考场梦境通常是对早年被评价创伤在成年后遇到现实挑战时的退行性重演。',
      analysis: '【临床意象解构】考试迟到或无法作答，反映了受测者在现实中面临重要绩效考核或角色转变时的隐秘不配得感。前额叶在梦中模拟“未完成准备”的极端情境，以一种夸张的焦虑演练来降低现实失败的心理冲击。',
      advice: '【认知重构干预建议】区分“客观现实要求”与“内在严苛超我”，设定合理的完美主义容错率，终止自我惩罚式的灾难化思维。'
    };
  }

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
  return {
    title: titles[hash % titles.length],
    keywords: [kw1, kw2, kw3],
    literature: literatures[hash % literatures.length],
    analysis: analyses[hash % analyses.length],
    advice: advices[hash % advices.length]
  };
}

async function callAcademicDeepAnalysis(dreamText, apiKey) {
  const activeKey = (apiKey && apiKey.trim().length > 10) ? apiKey.trim() : (ENV.apiKey || '');
  const activeUrl = dreamStore.settings?.apiUrl || ENV.apiUrl || 'https://api.deepseek.com/v1/chat/completions';
  const activeModel = dreamStore.settings?.apiModel || ENV.apiModel || 'deepseek-chat';

  if (!activeKey || activeKey.length < 10) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(generateMockAcademicAnalysis(dreamText));
      }, 1200);
    });
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: activeUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + activeKey
      },
      data: {
        model: activeModel,
        messages: [
          { role: 'system', content: '你是一位顶级的心理学与认知神经科学专家。请以《心理学报》等核心期刊的学术论文风格，对用户的梦境进行深度解码。返回严格的JSON格式，包含以下字段：title(学术风格的论文标题), keywords(3个学术关键词组成的数组), literature(文献回顾与理论溯源，需引用真实心理学理论), analysis(临床意象解构正文，极其专业严谨), advice(CBT认知行为或精神分析的专业干预建议)。不要输出任何markdown标记或额外解释，只输出纯JSON对象。' },
          { role: 'user', content: dreamText }
        ]
      },
      success: (res) => {
        try {
          if (res.data && res.data.choices && res.data.choices.length > 0) {
            const rawContent = res.data.choices[0].message.content;
            let str = (rawContent || '').trim();
            const codeBlock = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (codeBlock) {
              str = codeBlock[1].trim();
            } else {
              const start = str.indexOf('{');
              const end = str.lastIndexOf('}');
              if (start !== -1 && end !== -1 && end > start) {
                str = str.substring(start, end + 1);
              }
            }
            const parsed = JSON.parse(str);
            resolve(parsed);
          } else {
            reject(new Error('API choices empty'));
          }
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
const isImageLoading = ref(true);
const isRecreatingImage = ref(false);

const isFavorited = computed(() => {
  if (!currentDream.value) return false;
  return dreamStore.favoriteIds.includes(currentDream.value.id);
});

// 监听插画地址变化，重置加载状态
watch(
  () => currentDream.value?.illustrationUrl,
  (newUrl) => {
    if (newUrl) {
      isImageLoading.value = true;
    }
  },
  { immediate: true }
);

// 监听梦境变动或切换流派后，自动触发典籍考据解构
watch(
  () => currentDream.value?.id,
  (newId) => {
    if (newId && !deepAnalysisResult.value) {
      handleUnlockDeepAnalysis();
    }
  },
  { immediate: true }
);

async function handleUnlockDeepAnalysis() {
  if (isUnlockingDeepAnalysis.value || !currentDream.value) return;
  
  isUnlockingDeepAnalysis.value = true;
  try {
    const result = await callAcademicDeepAnalysis(currentDream.value.dreamText, dreamStore.settings?.apiKey);
    dreamStore.setDeepAnalysisResult(result);
  } catch (e) {
    console.warn('handleUnlockDeepAnalysis fallback:', e);
    // 自动降级为离线解析数据，防止卡在加载状态
    dreamStore.setDeepAnalysisResult(generateMockAcademicAnalysis(currentDream.value.dreamText));
  } finally {
    isUnlockingDeepAnalysis.value = false;
  }
}

function handleImageLoad() {
  isImageLoading.value = false;
}

function handleImageError() {
  isImageLoading.value = false;
  if (currentDream.value) {
    console.warn('Image failed to load, using fallback:', currentDream.value.illustrationUrl);
    const seed = simpleHash(currentDream.value.dreamText || currentDream.value.title || 'dream');
    currentDream.value.illustrationUrl = getFallbackIllustration(seed);
  }
}

async function handleRecreateImage() {
  if (!currentDream.value || isRecreatingImage.value) return;
  isRecreatingImage.value = true;
  isImageLoading.value = true;
  
  try {
    const randomSalt = Math.floor(Math.random() * 10000);
    const semantic = { symbols: currentDream.value.symbols || [] };
    const prompt = buildDynamicVisualPrompt(
      currentDream.value.dreamText,
      semantic,
      currentDream.value.moodId
    );
    currentDream.value.visualPrompt = prompt;
    const newSeed = simpleHash(currentDream.value.dreamText + randomSalt);
    const newUrl = generateDreamImageUrl(prompt, newSeed);
    
    currentDream.value.illustrationUrl = newUrl;
    dreamStore.saveDreamToHistory(currentDream.value);
    uni.showToast({
      title: '✦ 正在依梦重绘...',
      icon: 'none'
    });
  } catch (err) {
    console.error('Recreate image error:', err);
    isImageLoading.value = false;
  } finally {
    setTimeout(() => {
      isRecreatingImage.value = false;
    }, 1200);
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
      title: isFavorited.value ? '已题印收藏' : '已取消收藏',
      icon: 'none'
    });
  }
}

function handleSwitchPersona() {
  uni.showActionSheet({
    itemList: ['☯ 赛博周公 (玄学与算法)', '👁 弗洛伊德 (欲望与本能)', '✧ 荣格神话 (神话与原型)', '⚡ 毒舌嘴替 (爆笑毒舌)'],
    success: async res => {
      const pKeys = ['zhougong', 'freud', 'jung', 'roast'];
      const nextP = pKeys[res.tapIndex];
      if (currentDream.value) {
        uni.showLoading({ title: '正在切换流派重新推演...' });
        await dreamStore.decodeDream({
          dreamText: currentDream.value.dreamText,
          personaId: nextP,
          moodId: currentDream.value.moodId,
          selectedTags: currentDream.value.selectedTags || []
        });
        uni.hideLoading();
        // 核心修复：换派重推后重新启动典籍考据分析
        handleUnlockDeepAnalysis();
      }
    }
  });
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' });
}

// 微信分享卡片配置
onShareAppMessage((res) => {
  return {
    title: `✨ 我在梦源阁解码了梦境：${currentDream.value?.title || '神秘梦境'}`,
    path: currentDream.value?.id ? `/pages_sub/result/result?id=${currentDream.value.id}` : '/pages/index/index',
    imageUrl: currentDream.value?.illustrationUrl
  };
});

onShareTimeline(() => {
  return {
    title: `✨ 梦源阁：${currentDream.value?.title || '梦境解析报告'}`,
    query: `id=${currentDream.value?.id}`,
    imageUrl: currentDream.value?.illustrationUrl
  };
});
</script>

<style lang="scss" scoped>
.result-page {
  min-height: 100vh;
  padding-bottom: 220rpx;
  position: relative;
  background: #faf6f0;
}

.content-scroll {
  position: relative;
  z-index: 1;
}

/* 顶部插画视界 (太虚画境 · 绢帛水墨渐隐) */
.art-banner-box {
  position: relative;
  width: 100%;
  height: 520rpx;
  overflow: hidden;

  /* AI 绘卷加载骨架屏 */
  .art-loading-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18rpx;
    background: linear-gradient(135deg, #f7f2eb 0%, #ebe2d3 50%, #f6f0e6 100%);
    background-size: 200% 200%;
    animation: shimmerArtBg 2.5s ease-in-out infinite;

    .loading-spin-ring {
      width: 44rpx;
      height: 44rpx;
      border: 3rpx solid rgba(184, 134, 81, 0.25);
      border-top-color: #b88651;
      border-radius: 50%;
      animation: spinRing 1s linear infinite;
    }

    .art-loading-txt {
      font-size: 22rpx;
      color: #8c735d;
      font-family: "STKaiti", "KaiTi", serif;
      letter-spacing: 2rpx;
    }
  }

  .art-image {
    width: 100%;
    height: 100%;
    filter: contrast(1.05) saturate(1.05);
  }

  /* 弃用死黑遮罩，改用自然融入米宣底色的水墨渐变 */
  .art-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, 
      rgba(250, 246, 240, 0.05) 0%, 
      rgba(250, 246, 240, 0.25) 45%, 
      rgba(250, 246, 240, 0.85) 80%, 
      rgba(250, 246, 240, 1) 100%
    );
  }

  /* 悬浮 AI 意象微章与重绘按钮 */
  .ai-paint-tag {
    position: absolute;
    top: 30rpx;
    left: 30rpx;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 8rpx;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1.5rpx solid rgba(194, 149, 110, 0.45);
    padding: 8rpx 18rpx;
    border-radius: 40rpx;
    box-shadow: 0 4rpx 14rpx rgba(110, 80, 50, 0.08);
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.95);
      background: rgba(255, 255, 255, 0.96);
    }

    .ai-tag-icon {
      font-size: 20rpx;
      color: #b88651;
    }

    .ai-tag-label {
      font-size: 20rpx;
      font-weight: bold;
      color: #4a382c;
      font-family: "STKaiti", "KaiTi", serif;
      letter-spacing: 1rpx;
    }

    .ai-tag-redo {
      font-size: 20rpx;
      margin-left: 2rpx;
      opacity: 0.85;
    }
  }

  /* 宗师钦定玉佩浮牌 */
  .persona-float-badge {
    position: absolute;
    top: 30rpx;
    right: 30rpx;
    display: flex;
    align-items: center;
    gap: 12rpx;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1.5rpx solid rgba(194, 149, 110, 0.45);
    padding: 8rpx 20rpx;
    border-radius: 40rpx;
    box-shadow: 0 6rpx 18rpx rgba(110, 80, 50, 0.1);

    .persona-emoji {
      font-size: 32rpx;
      color: #2b1f16;
      font-weight: bold;
    }

    .persona-text-col {
      display: flex;
      flex-direction: column;

      .p-name {
        font-size: 22rpx;
        font-weight: bold;
        color: #261c15;
        font-family: "STZhongsong", "SimSun", "STKaiti", serif;
      }
      .p-title {
        font-size: 18rpx;
        color: #8c7a6e;
        font-family: "STKaiti", "KaiTi", serif;
      }
    }
  }

  /* 金石大宋体梦境题名 */
  .dream-title-wrap {
    position: absolute;
    bottom: 16rpx;
    left: 30rpx;
    right: 30rpx;

    .title-row {
      display: flex;
      align-items: center;
      gap: 14rpx;
      flex-wrap: wrap;
    }

    .dream-codename {
      font-size: 42rpx;
      font-weight: 900;
      color: #261c15;
      font-family: "STZhongsong", "SimSun", "STKaiti", serif;
      letter-spacing: 2rpx;
      text-shadow: 0 1rpx 2rpx rgba(255, 255, 255, 0.9);
      line-height: 1.3;
    }

    .title-seal {
      font-size: 18rpx;
      color: #bc312c;
      border: 1.5rpx solid #bc312c;
      background: rgba(188, 49, 44, 0.08);
      padding: 2rpx 8rpx;
      border-radius: 4rpx;
      font-family: "STKaiti", "KaiTi", serif;
      font-weight: bold;
      transform: rotate(-4deg);
      box-shadow: 1rpx 1rpx 0 rgba(188, 49, 44, 0.15);
    }

    .dream-date-label {
      font-size: 22rpx;
      color: #7a6e65;
      margin-top: 8rpx;
      display: block;
      font-family: "STKaiti", "KaiTi", serif;
      letter-spacing: 1.5rpx;
    }
  }
}

.details-body {
  padding: 18rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 22rpx;
}

/* 1. 潜意识密语卡片 (御批梦笺) */
.quote-card {
  padding: 24rpx 26rpx;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5rpx solid rgba(194, 149, 110, 0.38);
  border-radius: 16rpx;
  box-shadow: 0 6rpx 20rpx rgba(120, 95, 70, 0.05), inset 0 0 0 1rpx rgba(255, 255, 255, 0.8);

  .quote-header {
    display: flex;
    gap: 12rpx;
    align-items: flex-start;

    .quote-symbol {
      font-size: 26rpx;
      color: #b88651;
      line-height: 1.6;
    }

    .quote-text {
      font-size: 28rpx;
      color: #2b1f16;
      font-family: "STKaiti", "KaiTi", serif;
      line-height: 1.65;
      font-weight: 700;
      letter-spacing: 1rpx;
    }
  }

  .summary-line {
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1px dashed rgba(184, 134, 81, 0.25);
    display: flex;
    align-items: flex-start;
    gap: 12rpx;

    .summary-tag {
      font-size: 20rpx;
      color: #bc312c;
      font-family: "STKaiti", "KaiTi", serif;
      font-weight: 900;
      white-space: nowrap;
      margin-top: 2rpx;
    }

    .summary-desc {
      font-size: 24rpx;
      color: #4a3d35;
      line-height: 1.5;
      font-family: "STKaiti", "KaiTi", serif;
    }
  }
}

/* 通用解析卡片 (文房玉笺风格) */
.info-card {
  padding: 26rpx 26rpx;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5rpx solid rgba(194, 149, 110, 0.32);
  border-radius: 16rpx;
  box-shadow: 0 6rpx 20rpx rgba(120, 95, 70, 0.04), inset 0 0 0 1rpx rgba(255, 255, 255, 0.8);

  .card-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding-bottom: 14rpx;
    border-bottom: 1px solid rgba(194, 149, 110, 0.2);

    .title-left {
      display: flex;
      align-items: center;
      gap: 10rpx;

      .sec-symbol {
        font-size: 22rpx;
        color: #b58252;
      }

      .title {
        font-size: 30rpx;
        font-weight: 900;
        color: #261c15;
        font-family: "STZhongsong", "SimSun", "STKaiti", serif;
        letter-spacing: 2rpx;
      }
    }

    .sub-hint {
      font-size: 20rpx;
      color: #8c7a6e;
      font-family: "STKaiti", "KaiTi", serif;
      letter-spacing: 1rpx;
    }

    .code-badge {
      font-size: 20rpx;
      color: #8e6238;
      background: rgba(184, 134, 81, 0.1);
      padding: 4rpx 14rpx;
      border-radius: 6rpx;
      font-family: "STKaiti", "KaiTi", serif;
      border: 1px solid rgba(184, 134, 81, 0.3);
      letter-spacing: 1rpx;
    }
  }

  .analysis-text-content {
    font-size: 28rpx;
    color: #2b1f16;
    line-height: 1.85;
    letter-spacing: 1.5rpx;
    font-family: "STKaiti", "KaiTi", "SimSun", serif;
    text-align: justify;
  }
}

/* 3. 意象象征图谱 (物象归藏) */
.symbols-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;

  .symbol-item {
    display: flex;
    gap: 18rpx;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(194, 149, 110, 0.28);
    border-radius: 14rpx;
    padding: 18rpx 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(110, 80, 50, 0.03);

    .sym-icon-box {
      width: 76rpx;
      height: 76rpx;
      border-radius: 50%;
      background: radial-gradient(circle, #fcfaf5 0%, #efe4cf 100%);
      border: 1.5rpx solid rgba(194, 149, 110, 0.45);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      box-shadow: 0 2rpx 6rpx rgba(110, 80, 50, 0.06);

      .sym-icon {
        font-size: 36rpx;
      }
    }

    .sym-content {
      display: flex;
      flex-direction: column;
      gap: 6rpx;
      justify-content: center;

      .sym-name {
        font-size: 26rpx;
        font-weight: 700;
        color: #8c1e18;
        font-family: "STZhongsong", "SimSun", "STKaiti", serif;
        letter-spacing: 1rpx;
      }

      .sym-meaning {
        font-size: 23rpx;
        color: #5c5045;
        line-height: 1.5;
        font-family: "STKaiti", "KaiTi", serif;
      }
    }
  }
}

/* 5. 赛博气运与宜忌 (朱砂宜 · 焦墨忌) */
.fortune-card {
  .fortune-row {
    display: flex;
    align-items: center;
    gap: 18rpx;
    padding: 16rpx 20rpx;
    border-radius: 14rpx;
    margin-bottom: 14rpx;

    .f-tag {
      width: 52rpx;
      height: 52rpx;
      border-radius: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 26rpx;
      font-weight: 900;
      font-family: "STKaiti", "KaiTi", serif;
      flex-shrink: 0;
    }

    .f-text {
      font-size: 26rpx;
      color: #2b1f16;
      line-height: 1.5;
      font-family: "STKaiti", "KaiTi", serif;
    }

    &.lucky {
      background: rgba(188, 49, 44, 0.06);
      border: 1px solid rgba(188, 49, 44, 0.22);
      .lucky-tag {
        background: #bc312c;
        color: #ffffff;
        box-shadow: 0 2rpx 6rpx rgba(188, 49, 44, 0.25);
      }
    }

    &.taboo {
      background: rgba(43, 31, 22, 0.05);
      border: 1px solid rgba(43, 31, 22, 0.18);
      .taboo-tag {
        background: #332417;
        color: #f7eed8;
        box-shadow: 0 2rpx 6rpx rgba(43, 31, 22, 0.2);
      }
    }
  }
}

/* 原梦境记录 (初录本章) */
.raw-dream-card {
  padding: 24rpx;

  .raw-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .raw-title {
      font-size: 26rpx;
      color: #6b5d52;
      font-family: "STZhongsong", "SimSun", serif;
      font-weight: 700;
    }

    .raw-toggle {
      font-size: 22rpx;
      color: #b88651;
      font-family: "STKaiti", "KaiTi", serif;
      font-weight: 700;
    }
  }

  .raw-content {
    margin-top: 16rpx;
    padding-top: 14rpx;
    border-top: 1px dashed rgba(184, 134, 81, 0.2);
    font-size: 26rpx;
    color: #4a3d35;
    line-height: 1.7;
    font-family: "STKaiti", "KaiTi", serif;
    display: block;
  }
}

/* 神经递质参数 (心神灵息) */
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
  font-size: 25rpx;
  color: #4a3d35;
  font-family: "STKaiti", "KaiTi", serif;
  font-weight: 700;
}
.neuro-val {
  font-size: 25rpx;
  font-weight: 900;
  font-family: "STKaiti", serif;
}
.neuro-track {
  width: 100%;
  height: 10rpx;
  background: rgba(194, 149, 110, 0.15);
  border-radius: 10rpx;
  overflow: hidden;
}
.neuro-bar {
  height: 100%;
  border-radius: 10rpx;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 深度学术解析 (典籍考据) */
.deep-analysis-card {
  padding: 28rpx;
  margin-bottom: 30rpx;
  position: relative;
  overflow: hidden;

  .section-header {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 20rpx;

    .sec-symbol {
      font-size: 22rpx;
      color: #b58252;
    }
  }
  .section-title {
    font-size: 30rpx;
    font-weight: 900;
    color: #261c15;
    font-family: "STZhongsong", "SimSun", serif;
    letter-spacing: 2rpx;
  }
  .badge {
    background: #bc312c;
    color: #fff;
    font-size: 18rpx;
    padding: 2rpx 10rpx;
    border-radius: 4rpx;
    margin-left: 6rpx;
    font-weight: bold;
    font-family: "STKaiti", serif;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200rpx;
  gap: 20rpx;

  .loading-spinner {
    width: 40rpx;
    height: 40rpx;
    border: 4rpx solid rgba(184, 134, 81, 0.2);
    border-top-color: #b88651;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    font-size: 24rpx;
    color: #8c7a6e;
    font-family: "STKaiti", "KaiTi", serif;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.unlocked-container {
  display: flex;
  flex-direction: column;
  gap: 22rpx;

  .academic-title {
    font-size: 30rpx;
    font-weight: 900;
    color: #261c15;
    text-align: center;
    border-bottom: 1px solid rgba(194, 149, 110, 0.2);
    padding-bottom: 18rpx;
    font-family: "STZhongsong", "SimSun", serif;
  }
  .academic-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    justify-content: center;
  }
  .academic-tag {
    font-size: 20rpx;
    background: rgba(184, 134, 81, 0.1);
    color: #8e6238;
    border: 1px solid rgba(184, 134, 81, 0.25);
    padding: 4rpx 14rpx;
    border-radius: 4rpx;
    font-family: "STKaiti", "KaiTi", serif;
  }
  .academic-block {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }
  .academic-block-title {
    font-size: 25rpx;
    font-weight: 700;
    color: #8c1e18;
    font-family: "STZhongsong", "SimSun", serif;
  }
  .academic-text {
    font-size: 25rpx;
    color: #4a3d35;
    line-height: 1.65;
    font-family: "STKaiti", "KaiTi", serif;
    text-align: justify;
  }
  .highlight-block {
    background: rgba(188, 49, 44, 0.05);
    padding: 18rpx;
    border-radius: 12rpx;
    border-left: 6rpx solid #bc312c;
  }
}

/* 底部固定悬浮操作栏 */
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 120rpx;
  box-sizing: border-box;
  padding: 18rpx 30rpx calc(18rpx + env(safe-area-inset-bottom));
  background: rgba(250, 246, 240, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(194, 149, 110, 0.25);
  display: flex;
  align-items: center;
  gap: 16rpx;
  z-index: 100;

  .fav-btn {
    width: 110rpx;
    height: 84rpx;
    margin: 0;
    background: #ffffff;
    border: 1.5rpx solid rgba(194, 149, 110, 0.4);
    border-radius: 18rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    box-shadow: 0 4rpx 12rpx rgba(110, 80, 50, 0.04);

    .btn-icon {
      font-size: 28rpx;
      line-height: 1;
      color: #bc312c;
      transform: translateY(5rpx);
    }

    .btn-label {
      font-size: 18rpx;
      color: #6b5d52;
      font-family: "STKaiti", "KaiTi", serif;
      font-weight: 700;
      margin-top: 8rpx;
    }
  }

  .action-btn-flex {
    flex: 1;
    margin: 0;
    height: 84rpx;
    font-size: 26rpx;
    font-family: "STKaiti", "KaiTi", serif;
    font-weight: 700;
    letter-spacing: 1rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-icon {
      margin-right: 8rpx;
    }
  }

  .poster-btn {
    flex: 1.3;
    background: linear-gradient(135deg, #c2956e, #a67b45);
    color: #ffffff;
    border: none;
    box-shadow: 0 6rpx 18rpx rgba(194, 149, 110, 0.35);
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
    color: #8c7a6e;
    font-family: "STKaiti", "KaiTi", serif;
  }
}

.disclaimer-footer {
  text-align: center;
  font-size: 22rpx;
  color: #a39589;
  font-family: "STKaiti", "KaiTi", serif;
  padding: 10rpx 0 16rpx;
  width: 100%;
}

@keyframes shimmerArtBg {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes spinRing {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

