import { defineStore } from 'pinia';
import { analyzeDreamText } from '../api/dreamEngine.js';
import { ENV } from '../config/env.js';

const STORAGE_KEY_HISTORY = 'CYBER_DREAM_HISTORY';
const STORAGE_KEY_FAVORITES = 'CYBER_DREAM_FAVORITES';
const STORAGE_KEY_SETTINGS = 'CYBER_DREAM_SETTINGS';

// 初始精选公共梦境广场数据
const INITIAL_PUBLIC_DREAMS = [
  {
    id: 'PUBLIC_001',
    author: '赛博漫游者 #808',
    avatar: '🪐',
    title: '「量子深渊中的发条金鱼」',
    date: '2026.08.30',
    dreamText: '梦见站在三万米高空的霓虹摩天轮上，整座城市的重力倒转，所有人都在夜空里游泳。',
    summary: '潜意识渴望摆脱地心引力的惯性规律，开启高维创造力。',
    mood: { id: 'absurd', name: '荒诞离奇', icon: '🪐', color: '#00f2fe' },
    likes: 128,
    isLiked: false,
    illustrationUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    radar: { absurdity: 92, clarity: 75, anxiety: 30, awakening: 88, romance: 65 },
    symbols: [
      { name: '重力反转', icon: '🌀', meaning: '颠覆陈规的潜意识渴望' },
      { name: '高空漫游', icon: '🚀', meaning: '追寻掌控力与宏大视野' },
      { name: '发条金鱼', icon: '🐠', meaning: '精致而脆弱的童真记忆' }
    ],
    quote: '“当世界倒悬时，每一个向下坠落的人都是在奔向星空。”'
  },
  {
    id: 'PUBLIC_002',
    author: '神经元诗人 #042',
    avatar: '🌸',
    title: '「暮光之森与发光灵鹿」',
    date: '2026.08.29',
    dreamText: '走进一片泛着紫色微光的原始森林，树干上结满了像气泡一样的音符，一头长着水晶角的鹿向我眨了眨眼。',
    summary: '深层心灵正在经历一场温柔的自性化疗愈与能量回充。',
    mood: { id: 'healing', name: '温暖治愈', icon: '🌸', color: '#06d6a0' },
    likes: 256,
    isLiked: true,
    illustrationUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    radar: { absurdity: 70, clarity: 85, anxiety: 15, awakening: 80, romance: 95 },
    symbols: [
      { name: '发光灵鹿', icon: '🦌', meaning: '指引自性整合的心灵神兽' },
      { name: '音符气泡', icon: '🎵', meaning: '压抑情绪的诗意释放' },
      { name: '紫色森林', icon: '🌲', meaning: '宁静的心灵庇护所' }
    ],
    quote: '“所有在白昼里走丢的温柔，都会在夜间的森林深处重新相聚。”'
  },
  {
    id: 'PUBLIC_003',
    author: '摸鱼宗师 #996',
    avatar: '😈',
    title: '「无限循环的火星考场」',
    date: '2026.08.28',
    dreamText: '梦见回到高三考场，桌上卷子全是用二进制写的，监考老师突然掏出一把吉他开始弹重金属摇滚。',
    summary: '当代打工人典型的超我压力反抗梦，大脑在用发疯对抗焦虑。',
    mood: { id: 'funny', name: '搞怪中二', icon: '🎭', color: '#ffd166' },
    likes: 384,
    isLiked: false,
    illustrationUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    radar: { absurdity: 95, clarity: 60, anxiety: 65, awakening: 70, romance: 40 },
    symbols: [
      { name: '二进制考卷', icon: '💻', meaning: '对不可控规则的戏谑' },
      { name: '摇滚老师', icon: '🎸', meaning: '对刻板权威的幽默消解' },
      { name: '火星基地', icon: '🔴', meaning: '对现实琐事的逃避欲' }
    ],
    quote: '“既然现实不允许发疯，那梦境就是我们最后的赛博舞厅。”'
  }
];

