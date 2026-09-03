const fs = require('fs');

let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

// Replace the computed allTitles and filteredList logic
content = content.replace(/const allTitles = computed[\s\S]*?const filteredList = computed\(\(\) => \{[\s\S]*?\}\);/m, `
const filteredList = computed(() => {
  const q = searchQuery.value.trim();
  
  // 基础列表：本地已有 + 静态索引
  const localTitles = localDb.value.map(d => d.title);
  const indexTitles = dreamSearchIndex.filter(t => !localTitles.includes(t));
  let allItems = [
    ...localDb.value.map(d => ({ title: d.title, id: d.id, hasDetail: true })),
    ...indexTitles.map(t => ({ title: t, id: null, hasDetail: false }))
  ];

  if (!q) {
    // 未输入时，展示精选内容
    return allItems.filter(item => item.hasDetail);
  }
  
  // 过滤出包含关键词的项
  let matched = allItems.filter(item => item.title.includes(q));
  
  // 智能注入：如果用户输入的词组不在匹配结果的精确匹配中，自动补全一条 "梦见XXX" 让用户点击生成
  const targetTitle = q.startsWith('梦见') ? q : '梦见' + q;
  const exactMatch = matched.find(item => item.title === targetTitle);
  
  if (!exactMatch) {
    matched.unshift({ title: targetTitle, id: null, hasDetail: false, isDynamic: true });
  }
  
  return matched;
});
`);

// Remove the empty state HTML
content = content.replace(/<view v-if="searchQuery && filteredList.length === 0" class="empty-state">[\s\S]*?<\/view>/m, '');

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');