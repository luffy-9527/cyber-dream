const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

// Add hasSearched state
content = content.replace(
  /const searchQuery = ref\(''\);/,
  "const searchQuery = ref('');\nconst hasSearched = ref(false);"
);

// Update initFeatured to reset hasSearched
content = content.replace(
  /function initFeatured\(\) \{/,
  "function initFeatured() {\n  hasSearched.value = false;"
);

// Update onInput to reset hasSearched if empty, but wait, if they type, should we hide the search results?
// If they type, it's better to show "精选内容" again! So we just call initFeatured() when they type anything?
// No, if they type, they haven't searched yet. Let's just set hasSearched = false and clear the list to be empty?
// Wait, the user said "我没有点搜索的时候不要在出现图中这样的关联结果".
// So if they type, it should be empty!
content = content.replace(
  /function onInput\(\) \{[\s\S]*?\}/,
  `function onInput() {
    hasSearched.value = false;
    if (!searchQuery.value.trim()) {
      initFeatured();
    } else {
      allSearchItems.value = []; // 清空列表，保持安静，直到点击搜索
    }
  }`
);

// Update onSearch to set hasSearched = true
content = content.replace(
  /currentPage\.value = 1;\n  allSearchItems\.value = \[\];/,
  "currentPage.value = 1;\n  allSearchItems.value = [];\n  hasSearched.value = true;"
);

// Update template to use hasSearched instead of searchQuery for the header
content = content.replace(
  /<view class="section-title" v-if="!searchQuery">/,
  '<view class="section-title" v-if="!hasSearched && !searchQuery.trim()">'
);
content = content.replace(
  /<view class="section-title" v-else>/,
  '<view class="section-title" v-else-if="hasSearched">'
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');