export const useDreamStore = defineStore('dream', {
  state: () => {
    // 从微信本地缓存加载历史记录
    let history = [];
    let favorites = [];
    let settings = { apiKey: '', apiUrl: 'https://api.deepseek.com/v1/chat/completions', apiModel: 'deepseek-chat', autoPlaySound: true };

    try {
      const storedHistory = uni.getStorageSync(STORAGE_KEY_HISTORY);
      if (storedHistory && Array.isArray(storedHistory)) {
        history = storedHistory;
      }
      const storedFav = uni.getStorageSync(STORAGE_KEY_FAVORITES);
      if (storedFav && Array.isArray(storedFav)) {
        favorites = storedFav;
      }
      const storedSet = uni.getStorageSync(STORAGE_KEY_SETTINGS);
      if (storedSet) {
        settings = { ...settings, ...storedSet };
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }

    return {
      currentDream: null,
      deepAnalysisResult: null,
      historyList: history,
      favoriteIds: favorites,
      publicDreams: INITIAL_PUBLIC_DREAMS,
      settings,
      isLoading: false
    };
  },

  getters: {
    favoriteDreams(state) {
      return state.historyList.filter(d => state.favoriteIds.includes(d.id));
    },
    totalDreamsCount(state) {
      return state.historyList.length;
    },
    moodStats(state) {
      const counts = {};
      state.historyList.forEach(item => {
        const id = item.moodId || (item.mood && item.mood.id) || 'other';
        counts[id] = (counts[id] || 0) + 1;
      });
      return counts;
    }
  },

  actions: {
    // 发起梦境解析
    async decodeDream({ dreamText, personaId, moodId, selectedTags }) {
      this.isLoading = true; this.deepAnalysisResult = null;
      try {
        const result = await analyzeDreamText(
          dreamText,
          personaId,
          moodId,
          selectedTags,
          this.settings
        );
        this.currentDream = result;
        // 自动存入历史记录
        this.saveDreamToHistory(result);
        return result;
      } finally {
        this.isLoading = false;
      }
    },

    setDeepAnalysisResult(res) { this.deepAnalysisResult = res; },

    setCurrentDream(dream) {
      this.currentDream = dream;
    },

    saveDreamToHistory(dream) {
      if (!dream || !dream.id) return;
      // 避免重复添加
      const index = this.historyList.findIndex(d => d.id === dream.id);
      if (index >= 0) {
        this.historyList[index] = dream;
      } else {
        this.historyList.unshift(dream);
      }
      this.persistHistory();
    },

    deleteDream(dreamId) {
      this.historyList = this.historyList.filter(d => d.id !== dreamId);
      this.favoriteIds = this.favoriteIds.filter(id => id !== dreamId);
      this.persistHistory();
    },

    toggleFavorite(dreamId) {
      if (this.favoriteIds.includes(dreamId)) {
        this.favoriteIds = this.favoriteIds.filter(id => id !== dreamId);
      } else {
        this.favoriteIds.push(dreamId);
      }
      this.persistFavorites();
    },

    likePublicDream(dreamId) {
      const item = this.publicDreams.find(d => d.id === dreamId);
      if (item) {
        item.isLiked = !item.isLiked;
        item.likes += item.isLiked ? 1 : -1;
      }
    },

    persistHistory() {
      try {
        uni.setStorageSync(STORAGE_KEY_HISTORY, this.historyList);
      } catch (e) {
        console.error('Save history storage failed:', e);
      }
    },

    persistFavorites() {
      try {
        uni.setStorageSync(STORAGE_KEY_FAVORITES, this.favoriteIds);
      } catch (e) {
        console.error('Save favorites storage failed:', e);
      }
    },

    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings };
      try {
        uni.setStorageSync(STORAGE_KEY_SETTINGS, this.settings);
      } catch (e) {
        console.error('Save settings storage failed:', e);
      }
    }
  }
});
